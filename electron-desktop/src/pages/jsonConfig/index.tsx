import React, { useState, useMemo } from "react";
import "./index.css";
import { Form, Input, Button, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import { service } from "firstpage-core";
import ElectronConfigJsonRepo from "../../infrastructure/ElectronConfigJsonRepo";
import ElectronDownloader from "../../infrastructure/ElectronDownloader";
import SimpleCryptoDecrypter from "../../infrastructure/SimpleCryptoDecrypter";
import to from "await-to-js";

const JsonConfig = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [configErr, setConfigErr] = useState<string>();
  const configJsonService = useMemo(() => {
    const configJsonRepo = new ElectronConfigJsonRepo();
    const donwloader = new ElectronDownloader();
    const decrypter = new SimpleCryptoDecrypter();
    return new service.ConfigJsonService(configJsonRepo, donwloader, decrypter);
  }, []);
  const handleParse = async () => {
    const { jsonUri, jsonPassword } = await form.validateFields();
    const [configJsonErr, configJson] = await to(
      configJsonService.downloadJsonConfig(jsonUri, jsonPassword)
    );
    if (configJsonErr) {
      console.log(configJsonErr);
      setConfigErr(configJsonErr as any as string);
    } else if (!configJsonErr && configJson) {
      console.log(configJson);
      setConfigErr("");
      navigate("/");
    }
  };
  return (
    <div className="jsonconfig">
      <div className="jsonconfig_left">
        <div className="jsonconfig_logo">
          <img
            className="jsonconfig_logo_img"
            src={`${process.env.PUBLIC_URL}/logo.png`}
          />
          <span>FirstPage</span>
        </div>
      </div>
      <div className="jsonconfig_right">
        <Form className="jsonconfig_right_form" form={form}>
          <Form.Item name="jsonUri" required>
            <Input
              placeholder="请输入 json 地址"
              className="jsonconfig_right_form_input"
            />
          </Form.Item>
          <Form.Item name="jsonPassword" required>
            <Input.Password
              placeholder="请输入密码"
              className="jsonconfig_right_form_input"
            />
          </Form.Item>
          <Button
            type="primary"
            className="jsonconfig_right_form_button"
            onClick={handleParse}
          >
            解析 json 配置
          </Button>
          {!!configErr && (
            <Alert
              message={configErr}
              type="error"
              style={{ marginTop: "12px", width: "320px" }}
            />
          )}
        </Form>
      </div>
    </div>
  );
};

export default JsonConfig;
