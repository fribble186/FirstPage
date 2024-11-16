import React, { useContext } from "react";
import { ConfigJsonContext } from "../../context/ConfigJson";

const Chat = () => {
  const configJsonContext = useContext(ConfigJsonContext);

  return configJsonContext?.configJson?.IMURL ? (
    <div>
      <webview
        src={configJsonContext.configJson.IMURL.uri}
        style={{ width: "100%", height: "100vh" }}
      ></webview>
    </div>
  ) : null;
};

export default Chat;
