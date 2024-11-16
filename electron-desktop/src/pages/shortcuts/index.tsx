import React, { useContext } from "react";
import { Button } from "antd";
import { BulbOutlined } from "@ant-design/icons";
import "./index.css";
import { ConfigJsonContext } from "../../context/ConfigJson";
import { domain } from "firstpage-core";

type ShortcutItem = Required<domain.ConfigJson>["SHORTCUT"][number];
const ShortCuts = () => {
  const configJsonContext = useContext(ConfigJsonContext);
  const configJson = configJsonContext?.configJson;
  const [clicked, setClicked] = React.useState(false);
  const timer = React.useRef<NodeJS.Timeout | null>(null);
  const handlePress = (
    uri: ShortcutItem["action"]["uri"],
    headers: ShortcutItem["action"]["headers"]
  ) => {
    if (clicked) return;
    setClicked(true);
    window.electron.triggerShortcut(
      uri,
      headers ? JSON.stringify(headers) : ""
    );

    timer.current = setTimeout(() => {
      setClicked(false);
      if (timer.current) {
        clearTimeout(timer.current);
      }
    }, 1000 * 5);
  };
  return (
    <div className="shortcuts">
      <span className="shortcuts_title">快捷方式</span>
      <div>
        {(configJson?.SHORTCUT || []).map((shortcut) => (
          <Button
            type="primary"
            icon={<BulbOutlined />}
            size="large"
            loading={clicked}
            disabled={clicked}
            onClick={() =>
              handlePress(shortcut.action.uri, shortcut.action.headers)
            }
          >
            {shortcut.title}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ShortCuts;
