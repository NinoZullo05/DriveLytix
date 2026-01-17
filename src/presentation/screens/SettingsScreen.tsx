import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../../core/theme";
import AppVersion from "../components/AppVersion";

interface SettingSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  activeColor?: string;
}

interface SegmentedControlProps {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

const SettingsScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const currentTheme = isDark ? theme.palette.dark : theme.palette.light;

  const [vehicleData, setVehicleData] = useState({
    make: "",
    model: "",
    year: "",
    engine: "",
  });

  const [settings, setSettings] = useState({
    autoConnect: true,
    logTripData: true,
    analytics: false,
    keepScreenOn: true,
    highContrast: false,
  });

  const [units, setUnits] = useState({
    speed: "KM/H",
    temperature: "°C",
  });

  // Auto-save logic (Placeholder for SettingsService integration)
  // useEffect(() => {
  //   saveVehicleData(vehicleData);
  // }, [vehicleData]);

  const SettingSwitch = ({
    value,
    onValueChange,
    activeColor = theme.palette.primary,
  }: SettingSwitchProps) => (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: currentTheme.border, true: activeColor }}
      thumbColor={currentTheme.text}
      ios_backgroundColor={currentTheme.border}
    />
  );

  const SegmentedControl = ({
    options,
    selected,
    onSelect,
  }: SegmentedControlProps) => (
    <View
      style={[
        styles.segmentedContainer,
        { backgroundColor: currentTheme.border },
      ]}
    >
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.segmentButton,
            selected === option && [
              styles.segmentButtonActive,
              { backgroundColor: currentTheme.surface },
            ],
          ]}
          onPress={() => onSelect(option)}
        >
          <Text
            style={[
              styles.segmentText,
              {
                color:
                  selected === option
                    ? currentTheme.text
                    : currentTheme.textTertiary,
              },
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={currentTheme.background}
        translucent={false}
      />

      {/* Background Glows */}
      <View
        style={[
          styles.glowTop,
          {
            backgroundColor: isDark
              ? "rgba(0, 194, 255, 0.05)"
              : "rgba(0, 194, 255, 0.02)",
          },
        ]}
      />
      <View
        style={[
          styles.glowBottom,
          {
            backgroundColor: isDark
              ? "rgba(112, 224, 0, 0.05)"
              : "rgba(112, 224, 0, 0.02)",
          },
        ]}
      />

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Platform.OS === "android" ? 16 : 0, // Insets already handled by SafeAreaView if used, but user used hook
            paddingBottom: insets.bottom + 100, // Extra padding for bottom tabs and system nav
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.pageHeader}>
          <Text style={[styles.pageTitle, { color: currentTheme.text }]}>
            {t("settings.title")}
          </Text>
          <Text
            style={[styles.pageSubtitle, { color: currentTheme.textSecondary }]}
          >
            {t("settings.subtitle")}
          </Text>
        </View>

        {/* Vehicle Profile */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: currentTheme.textTertiary }]}
          >
            {t("settings.sections.vehicle")}
          </Text>
          <View
            style={[
              styles.card,
              {
                backgroundColor: currentTheme.surface,
                borderColor: currentTheme.border,
              },
            ]}
          >
            <View style={styles.row}>
              <View style={styles.inputGroup}>
                <Text
                  style={[styles.label, { color: currentTheme.textSecondary }]}
                >
                  {t("settings.vehicle.make")}
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: currentTheme.background, // Contrast against surface
                      color: currentTheme.text,
                      borderColor: currentTheme.border,
                    },
                  ]}
                  value={vehicleData.make}
                  onChangeText={(text) =>
                    setVehicleData({ ...vehicleData, make: text })
                  }
                  placeholderTextColor={currentTheme.textTertiary}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text
                  style={[styles.label, { color: currentTheme.textSecondary }]}
                >
                  {t("settings.vehicle.model")}
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: currentTheme.background,
                      color: currentTheme.text,
                      borderColor: currentTheme.border,
                    },
                  ]}
                  value={vehicleData.model}
                  onChangeText={(text) =>
                    setVehicleData({ ...vehicleData, model: text })
                  }
                  placeholderTextColor={currentTheme.textTertiary}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.inputGroup}>
                <Text
                  style={[styles.label, { color: currentTheme.textSecondary }]}
                >
                  {t("settings.vehicle.year")}
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: currentTheme.background,
                      color: currentTheme.text,
                      borderColor: currentTheme.border,
                    },
                  ]}
                  value={vehicleData.year}
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    setVehicleData({ ...vehicleData, year: text })
                  }
                  placeholderTextColor={currentTheme.textTertiary}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text
                  style={[styles.label, { color: currentTheme.textSecondary }]}
                >
                  {t("settings.vehicle.engine")}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.input,
                    {
                      backgroundColor: currentTheme.background,
                      borderColor: currentTheme.border,
                      justifyContent: "center",
                    },
                  ]}
                >
                  <Text style={{ color: currentTheme.text, fontSize: 14 }}>
                    {vehicleData.engine}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={16}
                    color={currentTheme.textTertiary}
                    style={{ position: "absolute", right: 12 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Connection */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: currentTheme.textTertiary }]}
          >
            {t("settings.sections.connection")}
          </Text>
          <View
            style={[
              styles.card,
              {
                backgroundColor: currentTheme.surface,
                borderColor: currentTheme.border,
                padding: 0,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.listItem,
                {
                  borderBottomColor: currentTheme.border,
                  borderBottomWidth: 1,
                },
              ]}
            >
              <View style={styles.listItemLeft}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: "rgba(59, 130, 246, 0.1)" },
                  ]}
                >
                  <Ionicons name="bluetooth" size={20} color="#3B82F6" />
                </View>
                <View>
                  <Text
                    style={[styles.listItemTitle, { color: currentTheme.text }]}
                  >
                    {t("settings.connection.adapterType")}
                  </Text>
                  <Text
                    style={[
                      styles.listItemSubtitle,
                      { color: currentTheme.textSecondary },
                    ]}
                  >
                    ELM327 Bluetooth LE
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={currentTheme.textTertiary}
              />
            </TouchableOpacity>

            <View style={styles.listItem}>
              <View style={styles.listItemLeft}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: "rgba(112, 224, 0, 0.1)" },
                  ]}
                >
                  <Ionicons
                    name="power"
                    size={20}
                    color={theme.palette.secondary}
                  />
                </View>
                <View>
                  <Text
                    style={[styles.listItemTitle, { color: currentTheme.text }]}
                  >
                    {t("settings.connection.autoConnect")}
                  </Text>
                  <Text
                    style={[
                      styles.listItemSubtitle,
                      { color: currentTheme.textSecondary },
                    ]}
                  >
                    {t("settings.connection.autoConnectDesc")}
                  </Text>
                </View>
              </View>
              <SettingSwitch
                value={settings.autoConnect}
                onValueChange={(val) =>
                  setSettings({ ...settings, autoConnect: val })
                }
                activeColor={theme.palette.secondary}
              />
            </View>
          </View>
        </View>

        {/* Data & Privacy */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: currentTheme.textTertiary }]}
          >
            {t("settings.sections.data")}
          </Text>
          <View
            style={[
              styles.card,
              {
                backgroundColor: currentTheme.surface,
                borderColor: currentTheme.border,
                padding: 0,
              },
            ]}
          >
            <View
              style={[
                styles.listItem,
                {
                  borderBottomColor: currentTheme.border,
                  borderBottomWidth: 1,
                },
              ]}
            >
              <View>
                <Text
                  style={[styles.listItemTitle, { color: currentTheme.text }]}
                >
                  {t("settings.data.logTrip")}
                </Text>
                <Text
                  style={[
                    styles.listItemSubtitle,
                    { color: currentTheme.textSecondary },
                  ]}
                >
                  {t("settings.data.logTripDesc")}
                </Text>
              </View>
              <SettingSwitch
                value={settings.logTripData}
                onValueChange={(val) =>
                  setSettings({ ...settings, logTripData: val })
                }
              />
            </View>

            <View style={styles.listItem}>
              <View>
                <Text
                  style={[styles.listItemTitle, { color: currentTheme.text }]}
                >
                  {t("settings.data.analytics")}
                </Text>
                <Text
                  style={[
                    styles.listItemSubtitle,
                    { color: currentTheme.textSecondary },
                  ]}
                >
                  {t("settings.data.analyticsDesc")}
                </Text>
              </View>
              <SettingSwitch
                value={settings.analytics}
                onValueChange={(val) =>
                  setSettings({ ...settings, analytics: val })
                }
              />
            </View>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: currentTheme.textTertiary }]}
          >
            {t("settings.sections.preferences")}
          </Text>
          <View
            style={[
              styles.card,
              {
                backgroundColor: currentTheme.surface,
                borderColor: currentTheme.border,
              },
            ]}
          >
            <View style={styles.preferenceRow}>
              <Text
                style={[styles.listItemTitle, { color: currentTheme.text }]}
              >
                {t("settings.preferences.speedUnits")}
              </Text>
              <SegmentedControl
                options={["KM/H", "MPH"]}
                selected={units.speed}
                onSelect={(val) => setUnits({ ...units, speed: val })}
              />
            </View>

            <View style={styles.preferenceRow}>
              <Text
                style={[styles.listItemTitle, { color: currentTheme.text }]}
              >
                {t("settings.preferences.temperature")}
              </Text>
              <SegmentedControl
                options={["°F", "°C"]}
                selected={units.temperature}
                onSelect={(val) => setUnits({ ...units, temperature: val })}
              />
            </View>

            <View
              style={[styles.divider, { backgroundColor: currentTheme.border }]}
            />

            <View style={styles.preferenceRow}>
              <View>
                <Text
                  style={[styles.listItemTitle, { color: currentTheme.text }]}
                >
                  {t("settings.preferences.keepScreenOn")}
                </Text>
                <Text
                  style={[
                    styles.listItemSubtitle,
                    { color: currentTheme.textSecondary },
                  ]}
                >
                  {t("settings.preferences.keepScreenOnDesc")}
                </Text>
              </View>
              <SettingSwitch
                value={settings.keepScreenOn}
                onValueChange={(val) =>
                  setSettings({ ...settings, keepScreenOn: val })
                }
              />
            </View>

            <View style={styles.preferenceRow}>
              <View>
                <Text
                  style={[styles.listItemTitle, { color: currentTheme.text }]}
                >
                  {t("settings.preferences.highContrast")}
                </Text>
                <Text
                  style={[
                    styles.listItemSubtitle,
                    { color: currentTheme.textSecondary },
                  ]}
                >
                  {t("settings.preferences.highContrastDesc")}
                </Text>
              </View>
              <SettingSwitch
                value={settings.highContrast}
                onValueChange={(val) =>
                  setSettings({ ...settings, highContrast: val })
                }
              />
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <AppVersion
            style={{ marginBottom: 8, color: currentTheme.textTertiary }}
          />
          <View style={styles.footerLinks}>
            <TouchableOpacity>
              <Text
                style={[
                  styles.footerLink,
                  { color: currentTheme.textSecondary },
                ]}
              >
                {t("settings.footer.privacy")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text
                style={[
                  styles.footerLink,
                  { color: currentTheme.textSecondary },
                ]}
              >
                {t("settings.footer.terms")}
              </Text>
            </TouchableOpacity>
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
  glowTop: {
    position: "absolute",
    top: -200,
    left: -200,
    width: 600,
    height: 600,
    borderRadius: 300,
  },
  glowBottom: {
    position: "absolute",
    bottom: -150,
    right: -150,
    width: 500,
    height: 500,
    borderRadius: 250,
  },
  pageHeader: {
    marginBottom: 32,
    paddingHorizontal: 24,
    marginTop: 24,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 12,
    fontWeight: "400",
    fontStyle: "italic",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 0,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  inputGroup: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 1,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  listItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  listItemTitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  listItemSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  preferenceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  segmentedContainer: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 8,
    gap: 4,
  },
  segmentButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  segmentButtonActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    marginVertical: 20,
  },
  footer: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  footerLinks: {
    flexDirection: "row",
    gap: 16,
  },
  footerLink: {
    fontSize: 10,
  },
});

export default SettingsScreen;
