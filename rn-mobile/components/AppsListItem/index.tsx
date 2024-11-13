import React, { useMemo } from "react";
import { StyleSheet, Pressable, GestureResponderEvent } from "react-native";
import { useRouter } from "expo-router";
import { List } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { openBrowserAsync } from "expo-web-browser";
import { Platform } from "react-native";
import { domain, service } from "firstpage-core";
import ExpoWebAuthRepo from "@/infrastructure/ExpoWebAuthRepo";

const RippleColor = "rgba(0, 0, 0, .32)";

const AppsListItem: React.FC<domain.ConfigJson["URL"][number]> = ({
  title,
  desc,
  uri,
  encrypted,
}) => {
  const urlService = useMemo(() => {
    const webAuthRepo = new ExpoWebAuthRepo();
    return new service.URLService(webAuthRepo);
  }, []);
  const handlePress = async () => {
    router.push({
      pathname: "/appContainer",
      params: { url: await urlService.getAuthUrl(uri, !!encrypted), title },
    });
  };
  const router = useRouter();
  const handleOpenBrowser = async (event: GestureResponderEvent) => {
    if (Platform.OS !== "web") {
      // Prevent the default behavior of linking to the default browser on native.
      event.preventDefault();
      // Open the link in an in-app browser.
      await openBrowserAsync(await urlService.getAuthUrl(uri, !!encrypted));
    }
  };
  return (
    <List.Item
      title={title}
      description={desc}
      left={(props) => <List.Icon {...props} icon="book-open-page-variant" />}
      rippleColor={RippleColor}
      style={styles.listContainer}
      titleStyle={{ fontWeight: "bold" }}
      onPress={handlePress}
      // right={() => (
      //   <Pressable
      //     onPress={handleOpenBrowser}
      //     style={{
      //       display: "flex",
      //       justifyContent: "center",
      //     }}
      //   >
      //     <List.Icon icon="web" />
      //   </Pressable>
      // )}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    borderRadius: 8,
    backgroundColor: "white",
    shadowColor: "#000", // 阴影颜色
    shadowOffset: { width: 0, height: 2 }, // 阴影偏移
    shadowOpacity: 0.2, // 阴影透明度
    shadowRadius: 3.84, // 阴影模糊程度
    elevation: 3, // Android 阴影效果
    marginHorizontal: 16,
    marginVertical: 8,
  },
});

export default AppsListItem;
