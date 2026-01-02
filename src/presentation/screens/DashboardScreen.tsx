import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import { moderateScale, verticalScale } from "../../core/responsive";
import { theme } from "../../core/theme";

const { width } = Dimensions.get("window");

/* ---------------- COMPONENTS ---------------- */

const CircularGauge = ({
  value,
  max,
  label,
  subLabel,
  color,
  size = 150,
}: {
  value: number;
  max: number;
  label: string;
  subLabel?: string;
  color: string;
  size?: number;
}) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  // We use 270 degrees (3/4 of a circle)
  const totalAngle = 270;
  const gapAngle = 360 - totalAngle;
  const activeCircumference = (totalAngle / 360) * circumference;
  const progress = (Math.min(value, max) / max) * activeCircumference;

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
      }}
    >
      <Svg
        width={size}
        height={size}
        style={{ transform: [{ rotate: "135deg" }] }}
      >
        {/* Background Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1E293B"
          strokeWidth={strokeWidth}
          strokeDasharray={`${activeCircumference} ${circumference}`}
          strokeLinecap="round"
          fill="transparent"
        />
        {/* Progress Fill */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${progress} ${circumference}`}
          strokeLinecap="round"
          fill="transparent"
        />
      </Svg>
      <View style={StyleSheet.absoluteFill}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 10,
          }}
        >
          <Text style={[styles.gaugeValue, { color: "#fff" }]}>{value}</Text>
          <Text style={styles.gaugeLabel}>{label}</Text>
          {subLabel && <Text style={styles.gaugeSubLabel}>{subLabel}</Text>}
        </View>
      </View>
    </View>
  );
};

const StatCardSmall = ({ title, value, unit, icon, color }: any) => (
  <View
    style={[
      styles.statCardSmall,
      { backgroundColor: theme.palette.dark.surface },
    ]}
  >
    <View style={[styles.statIconSmall, { backgroundColor: `${color}22` }]}>
      <MaterialCommunityIcons name={icon} size={20} color={color} />
    </View>
    <Text style={styles.statTitleSmall}>{title}</Text>
    <View style={styles.statValueRow}>
      <Text style={[styles.statValueSmall, { color: "#fff" }]}>{value}</Text>
      <Text style={styles.statUnitSmall}>{unit}</Text>
    </View>
  </View>
);

const HorizontalStatCard = ({ title, value, unit, icon, color }: any) => (
  <View
    style={[
      styles.horizontalCard,
      { backgroundColor: theme.palette.dark.surface },
    ]}
  >
    <View style={styles.horizontalCardContent}>
      <Text style={styles.horizontalCardTitle}>{title}</Text>
      <View style={styles.statValueRow}>
        <Text style={[styles.horizontalCardValue, { color: "#fff" }]}>
          {value}
        </Text>
        <Text style={styles.horizontalCardUnit}>{unit}</Text>
      </View>
    </View>
    <View style={[styles.horizontalIconBox, { backgroundColor: `${color}22` }]}>
      <MaterialCommunityIcons name={icon} size={24} color={color} />
    </View>
  </View>
);

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
                style={[styles.statusDot, { backgroundColor: "#4ADE80" }]}
              />
              <Text style={styles.statusText}>CONNECTED</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => console.log("Settings button pressed")}
        >
          <MaterialIcons name="settings" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Vehicle Status Section */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.palette.dark.surface + "88" },
          ]}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>{t("home.vehicleStatus")}</Text>
            <View style={styles.liveBadge}>
              <View style={[styles.liveDot, { backgroundColor: "#4ADE80" }]} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>

          <Text style={styles.vehicleName}>Ford Mustang GT</Text>

          <View style={styles.statsGrid}>
            <StatCardSmall
              title={t("home.avgSpeed")}
              value="42"
              unit="km/h"
              icon="speedometer"
              color={activeColor}
            />
            <StatCardSmall
              title={t("home.fuelLevel")}
              value="68"
              unit="%"
              icon="fuel"
              color="#4ADE80"
            />
            <StatCardSmall
              title={t("home.coolant")}
              value="90"
              unit="°C"
              icon="thermometer"
              color="#FB923C"
            />
          </View>
        </View>

        {/* Gauges Section */}
        <View style={styles.gaugesContainer}>
          <View
            style={[
              styles.gaugeBox,
              { backgroundColor: theme.palette.dark.surface },
            ]}
          >
            <CircularGauge
              value={3.2}
              max={8}
              label="RPM"
              subLabel="x1000"
              color={activeColor}
              size={width * 0.4}
            />
            <View style={styles.gaugeFooter}>
              <Text style={[styles.gaugeFooterText, { color: activeColor }]}>
                {t("home.engineLoad")}: 45%
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.gaugeBox,
              { backgroundColor: theme.palette.dark.surface },
            ]}
          >
            <CircularGauge
              value={84}
              max={260}
              label="KM/H"
              color="#4ADE80"
              size={width * 0.4}
            />
            <View style={styles.gaugeFooter}>
              <Text style={[styles.gaugeFooterText, { color: "#4ADE80" }]}>
                {t("home.ecoDriving")}
              </Text>
            </View>
          </View>
        </View>

        {/* Second Row Stats */}
        <View style={styles.secondRowStats}>
          <HorizontalStatCard
            title={t("home.battery")}
            value="12.4"
            unit="V"
            icon="flash"
            color="#FACC15"
          />
          <HorizontalStatCard
            title={t("home.intake")}
            value="32"
            unit="°C"
            icon="weather-windy"
            color="#38BDF8"
          />
        </View>

        {/* Quick Actions */}
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
    justifyContent: "space-between",
    gap: moderateScale(12),
  },
  statCardSmall: {
    flex: 1,
    padding: moderateScale(12),
    borderRadius: moderateScale(16),
    alignItems: "flex-start",
  },
  statIconSmall: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(8),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(10),
  },
  statTitleSmall: {
    fontSize: moderateScale(10),
    color: "rgba(255,255,255,0.4)",
    marginBottom: verticalScale(4),
  },
  statValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  statValueSmall: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
  },
  statUnitSmall: {
    fontSize: moderateScale(10),
    color: "rgba(255,255,255,0.4)",
    marginLeft: moderateScale(2),
  },
  gaugesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(20),
    gap: moderateScale(12),
  },
  gaugeBox: {
    flex: 1,
    borderRadius: moderateScale(24),
    padding: moderateScale(16),
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  gaugeValue: {
    fontSize: moderateScale(28),
    fontWeight: "bold",
  },
  gaugeLabel: {
    fontSize: moderateScale(12),
    color: "rgba(255,255,255,0.4)",
    fontWeight: "bold",
  },
  gaugeSubLabel: {
    fontSize: moderateScale(10),
    color: "rgba(255,255,255,0.3)",
  },
  gaugeFooter: {
    marginTop: verticalScale(12),
  },
  gaugeFooterText: {
    fontSize: moderateScale(12),
    fontWeight: "600",
  },
  secondRowStats: {
    flexDirection: "row",
    gap: moderateScale(12),
    marginBottom: verticalScale(30),
  },
  horizontalCard: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: moderateScale(16),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  horizontalCardContent: {
    flex: 1,
  },
  horizontalCardTitle: {
    fontSize: moderateScale(12),
    color: "rgba(255,255,255,0.4)",
    marginBottom: verticalScale(4),
  },
  horizontalCardValue: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
  },
  horizontalCardUnit: {
    fontSize: moderateScale(12),
    color: "rgba(255,255,255,0.4)",
    marginLeft: moderateScale(4),
  },
  horizontalIconBox: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    justifyContent: "center",
    alignItems: "center",
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
