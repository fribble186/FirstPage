import React, { useState, useRef, useEffect } from "react";
import "jsoneditor/dist/jsoneditor.css";
import SimpleCrypto from "simple-crypto-js";
import BrowserOnly from "@docusaurus/BrowserOnly";

const EncryptPage = () => {
  return (
    <BrowserOnly fallback={<div>Loading...</div>}>
      {() => {
        const JSONEditor = require("jsoneditor").default;
        console.log(JSONEditor);
        return <Encrypt JSONEditor={JSONEditor} />;
      }}
    </BrowserOnly>
  );
};
const DefaultConfigJson = {
  SHORTCUT: [
    {
      title: "触发某个服务",
      action: {
        uri: "https://turnon-light",
        headers: {
          authkey: "authvalue",
        },
      },
    },
  ],
  URL: [
    {
      title: "家中部署的某个服务",
      desc: "家中部署的某个服务",
      uri: "https://service",
    },
  ],
  IMURL: {
    title: "IM 服务",
    desc: "you can choose matrix + cinny",
    uri: "https://chat",
  },
};

const Encrypt = ({ JSONEditor }) => {
  const [password, setPassword] = useState("");
  const [jsonStr, setJsonStr] = useState(JSON.stringify(DefaultConfigJson));
  const [loaded, setLoaded] = useState(false);

  const handleInputChange = (event) => {
    setPassword(event.target.value);
  };
  const handleClick = () => {
    console.log(jsonStr);
    const simplecrypto = new SimpleCrypto(password);
    const text = simplecrypto.encrypt(JSON.stringify(JSON.parse(jsonStr)));
    const filename = "encrypt";

    // 创建 Blob 对象
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    // 创建一个隐藏的下载链接
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click(); // 模拟点击下载链接
    document.body.removeChild(a);

    // 释放 URL 对象
    URL.revokeObjectURL(url);
  };
  const loadEditor = () => {
    if (!loaded) {
      const container = document.getElementById("editor");
      if (container && !container.children.length) {
        const options = {
          mode: "text",
          onChangeText: setJsonStr,
        };
        const editor = new JSONEditor(container, options);

        // 设置初始 JSON 数据
        editor.set(DefaultConfigJson);
        setLoaded(true);
      }
    }
  };

  //   useEffect(() => {
  //     const container = editorRef.current;
  //     const options = {
  //       mode: "text",
  //       onChangeText: setJsonStr,
  //     };
  //     const editor = new JSONEditor(container, options);

  //     // 设置初始 JSON 数据
  //     editor.set(DefaultConfigJson);

  //     return () => {
  //       editor.destroy(); // 清理资源
  //     };
  //   }, []);
  return (
    <div
      style={{
        padding: "32px",
        color: "#333",
        height: "100vh",
      }}
    >
      <div>
        <h2>加密 json 文件</h2>
      </div>
      <div
        id="editor"
        ref={loadEditor}
        style={{ height: "500px", marginBottom: "22px" }}
      />
      <div style={{ display: "flex" }}>
        <input
          placeholder="请输入加密的密码"
          type="text"
          value={password}
          onChange={handleInputChange}
          style={{
            flex: 1,
            height: "32px",
            marginRight: "12px",
            maxWidth: "220px",
          }}
        />
        <button
          style={{ width: "100px", height: "32px" }}
          onClick={handleClick}
        >
          加密并下载
        </button>
      </div>
    </div>
  );
};
export default EncryptPage;
