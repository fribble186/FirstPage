import React, { useState, useEffect, useRef } from "react";
import { WebView, WebViewNavigation } from "react-native-webview";
import { BackHandler, StyleSheet, View, ActivityIndicator } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Linking } from "react-native";

const AppContainer = () => {
  const route = useRoute();
  const router = useRouter();
  const webViewRef = useRef<any>(null);
  const navigation = useNavigation();
  const [canGoBack, setCanGoBack] = useState(false);
  const { url, title } = route.params as { url: string; title: string };
  const endLoadWebView = () => {
    navigation.setOptions({
      headerRight: () => (
        <Ionicons name="close" size={32} onPress={router.back} />
      ),
    });
  };
  useEffect(() => {
    navigation.setOptions({
      title,
      headerLeft: () => <View />,
      headerRight: () => <ActivityIndicator animating={true} />,
    });
  }, []);
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
    console.log("navState", navState);
    setCanGoBack(navState.canGoBack);
  };
  return (
    <WebView
      ref={webViewRef}
      style={styles.container}
      source={{ uri: url }}
      onNavigationStateChange={handleNavigationStateChange}
      onLoadEnd={endLoadWebView}
      setSupportMultipleWindows={false}
      onShouldStartLoadWithRequest={(request) => {
        console.log("onShouldStartLoadWithRequest", request.url, url);
        // 检查 URL，判断是否为内部链接

        const isInternalLink =
          new URL(request.url).hostname === new URL(url).hostname;

        if (isInternalLink) {
          // 返回 true 表示在 WebView 内加载
          return true;
        } else {
          // 对于外部链接，返回 false 并使用 Linking 打开外部浏览器
          Linking.openURL(request.url);
          return false;
        }
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AppContainer;
