import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Dimensions,
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
// Using local theme definition to ensure consistent look with LoadingScreen as requested
// Ideally this should be imported from core/theme.ts if it matches exactly, but we'll adapt slightly to match the specific HTML design request while keeping the theme structure.

const { width, height } = Dimensions.get("window");

interface Props {
  onGetStarted?: () => void;
}

const GetStartedScreen = ({ onGetStarted }: Props) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark"; // Enforce dark mode based on HTML "class='dark'" default? User said "like LoadingScreen", LoadingScreen adapts.
  // HTML has <html class="dark"> and script ensuring dark mode.
  // However, best practice is to support system theme or enforce dark if that's the branding.
  // Given the HTML is explicitly dark, I will bias towards dark or just use the dark theme values for "default" if the user wants that specific look.
  // Let's stick to system preference but with the specific palette provided.

  // Actually, the HTML is VERY dark/neon. If light mode is active, it might look weird if we strictly map to a light theme that looks different.
  // But LoadingScreen supports both. I will support both but ensure the Dark mode matches the HTML.

  const theme = {
    dark: {
      bg: "#0B0F17",
      surface: "#161B26",
      text: "#FFFFFF",
      textSecondary: "#94A3B8",
      primary: "#00C2FF",
      secondary: "#70E000",
      border: "#1E293B",
      version: "#475569",
      statusBar: "light-content" as const,
    },
    light: {
      bg: "#F1F5F9",
      surface: "#FFFFFF",
      text: "#0F172A",
      textSecondary: "#64748B",
      primary: "#00C2FF", // Keep branding colors
      secondary: "#70E000",
      border: "#E2E8F0",
      version: "#94A3B8",
      statusBar: "dark-content" as const,
    },
  };

  const currentTheme = isDark ? theme.dark : theme.light;

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Slow pulse for background glow (mimicking 'pulse-slow')
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.bg }]}>
      <StatusBar
        barStyle={currentTheme.statusBar}
        backgroundColor={currentTheme.bg}
        translucent
      />

      {/* Background Glows */}
      <Animated.View
        style={[
          styles.glowTop,
          {
            opacity: 0.6,
            transform: [{ scale: pulseAnim }],
            backgroundColor: isDark
              ? "rgba(0, 194, 255, 0.15)"
              : "rgba(0, 194, 255, 0.1)",
          },
        ]}
      />
      <View
        style={[
          styles.glowBottom,
          {
            backgroundColor: isDark
              ? "rgba(112, 224, 0, 0.15)"
              : "rgba(112, 224, 0, 0.1)",
          },
        ]}
      />

      {/* Main Content */}
      <View style={styles.contentContainer}>
        {/* Logo Section */}
        <Animated.View
          style={[
            styles.logoSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.logoWrapper}>
            <View
              style={[
                styles.logoGlow,
                { backgroundColor: currentTheme.primary },
              ]}
            />
            <View
              style={[
                styles.logoCard,
                {
                  backgroundColor: currentTheme.surface,
                  shadowColor: currentTheme.primary,
                },
              ]}
            >
              <Image
                source={require("../../../assets/images/icon.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </Animated.View>

        {/* Text Section */}
        <Animated.View
          style={[
            styles.textSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={[styles.title, { color: currentTheme.text }]}>
            Drive<Text style={{ color: currentTheme.primary }}>Lytix</Text>
          </Text>
          <Text
            style={[styles.subtitle, { color: currentTheme.textSecondary }]}
          >
            OBD-II DIAGNOSTICS
          </Text>

          <Text
            style={[styles.description, { color: currentTheme.textSecondary }]}
          >
            Monitor your vehicle's health in real-time.{"\n"}
            <Text style={{ color: currentTheme.text, fontWeight: "600" }}>
              Connect. Diagnose. Drive.
            </Text>
          </Text>
        </Animated.View>
      </View>

      {/* Bottom Actions */}
      <Animated.View
        style={[
          styles.bottomSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Pressable
          onPress={onGetStarted}
          style={({ pressed }) => [
            styles.buttonContainer,
            { transform: [{ scale: pressed ? 0.98 : 1 }] },
          ]}
        >
          <LinearGradient
            colors={[currentTheme.primary, currentTheme.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>GET STARTED</Text>
            <View style={styles.iconContainer}>
              <Text style={styles.arrowIcon}>→</Text>
            </View>
          </LinearGradient>
        </Pressable>
        <Pressable
          onPress={() => {
            /* Handle login nav if needed */
          }}
          style={styles.loginButton}
        >
          <Text
            style={[styles.loginText, { color: currentTheme.textSecondary }]}
          >
            Already have an account?{" "}
            <Text style={{ color: currentTheme.primary }}>Log in</Text>
          </Text>
        </Pressable>
        <AppVersion style={{ color: currentTheme.version }} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  glowTop: {
    position: "absolute",
    top: -width * 0.5,
    left: -width * 0.5,
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width,
    alignSelf: "center",
  },
  glowBottom: {
    position: "absolute",
    bottom: -width * 0.5,
    right: -width * 0.5,
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(40),
  },
  logoSection: {
    alignItems: "center",
    marginBottom: verticalScale(40),
  },
  logoWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  logoGlow: {
    position: "absolute",
    width: scale(160),
    height: scale(160),
    borderRadius: scale(30),
    opacity: 0.3,
    transform: [{ scale: 1.1 }],
  },
  logoCard: {
    width: scale(160),
    height: scale(160),
    borderRadius: scale(32),
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logoImage: {
    width: scale(140),
    height: scale(140),
    borderRadius: scale(28),
  },
  textSection: {
    alignItems: "center",
    maxWidth: scale(300),
  },
  title: {
    fontSize: moderateScale(42),
    fontWeight: "800",
    letterSpacing: -1,
    marginBottom: verticalScale(8),
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  subtitle: {
    fontSize: moderateScale(14),
    fontWeight: "600",
    letterSpacing: scale(2),
    textTransform: "uppercase",
    marginBottom: verticalScale(24),
    textAlign: "center",
  },
  description: {
    fontSize: moderateScale(16),
    lineHeight: verticalScale(24),
    textAlign: "center",
    fontWeight: "300",
  },
  bottomSection: {
    paddingBottom: verticalScale(48),
    paddingHorizontal: scale(32),
    alignItems: "center",
    width: "100%",
  },
  buttonContainer: {
    width: "100%",
    shadowColor: "#00C2FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: verticalScale(24),
    borderRadius: scale(16),
    overflow: "hidden",
  },
  gradientButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(24),
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: moderateScale(16),
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginRight: scale(8),
  },
  iconContainer: {
    marginLeft: scale(4),
  },
  arrowIcon: {
    color: "#FFFFFF",
    fontSize: moderateScale(18),
    fontWeight: "bold",
  },
  loginButton: {
    padding: scale(8),
    marginBottom: verticalScale(16),
  },
  loginText: {
    fontSize: moderateScale(14),
    fontWeight: "500",
  },
  versionText: {
    fontSize: moderateScale(10),
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    opacity: 0.7,
  },
});

export default GetStartedScreen;
