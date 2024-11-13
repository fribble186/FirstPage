import React, { useState, useEffect, useRef, useContext } from "react";
import { WebView, WebViewNavigation } from "react-native-webview";
import { BackHandler, StyleSheet, View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ConfigJsonContext } from "@/context/ConfigJson";

const Chat = () => {
  const configJsonContext = useContext(ConfigJsonContext);
  const configJson = configJsonContext?.configJson;
  const imUrl = configJson!.IMURL!;
  const router = useRouter();
  const webViewRef = useRef<any>(null);
  // const navigation = useNavigation();
  const [canGoBack, setCanGoBack] = useState(false);
  const { uri } = imUrl;
  // const endLoadWebView = () => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <Ionicons name="close" size={32} onPress={router.back} />
  //     ),
  //   });
  // };
  // useEffect(() => {
  //   navigation.setOptions({
  //     title,
  //     headerLeft: () => <View />,
  //     headerRight: () => <ActivityIndicator animating={true} />,
  //   });
  // }, []);
  useEffect(() => {
    const backAction = () => {
      if (canGoBack) {
        webViewRef.current.goBack(); // 返回上一个网页
        return true; // 阻止默认行为（返回到上级页面）
      } else {
        router.back();
        return true; // 阻止默认行为
      }
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => subscription.remove(); // 清理事件监听
  }, [canGoBack]);

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    setCanGoBack(navState.canGoBack);
  };
  return (
    <WebView
      ref={webViewRef}
      style={styles.container}
      source={{ uri }}
      onNavigationStateChange={handleNavigationStateChange}
      // onLoadEnd={endLoadWebView}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 35,
  },
});

export default Chat;
