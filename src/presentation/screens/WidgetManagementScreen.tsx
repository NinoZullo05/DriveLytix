import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../../core/theme";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Widget {
  id: string;
  categoryKey: string;
  titleKey: string;
  descriptionKey: string;
  enabled: boolean;
  icon: string;
}

const WIDGET_STORAGE_KEY = "DRIVELYTIX_WIDGET_SETTINGS";

const DEFAULT_WIDGETS: Widget[] = [
  {
    id: "rpm",
    categoryKey: "engine",
    titleKey: "rpm",
    descriptionKey: "rpmDesc",
    enabled: true,
    icon: "speedometer",
  },
  {
    id: "speed",
    categoryKey: "engine",
    titleKey: "speed",
    descriptionKey: "speedDesc",
    enabled: true,
    icon: "speedometer-slow",
  },
  {
    id: "boost",
    categoryKey: "engine",
    titleKey: "boost",
    descriptionKey: "boostDesc",
    enabled: false,
    icon: "weather-windy",
  },
  {
    id: "coolant",
    categoryKey: "fluids",
    titleKey: "coolant",
    descriptionKey: "coolantDesc",
    enabled: true,
    icon: "thermometer",
  },
  {
    id: "fuel",
    categoryKey: "fluids",
    titleKey: "fuel",
    descriptionKey: "fuelDesc",
    enabled: true,
    icon: "fuel",
  },
  {
    id: "oil",
    categoryKey: "fluids",
    titleKey: "oil",
    descriptionKey: "oilDesc",
    enabled: false,
    icon: "oil",
  },
];

const WidgetManagementScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [widgets, setWidgets] = useState<Widget[]>(DEFAULT_WIDGETS);

  // Load widgets from storage
  useEffect(() => {
    const loadWidgets = async () => {
      try {
        const saved = await AsyncStorage.getItem(WIDGET_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Merge with defaults to ensure new widgets appear
          const merged = DEFAULT_WIDGETS.map((def) => {
            const found = parsed.find((p: any) => p.id === def.id);
            return found ? { ...def, enabled: found.enabled } : def;
          });
          setWidgets(merged);
        }
      } catch (e) {
        console.error("Failed to load widget settings", e);
      }
    };
    loadWidgets();
  }, []);

  // Save widgets on change
  const toggleWidget = async (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const updated = widgets.map((w) =>
      w.id === id ? { ...w, enabled: !w.enabled } : w
    );
    setWidgets(updated);
    saveWidgets(updated);
  };

  const moveWidget = async (id: string, direction: "up" | "down") => {
    const index = widgets.findIndex((w) => w.id === id);
    if (index === -1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= widgets.length) return;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const updated = [...widgets];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIndex, 0, moved);

    setWidgets(updated);
    saveWidgets(updated);
  };

  const saveWidgets = async (updated: Widget[]) => {
    try {
      await AsyncStorage.setItem(WIDGET_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save widget settings", e);
    }
  };

  const resetToDefaults = async () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setWidgets(DEFAULT_WIDGETS);
    try {
      await AsyncStorage.removeItem(WIDGET_STORAGE_KEY);
    } catch (e) {
      console.error("Failed to reset widget settings", e);
    }
  };

  const categories = Array.from(new Set(widgets.map((w) => w.categoryKey)));

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.palette.dark.background,
          paddingTop: insets.top,
        },
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
        <Text style={styles.headerTitle}>{t("widgets.manageTitle")}</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.doneButton}>{t("widgets.done")}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.mainTitle}>{t("widgets.customizeTitle")}</Text>
        <Text style={styles.subtitle}>{t("widgets.customizeSubtitle")}</Text>

        {categories.map((categoryKey) => (
          <View key={categoryKey} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>
                {t(`widgets.categories.${categoryKey}`).toUpperCase()}
              </Text>
              <View style={styles.categoryLine} />
            </View>

            {widgets
              // Grouping by category makes reordering less intuitive if they restricted to categories,
              // but for now let's keep the category view and just allow moving within the list.
              .filter((w) => w.categoryKey === categoryKey)
              .map((widget, index) => {
                const globalIndex = widgets.findIndex(
                  (w) => w.id === widget.id
                );
                return (
                  <View key={widget.id} style={styles.widgetCard}>
                    <View
                      style={[
                        styles.iconContainer,
                        { backgroundColor: theme.palette.dark.surface },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={widget.icon as any}
                        size={24}
                        color={theme.palette.primary}
                      />
                    </View>
                    <View style={styles.widgetInfo}>
                      <Text style={styles.widgetTitle}>
                        {t(`widgets.${widget.titleKey}`)}
                      </Text>
                      <Text style={styles.widgetDescription}>
                        {t(`widgets.${widget.descriptionKey}`)}
                      </Text>
                    </View>
                    <View style={styles.controls}>
                      <View style={styles.reorderButtons}>
                        <TouchableOpacity
                          onPress={() => moveWidget(widget.id, "up")}
                          disabled={globalIndex === 0}
                          style={[
                            styles.reorderBtn,
                            globalIndex === 0 && { opacity: 0.2 },
                          ]}
                        >
                          <MaterialCommunityIcons
                            name="chevron-up"
                            size={20}
                            color="#fff"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => moveWidget(widget.id, "down")}
                          disabled={globalIndex === widgets.length - 1}
                          style={[
                            styles.reorderBtn,
                            globalIndex === widgets.length - 1 && {
                              opacity: 0.2,
                            },
                          ]}
                        >
                          <MaterialCommunityIcons
                            name="chevron-down"
                            size={20}
                            color="#fff"
                          />
                        </TouchableOpacity>
                      </View>
                      <Switch
                        value={widget.enabled}
                        onValueChange={() => toggleWidget(widget.id)}
                        trackColor={{
                          false: "#1E293B",
                          true: theme.palette.primary,
                        }}
                        thumbColor="#fff"
                      />
                    </View>
                  </View>
                );
              })}
          </View>
        ))}

        <TouchableOpacity style={styles.resetButton} onPress={resetToDefaults}>
          <MaterialCommunityIcons
            name="restart"
            size={20}
            color="rgba(255,255,255,0.7)"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.resetButtonText}>{t("widgets.reset")}</Text>
        </TouchableOpacity>
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
    padding: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  doneButton: {
    color: theme.palette.primary,
    fontSize: 16,
    fontWeight: "bold",
    padding: 8,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  mainTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 32,
  },
  categorySection: {
    marginBottom: 32,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  categoryTitle: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
    marginRight: 12,
  },
  categoryLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  widgetCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  widgetInfo: {
    flex: 1,
    justifyContent: "center",
  },
  widgetTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  widgetDescription: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
  },
  reorderButtons: {
    flexDirection: "column",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  reorderBtn: {
    padding: 2,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    marginTop: 16,
  },
  resetButtonText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default WidgetManagementScreen;
