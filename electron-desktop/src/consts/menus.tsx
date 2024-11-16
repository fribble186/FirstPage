import {
  AppstoreOutlined,
  BulbOutlined,
  SettingOutlined,
  MessageOutlined,
} from "@ant-design/icons";

export enum MENUS {
  "SHORTCUT",
  "SERVICE",
  "CHAT",
  "SETTING",
}
export const MenuKeys = {
  [MENUS.SHORTCUT]: "shortcut",
  [MENUS.SERVICE]: "service",
  [MENUS.CHAT]: "chat",
  [MENUS.SETTING]: "setting",
};
export const MenuTitles = {
  [MENUS.SHORTCUT]: "快捷方式",
  [MENUS.SERVICE]: "服务启动台",
  [MENUS.CHAT]: "聊天",
  [MENUS.SETTING]: "设置",
};
export const MenuIcons = {
  [MENUS.SHORTCUT]: <BulbOutlined />,
  [MENUS.SERVICE]: <AppstoreOutlined />,
  [MENUS.CHAT]: <MessageOutlined />,
  [MENUS.SETTING]: <SettingOutlined />,
};
export const MenuPaths = {
  [MenuKeys[MENUS.SHORTCUT]]: "/shortcuts",
  [MenuKeys[MENUS.SERVICE]]: "/services",
  [MenuKeys[MENUS.CHAT]]: "/chat",
  [MenuKeys[MENUS.SETTING]]: "/settings",
};
