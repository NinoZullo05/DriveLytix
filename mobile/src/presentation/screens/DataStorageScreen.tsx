import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Dimensions,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "../../core/responsive";
import AppVersion from "../components/AppVersion";

const { width } = Dimensions.get("window");

interface Props {
  onSelectStorage: (type: "local" | "cloud") => void;
}

const DataStorageScreen = ({ onSelectStorage }: Props) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const storageOptions = [
    {
      id: "local",
      title: "Local Storage",
      subtitle: "Maximum Privacy",
      description: "Data stays on your device. No cloud sync. Full control.",
      icon: "lock", // Placeholder for icon logic
      colors: ["#70E000", "#3B82F6"],
    },
    {
      id: "cloud",
      title: "Cloud Sync",
      subtitle: "Firebase Integration",
      description: "Backup & Sync across devices. Secure cloud storage.",
      icon: "cloud",
      colors: ["#00C2FF", "#6366F1"],
    },
  ];

  const currentTheme = {
    bg: "#0B0F17",
    surface: "#161B26",
    text: "#FFFFFF",
    textSecondary: "#94A3B8",
    border: "#1E293B",
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.bg }]}>
      <StatusBar barStyle="light-content" backgroundColor={currentTheme.bg} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Data Privacy</Text>
        <Text style={styles.headerSubtitle}>
          Choose how you want to store your driving data.
        </Text>
      </View>

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {storageOptions.map((option) => (
          <Pressable
            key={option.id}
            onPress={() => onSelectStorage(option.id as "local" | "cloud")}
            style={({ pressed }) => [
              styles.cardContainer,
              { transform: [{ scale: pressed ? 0.98 : 1 }] },
            ]}
          >
            <LinearGradient
              colors={["rgba(255,255,255,0.03)", "rgba(255,255,255,0.01)"]}
              style={styles.cardGradient}
            >
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: `rgba(${
                      option.id === "local" ? "112, 224, 0" : "0, 194, 255"
                    }, 0.1)`,
                  },
                ]}
              >
                {/* Simple text icon representation for now due to lack of vector icons setup for sure */}
                <Text style={{ fontSize: 24 }}>
                  {option.id === "local" ? "🔒" : "☁️"}
                </Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{option.title}</Text>
                <Text
                  style={[
                    styles.cardSubtitle,
                    { color: option.id === "local" ? "#70E000" : "#00C2FF" },
                  ]}
                >
                  {option.subtitle}
                </Text>
                <Text style={styles.cardDescription}>{option.description}</Text>
              </View>
              <View style={styles.arrowContainer}>
                <Text style={styles.arrow}>→</Text>
              </View>
            </LinearGradient>
          </Pressable>
        ))}
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          You can change this later in settings.
        </Text>
        <AppVersion
          style={{ marginTop: verticalScale(16), color: "#475569" }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(60),
  },
  header: {
    marginBottom: verticalScale(32),
  },
  headerTitle: {
    fontSize: moderateScale(32),
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: verticalScale(8),
  },
  headerSubtitle: {
    fontSize: moderateScale(16),
    color: "#94A3B8",
    lineHeight: verticalScale(24),
  },
  content: {
    flex: 1,
    gap: verticalScale(16),
  },
  cardContainer: {
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
  },
  cardGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: scale(20),
  },
  iconContainer: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(16),
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: moderateScale(18),
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: verticalScale(4),
  },
  cardSubtitle: {
    fontSize: moderateScale(12),
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: verticalScale(4),
  },
  cardDescription: {
    fontSize: moderateScale(13),
    color: "#94A3B8",
    lineHeight: verticalScale(18),
  },
  arrowContainer: {
    marginLeft: scale(12),
  },
  arrow: {
    color: "#FFFFFF",
    fontSize: moderateScale(20),
    opacity: 0.5,
  },
  footer: {
    paddingBottom: verticalScale(40),
    alignItems: "center",
  },
  footerText: {
    color: "#64748B",
    fontSize: moderateScale(12),
  },
});

export default DataStorageScreen;
