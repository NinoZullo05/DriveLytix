import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../../core/theme";
import {
  CategoryHeader,
  DataCardGraph,
  DataCardMini,
  DataCardProgress,
} from "../components/DataScreenComponents";

const DataScreen = () => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const activeColor = theme.palette.primary;

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
            <Text style={{ color: "#00C2FF" }}>
              {t("widgets.dataOverview").split(" ")[1]}
            </Text>
          </Text>
          <Text style={styles.headerSubtitle}>
            {t("widgets.liveParameters")}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons
              name="filter-variant"
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="cog-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color="rgba(255,255,255,0.3)"
          />
          <TextInput
            placeholder="Search PID or Sensor name..."
            placeholderTextColor="rgba(255,255,255,0.3)"
            style={styles.searchInput}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Engine & Power */}
        <CategoryHeader
          title={t("widgets.categories.engine")}
          activeCount="4"
          dotColor="#00C2FF"
        />
        <View style={styles.row}>
          <DataCardGraph
            title="Engine RPM"
            value="2,450"
            unit=""
            icon="speedometer"
            color="#00C2FF"
            points="M0 40 L20 30 L40 35 L60 20 L80 25 L100 10 L100 40 L0 40 Z"
          />
          <View style={{ width: 12 }} />
          <DataCardProgress
            title="Calculated Load"
            value="45"
            unit="%"
            progress={45}
          />
        </View>
        <View style={{ height: 12 }} />
        <DataCardGraph
          title="Vehicle Speed"
          value="84"
          unit="km/h"
          icon="speedometer-slow"
          color="#38BDF8"
          chartType="wave"
        />

        {/* Fluids & Temp */}
        <CategoryHeader
          title={t("widgets.categories.fluids")}
          dotColor="#FB923C"
        />
        <View style={styles.grid}>
          <View style={styles.gridRow}>
            <DataCardMini
              title="Coolant"
              value="92°C"
              icon="thermometer"
              color="#FB923C"
            />
            <View style={{ width: 12 }} />
            <DataCardMini
              title="Oil Temp"
              value="98°C"
              icon="oil"
              color="#F87171"
            />
          </View>
          <View style={{ height: 12 }} />
          <View style={styles.gridRow}>
            <DataCardMini
              title="Intake"
              value="34°C"
              icon="weather-windy"
              color="#38BDF8"
            />
            <View style={{ width: 12 }} />
            <DataCardMini
              title="Fuel Press."
              value="380 kPa"
              icon="arrow-collapse-vertical"
              color="#FACC15"
            />
          </View>
        </View>

        {/* Electrical & Misc */}
        <CategoryHeader title="Electrical & Misc" dotColor="#4ADE80" />
        <DataCardGraph
          title="Control Module Voltage"
          value="13.8"
          unit="V"
          icon="flash"
          color="#4ADE80"
          chartType="wave"
        />
        <View style={{ height: 12 }} />
        <DataCardGraph
          title="Mass Air Flow"
          value="14.2"
          unit="g/s"
          icon="windsock"
          color="#22D3EE"
          chartType="wave"
        />
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
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 2,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    marginLeft: 10,
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  grid: {
    width: "100%",
  },
  gridRow: {
    flexDirection: "row",
  },
});

export default DataScreen;
