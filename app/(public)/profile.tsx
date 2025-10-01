import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { apiClient } from "../../utils/api";

export default function Profile() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/(public)/sign-up");
    }
  }, [isAuthenticated]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Just refresh the page state
    setIsRefreshing(false);
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(public)/sign-up");
        },
      },
    ]);
  };

  const handleTestApiCall = async () => {
    try {
      const health = await apiClient.healthCheck();
      Alert.alert("API Health Check", `Status: ${health.status}`);
    } catch (error) {
      Alert.alert(
        "API Error",
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={24} color="#FF3B30" />
          </Pressable>
        </View>

        {/* User Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>User Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ID:</Text>
            <Text style={styles.infoValue}>{user.id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{user.display_name}</Text>
          </View>
        </View>

        {/* API Data Card - Removed since /api/me no longer exists */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Authentication Status</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <Text style={styles.infoValue}>Authenticated ✅</Text>
          </View>
        </View>

        {/* Test Buttons */}
        <View style={styles.buttonContainer}>
          <Pressable style={styles.testButton} onPress={handleTestApiCall}>
            <Ionicons
              name="pulse"
              size={20}
              color="#347CFF"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.testButtonText}>Test Health Check</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222",
  },
  logoutButton: {
    padding: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    width: 80,
  },
  infoValue: {
    fontSize: 16,
    color: "#222",
    flex: 1,
  },
  noData: {
    fontSize: 16,
    color: "#999",
    fontStyle: "italic",
  },
  buttonContainer: {
    gap: 12,
    marginTop: 8,
  },
  testButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#347CFF",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  testButtonText: {
    color: "#347CFF",
    fontSize: 16,
    fontWeight: "500",
  },
});
