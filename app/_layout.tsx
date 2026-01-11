import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import { useDatabaseInit } from "../src/core/hooks/useDatabaseInit";

export default function RootLayout() {
  const isDBReady = useDatabaseInit();

  if (!isDBReady) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0B0F17",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#00C2FF" />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
