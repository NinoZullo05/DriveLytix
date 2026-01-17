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
import { bluetoothService } from "../../core/services/BluetoothService";
import { theme } from "../../core/theme";
import { CircularGauge } from "../components/WidgetComponents";

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

const AlertCard = ({ title, value, status, icon, onPress }: any) => {
  const statusColor =
    status === "danger"
      ? "#F87171"
      : status === "warning"
        ? "#FB923C"
        : "#4ADE80";

  return (
    <TouchableOpacity
      style={[styles.alertCard, { borderColor: `${statusColor}22` }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[styles.alertIconBox, { backgroundColor: `${statusColor}11` }]}
      >
        <MaterialCommunityIcons name={icon} size={20} color={statusColor} />
      </View>
      <View style={styles.alertContent}>
        <Text style={styles.alertValue}>{value}</Text>
        <Text style={styles.alertTitle}>{title.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  );
};

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
      },
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
    const interval = setInterval(loadWidgets, 2000);
    return () => clearInterval(interval);
  }, []);

  const navigateToConnection = () => {
    router.push("/connection");
  };

  return (
    <View style={[styles.container, { backgroundColor: "#0B0F17" }]}>
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
        {/* VEHICLE STATUS CARD */}
        <TouchableOpacity
          style={styles.vehicleStatusCard}
          onPress={() => router.push("/data")}
          activeOpacity={0.9}
        >
          <View style={styles.vehicleInfo}>
            <View style={styles.vehicleHeader}>
              <Text style={styles.vehicleTitle}>
                {t("home.vehicleStatusLabel")}
              </Text>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            </View>
            <Text style={styles.vehicleModel}>
              {isConnected ? "Connected Vehicle" : t("home.vehicleStatusLabel")}
            </Text>
            <Text style={styles.vehicleVin}>
              {isConnected ? "Reading VIN..." : "No Vehicle Protected"}
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="rgba(255,255,255,0.3)"
          />
        </TouchableOpacity>

        {/* CRITICAL ALERTS SECTION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t("home.healthAlerts")}</Text>
          <Text
            style={styles.sectionAction}
            onPress={() => router.push("/data")}
          >
            {t("home.viewAll")}
          </Text>
        </View>

        <View style={styles.alertsContainer}>
          <AlertCard
            title={t("home.coolant")}
            value="--"
            status="normal"
            icon="thermometer"
            onPress={() => router.push("/data")}
          />
          <AlertCard
            title={t("home.fuelLevel")}
            value="--"
            status="normal" // Changed from warning to normal for default
            icon="fuel"
            onPress={() => router.push("/data")}
          />
          <AlertCard
            title={t("home.battery")}
            value="--"
            status="normal" // Changed from danger
            icon="flash"
            onPress={() => router.push("/data")}
          />
          <AlertCard
            title="Consumption"
            value="Anomalous"
            status="warning"
            icon="chart-bell-curve-cumulative"
            onPress={() => router.push("/data")}
          />
        </View>

        {/* DRIVING STATUS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t("home.drivingStatus")}</Text>
        </View>

        <View style={styles.statusGrid}>
          <View style={styles.statusItem}>
            <CircularGauge
              value={3.2}
              max={8}
              label="RPM"
              subLabel="x1000"
              color={activeColor}
              size={width * 0.4}
            />
          </View>
          <View style={styles.statusItem}>
            <View style={styles.ecoCard}>
              <MaterialCommunityIcons name="leaf" size={24} color="#4ADE80" />
              <Text style={styles.ecoValue}>85</Text>
              <Text style={styles.ecoLabel}>{t("home.ecoScore")}</Text>
            </View>
            <View style={{ height: 12 }} />
            <View style={styles.avgSpeedCard}>
              <Text style={styles.avgSpeedValue}>42</Text>
              <Text style={styles.avgSpeedLabel}>{t("home.avgSpeedUnit")}</Text>
            </View>
          </View>
        </View>

        {/* QUICK ACTIONS */}
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  appName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  connectedRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 1,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  vehicleStatusCard: {
    backgroundColor: "#151A23",
    padding: 20,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    marginBottom: 24,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  vehicleTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 2,
    marginRight: 12,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(74, 222, 128, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4ADE80",
    marginRight: 6,
  },
  liveText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#4ADE80",
  },
  vehicleModel: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  vehicleVin: {
    fontSize: 12,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    color: "rgba(255,255,255,0.3)",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 2,
  },
  sectionAction: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#00C2FF",
  },
  alertsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  alertCard: {
    width: "48%",
    backgroundColor: "#151A23",
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  alertIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  alertTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "rgba(255,255,255,0.3)",
    marginTop: 2,
  },
  statusGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statusItem: {
    width: "48%",
  },
  ecoCard: {
    backgroundColor: "#151A23",
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  ecoValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#fff",
    marginTop: 8,
  },
  ecoLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 1,
    marginTop: 2,
  },
  avgSpeedCard: {
    backgroundColor: "#151A23",
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  avgSpeedValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#fff",
  },
  avgSpeedLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 1,
    marginTop: 4,
  },
  quickActionsSection: {
    marginTop: 8,
  },
  quickActionsTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 1,
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickActionItem: {
    alignItems: "center",
  },
  quickActionCircle: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "#151A23",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  quickActionLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
  },
});

export default DashboardScreen;
