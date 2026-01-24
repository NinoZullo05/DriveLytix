import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { sensorService } from "../../core/services/SensorService";
import { theme } from "../../core/theme";
import { Sensor, SensorCategory } from "../../domain/entities/Sensor";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get("window");
const CARD_GAP = 10;
const CARD_WIDTH = (width - 40 - CARD_GAP) / 2;

const DataScreen = () => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const router = useRouter();

  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<SensorCategory | "all">(
    "all"
  );
  const [showSettings, setShowSettings] = useState(false);
  const [refreshRate, setRefreshRate] = useState(
    sensorService.getRefreshRate()
  );

  useEffect(() => {
    sensorService.startSimulation();
    const unsubscribe = sensorService.subscribe((updatedSensors) => {
      setSensors([...updatedSensors]);
    });
    return () => {
      unsubscribe();
      sensorService.stopSimulation();
    };
  }, []);

  const filteredSensors = useMemo(() => {
    return sensors.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.pid.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === "all" || s.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [sensors, searchQuery, activeCategory]);

  const selectCategory = (category: SensorCategory | "all") => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveCategory(category);
  };

  const toggleSettings = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowSettings(!showSettings);
  };

  const updateRefreshRate = (ms: number) => {
    setRefreshRate(ms);
    sensorService.setRefreshRate(ms);
  };

  const categories: (SensorCategory | "all")[] = [
    "all",
    "engine",
    "fluids",
    "electrical",
  ];

  const navigateToDetail = (sensorId: string) => {
    router.push({ pathname: "/data/[id]", params: { id: sensorId } } as any);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: "#0B0F17", paddingTop: insets.top },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>
            {t("widgets.dataOverview").split(" ")[0]}{" "}
            <Text style={{ color: theme.palette.primary }}>
              {t("widgets.dataOverview").split(" ")[1]}
            </Text>
          </Text>
          <Text style={styles.headerSubtitle}>
            {t("widgets.liveParameters")}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.iconButton, showSettings && styles.activeIconButton]}
          onPress={toggleSettings}
        >
          <MaterialCommunityIcons
            name="cog-outline"
            size={22}
            color={showSettings ? theme.palette.primary : "#fff"}
          />
        </TouchableOpacity>
      </View>

      {/* Category Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabs}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.tab, activeCategory === cat && styles.activeTab]}
              onPress={() => selectCategory(cat)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeCategory === cat && styles.activeTabText,
                ]}
              >
                {cat === "all"
                  ? "All"
                  : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Settings Dropdown */}
      {showSettings && (
        <View style={styles.settingsDropdown}>
          <Text style={styles.settingsLabel}>REFRESH RATE</Text>
          <View style={styles.settingsOptions}>
            {[100, 500, 1000, 2000].map((rate) => (
              <TouchableOpacity
                key={rate}
                style={[
                  styles.settingsOption,
                  refreshRate === rate && styles.activeSettingsOption,
                ]}
                onPress={() => updateRefreshRate(rate)}
              >
                <Text
                  style={[
                    styles.settingsOptionText,
                    refreshRate === rate && styles.activeSettingsOptionText,
                  ]}
                >
                  {rate < 1000 ? `${rate}ms` : `${rate / 1000}s`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialCommunityIcons
            name="magnify"
            size={18}
            color="rgba(255,255,255,0.3)"
          />
          <TextInput
            placeholder={t("widgets.searchPlaceholder")}
            placeholderTextColor="rgba(255,255,255,0.3)"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <MaterialCommunityIcons
                name="close-circle"
                size={16}
                color="rgba(255,255,255,0.3)"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Sensor Grid */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {filteredSensors.map((sensor) => (
            <TouchableOpacity
              key={sensor.id}
              style={styles.gridItem}
              onPress={() => navigateToDetail(sensor.id)}
              activeOpacity={0.7}
            >
              <View style={styles.sensorCard}>
                <View style={styles.sensorHeader}>
                  <View
                    style={[
                      styles.sensorIcon,
                      { backgroundColor: `${sensor.color}22` },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={sensor.icon as any}
                      size={18}
                      color={sensor.color}
                    />
                  </View>
                  <Text style={styles.sensorPid}>{sensor.pid}</Text>
                </View>
                <Text style={styles.sensorValue}>
                  {sensor.currentValue.toFixed(sensor.unit === "V" ? 1 : 0)}
                  <Text style={styles.sensorUnit}> {sensor.unit}</Text>
                </Text>
                <Text style={styles.sensorName} numberOfLines={1}>
                  {sensor.name}
                </Text>
                {/* Mini Sparkline */}
                <View style={styles.sparkline}>
                  {sensor.history.slice(-20).map((h, i) => {
                    const max = Math.max(
                      ...sensor.history.slice(-20).map((p) => p.value),
                      1
                    );
                    const min = Math.min(
                      ...sensor.history.slice(-20).map((p) => p.value),
                      0
                    );
                    const range = max - min || 1;
                    const height = Math.max(2, ((h.value - min) / range) * 20);
                    return (
                      <View
                        key={i}
                        style={[
                          styles.sparklineBar,
                          { height, backgroundColor: sensor.color },
                        ]}
                      />
                    );
                  })}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {filteredSensors.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={48}
              color="rgba(255,255,255,0.2)"
            />
            <Text style={styles.emptyText}>No sensors found.</Text>
          </View>
        )}

        {/* Bottom Padding */}
        <View style={{ height: 120 }} />
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
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 2,
    marginTop: 2,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  activeIconButton: {
    backgroundColor: "rgba(0, 194, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(0, 194, 255, 0.3)",
  },
  tabsContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  tabs: {
    flexDirection: "row",
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  activeTab: {
    backgroundColor: theme.palette.primary,
  },
  tabText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#fff",
  },
  settingsDropdown: {
    marginHorizontal: 20,
    backgroundColor: "#151A23",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  settingsLabel: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 8,
  },
  settingsOptions: {
    flexDirection: "row",
    gap: 8,
  },
  settingsOption: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
  },
  activeSettingsOption: {
    backgroundColor: theme.palette.primary,
  },
  settingsOptionText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    fontWeight: "600",
  },
  activeSettingsOptionText: {
    color: "#fff",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    marginLeft: 8,
    fontSize: 13,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: CARD_WIDTH,
    marginBottom: CARD_GAP,
  },
  sensorCard: {
    backgroundColor: "#151A23",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  sensorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sensorIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sensorPid: {
    fontSize: 9,
    fontWeight: "bold",
    color: "rgba(255,255,255,0.2)",
    letterSpacing: 1,
  },
  sensorValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#fff",
  },
  sensorUnit: {
    fontSize: 11,
    fontWeight: "500",
    color: "rgba(255,255,255,0.4)",
  },
  sensorName: {
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
    marginTop: 2,
    marginBottom: 10,
  },
  sparkline: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 20,
    gap: 2,
  },
  sparklineBar: {
    flex: 1,
    borderRadius: 2,
    opacity: 0.6,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyText: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 14,
    marginTop: 16,
    textAlign: "center",
  },
});

export default DataScreen;
