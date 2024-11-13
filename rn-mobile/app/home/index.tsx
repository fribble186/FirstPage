import React, { useContext } from "react";
import { StyleSheet, View, ScrollView, Dimensions } from "react-native";
import AppsListItem from "@/components/AppsListItem";
import ShortcutCard from "@/components/ShortcutCard";
import { List } from "react-native-paper";
import { ConfigJsonContext } from "@/context/ConfigJson";

const { height: screenHeight } = Dimensions.get("window");

const Index = () => {
  const configJsonContext = useContext(ConfigJsonContext);
  const configJson = configJsonContext?.configJson;
  console.log(configJson);
  const shortcuts = configJson?.SHORTCUT || [];
  const urls = configJson?.URL || [];
  return (
    <View style={styles.appsListContainer}>
      {!!shortcuts.length && (
        <View style={{ paddingLeft: 12, marginBottom: 18, marginTop: 12 }}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {shortcuts.map((shortcut) => (
              <ShortcutCard
                title={shortcut.title}
                action={shortcut.action}
                key={shortcut.action.uri}
              />
            ))}
          </ScrollView>
        </View>
      )}
      {!!urls.length && (
        <List.Section>
          <List.Subheader
            style={{ fontSize: 22, fontWeight: "bold" }}
            variant="headlineMedium"
          >
            应用列表
          </List.Subheader>
          <View
            style={{
              height: screenHeight - 320,
              borderRadius: 15,
              paddingVertical: 12,
            }}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              {urls.map((url) => (
                <AppsListItem
                  title={url.title}
                  desc={url.desc}
                  uri={url.uri}
                  key={url.uri}
                  encrypted={url.encrypted}
                />
              ))}
            </ScrollView>
          </View>
        </List.Section>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  appsListContainer: {
    width: "100%",
  },
});

export default Index;
