import { Stack } from "expo-router";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { ConfigJsonContext } from "@/context/ConfigJson";
import { useState, useEffect } from "react";
import Colors from "@/constants/Colors";
import { domain, service } from "firstpage-core";
import ExpoNotificationProvider from "@/infrastructure/ExpoNotificationProvider";
import ExpoNotificationConfigRepo from "@/infrastructure/ExpoNotificationConfigRepo";
import to from "await-to-js";

const theme = {
  ...DefaultTheme,
  colors: Colors,
};

export default function RootLayout() {
  const [configJson, setConfigJson] = useState<domain.ConfigJson | null>(null);
  const onInit = async () => {
    const notificationProvider = new ExpoNotificationProvider();
    const notificationConfigRepo = new ExpoNotificationConfigRepo();
    const notificationService = new service.NotificationService(
      notificationProvider,
      notificationConfigRepo
    );
    const [getConfigErr, config] = await to(notificationService.getConfig());
    console.log("getConfigErr", getConfigErr);
    if (!getConfigErr && config) {
      const [connectErr] = await to(notificationService.connect());
      console.log("connectErr", connectErr);
    }
    return () => {
      notificationService.disconnect();
    };
  };
  useEffect(() => {
    onInit();
  }, []);
  return (
    <PaperProvider theme={theme}>
      <ConfigJsonContext.Provider value={{ setConfigJson, configJson }}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="home" options={{ headerShown: false }} />
          <Stack.Screen name="appContainer" options={{ headerShown: true }} />
        </Stack>
      </ConfigJsonContext.Provider>
    </PaperProvider>
  );
}
