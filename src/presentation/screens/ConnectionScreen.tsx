import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  BluetoothDevice,
  bluetoothService,
} from "../../core/services/BluetoothService";
import { theme } from "../../core/theme";

const { width } = Dimensions.get("window");

interface ConnectionScreenProps {
  onBack?: () => void;
  onSkip?: () => void;
}

const ConnectionScreen: React.FC<ConnectionScreenProps> = ({
  onBack,
  onSkip,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // State
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<BluetoothDevice | null>(
    null
  );
  const [connectionStatus, setConnectionStatus] = useState<
    "none" | "connecting" | "connected" | "error"
  >("none");
  const [errorMessage, setErrorMessage] = useState("");

  // Animations
  const scanAnim = useRef(new Animated.Value(0)).current;
  const pingAnim = useRef(new Animated.Value(0)).current;
  const modalAnim = useRef(new Animated.Value(0)).current;

  const currentTheme = theme.palette.dark;
  const activeColor = theme.palette.primary;

  useEffect(() => {
    startPingAnimation();

    // Request permissions on mount
    checkPermissions();

    return () => {
      bluetoothService.stopScan();
    };
  }, []);

  const checkPermissions = async () => {
    const granted = await bluetoothService.requestPermissions();
    if (!granted) {
      setErrorMessage("Bluetooth and Location permissions are required.");
      setConnectionStatus("error");
    }
  };

  const startPingAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pingAnim, {
          toValue: 1.5,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pingAnim, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startScanAnimation = () => {
    Animated.loop(
      Animated.timing(scanAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  };

  const handleScan = () => {
    if (isScanning) {
      bluetoothService.stopScan();
      setIsScanning(false);
      scanAnim.setValue(0);
    } else {
      setDevices([]);
      setIsScanning(true);
      startScanAnimation();

      bluetoothService.startScan(
        (foundDevices) => {
          setDevices(foundDevices);
        },
        (error) => {
          console.error(error);
          setIsScanning(false);
          scanAnim.stopAnimation();
          setErrorMessage(error.message);
          setConnectionStatus("error");
        }
      );
    }
  };

  const handleConnect = async (device: BluetoothDevice) => {
    bluetoothService.stopScan();
    setIsScanning(false);
    setSelectedDevice(device);
    setConnectionStatus("connecting");

    // Show modal
    Animated.spring(modalAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    const success = await bluetoothService.connectToDevice(device.id);

    if (success) {
      setConnectionStatus("connected");
      setTimeout(() => {
        handleComplete();
      }, 1500);
    } else {
      setConnectionStatus("error");
      setErrorMessage("Failed to connect to " + device.name);
    }
  };

  const handleComplete = () => {
    if (onSkip) {
      onSkip();
    } else {
      router.replace("/");
    }
  };

  const handleGoBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // If we can't go back, maybe we should just go home or skip
      if (onSkip) onSkip();
      else router.replace("/");
    }
  };

  const closeModal = () => {
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setConnectionStatus("none");
      setSelectedDevice(null);
    });
  };

  const renderSignalBars = (rssi: number) => {
    return (
      <View style={styles.signalContainer}>
        {[1, 2, 3].map((i) => {
          const thresholds = [-90, -80, -70];
          const opacity = rssi > thresholds[i - 1] ? 1 : 0.2;
          return (
            <View
              key={i}
              style={[
                styles.signalBar,
                {
                  height: 6 + i * 4,
                  backgroundColor: activeColor,
                  opacity,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  const translateX = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  const modalScale = modalAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentTheme.background, paddingTop: insets.top },
      ]}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header / App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={currentTheme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: currentTheme.text }]}>
          {t("connection.title")}
        </Text>
        <TouchableOpacity onPress={handleComplete}>
          <Text style={[styles.helpText, { color: activeColor }]}>
            {t("connection.skip")}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 100 + insets.bottom }, // Extra padding for footer and potential tab bar
        ]}
      >
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <ImageBackground
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuA76CHO9Rkiw0dFggmy5IX3-Iv8KyiSw1XBzI_Trmv4aDnv_1C-rdhbYAE4wDNeoejAKdGRgocYo4vzlpBplJYVGffW11Sp8Ho1-B6jrPhQY7RGRxsA5kEtEdEXleMac_EyyzUuDB2-NmlgYCz1SM0hAJyqWEy87l6gTEHSz9EJgAc3Q7VJKeU8fXcK7d0kOJr70g5RKrFSLPBcTK0m0uSGqjUuRKfENfhMBjzqLU5Bc177VWANkDe1XhdLz8bx_tb4u0i59bwSfnNc",
            }}
            style={styles.heroImage}
            imageStyle={{ borderRadius: 12 }}
          >
            <LinearGradient
              colors={[
                "rgba(11, 15, 23, 0.95)",
                "rgba(11, 15, 23, 0.6)",
                "transparent",
              ]}
              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: 0 }}
              style={styles.heroGradient}
            >
              {/* Status Badge */}
              <View style={styles.statusBadge}>
                <View style={styles.pingContainer}>
                  <Animated.View
                    style={[
                      styles.pingDot,
                      {
                        backgroundColor: activeColor,
                        transform: [{ scale: pingAnim }],
                        opacity: 0.5,
                      },
                    ]}
                  />
                  <View
                    style={[styles.dot, { backgroundColor: activeColor }]}
                  />
                </View>
                <Text style={styles.statusText}>
                  {isScanning
                    ? t("connection.scanning")
                    : t("connection.readyToScan")}
                </Text>
              </View>

              <View style={styles.heroContent}>
                <View
                  style={[
                    styles.iconBox,
                    {
                      backgroundColor: `${activeColor}22`,
                      borderColor: `${activeColor}44`,
                    },
                  ]}
                >
                  <MaterialIcons
                    name="electric-car"
                    size={32}
                    color={activeColor}
                  />
                </View>
                <Text style={styles.heroTitle}>DriveLytix</Text>
                <Text style={styles.heroSubtitle}>
                  Unlock Your Engine's Data
                </Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>
            {t("connection.connectAdapter")}
          </Text>
          <Text
            style={[
              styles.sectionSubtitle,
              { color: currentTheme.textSecondary },
            ]}
          >
            {t("connection.connectInstructions")}
          </Text>
        </View>

        {/* Scan Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.scanButton,
              { backgroundColor: activeColor, shadowColor: activeColor },
            ]}
            onPress={handleScan}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name={isScanning ? "stop" : "radar"}
              size={24}
              color={theme.palette.dark.background}
              style={{ marginRight: 8 }}
            />
            <Text
              style={[
                styles.scanButtonText,
                { color: theme.palette.dark.background },
              ]}
            >
              {isScanning
                ? t("connection.scanning")
                : t("connection.scanForDevices")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Available Devices */}
        <View style={styles.listSection}>
          <View style={styles.sectionHeaderRow}>
            <Text
              style={[styles.listHeader, { color: currentTheme.textSecondary }]}
            >
              {t("connection.availableDevices")}
            </Text>
            {isScanning && (
              <ActivityIndicator size="small" color={activeColor} />
            )}
          </View>

          <View style={styles.devicesList}>
            {devices.map((device) => (
              <TouchableOpacity
                key={device.id}
                onPress={() => handleConnect(device)}
                style={[
                  styles.deviceCard,
                  {
                    backgroundColor: currentTheme.surface,
                    borderColor: currentTheme.border,
                    overflow: "hidden",
                  },
                ]}
              >
                {/* Active Scan Effect */}
                {isScanning && (
                  <Animated.View
                    style={[
                      StyleSheet.absoluteFill,
                      {
                        transform: [{ translateX }],
                        backgroundColor: "rgba(255, 255, 255, 0.03)",
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={[
                        "transparent",
                        `${activeColor}15`,
                        "transparent",
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ flex: 1 }}
                    />
                  </Animated.View>
                )}

                <View
                  style={[
                    styles.deviceIcon,
                    { backgroundColor: "rgba(255,255,255,0.05)" },
                  ]}
                >
                  <MaterialIcons
                    name={
                      device.name && device.name.toLowerCase().includes("wifi")
                        ? "wifi"
                        : "bluetooth"
                    }
                    size={24}
                    color={currentTheme.text}
                  />
                </View>
                <View style={styles.deviceInfo}>
                  <View style={styles.deviceRow}>
                    <Text
                      style={[styles.deviceName, { color: currentTheme.text }]}
                    >
                      {device.name || "Unknown Device"}
                    </Text>
                    {renderSignalBars(device.rssi)}
                  </View>
                  <View style={styles.deviceRowLeft}>
                    <Text
                      style={[
                        styles.deviceDetail,
                        { color: currentTheme.textTertiary },
                      ]}
                    >
                      ID: {device.id}
                    </Text>
                  </View>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  color={currentTheme.textTertiary}
                />
              </TouchableOpacity>
            ))}

            {!isScanning && devices.length === 0 && (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons
                  name="bluetooth-off"
                  size={48}
                  color={currentTheme.textTertiary}
                />
                <Text
                  style={{
                    textAlign: "center",
                    color: currentTheme.textTertiary,
                    marginTop: 12,
                  }}
                >
                  {t("connection.noDevices")}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Trouble connecting - Positioned relative to bottom to avoid tab bar overlap */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: currentTheme.background,
            paddingBottom: Math.max(24, insets.bottom + 12),
            borderTopColor: currentTheme.border,
          },
        ]}
      >
        <TouchableOpacity style={styles.footerButton}>
          <MaterialIcons
            name="help-outline"
            size={20}
            color={currentTheme.textSecondary}
          />
          <Text
            style={[styles.footerText, { color: currentTheme.textSecondary }]}
          >
            {t("connection.troubleConnecting")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Custom Connection Modal */}
      {connectionStatus !== "none" && (
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContent,
              {
                backgroundColor: currentTheme.surface,
                borderColor: currentTheme.border,
                transform: [{ scale: modalScale }],
                opacity: modalAnim,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <View
                style={[
                  styles.modalIconBox,
                  { backgroundColor: `${activeColor}22` },
                ]}
              >
                {connectionStatus === "connecting" && (
                  <ActivityIndicator size="large" color={activeColor} />
                )}
                {connectionStatus === "connected" && (
                  <Ionicons name="checkmark-circle" size={48} color="#4ADE80" />
                )}
                {connectionStatus === "error" && (
                  <Ionicons name="alert-circle" size={48} color="#F87171" />
                )}
              </View>
              <Text style={[styles.modalTitle, { color: currentTheme.text }]}>
                {connectionStatus === "connecting" && "Connecting..."}
                {connectionStatus === "connected" && "Connected!"}
                {connectionStatus === "error" && "Connection Failed"}
              </Text>
              <Text
                style={[
                  styles.modalSubtitle,
                  { color: currentTheme.textSecondary },
                ]}
              >
                {connectionStatus === "connecting" &&
                  `Pairing with ${selectedDevice?.name}...`}
                {connectionStatus === "connected" &&
                  `Successfully linked to ${selectedDevice?.name}`}
                {connectionStatus === "error" && errorMessage}
              </Text>
            </View>

            {connectionStatus === "error" && (
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: activeColor }]}
                onPress={closeModal}
              >
                <Text style={styles.modalButtonText}>Try Again</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  helpText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroContainer: {
    padding: 16,
  },
  heroImage: {
    height: 180,
    justifyContent: "flex-end",
    overflow: "hidden",
    borderRadius: 12,
  },
  heroGradient: {
    flex: 1,
    borderRadius: 12,
    padding: 20,
    justifyContent: "flex-end",
  },
  statusBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  pingContainer: {
    width: 10,
    height: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  pingDot: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  heroContent: {
    zIndex: 10,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    marginBottom: 12,
    // Removed backdropFilter
    backgroundColor: "rgba(0, 194, 255, 0.2)", // Approximate if supported or fallback
  },
  heroTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    lineHeight: 32,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
  },
  instructions: {
    paddingHorizontal: 16,
    alignItems: "center",
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
    marginTop: 16,
  },
  scanButton: {
    height: 56,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  scanButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  listSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  listHeader: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  deviceCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  deviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  deviceInfo: {
    flex: 1,
    justifyContent: "center",
  },
  deviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  deviceRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  deviceMeta: {
    fontSize: 12,
    fontWeight: "500",
  },
  deviceDetail: {
    fontSize: 12,
    fontFamily: "monospace",
  },
  newBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  signalContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
    height: 14,
  },
  signalBar: {
    width: 4,
    borderRadius: 1,
  },
  devicesList: {
    gap: 0,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    alignItems: "center",
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footerText: {
    fontSize: 14,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    width: width * 0.85,
    padding: 32,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  modalIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  modalButton: {
    height: 50,
    width: "100%",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
});

export default ConnectionScreen;
