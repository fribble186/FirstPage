import React, { useContext, useEffect, useMemo, useState } from "react";
import { Card, Button, Spin } from "antd";
import { ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";
import "./index.css";
import { ConfigJsonContext } from "../../context/ConfigJson";
import ElectronWebAuthRepo from "../../infrastructure/ElectronWebAuthRepo";
import { service } from "firstpage-core";

const URLWebview: React.FC<{
  uri: string;
  title: string;
  goBack: () => void;
}> = ({ uri, goBack, title }) => {
  const webviewRef = React.useRef<HTMLWebViewElement>(null);
  const [curUri, setCurUri] = useState<string>(uri);
  const [pageStack, setPageStack] = useState<string[]>([uri]);
  const [loading, setLoading] = useState(true);
  const inPageStack = (uri: string) => {
    const newStack = pageStack.slice();
    newStack.push(uri);
    setPageStack(newStack);
    return newStack;
  };
  const outPageStack = () => {
    const newStack = pageStack.slice();
    newStack.pop();
    setPageStack(newStack);
    return newStack;
  };
  const handleClickBack = () => {
    const newStack = outPageStack();
    if (newStack.length === 0) {
      goBack();
    } else {
      setCurUri(newStack[newStack.length - 1]);
    }
  };
  useEffect(() => {
    window.electron.onWebviewNewWindow((url) => {
      console.log(url);
      const newStack = inPageStack(url);
      setCurUri(newStack[newStack.length - 1]);
    });
    webviewRef.current?.addEventListener("did-start-loading", () => {
      setLoading(true);
    });
    webviewRef.current?.addEventListener("did-stop-loading", () => {
      setLoading(false);
    });
  }, [webviewRef.current]);

  return (
    <div style={{ height: "100vh" }}>
      <div className="services_webview_title_bar">
        <Button
          shape="circle"
          icon={loading ? <LoadingOutlined spin /> : <ArrowLeftOutlined />}
          disabled={loading}
          onClick={handleClickBack}
          style={{ marginRight: "12px" }}
        />
        <span>{title}</span>
        <div className="services_webview_title_bar_drag" />
      </div>
      <div style={{ flex: 1 }}>
        <webview
          ref={webviewRef}
          src={curUri}
          // @ts-ignore
          allowpopups=""
          style={{ width: "100%", height: `${window.innerHeight - 48}px` }}
        ></webview>
      </div>
    </div>
  );
};

const Services = () => {
  const configJsonContext = useContext(ConfigJsonContext);
  const configJson = configJsonContext?.configJson;
  const [webviewVisible, setWebviewVisible] = useState(false);
  const [curUri, setCurUri] = useState("");
  const [webTitle, setWebTitle] = useState("");
  const showWebView = webviewVisible && curUri && webTitle;
  const urlService = useMemo(() => {
    const webAuthRepo = new ElectronWebAuthRepo();
    return new service.URLService(webAuthRepo);
  }, []);
  const navigate2webview = async (
    uri: string,
    title: string,
    encrypted?: 0 | 1
  ) => {
    setWebviewVisible(true);
    setCurUri(await urlService.getAuthUrl(uri, !!encrypted));
    setWebTitle(title);
  };
  const goBack = () => {
    setWebviewVisible(false);
    setCurUri("");
    setWebTitle("");
  };

  return !showWebView ? (
    <div className="services">
      <span className="services_title">服务启动台</span>
      <div className="card_container">
        {(configJson?.URL || []).map((url) => (
          <Card
            title={url.title}
            bordered={false}
            className="services_card"
            hoverable
            size="small"
            onClick={() => navigate2webview(url.uri, url.title, url.encrypted)}
          >
            {url.desc}
          </Card>
        ))}
      </div>
      <div style={{ flex: 1 }} />
    </div>
  ) : (
    <URLWebview uri={curUri} goBack={goBack} title={webTitle} />
  );
};

export default Services;
