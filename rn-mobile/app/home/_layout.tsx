import React, { useContext } from "react";
import { Tabs } from "expo-router";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useTheme } from "react-native-paper";
import { ConfigJsonContext } from "@/context/ConfigJson";

enum LayoutTabEnum {
  APPS,
  STORE,
  CHAT,
  SETTINGS,
}
const LayoutTabKeys = {
  [LayoutTabEnum.APPS]: "index",
  [LayoutTabEnum.STORE]: "store",
  [LayoutTabEnum.CHAT]: "chat",
  [LayoutTabEnum.SETTINGS]: "settings",
};
const LayoutTabNames = {
  [LayoutTabEnum.APPS]: "快捷方式与应用",
  [LayoutTabEnum.STORE]: "应用市场",
  [LayoutTabEnum.CHAT]: "im",
  [LayoutTabEnum.SETTINGS]: "设置",
};
const TabLayout = () => {
  const theme = useTheme();
  const configJsonContext = useContext(ConfigJsonContext);
  const configJson = configJsonContext?.configJson;
  const imUrl = configJson?.IMURL;
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.colors.primary,
      }}
    >
      <Tabs.Screen
        name={LayoutTabKeys[LayoutTabEnum.APPS]}
        options={{
          headerTitle: LayoutTabNames[LayoutTabEnum.APPS],
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name={LayoutTabKeys[LayoutTabEnum.CHAT]}
        options={{
          href: imUrl ? undefined : null,
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "chatbox" : "chatbox-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name={LayoutTabKeys[LayoutTabEnum.SETTINGS]}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "settings" : "settings-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
