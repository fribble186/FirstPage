import React, { useEffect, useState, useMemo, useContext } from "react";
import "./App.css";
import { Layout, Menu } from "antd";

import {
  MENUS,
  MenuKeys,
  MenuTitles,
  MenuIcons,
  MenuPaths,
} from "../consts/menus";
import type { MenuProps } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { ConfigJsonContext } from "../context/ConfigJson";
import { domain, service } from "firstpage-core";
import ElectronConfigJsonRepo from "../infrastructure/ElectronConfigJsonRepo";
import ElectronDownloader from "../infrastructure/ElectronDownloader";
import SimpleCryptoDecrypter from "../infrastructure/SimpleCryptoDecrypter";

type MenuItem = Required<MenuProps>["items"][number];
type MenuOnSelect = Required<MenuProps>["onSelect"];

const items: MenuItem[] = [
  {
    key: MenuKeys[MENUS.SHORTCUT],
    label: MenuTitles[MENUS.SHORTCUT],
    icon: MenuIcons[MENUS.SHORTCUT],
  },
  {
    key: MenuKeys[MENUS.SERVICE],
    label: MenuTitles[MENUS.SERVICE],
    icon: MenuIcons[MENUS.SERVICE],
  },
  {
    key: MenuKeys[MENUS.CHAT],
    label: MenuTitles[MENUS.CHAT],
    icon: MenuIcons[MENUS.CHAT],
  },
  {
    type: "divider",
  },
  {
    key: MenuKeys[MENUS.SETTING],
    label: MenuTitles[MENUS.SETTING],
    icon: MenuIcons[MENUS.SETTING],
  },
];

const App = () => {
  const navigate = useNavigate();
  const [curMenuKey, setCurMenuKey] = useState<string[]>();
  const handleSelcetMenu: MenuOnSelect = ({ key }) => {
    setCurMenuKey([key]);
    navigate(MenuPaths[key]);
  };
  const configJsonService = useMemo(() => {
    const configJsonRepo = new ElectronConfigJsonRepo();
    const donwloader = new ElectronDownloader();
    const decrypter = new SimpleCryptoDecrypter();
    return new service.ConfigJsonService(configJsonRepo, donwloader, decrypter);
  }, []);
  const [configJson, setConfigJson] = useState<domain.ConfigJson | null>(null);
  useEffect(() => {
    console.log("useeffect");
    configJsonService
      .getJsonConfig()
      .then((data) => {
        console.log("data", data);
        if (data) {
          setConfigJson(data);
        } else {
          navigate("/config");
        }
      })
      .catch((e) => {
        navigate("/config");
      });
  }, []);
  return (
    <ConfigJsonContext.Provider value={{ setConfigJson, configJson }}>
      <div>
        <Layout className="app">
          <Layout.Sider width="15%" className="app_sider">
            <div className="app_logo_container">
              <img
                className="app_logo_img"
                src={`${process.env.PUBLIC_URL}/logo.png`}
              />
              <span onClick={() => navigate("/")}>FirstPage</span>
            </div>
            <Menu
              theme="light"
              mode="inline"
              defaultSelectedKeys={["4"]}
              items={items}
              style={{ width: "100%", height: "100vh" }}
              onSelect={handleSelcetMenu}
              selectedKeys={curMenuKey}
            />
          </Layout.Sider>
          <Layout.Content className="app_content">{<Outlet />}</Layout.Content>
        </Layout>
      </div>
    </ConfigJsonContext.Provider>
  );
};

export default App;
