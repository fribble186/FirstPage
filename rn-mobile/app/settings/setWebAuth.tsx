import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useNavigation, useRouter } from "expo-router";
import { domain, service } from "firstpage-core";
import ExpoWebAuthRepo from "@/infrastructure/ExpoWebAuthRepo";

const SetWebAuth = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const canSave = !!account && !!password;

  const urlService = useMemo(() => {
    const webAuthRepo = new ExpoWebAuthRepo();
    return new service.URLService(webAuthRepo);
  }, []);
  useEffect(() => {
    navigation.setOptions({
      title: "网页的登录信息",
    });
    urlService
      .getWebAuth()
      .then((webAuth) => {
        if (webAuth?.account) {
          setAccount(webAuth?.account);
        }
        if (webAuth?.password) {
          setPassword(webAuth.password);
        }
      })
      .catch(console.log);
  }, []);
  const handleSave = async () => {
    if (canSave) {
      const webAuth = new domain.WebAuth(account, password);
      await urlService.saveWebAuth(webAuth);
      router.back();
    }
  };
  const handleClear = async () => {
    await urlService.clearWebAuth();
    setAccount("");
    setPassword("");
    router.back();
  };
  return (
    <View style={{ padding: 16, marginTop: 50 }}>
      <TextInput
        style={{ marginBottom: 16 }}
        placeholder="账号"
        value={account}
        onChangeText={setAccount}
      />
      <TextInput
        style={{ marginBottom: 16 }}
        placeholder="密码"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
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
      <Text variant="labelMedium">
        这个账号密码是登录您网页的账号密码，具体配置在 nginx 中
      </Text>
      <Text variant="labelMedium">这个账号密码将安全地存储在本地</Text>
    </View>
  );
};

export default SetWebAuth;
