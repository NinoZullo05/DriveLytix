import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { bluetoothService } from "../../core/services/BluetoothService";
import { theme } from "../../core/theme";

import DashboardScreen from "../screens/DashboardScreen";
import DataScreen from "../screens/DataScreen";
import MapScreen from "../screens/MapScreen";
import PowerScreen from "../screens/PowerScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();

const CustomPowerButton = ({ onPress }: any) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const unsubscribe = bluetoothService.subscribeToConnectionStatus(
      (status) => {
        setIsConnected(status);
      }
    );
    return unsubscribe;
  }, []);

  const buttonColor = isConnected ? "#4ADE80" : "#F87171"; // Green if connected, Red if not

  return (
    <View style={styles.powerButtonContainer}>
      <TouchableOpacity
        style={[
          styles.powerButton,
          {
            backgroundColor: buttonColor,
            shadowColor: buttonColor,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Ionicons name="power" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

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
          backgroundColor: "#0B0F17",
          borderTopColor: "rgba(255,255,255,0.05)",
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 88 : 70 + insets.bottom,
          paddingBottom: Platform.OS === "ios" ? 28 : insets.bottom + 8,
          paddingTop: 12,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
        },
        tabBarActiveTintColor: "#00C2FF",
        tabBarInactiveTintColor: "rgba(255,255,255,0.4)",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 4,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          switch (route.name) {
            case "Dashboard":
              iconName = focused ? "grid" : "grid-outline";
              break;
            case "Data":
              iconName = focused ? "bar-chart" : "bar-chart-outline";
              break;
            case "Map":
              iconName = focused ? "map" : "map-outline";
              break;
            case "Settings":
              iconName = focused ? "person" : "person-outline";
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
            <CustomPowerButton {...props} currentTheme={currentTheme} />
          ),
        }}
      />

      <Tab.Screen name="Map" component={MapScreen} />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  powerButtonContainer: {
    top: -25,
    justifyContent: "center",
    alignItems: "center",
  },
  powerButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 4,
    borderColor: "#0B0F17",
  },
});

export default BottomNavigationbar;
