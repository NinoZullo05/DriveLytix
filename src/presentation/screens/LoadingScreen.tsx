import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Easing,
  Image,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "../../core/responsive";
import AppVersion from "../components/AppVersion";

const DriveLytixLoadingScreen = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(colorScheme === "dark");

  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const glowValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeValue, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 0.5,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(glowValue, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );

    spinAnimation.start();
    pulseAnimation.start();
    glowAnimation.start();

    return () => {
      spinAnimation.stop();
      pulseAnimation.stop();
      glowAnimation.stop();
    };
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const glowOpacity = glowValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.6],
  });

  const theme = {
    dark: {
      bg: "#0B0F17",
      surface: "#161B26",
      text: "#FFFFFF",
      textSecondary: "#94A3B8",
      textTertiary: "#64748B",
      primary: "#00C2FF",
      secondary: "#70E000",
      spinnerBg: "#1E293B",
      versionText: "#475569",
      statusBar: "light-content" as const,
    },
    light: {
      bg: "#F1F5F9",
      surface: "#FFFFFF",
      text: "#0F172A",
      textSecondary: "#64748B",
      textTertiary: "#94A3B8",
      primary: "#00C2FF",
      secondary: "#70E000",
      spinnerBg: "#E2E8F0",
      versionText: "#94A3B8",
      statusBar: "dark-content" as const,
    },
  };

  const currentTheme = isDark ? theme.dark : theme.light;

  return (
    <Pressable
      style={[styles.container, { backgroundColor: currentTheme.bg }]}
      onLongPress={() => setIsDark(!isDark)}
    >
      <StatusBar
        barStyle={currentTheme.statusBar}
        backgroundColor={currentTheme.bg}
        translucent={Platform.OS === "android"}
      />

      {/* Background glows */}
      <View
        style={[
          styles.glowTop,
          {
            backgroundColor: isDark
              ? "rgba(0, 194, 255, 0.08)"
              : "rgba(59, 130, 246, 0.25)",
          },
        ]}
      />
      <View
        style={[
          styles.glowBottom,
          {
            backgroundColor: isDark
              ? "rgba(112, 224, 0, 0.08)"
              : "rgba(34, 197, 94, 0.25)",
          },
        ]}
      />

      <Animated.View style={[styles.content, { opacity: fadeValue }]}>
        {/* Logo section */}
        <View style={styles.logoSection}>
          <Animated.View
            style={[
              styles.logoGlow,
              {
                opacity: glowOpacity,
                backgroundColor: currentTheme.primary,
              },
            ]}
          />
          <View
            style={[
              styles.logoContainer,
              {
                backgroundColor: currentTheme.surface,
                shadowColor: isDark ? "#000" : "#0F172A",
                shadowOpacity: isDark ? 0.8 : 0.15,
              },
            ]}
          >
            {/* App Icon - Simplified */}
            <Image
              source={require("../../../assets/images/icon.png")}
              style={{ width: scale(240), height: scale(240) }}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* App Name */}
        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: currentTheme.text }]}>
            Drive<Text style={{ color: currentTheme.primary }}>Lytix</Text>
          </Text>
          <Text
            style={[styles.subtitle, { color: currentTheme.textSecondary }]}
          >
            {t("loadingScreen.subtitle")}
          </Text>
        </View>

        {/* Tagline */}
        <View style={styles.taglineSection}>
          <Text style={[styles.tagline, { color: currentTheme.textSecondary }]}>
            "{t("loadingScreen.taglinePart1")}
            <Text
              style={[styles.taglineHighlight, { color: currentTheme.primary }]}
            >
              {t("loadingScreen.taglinePart2")}
            </Text>
            "
          </Text>
        </View>
      </Animated.View>

      {/* Bottom section */}
      <View style={styles.bottomSection}>
        <View style={styles.spinnerSection}>
          {/* Spinner */}
          <View style={styles.spinnerContainer}>
            <View
              style={[
                styles.spinnerBg,
                { borderColor: currentTheme.spinnerBg },
              ]}
            />
            <Animated.View
              style={[
                styles.spinner,
                {
                  borderTopColor: currentTheme.primary,
                  borderRightColor: currentTheme.secondary,
                  transform: [{ rotate: spin }],
                },
              ]}
            />
          </View>

          {/* Loading text */}
          <Animated.Text
            style={[
              styles.loadingText,
              {
                color: currentTheme.textTertiary,
                opacity: pulseValue,
              },
            ]}
          >
            {t("loadingScreen.connecting")}
          </Animated.Text>
        </View>
        {/* Version */}
        <AppVersion style={{ color: currentTheme.versionText }} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  glowTop: {
    position: "absolute",
    top: verticalScale(-200),
    left: scale(-200),
    width: scale(600),
    height: scale(600),
    borderRadius: scale(300),
    opacity: 0.8,
  },
  glowBottom: {
    position: "absolute",
    bottom: verticalScale(-150),
    right: scale(-150),
    width: scale(500),
    height: scale(500),
    borderRadius: scale(250),
    opacity: 0.6,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(24),
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  logoSection: {
    marginBottom: verticalScale(40),
    alignItems: "center",
    justifyContent: "center",
  },
  logoGlow: {
    position: "absolute",
    width: scale(200),
    height: scale(200),
    borderRadius: scale(40),
    opacity: 0.4,
  },
  logoContainer: {
    width: scale(176),
    height: scale(176),
    borderRadius: scale(32),
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: verticalScale(25) },
    shadowRadius: scale(50),
    elevation: 20,
  },
  iconCircle: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    borderWidth: scale(4),
    justifyContent: "center",
    alignItems: "center",
  },
  iconTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: scale(20),
    borderRightWidth: scale(20),
    borderBottomWidth: scale(35),
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    transform: [{ rotate: "180deg" }],
    marginTop: verticalScale(-5),
  },
  titleSection: {
    alignItems: "center",
    marginBottom: verticalScale(32),
  },
  title: {
    fontSize: moderateScale(48),
    fontWeight: "700",
    letterSpacing: -1,
    marginBottom: verticalScale(8),
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  subtitle: {
    fontSize: moderateScale(14),
    fontWeight: "500",
    letterSpacing: scale(3),
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  taglineSection: {
    maxWidth: scale(320),
    alignItems: "center",
  },
  tagline: {
    fontSize: moderateScale(18),
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: verticalScale(28),
    fontWeight: "300",
  },
  taglineHighlight: {
    fontWeight: "600",
    fontStyle: "normal",
  },
  bottomSection: {
    paddingBottom: verticalScale(48),
    alignItems: "center",
    gap: verticalScale(24),
  },
  spinnerSection: {
    alignItems: "center",
    gap: verticalScale(12),
  },
  spinnerContainer: {
    width: scale(48),
    height: scale(48),
    position: "relative",
  },
  spinnerBg: {
    position: "absolute",
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    borderWidth: scale(4),
  },
  spinner: {
    position: "absolute",
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    borderWidth: scale(4),
    borderColor: "transparent",
  },
  loadingText: {
    fontSize: moderateScale(11),
    fontWeight: "600",
    letterSpacing: scale(2),
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  version: {
    fontSize: moderateScale(10),
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
});

export default DriveLytixLoadingScreen;
