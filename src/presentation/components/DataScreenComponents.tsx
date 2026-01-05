import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Sensor } from "../../domain/entities/Sensor";

/* ---------------- GRAPH COMPONENTS ---------------- */

export const MiniAreaChart = ({
  color,
  data,
}: {
  color: string;
  data: { value: number }[];
}) => {
  if (!data || data.length < 2) {
    return (
      <View style={styles.graphContainer}>
        <View
          style={[styles.placeholderLine, { backgroundColor: `${color}33` }]}
        />
      </View>
    );
  }

  const width = 100;
  const height = 40;
  const max = Math.max(...data.map((d) => d.value), 1);
  const min = Math.min(...data.map((d) => d.value), 0);
  const range = max - min || 1;

  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d.value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <View style={styles.graphContainer}>
      <Svg height="100%" width="100%" viewBox={`0 0 ${width} ${height}`}>
        <Path d={`M ${points}`} stroke={color} strokeWidth="2" fill="none" />
        <Path d={`M ${areaPoints}`} fill={`${color}33`} stroke="none" />
      </Svg>
    </View>
  );
};

/* ---------------- CARD COMPONENTS ---------------- */

export const DataCardGraph = ({
  sensor,
  onPress,
}: {
  sensor: Sensor;
  onPress?: () => void;
}) => (
  <View style={[styles.card, { backgroundColor: "#151A23" }]}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{sensor.name}</Text>
      <MaterialCommunityIcons
        name={sensor.icon as any}
        size={16}
        color="rgba(255,255,255,0.3)"
      />
    </View>
    <View style={styles.cardBody}>
      <Text style={styles.cardValue}>
        {sensor.currentValue.toFixed(sensor.unit === "V" ? 1 : 0)}
      </Text>
      <Text style={styles.cardUnit}>{sensor.unit}</Text>
    </View>
    <MiniAreaChart color={sensor.color} data={sensor.history} />
  </View>
);

export const DataCardProgress = ({ sensor }: { sensor: Sensor }) => {
  const progress =
    ((sensor.currentValue - sensor.minValue) /
      (sensor.maxValue - sensor.minValue)) *
    100;

  return (
    <View style={[styles.card, { backgroundColor: "#151A23" }]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{sensor.name}</Text>
        <MaterialCommunityIcons
          name={sensor.icon as any}
          size={16}
          color="rgba(255,255,255,0.3)"
        />
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardValue}>{sensor.currentValue.toFixed(0)}</Text>
        <Text style={styles.cardUnit}>{sensor.unit}</Text>
      </View>
      <View style={styles.progressBarBg}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${progress}%`, backgroundColor: sensor.color },
          ]}
        />
      </View>
    </View>
  );
};

export const DataCardMini = ({ sensor }: { sensor: Sensor }) => (
  <View style={[styles.miniCard, { backgroundColor: "#151A23" }]}>
    <View
      style={[styles.miniIconBox, { backgroundColor: `${sensor.color}22` }]}
    >
      <MaterialCommunityIcons
        name={sensor.icon as any}
        size={20}
        color={sensor.color}
      />
    </View>
    <View>
      <Text style={styles.miniTitle}>{sensor.name}</Text>
      <Text style={styles.miniValue}>
        {sensor.currentValue.toFixed(0)}
        {sensor.unit}
      </Text>
    </View>
  </View>
);

export const CategoryHeader = ({ title, activeCount, dotColor }: any) => (
  <View style={styles.categoryHeader}>
    <View style={styles.categoryLeft}>
      <View style={[styles.categoryDot, { backgroundColor: dotColor }]} />
      <Text style={styles.categoryTitle}>{title.toUpperCase()}</Text>
    </View>
    {activeCount !== undefined && (
      <View style={styles.activeBadge}>
        <Text style={styles.activeBadgeText}>{activeCount} Sensors</Text>
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
  placeholderLine: {
    height: 2,
    width: "100%",
    borderRadius: 1,
    marginTop: 19,
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
