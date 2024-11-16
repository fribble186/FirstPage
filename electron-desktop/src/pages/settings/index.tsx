import React, { useEffect, useMemo } from "react";
import { Button, Card, Input, Form, Alert, Modal, message } from "antd";
import "./index.css";
import { useNavigate } from "react-router-dom";
import ElectronConfigJsonRepo from "../../infrastructure/ElectronConfigJsonRepo";
import ElectronDownloader from "../../infrastructure/ElectronDownloader";
import SimpleCryptoDecrypter from "../../infrastructure/SimpleCryptoDecrypter";
import { domain, service } from "firstpage-core";
import ElectronWebAuthRepo from "../../infrastructure/ElectronWebAuthRepo";

const Settings = () => {
  const navigate = useNavigate();
  const [modal, modalContextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [webAuthForm] = Form.useForm();
  const [notifyConfigForm] = Form.useForm();
  const account_watcher = Form.useWatch("account", webAuthForm);
  const password_watcher = Form.useWatch("password", webAuthForm);
  const wss_uri_watcher = Form.useWatch("uri", notifyConfigForm);
  const wss_header_key_watcher = Form.useWatch("header_key", notifyConfigForm);
  const wss_header_value_watcher = Form.useWatch(
    "header_value",
    notifyConfigForm
  );

  const handleExit = () => {
    modal.confirm({
      title: "确定要删除所有缓存在本地的配置，重新配置吗?",
      okText: "确认",
      cancelText: "我再想想",
      onOk() {
        const configJsonRepo = new ElectronConfigJsonRepo();
        const donwloader = new ElectronDownloader();
        const decrypter = new SimpleCryptoDecrypter();
        const configJsonService = new service.ConfigJsonService(
          configJsonRepo,
          donwloader,
          decrypter
        );
        configJsonService.removeJsonConfig().then(() => {
          navigate("/config");
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const urlService = useMemo(() => {
    const webAuthRepo = new ElectronWebAuthRepo();
    return new service.URLService(webAuthRepo);
  }, []);
  const handleSaveWebAuth = async () => {
    const { account, password } = await webAuthForm.validateFields();
    const webAuth = new domain.WebAuth(account, password);
    await urlService.saveWebAuth(webAuth);
    messageApi.success("网页登录信息保存成功");
  };
  const handleClearWebAuth = async () => {
    await urlService.clearWebAuth();
    webAuthForm.resetFields();
  };
  useEffect(() => {
    urlService
      .getWebAuth()
      .then((webAuth) => {
        if (webAuth?.account) {
          webAuthForm.setFieldValue("account", webAuth.account);
        }
        if (webAuth?.password) {
          webAuthForm.setFieldValue("password", webAuth.password);
        }
      })
      .catch(console.log);
  }, []);

  return (
    <div className="settings">
      <span className="settings_title">设置页</span>
      <Card className="mb_12">
        <div className="settings_card_title mb_12">配置网页的登录信息</div>
        <Alert
          message={
            <>
              <div className="t_12">
                这个账号密码是登录网页的账号密码，可以在 nginx 中配置
              </div>
              <div className="t_12">这个账号密码将安全地存储在本地</div>
            </>
          }
          type="info"
          className="mb_12"
        />
        <Form form={webAuthForm}>
          <Form.Item name="account">
            <Input placeholder="账号" className="mb_12" />
          </Form.Item>
          <Form.Item name="password">
            <Input.Password placeholder="密码" className="mb_12" />
          </Form.Item>
          <div className="flex_row">
            <Button
              type="primary"
              className="mr_12"
              disabled={!account_watcher || !password_watcher}
              onClick={handleSaveWebAuth}
            >
              存储
            </Button>
            <Button onClick={handleClearWebAuth}>清空</Button>
          </div>
        </Form>
      </Card>
      <Card className="mb_12">
        <div className="settings_card_title mb_12">配置消息提醒</div>
        <Alert
          message={
            <>
              <div className="t_12">配置消息提醒 socket 链接</div>
              <div className="t_12">这些配置将安全地存储在本地</div>
            </>
          }
          type="info"
          className="mb_12"
        />
        <Form form={notifyConfigForm}>
          <Form.Item name="uri">
            <Input placeholder="消息提醒的 wss 链接" className="mb_12" />
          </Form.Item>
          <Form.Item name="header_key">
            <Input placeholder="用于验证的 header key" className="mb_12" />
          </Form.Item>
          <Form.Item name="header_value">
            <Input placeholder="用于验证的 header value" className="mb_12" />
          </Form.Item>
        </Form>
        <div className="flex_row">
          <Button
            type="primary"
            className="mr_12"
            disabled={
              !wss_uri_watcher ||
              !wss_header_key_watcher ||
              !wss_header_value_watcher
            }
          >
            存储
          </Button>
          <Button>清空</Button>
        </div>
      </Card>
      <Card>
        <Button type="primary" className="mb_12" onClick={handleExit}>
          重新配置 json
        </Button>
        <Alert
          message="清空缓存的 json 配置; 清空缓存的消息提醒配置"
          type="warning"
        />
      </Card>
      {modalContextHolder}
      {messageContextHolder}
    </div>
  );
};

export default Settings;
