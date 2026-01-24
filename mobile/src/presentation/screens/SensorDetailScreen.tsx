import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
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
import Svg, { Line, Path, Text as SvgText } from "react-native-svg";
import { sensorService } from "../../core/services/SensorService";
import { theme } from "../../core/theme";
import { Sensor } from "../../domain/entities/Sensor";

const { width } = Dimensions.get("window");
const CHART_WIDTH = width - 48;
const CHART_HEIGHT = 180;

type TimeRange = "30s" | "1m" | "5m" | "15m";

const TIME_RANGES: { key: TimeRange; label: string; samples: number }[] = [
  { key: "30s", label: "30s", samples: 30 },
  { key: "1m", label: "1m", samples: 60 },
  { key: "5m", label: "5m", samples: 300 },
  { key: "15m", label: "15m", samples: 900 },
];

const SensorDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const [sensor, setSensor] = useState<Sensor | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("1m");

  useEffect(() => {
    const unsub = sensorService.subscribe(() => {
      const s = sensorService.getSensor(id as string);
      if (s) setSensor({ ...s });
    });
    return unsub;
  }, [id]);

  const selectedRange = TIME_RANGES.find((r) => r.key === timeRange)!;

  const chartData = useMemo(() => {
    if (!sensor) return [];
    return sensor.history.slice(-selectedRange.samples);
  }, [sensor, selectedRange.samples]);

  const stats = useMemo(() => {
    if (!chartData.length) return { min: 0, max: 0, avg: 0, current: 0 };
    const values = chartData.map((h) => h.value);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      current: sensor?.currentValue || 0,
    };
  }, [chartData, sensor]);

  // Build SVG path
  const pathData = useMemo(() => {
    if (chartData.length < 2) return "";
    const max = stats.max;
    const min = stats.min;
    const range = max - min || 1;

    const points = chartData.map((h, i) => {
      const x = (i / (chartData.length - 1)) * CHART_WIDTH;
      const y =
        CHART_HEIGHT - 20 - ((h.value - min) / range) * (CHART_HEIGHT - 40);
      return { x, y };
    });

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      const cp1x = p0.x + (p1.x - p0.x) / 3;
      const cp2x = p0.x + (2 * (p1.x - p0.x)) / 3;
      d += ` C ${cp1x} ${p0.y}, ${cp2x} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  }, [chartData, stats]);

  const areaPath = useMemo(() => {
    if (chartData.length < 2) return "";
    const max = stats.max;
    const min = stats.min;
    const range = max - min || 1;

    const points = chartData.map((h, i) => {
      const x = (i / (chartData.length - 1)) * CHART_WIDTH;
      const y =
        CHART_HEIGHT - 20 - ((h.value - min) / range) * (CHART_HEIGHT - 40);
      return { x, y };
    });

    let d = `M 0 ${CHART_HEIGHT - 20}`;
    d += ` L ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      const cp1x = p0.x + (p1.x - p0.x) / 3;
      const cp2x = p0.x + (2 * (p1.x - p0.x)) / 3;
      d += ` C ${cp1x} ${p0.y}, ${cp2x} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    d += ` L ${CHART_WIDTH} ${CHART_HEIGHT - 20} Z`;
    return d;
  }, [chartData, stats]);

  if (!sensor) return null;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: "#0B0F17", paddingTop: insets.top },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{sensor.name}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Value Display */}
        <View style={styles.valueCard}>
          <View
            style={[styles.iconBox, { backgroundColor: `${sensor.color}22` }]}
          >
            <MaterialCommunityIcons
              name={sensor.icon as any}
              size={28}
              color={sensor.color}
            />
          </View>
          <View style={styles.valueInfo}>
            <Text style={styles.currentValue}>
              {sensor.currentValue.toFixed(sensor.unit === "V" ? 1 : 0)}
            </Text>
            <Text style={styles.unit}>{sensor.unit}</Text>
          </View>
          <View style={styles.pidBadge}>
            <Text style={styles.pidText}>{sensor.pid}</Text>
          </View>
        </View>

        {/* Time Range Selector */}
        <View style={styles.timeRangeContainer}>
          <Text style={styles.sectionTitle}>TIME RANGE</Text>
          <View style={styles.timeRangeTabs}>
            {TIME_RANGES.map((range) => (
              <TouchableOpacity
                key={range.key}
                style={[
                  styles.timeRangeTab,
                  timeRange === range.key && styles.activeTimeRangeTab,
                ]}
                onPress={() => setTimeRange(range.key)}
              >
                <Text
                  style={[
                    styles.timeRangeText,
                    timeRange === range.key && styles.activeTimeRangeText,
                  ]}
                >
                  {range.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Chart */}
        <View style={styles.chartContainer}>
          <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <Line
                key={i}
                x1={0}
                y1={20 + ratio * (CHART_HEIGHT - 40)}
                x2={CHART_WIDTH}
                y2={20 + ratio * (CHART_HEIGHT - 40)}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth={1}
              />
            ))}
            {/* Y-Axis Labels */}
            <SvgText
              x={CHART_WIDTH - 4}
              y={18}
              fill="rgba(255,255,255,0.3)"
              fontSize={9}
              textAnchor="end"
            >
              {stats.max.toFixed(0)}
            </SvgText>
            <SvgText
              x={CHART_WIDTH - 4}
              y={CHART_HEIGHT - 22}
              fill="rgba(255,255,255,0.3)"
              fontSize={9}
              textAnchor="end"
            >
              {stats.min.toFixed(0)}
            </SvgText>
            {/* Area */}
            {areaPath && <Path d={areaPath} fill={`${sensor.color}20`} />}
            {/* Line */}
            {pathData && (
              <Path
                d={pathData}
                stroke={sensor.color}
                strokeWidth={2.5}
                fill="none"
              />
            )}
          </Svg>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>MIN</Text>
            <Text style={[styles.statValue, { color: "#38BDF8" }]}>
              {stats.min.toFixed(1)}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>AVG</Text>
            <Text style={[styles.statValue, { color: "#FACC15" }]}>
              {stats.avg.toFixed(1)}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>MAX</Text>
            <Text style={[styles.statValue, { color: "#F87171" }]}>
              {stats.max.toFixed(1)}
            </Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>About {sensor.name}</Text>
          <Text style={styles.infoText}>
            This sensor monitors {sensor.name.toLowerCase()} using PID{" "}
            {sensor.pid}. Current range: {sensor.minValue} - {sensor.maxValue}{" "}
            {sensor.unit}.
          </Text>
        </View>

        {/* Bottom Spacer */}
        <View style={{ height: 40 }} />
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 56,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  content: {
    padding: 20,
  },
  valueCard: {
    backgroundColor: "#151A23",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    marginBottom: 20,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  valueInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "baseline",
  },
  currentValue: {
    fontSize: 42,
    fontWeight: "900",
    color: "#fff",
  },
  unit: {
    fontSize: 16,
    color: "rgba(255,255,255,0.4)",
    marginLeft: 6,
  },
  pidBadge: {
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  pidText: {
    fontSize: 10,
    color: "rgba(255,255,255,0.4)",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  timeRangeContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 10,
  },
  timeRangeTabs: {
    flexDirection: "row",
    gap: 8,
  },
  timeRangeTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
  },
  activeTimeRangeTab: {
    backgroundColor: theme.palette.primary,
  },
  timeRangeText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    fontWeight: "600",
  },
  activeTimeRangeText: {
    color: "#fff",
  },
  chartContainer: {
    backgroundColor: "#151A23",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    marginBottom: 20,
    alignItems: "center",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#151A23",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
  },
  statLabel: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  infoCard: {
    backgroundColor: "rgba(0, 194, 255, 0.05)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 194, 255, 0.1)",
  },
  infoTitle: {
    color: theme.palette.primary,
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    lineHeight: 20,
  },
});

export default SensorDetailScreen;
