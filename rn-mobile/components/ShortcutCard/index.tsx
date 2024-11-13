import React from "react";
import { StyleSheet, View } from "react-native";
import { FAB, Text } from "react-native-paper";
import { domain } from "firstpage-core";

const ShortcutCard: React.FC<
  Required<domain.ConfigJson>["SHORTCUT"][number]
> = ({ title, action }) => {
  const [clicked, setClicked] = React.useState(false);
  const timer = React.useRef<NodeJS.Timeout | null>(null);
  const handlePress = () => {
    if (clicked) return;
    setClicked(true);
    fetch(action.uri, {
      method: "GET",
      headers: action?.headers ?? {},
    }).then(() => {
      timer.current = setTimeout(() => {
        setClicked(false);
        if (timer.current) {
          clearTimeout(timer.current);
        }
      }, 1000 * 5);
    });
  };
  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <FAB
        icon="gesture-tap-button"
        style={{ margin: 8 }}
        onPress={handlePress}
        loading={clicked}
        disabled={clicked}
      />
      <Text variant="labelLarge">{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  button: { marginRight: 5 },
});

export default ShortcutCard;
