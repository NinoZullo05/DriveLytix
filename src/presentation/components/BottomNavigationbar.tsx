import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Platform, TouchableOpacity, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../../core/theme";

import DashboardScreen from "../screens/DashboardScreen";
import DataScreen from "../screens/DataScreen";
import MapScreen from "../screens/MapScreen";
import PowerScreen from "../screens/PowerScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();

const CustomPowerButton = ({ children, onPress, currentTheme }: any) => (
  <TouchableOpacity
    style={{
      top: -30,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.palette.primary,
      width: 70,
      height: 70,
      borderRadius: 35,
      shadowColor: theme.palette.primary,
      shadowOpacity: 0.5,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 10,
      elevation: 8,
      borderWidth: 6,
      borderColor: currentTheme.background, // Match container background
    }}
    onPress={onPress}
  >
    {children}
  </TouchableOpacity>
);

const BottomNavigationbar = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const currentTheme = isDark ? theme.palette.dark : theme.palette.light;
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: currentTheme.surface,
          borderTopColor: currentTheme.border,
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 88 : 64 + insets.bottom,
          paddingBottom: Platform.OS === "ios" ? 28 : insets.bottom + 8,
          paddingTop: 8,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
        },
        tabBarActiveTintColor: currentTheme.text,
        tabBarInactiveTintColor: currentTheme.textTertiary,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "500",
          marginTop: 2,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          switch (route.name) {
            case "Dashboard":
              iconName = focused ? "speedometer" : "speedometer-outline";
              break;
            case "Data":
              iconName = focused ? "stats-chart" : "stats-chart-outline";
              break;
            case "Map":
              iconName = focused ? "map" : "map-outline";
              break;
            case "Settings":
              iconName = focused ? "settings" : "settings-outline";
              break;
            case "Power":
              iconName = "power";
              break;
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: "Dash",
        }}
      />

      <Tab.Screen name="Data" component={DataScreen} />

      <Tab.Screen
        name="Power"
        component={PowerScreen}
        options={{
          tabBarLabel: "",
          tabBarIcon: () => null,
          tabBarButton: (props) => (
            <CustomPowerButton {...props} currentTheme={currentTheme}>
              <Ionicons name="power" size={32} color="#fff" />
            </CustomPowerButton>
          ),
        }}
      />

      <Tab.Screen name="Map" component={MapScreen} />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Settings",
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigationbar;
