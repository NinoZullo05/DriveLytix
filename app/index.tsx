import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import "../src/core/i18n";
import { moderateScale, verticalScale } from "../src/core/responsive";
import { theme } from "../src/core/theme";

import BottomNavigationbar from "../src/presentation/components/BottomNavigationbar";
import ConnectionScreen from "../src/presentation/screens/ConnectionScreen";
import DataStorageScreen from "../src/presentation/screens/DataStorageScreen";
import GetStartedScreen from "../src/presentation/screens/GetStartedScreen";
import LoadingScreen from "../src/presentation/screens/LoadingScreen";

/* ---------------- TYPES ---------------- */

type AppStage = "loading" | "getStarted" | "dataSetup" | "connection" | "home";

/* ---------------- APP ---------------- */

export default function App() {
  const { t } = useTranslation();

  const [stage, setStage] = useState<AppStage>("loading");

  /* ----------- BOOTSTRAP ----------- */

  useEffect(() => {
    bootstrap();
  }, []);

  const bootstrap = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem("HAS_LAUNCHED");
      const storageChoice = await AsyncStorage.getItem("STORAGE_CHOICE");
      const lastDeviceId = await AsyncStorage.getItem(
        "LAST_CONNECTED_DEVICE_ID"
      );

      setStage("loading");

      setTimeout(() => {
        if (!hasLaunched) {
          setStage("getStarted");
        } else if (!storageChoice) {
          setStage("dataSetup");
        } else if (!lastDeviceId) {
          // User Requirement: Choice of device should appear when app opens if not set
          // We can't use router.push here easily because we are unconditionally rendering based on stage.
          // We will introduce a new stage "connection" or handle it after home mount.
          // But simpler: just set stage to 'connection' which renders the screen.
          setStage("connection");
        } else {
          setStage("home");
        }
      }, 3000);
    } catch (error) {
      console.error("Bootstrap error:", error);
      setStage("home");
    }
  };

  /* ----------- ACTIONS ----------- */

  const handleGetStarted = async () => {
    await AsyncStorage.setItem("HAS_LAUNCHED", "true");
    setStage("dataSetup");
  };

  const handleStorageSelection = async (type: "local" | "cloud") => {
    try {
      await AsyncStorage.setItem("STORAGE_CHOICE", type);
      setStage("loading");
      setTimeout(async () => {
        const lastDeviceId = await AsyncStorage.getItem(
          "LAST_CONNECTED_DEVICE_ID"
        );
        if (!lastDeviceId) {
          setStage("connection");
        } else {
          setStage("home");
        }
      }, 1500);
    } catch (error) {
      console.error("Storage selection error:", error);
      setStage("home");
    }
  };

  /* ----------- RENDER FLOW ----------- */

  if (stage === "loading") {
    return <LoadingScreen />;
  }

  if (stage === "getStarted") {
    return <GetStartedScreen onGetStarted={handleGetStarted} />;
  }

  if (stage === "dataSetup") {
    return <DataStorageScreen onSelectStorage={handleStorageSelection} />;
  }

  if (stage === "connection") {
    return (
      <ConnectionScreen
        onBack={() => setStage("dataSetup")}
        onSkip={() => setStage("home")}
      />
    );
  }

  // HOME → Bottom Tabs
  return <BottomNavigationbar />;
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.palette.light.background,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    color: theme.palette.light.text,
  },
  textSecondary: {
    fontSize: moderateScale(16),
    color: theme.palette.light.textSecondary,
    marginTop: verticalScale(8),
  },
});
