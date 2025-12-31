import React from "react";
import { Platform, StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import { APP_CONFIG } from "../../core/config";
import { theme } from "../../core/theme";

interface Props {
  style?: StyleProp<TextStyle>;
  color?: string;
}

const AppVersion = ({ style, color }: Props) => {
  return (
    <Text
      style={[
        styles.version,
        { color: color || theme.palette.light.textTertiary },
        style,
      ]}
    >
      {APP_CONFIG.displayVersion()}
    </Text>
  );
};

const styles = StyleSheet.create({
  version: {
    fontSize: 10,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    opacity: 0.7,
    textAlign: "center",
  },
});

export default AppVersion;
