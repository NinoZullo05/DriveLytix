import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { moderateScale, verticalScale } from "../../core/responsive";
import { bluetoothService } from "../../core/services/BluetoothService";
import { theme } from "../../core/theme";
import {
  CircularGauge,
  StatCardWidget as StatCardSmall,
} from "../components/WidgetComponents";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const WIDGET_STORAGE_KEY = "DRIVELYTIX_WIDGET_SETTINGS";

const { width } = Dimensions.get("window");

/* ---------------- COMPONENTS ---------------- */

const QuickAction = ({ icon, label, onPress }: any) => (
  <TouchableOpacity style={styles.quickActionItem} onPress={onPress}>
    <View style={styles.quickActionCircle}>
      <MaterialCommunityIcons name={icon} size={24} color="#fff" />
    </View>
    <Text style={styles.quickActionLabel}>{label}</Text>
  </TouchableOpacity>
);

const DashboardScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const activeColor = theme.palette.primary;

  const [isConnected, setIsConnected] = useState(false);
  const [widgets, setWidgets] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = bluetoothService.subscribeToConnectionStatus(
      (status) => {
        setIsConnected(status);
      }
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    const loadWidgets = async () => {
      try {
        const saved = await AsyncStorage.getItem(WIDGET_STORAGE_KEY);
        if (saved) {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setWidgets(JSON.parse(saved));
        }
      } catch (e) {
        console.error("Failed to load widgets", e);
      }
    };

    loadWidgets();
    // In a real app, we might want to use useFocusEffect or a proper state management
    // but for now, we'll just reload periodically or when focusing.
    const interval = setInterval(loadWidgets, 2000);
    return () => clearInterval(interval);
  }, []);

  const navigateToConnection = () => {
    router.push("/connection");
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.palette.dark.background },
      ]}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBox}>
            <MaterialCommunityIcons
              name="car-outline"
              size={24}
              color={activeColor}
            />
          </View>
          <View>
            <Text style={styles.appName}>DriveLytix</Text>
            <View style={styles.connectedRow}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: isConnected ? "#4ADE80" : "#F87171" },
                ]}
              />
              <Text style={styles.statusText}>
                {isConnected
                  ? t("connection.connectedAlert").toUpperCase()
                  : t("connection.disconnected").toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push("/manage-widgets")}
        >
          <MaterialIcons name="settings" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Dynamic Widgest - Arranged by Category/Type */}

        {/* TOP SECTION: GAUGES (Primary Data) */}
        <View style={styles.gaugesContainer}>
          {widgets
            .filter((w) => w.enabled && (w.id === "rpm" || w.id === "speed"))
            .map((widget) => (
              <View key={widget.id} style={styles.gaugeBox}>
                <CircularGauge
                  value={widget.id === "rpm" ? 3.2 : 84}
                  max={widget.id === "rpm" ? 8 : 260}
                  label={widget.id === "rpm" ? "RPM" : "KM/H"}
                  subLabel={widget.id === "rpm" ? "x1000" : undefined}
                  color={widget.id === "rpm" ? activeColor : "#4ADE80"}
                  size={width * 0.42}
                />
              </View>
            ))}
        </View>

        {/* MIDDLE SECTION: GRID CARDS (Secondary Data) */}
        <View style={styles.statsGrid}>
          {widgets
            .filter((w) => w.enabled && !["rpm", "speed"].includes(w.id))
            .map((widget) => {
              const widgetColor =
                widget.id === "fuel"
                  ? "#4ADE80"
                  : widget.id === "coolant"
                  ? "#FB923C"
                  : widget.id === "oil"
                  ? "#F87171"
                  : widget.id === "boost"
                  ? "#38BDF8"
                  : activeColor;

              const unit =
                widget.id === "fuel"
                  ? "%"
                  : ["coolant", "oil"].includes(widget.id)
                  ? "°C"
                  : widget.id === "boost"
                  ? "bar"
                  : "";

              return (
                <View key={widget.id} style={styles.gridItem}>
                  <StatCardSmall
                    title={t(`widgets.${widget.titleKey}`)}
                    value="--"
                    unit={unit}
                    icon={widget.icon}
                    color={widgetColor}
                  />
                </View>
              );
            })}
        </View>

        {/* Quick Actions (Always visible at bottom) */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.quickActionsTitle}>{t("home.quickActions")}</Text>
          <View style={styles.quickActionsGrid}>
            <QuickAction
              icon="magnify"
              label={t("connection.title")}
              onPress={navigateToConnection}
            />
            <QuickAction icon="history" label={t("home.logs")} />
            <QuickAction
              icon="chart-timeline-variant"
              label={t("home.charts")}
            />
            <QuickAction icon="wrench" label={t("home.tools")} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: moderateScale(20),
    paddingBottom: verticalScale(20),
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoBox: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(12),
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: moderateScale(12),
    borderWidth: 1,
    borderColor: "#334155",
  },
  appName: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    color: "#fff",
  },
  connectedRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(2),
  },
  statusDot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    marginRight: moderateScale(6),
  },
  statusText: {
    fontSize: moderateScale(10),
    fontWeight: "bold",
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 1,
  },
  settingsButton: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  scrollContent: {
    paddingHorizontal: moderateScale(16),
    paddingTop: verticalScale(8),
  },
  card: {
    borderRadius: moderateScale(24),
    padding: moderateScale(20),
    marginBottom: verticalScale(20),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(8),
  },
  sectionTitle: {
    fontSize: moderateScale(14),
    color: "rgba(255,255,255,0.6)",
    fontWeight: "500",
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(74, 222, 128, 0.1)",
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    borderColor: "rgba(74, 222, 128, 0.2)",
  },
  liveDot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    marginRight: moderateScale(6),
  },
  liveText: {
    fontSize: moderateScale(10),
    fontWeight: "bold",
    color: "#4ADE80",
  },
  vehicleName: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    color: "#fff",
    marginBottom: verticalScale(20),
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: -moderateScale(6),
    marginBottom: verticalScale(20),
  },
  gridItem: {
    width: "48%",
    marginHorizontal: "1%",
    marginBottom: moderateScale(12),
  },
  gaugesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(24),
    gap: moderateScale(12),
  },
  gaugeBox: {
    flex: 1,
    borderRadius: moderateScale(28),
    padding: moderateScale(16),
    alignItems: "center",
    backgroundColor: theme.palette.dark.surface,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  quickActionsSection: {
    marginTop: verticalScale(10),
  },
  quickActionsTitle: {
    fontSize: moderateScale(12),
    fontWeight: "bold",
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 1,
    marginBottom: verticalScale(16),
  },
  quickActionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickActionItem: {
    alignItems: "center",
  },
  quickActionCircle: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(16),
    backgroundColor: theme.palette.dark.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(8),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  quickActionLabel: {
    fontSize: moderateScale(12),
    color: "rgba(255,255,255,0.6)",
  },
});

export default DashboardScreen;
