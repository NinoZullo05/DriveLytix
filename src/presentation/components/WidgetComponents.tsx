import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { moderateScale } from "../../core/responsive";
import { theme } from "../../core/theme";

interface WidgetProps {
  title: string;
  value: string | number;
  unit: string;
  icon: string;
  color: string;
}

export const CircularGauge = ({
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
  const totalAngle = 270;
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
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${activeCircumference} ${circumference}`}
          strokeLinecap="round"
          fill="transparent"
        />
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

export const StatCardWidget = ({
  title,
  value,
  unit,
  icon,
  color,
}: WidgetProps) => (
  <View
    style={[
      styles.statCardSmall,
      { backgroundColor: theme.palette.dark.surface },
    ]}
  >
    <LinearGradient
      colors={[`${color}15`, "transparent"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
    <View style={[styles.statIconSmall, { backgroundColor: `${color}22` }]}>
      <MaterialCommunityIcons name={icon as any} size={20} color={color} />
    </View>
    <View style={styles.statContent}>
      <Text style={styles.statTitleSmall}>{title}</Text>
      <View style={styles.statValueRow}>
        <Text style={[styles.statValueSmall, { color: "#fff" }]}>{value}</Text>
        <Text style={styles.statUnitSmall}>{unit}</Text>
      </View>
    </View>
  </View>
);

export const HorizontalCardWidget = ({
  title,
  value,
  unit,
  icon,
  color,
}: WidgetProps) => (
  <View
    style={[
      styles.horizontalCard,
      { backgroundColor: theme.palette.dark.surface },
    ]}
  >
    <LinearGradient
      colors={[`${color}10`, "transparent"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.5, y: 0 }}
      style={StyleSheet.absoluteFill}
    />
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
      <MaterialCommunityIcons name={icon as any} size={24} color={color} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  gaugeValue: {
    fontSize: moderateScale(28),
    fontWeight: "bold",
    letterSpacing: -1,
  },
  gaugeLabel: {
    fontSize: moderateScale(12),
    color: "rgba(255,255,255,0.4)",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  gaugeSubLabel: {
    fontSize: moderateScale(10),
    color: "rgba(255,255,255,0.3)",
  },
  statCardSmall: {
    flex: 1,
    padding: moderateScale(16),
    borderRadius: moderateScale(20),
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    overflow: "hidden",
  },
  statContent: {
    marginTop: moderateScale(12),
  },
  statIconSmall: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(10),
    justifyContent: "center",
    alignItems: "center",
  },
  statTitleSmall: {
    fontSize: moderateScale(11),
    color: "rgba(255,255,255,0.5)",
    marginBottom: moderateScale(4),
    fontWeight: "500",
  },
  statValueRow: { flexDirection: "row", alignItems: "baseline" },
  statValueSmall: { fontSize: moderateScale(22), fontWeight: "700" },
  statUnitSmall: {
    fontSize: moderateScale(12),
    color: "rgba(255,255,255,0.3)",
    marginLeft: moderateScale(4),
  },
  horizontalCard: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: moderateScale(18),
    borderRadius: moderateScale(24),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    overflow: "hidden",
  },
  horizontalCardContent: { flex: 1 },
  horizontalCardTitle: {
    fontSize: moderateScale(13),
    color: "rgba(255,255,255,0.5)",
    marginBottom: moderateScale(4),
    fontWeight: "600",
  },
  horizontalCardValue: { fontSize: moderateScale(24), fontWeight: "800" },
  horizontalCardUnit: {
    fontSize: moderateScale(13),
    color: "rgba(255,255,255,0.3)",
    marginLeft: moderateScale(6),
  },
  horizontalIconBox: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(14),
    justifyContent: "center",
    alignItems: "center",
  },
});
