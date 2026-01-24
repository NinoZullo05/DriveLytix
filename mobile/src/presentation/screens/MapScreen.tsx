import React from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { theme } from "../../core/theme";

const MapScreen = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const currentTheme = isDark ? theme.palette.dark : theme.palette.light;

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <Text style={[styles.text, { color: currentTheme.text }]}>Map</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 24, fontWeight: "600" },
});

export default MapScreen;
