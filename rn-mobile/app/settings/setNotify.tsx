import React, { useEffect, useState, useMemo } from "react";
import { View } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useNavigation } from "expo-router";
import * as Updates from "expo-updates";
import { domain, service } from "firstpage-core";
import ExpoNotificationProvider from "@/infrastructure/ExpoNotificationProvider";
import ExpoNotificationConfigRepo from "@/infrastructure/ExpoNotificationConfigRepo";
import to from "await-to-js";

const SetNotify = () => {
  const navigation = useNavigation();
  const [uri, setUri] = useState("");
  const [authHeaderKey, setAuthHeaderKey] = useState("");
  const [authHeaderValue, setAuthHeaderValue] = useState("");
  const [granted, setGranted] = useState(false);
  const canSave = !!uri;

  const notificationService = useMemo(() => {
    const notificationProvider = new ExpoNotificationProvider();
    const notificationConfigRepo = new ExpoNotificationConfigRepo();
    return new service.NotificationService(
      notificationProvider,
      notificationConfigRepo
    );
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: "设置消息提醒",
    });
  }, []);
  const onInit = async () => {
    const [getConfigErr, config] = await to(notificationService.getConfig());
    const [_, granted] = await to(notificationService.getPermission());
    if (!getConfigErr && config) {
      if (config.uri) {
        setUri(config.uri);
      }
      if (config.header_auth_key) {
        setAuthHeaderKey(config.header_auth_key);
      }
      if (config.header_auth_value) {
        setAuthHeaderValue(config.header_auth_value);
      }
    }
    if (getConfigErr) {
      console.log("getConfigErr", getConfigErr);
    }
    setGranted(granted!);
  };
  useEffect(() => {
    onInit();
  }, []);
  const handleSave = async () => {
    if (canSave) {
      const notificationConfig = new domain.NotificationConfig(
        uri,
        authHeaderKey,
        authHeaderValue
      );
      await notificationService.saveConfig(notificationConfig);
      await Updates.reloadAsync();
    }
  };
  const handleClear = async () => {
    await notificationService.removeConfig();
    setUri("");
    setAuthHeaderKey("");
    setAuthHeaderValue("");
    await Updates.reloadAsync();
  };
  const getPermissions = async () => {
    const result = await notificationService.requestPermission();
    setGranted(result);
  };
  return (
    <View style={{ padding: 16, marginTop: 50 }}>
      <TextInput
        style={{ marginBottom: 16 }}
        placeholder="消息提醒的 wss 链接"
        value={uri}
        onChangeText={setUri}
      />
      <TextInput
        style={{ marginBottom: 16 }}
        placeholder="用于验证的 header key"
        value={authHeaderKey}
        onChangeText={setAuthHeaderKey}
      />
      <TextInput
        style={{ marginBottom: 16 }}
        placeholder="用于验证的 header value"
        secureTextEntry={true}
        value={authHeaderValue}
        onChangeText={setAuthHeaderValue}
      />
      <Button
        style={{ marginBottom: 16 }}
        mode="contained"
        disabled={!canSave}
        onPress={handleSave}
      >
        存储
      </Button>
      <Button
        style={{ marginBottom: 32 }}
        mode="outlined"
        disabled={!canSave}
        onPress={handleClear}
      >
        清空
      </Button>
      <Button
        style={{ marginBottom: 16 }}
        mode="contained"
        disabled={granted}
        onPress={getPermissions}
      >
        {granted ? "已开启应用消息通知权限" : "开启应用消息通知权限"}
      </Button>
      <Text variant="labelMedium">这些配置将安全地存储在本地</Text>
    </View>
  );
};

export default SetNotify;
