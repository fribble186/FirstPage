import React, { useState, useMemo } from "react";
import { List, Portal, Dialog, Text, Button } from "react-native-paper";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { service } from "firstpage-core";
import ExpoConfigJsonRepo from "@/infrastructure/ExpoConfigJsonRepo";
import ExpoDownloader from "@/infrastructure/ExpoDownloader";
import SimpleCryptoDecrypter from "@/infrastructure/SimpleCryptoDecrypter";
import ExpoNotificationProvider from "@/infrastructure/ExpoNotificationProvider";
import ExpoNotificationConfigRepo from "@/infrastructure/ExpoNotificationConfigRepo";

const Index = () => {
  const router = useRouter();
  const [confirmDeleteJsonDialogVisible, setConfirmDeleteJsonDialogVisible] =
    useState(false);
  const configJsonService = useMemo(() => {
    const configJsonRepo = new ExpoConfigJsonRepo();
    const downloader = new ExpoDownloader();
    const decrypter = new SimpleCryptoDecrypter();
    return new service.ConfigJsonService(configJsonRepo, downloader, decrypter);
  }, []);
  const notificationService = useMemo(() => {
    const notificationProvider = new ExpoNotificationProvider();
    const notificationConfigRepo = new ExpoNotificationConfigRepo();
    return new service.NotificationService(
      notificationProvider,
      notificationConfigRepo
    );
  }, []);
  const handleExit = async () => {
    await configJsonService.removeJsonConfig();
    await notificationService.removeConfig();
    hideConfirmDeleteJsonDialog();
    router.replace("/");
  };
  const go2WebAuth = () => {
    router.push("/settings/setWebAuth");
  };
  const go2Notify = () => {
    router.push("/settings/setNotify");
  };
  const showConfirmDeleteJsonDialog = () => {
    setConfirmDeleteJsonDialogVisible(true);
  };
  const hideConfirmDeleteJsonDialog = () => {
    setConfirmDeleteJsonDialogVisible(false);
  };
  return (
    <View style={{ marginTop: 30, padding: 12 }}>
      <List.Section>
        <List.Subheader>应用配置</List.Subheader>
        <List.Item
          title="配置网页的登录信息"
          description="进入网页的 auth 账号密码"
          right={(props) => (
            <List.Icon {...props} icon="form-textbox-password" />
          )}
          onPress={go2WebAuth}
          style={{ backgroundColor: "white" }}
        />
        <List.Item
          title="配置消息提醒"
          description="配置消息提醒 socket 链接"
          right={(props) => (
            <List.Icon {...props} icon="message-alert-outline" />
          )}
          onPress={go2Notify}
          style={{ backgroundColor: "white" }}
        />
      </List.Section>
      <List.Section>
        <List.Subheader>基础设置</List.Subheader>
        <List.Item
          title="重新配置 json"
          description="清空缓存的 json 配置"
          right={(props) => <List.Icon {...props} icon="exit-to-app" />}
          onPress={showConfirmDeleteJsonDialog}
          style={{ backgroundColor: "white" }}
        />
      </List.Section>
      <Portal>
        <Dialog
          visible={confirmDeleteJsonDialogVisible}
          onDismiss={hideConfirmDeleteJsonDialog}
        >
          <Dialog.Title>注意！</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">确定重新配置 JSON 配置文件吗？</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideConfirmDeleteJsonDialog}>我再想想</Button>
            <Button onPress={handleExit}>确定</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default Index;
