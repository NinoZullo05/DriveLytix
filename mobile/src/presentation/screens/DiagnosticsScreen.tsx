import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { diagnosticService } from "../../core/services/DiagnosticService";
import { theme } from "../../core/theme";
import { DTC } from "../../domain/entities/DTC";

export default function DiagnosticsScreen() {
  const insets = useSafeAreaInsets();
  const [dtcs, setDtcs] = useState<DTC[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDTCs = async () => {
    setLoading(true);
    setError(null);
    try {
      const codes = await diagnosticService.readDTCs();
      setDtcs(codes);
    } catch (e) {
      setError("Failed to read DTCs. Ensure device is connected.");
      console.error(e);
      // For demo purposes, if failed, we might show empty or mock if needed, but error is better.
    } finally {
      setLoading(false);
    }
  };

  const clearDTCs = async () => {
    setLoading(true);
    try {
      await diagnosticService.clearDTCs();
      setDtcs([]);
      alert("Codes cleared successfully");
    } catch (e) {
      alert("Failed to clear codes");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: DTC }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.code}>{item.code}</Text>
        <View style={[styles.badge, styles.warningBadge]}>
          <Text style={styles.badgeText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.system}>{item.system}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Diagnostics</Text>
        <Text style={styles.subtitle}>ECU ERROR CODES</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.readButton]}
          onPress={fetchDTCs}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialCommunityIcons
                name="car-connected"
                size={20}
                color="#fff"
              />
              <Text style={styles.buttonText}>READ CODES</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={clearDTCs}
          disabled={loading}
        >
          <MaterialCommunityIcons
            name="delete-outline"
            size={20}
            color="#FF4444"
          />
          <Text style={[styles.buttonText, { color: "#FF4444" }]}>
            CLEAR ALL
          </Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons
            name="alert-circle"
            size={24}
            color="#FF4444"
          />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={dtcs}
        renderItem={renderItem}
        keyExtractor={(item) => item.code}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !loading && !error ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={64}
                color={"#4CAF50"}
              />
              <Text style={styles.emptyText}>No Pending Codes</Text>
              <Text style={styles.emptySubText}>System checks passing</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F17",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
  },
  subtitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 2,
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  readButton: {
    backgroundColor: theme.palette.primary, // Make sure this exists or fallback
    borderColor: theme.palette.primary,
  },
  clearButton: {
    borderColor: "rgba(255,68,68,0.3)",
    backgroundColor: "rgba(255,68,68,0.05)",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 1,
  },
  list: {
    padding: 20,
    gap: 12,
  },
  card: {
    backgroundColor: "#151A23",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  code: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  warningBadge: {
    backgroundColor: "rgba(255, 152, 0, 0.2)",
  },
  badgeText: {
    fontSize: 10,
    color: "#FF9800",
    fontWeight: "bold",
  },
  system: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  errorContainer: {
    marginHorizontal: 20,
    padding: 12,
    backgroundColor: "rgba(255,68,68,0.1)",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  errorText: {
    color: "#FF4444",
    fontSize: 13,
    flex: 1,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
  },
  emptySubText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 14,
    marginTop: 4,
  },
});
