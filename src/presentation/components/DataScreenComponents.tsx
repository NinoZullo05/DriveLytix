import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

/* ---------------- GRAPH COMPONENTS ---------------- */

export const MiniAreaChart = ({
  color,
  points,
}: {
  color: string;
  points: string;
}) => (
  <View style={styles.graphContainer}>
    <Svg height="40" width="100%">
      <Path d={points} stroke={color} strokeWidth="2" fill={`${color}33`} />
    </Svg>
  </View>
);

export const MiniWaveChart = ({ color }: { color: string }) => (
  <View style={styles.graphContainer}>
    <Svg height="40" width="100%">
      <Path
        d="M0 20 Q 25 5, 50 20 T 100 20"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
    </Svg>
  </View>
);

/* ---------------- CARD COMPONENTS ---------------- */

export const DataCardGraph = ({
  title,
  value,
  unit,
  icon,
  color,
  chartType = "area",
  points = "M0 40 L20 30 L40 35 L60 20 L80 25 L100 10 L100 40 L0 40 Z",
}: any) => (
  <View style={[styles.card, { backgroundColor: "#151A23" }]}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{title}</Text>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={16}
          color="rgba(255,255,255,0.3)"
        />
      )}
    </View>
    <View style={styles.cardBody}>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardUnit}>{unit}</Text>
    </View>
    {chartType === "area" ? (
      <MiniAreaChart color={color} points={points} />
    ) : (
      <MiniWaveChart color={color} />
    )}
  </View>
);

export const DataCardProgress = ({ title, value, unit, progress }: any) => (
  <View style={[styles.card, { backgroundColor: "#151A23" }]}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{title}</Text>
      <MaterialCommunityIcons
        name="clock-outline"
        size={16}
        color="rgba(255,255,255,0.3)"
      />
    </View>
    <View style={styles.cardBody}>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardUnit}>{unit}</Text>
    </View>
    <View style={styles.progressBarBg}>
      <View
        style={[
          styles.progressBarFill,
          { width: `${progress}%`, backgroundColor: "#A855F7" },
        ]}
      />
    </View>
  </View>
);

export const DataCardMini = ({ title, value, icon, color }: any) => (
  <View style={[styles.miniCard, { backgroundColor: "#151A23" }]}>
    <View style={[styles.miniIconBox, { backgroundColor: `${color}22` }]}>
      <MaterialCommunityIcons name={icon} size={20} color={color} />
    </View>
    <View>
      <Text style={styles.miniTitle}>{title}</Text>
      <Text style={styles.miniValue}>{value}</Text>
    </View>
  </View>
);

export const CategoryHeader = ({ title, activeCount, dotColor }: any) => (
  <View style={styles.categoryHeader}>
    <View style={styles.categoryLeft}>
      <View style={[styles.categoryDot, { backgroundColor: dotColor }]} />
      <Text style={styles.categoryTitle}>{title.toUpperCase()}</Text>
    </View>
    {activeCount && (
      <View style={styles.activeBadge}>
        <Text style={styles.activeBadgeText}>{activeCount} Active</Text>
      </View>
    )}
  </View>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    flex: 1,
    minHeight: 120,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    fontWeight: "500",
  },
  cardBody: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 8,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  cardUnit: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
    marginLeft: 4,
  },
  graphContainer: {
    height: 40,
    marginTop: 10,
    width: "100%",
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 3,
    marginTop: 15,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  miniCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  miniIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  miniTitle: {
    fontSize: 10,
    color: "rgba(255,255,255,0.4)",
  },
  miniValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  categoryLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 1,
  },
  activeBadge: {
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activeBadgeText: {
    fontSize: 10,
    color: "rgba(255,255,255,0.4)",
  },
});
