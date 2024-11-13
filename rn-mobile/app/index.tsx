import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { Text, TextInput, Button, HelperText } from "react-native-paper";
import { View, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ConfigJsonContext } from "@/context/ConfigJson";
import { service } from "firstpage-core";
import ExpoConfigJsonRepo from "@/infrastructure/ExpoConfigJsonRepo";
import ExpoDownloader from "@/infrastructure/ExpoDownloader";
import SimpleCryptoDecrypter from "@/infrastructure/SimpleCryptoDecrypter";
import to from "await-to-js";

const LOGO_URL = "../assets/images/logo.png";
const ParseJson = () => {
  const router = useRouter();
  const [fileUrl, setFileUrl] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [parseLoading, setParseLoading] = useState(false);
  const configJsonContext = useContext(ConfigJsonContext);
  const setConfigJson = configJsonContext?.setConfigJson;
  const canParse = useMemo(() => {
    return !!fileUrl && !!password;
  }, [fileUrl, password]);
  const configJsonService = useMemo(() => {
    const configJsonRepo = new ExpoConfigJsonRepo();
    const downloader = new ExpoDownloader();
    const decrypter = new SimpleCryptoDecrypter();
    return new service.ConfigJsonService(configJsonRepo, downloader, decrypter);
  }, []);
  const handleParse = useCallback(async () => {
    setParseLoading(true);
    if (canParse) {
      const [downloaderr, decryptedStr] = await to(
        configJsonService.downloadJsonConfig(fileUrl, password)
      );
      if (!downloaderr) {
        setConfigJson?.(decryptedStr);
        router.replace({
          pathname: "/home",
          params: {},
        });
      } else {
        console.log("downloaderr", downloaderr);
      }
      setParseLoading(false);
    }
  }, [canParse, fileUrl, password]);

  useEffect(() => {
    configJsonService.getJsonConfig().then((config) => {
      if (config) {
        setConfigJson?.(config);
        router.replace({
          pathname: "/home",
          params: {},
        });
      }
    });
  }, []);

  return (
    <View style={styles.pageContainer}>
      <View style={[styles.headerContainer]}>
        <Image source={require(LOGO_URL)} style={styles.logo} />
        <Text variant="headlineSmall">Top Page</Text>
      </View>
      <Text variant="labelLarge" style={styles.mb_16}>
        输入加密的 JSON 文件地址，开始解析 JSON 文件
      </Text>
      <TextInput
        style={styles.mb_16}
        placeholder="加密的 json 文件地址"
        value={fileUrl}
        onChangeText={setFileUrl}
      />
      <TextInput
        style={styles.mb_32}
        placeholder="密码"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <Button
        mode="contained"
        onPress={handleParse}
        disabled={!canParse}
        loading={parseLoading}
      >
        解析
      </Button>
      <HelperText type="error" visible={!!errorMessage}>
        {errorMessage}
      </HelperText>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: { padding: 16, marginTop: 100 },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 80,
  },
  logo: { width: 50, height: 50, marginRight: 12 },
  mb_16: { marginBottom: 16 },
  mb_32: { marginBottom: 32 },
});

export default ParseJson;
