import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useI18n } from "../../contexts/I18nContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useFonts } from "../../hooks/useFonts";
import { useThemeColor } from "../../hooks/useThemeColor";
import { apiClient } from "../../utils/api";
import { navigateBackGently, navigateGently, NavigationPresets } from "../../utils/navigation";
import {
  isDeviceRegistered,
  registerForPushNotificationsAsync,
  scheduleTestNotification,
  unregisterDevice,
} from "../../utils/notifications";

type ThemeMode = "light" | "dark" | "auto" | "time-based";

interface UserSettings {
  profile: {
    name: string;
    email: string;
    timezone: string;
  };
  preferences: {
    global: {
      enable_notifications: boolean;
      butler_personality?: string;
      default_remind_days: number;
    };
    categories: any[];
  };
  butler: {
    personality: string;
    greeting_style: string;
    recommendation_frequency: string;
  };
}

export default function Settings() {
  const { user, logout } = useAuth();
  const { themeMode, setThemeMode, isLoading } = useTheme();
  const { language, setLanguage } = useI18n();
  const { fontsLoaded, getFontFamily } = useFonts();
  const router = useRouter();
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>(themeMode);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(true);

  // Theme colors
  const backgroundColor = useThemeColor({}, "background");
  const cardBackground = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const subtitleColor = useThemeColor({}, "subtitleText");
  const borderColor = useThemeColor({}, "borderColor");
  const tintColor = useThemeColor({}, "tint");
  const successColor = useThemeColor({}, "successColor");
  const dangerColor = useThemeColor({}, "dangerColor");

  const loadSettings = async () => {
    try {
      setSettingsLoading(true);
      const response = await apiClient.getSettings();
      setSettings(response);
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setSettingsLoading(false);
    }
  };

  useEffect(() => {
    checkNotificationStatus();
    loadSettings();
  }, []);

  const updateButlerPersonality = async (personality: string) => {
    try {
      await apiClient.updateButlerSettings({ personality });
      setSettings((prev) =>
        prev
          ? {
              ...prev,
              butler: { ...prev.butler, personality },
            }
          : null
      );
      Alert.alert("Success", "Butler personality updated!");
    } catch (error) {
      console.error("Failed to update butler personality:", error);
      Alert.alert("Error", "Failed to update settings");
    }
  };

  const checkNotificationStatus = async () => {
    try {
      const isRegistered = await isDeviceRegistered();
      setNotificationsEnabled(isRegistered);
    } catch (error) {
      console.error("Error checking notification status:", error);
    }
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    try {
      if (enabled) {
        console.log("Enabling notifications...");
        const token = await registerForPushNotificationsAsync();
        if (token) {
          setNotificationsEnabled(true);
          Alert.alert("Success", "Notifications enabled successfully!");
        } else {
          console.warn("No token received, but continuing...");
          // Even if no token, still enable for development
          setNotificationsEnabled(true);
          Alert.alert("Info", "Notifications enabled (development mode)");
        }
      } else {
        console.log("Disabling notifications...");
        await unregisterDevice();
        setNotificationsEnabled(false);
        Alert.alert("Success", "Notifications disabled successfully!");
      }
    } catch (error) {
      console.error("Error toggling notifications:", error);
      // For development, still allow toggling
      setNotificationsEnabled(enabled);
      Alert.alert(
        "Info",
        `Notifications ${enabled ? "enabled" : "disabled"} (development mode)`
      );
    }
  };

  const handleTestNotification = async () => {
    if (!notificationsEnabled) {
      Alert.alert("Info", "Please enable notifications first.");
      return;
    }

    await scheduleTestNotification();
    Alert.alert("Test Sent", "Check your notifications!");
  };

  const handleThemeChange = async (mode: ThemeMode) => {
    try {
      await setThemeMode(mode);
      setSelectedTheme(mode);
    } catch (error) {
      Alert.alert("Error", "Failed to change theme");
    }
  };

  const handleLanguageToggle = () => {
    const newLanguage = language === "en" ? "th" : "en";
    setLanguage(newLanguage);
  };

  const handleThemeSelection = () => {
    Alert.alert(
      "Select Theme",
      "Choose your preferred theme",
      [
        { text: "Light", onPress: () => handleThemeChange("light") },
        { text: "Dark", onPress: () => handleThemeChange("dark") },
        { text: "Auto", onPress: () => handleThemeChange("auto") },
        { text: "Time-based", onPress: () => handleThemeChange("time-based") },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const handlePrivacySecurity = () => {
    Alert.alert(
      "Privacy & Security",
      "Privacy settings and security options will be available in a future update.",
      [{ text: "OK" }]
    );
  };

  const handleHelpSupport = () => {
    Alert.alert(
      "Help & Support",
      "Contact support: support@yourbutler.app\n\nFAQ and documentation coming soon!",
      [{ text: "OK" }]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      "About YourButler",
      "Version: 1.0.0\nBuild: 2025.09.04\n\nYour personal AI shopping assistant that helps you manage grocery items and never forget to buy what you need.",
      [{ text: "OK" }]
    );
  };

  const handleButlerPersonality = () => {
    const personalities = [
      { key: "friendly", label: "Friendly" },
      { key: "formal", label: "Formal" },
      { key: "casual", label: "Casual" },
      { key: "enthusiastic", label: "Enthusiastic" },
    ];

    Alert.alert(
      "Butler Personality",
      "Choose how your butler communicates with you",
      [
        ...personalities.map(p => ({
          text: p.label,
          onPress: () => updateButlerPersonality(p.key)
        })),
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const handleBackPress = () => {
    navigateBackGently(NavigationPresets.gentle);
  };

  const handleLogout = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(public)/welcome");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {!fontsLoaded ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor,
          }}
        >
          <Text style={{ color: textColor }}>Loading...</Text>
        </View>
      ) : (
        <>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: borderColor }]}>
            <Pressable style={styles.backButton} onPress={handleBackPress}>
              <Ionicons name="arrow-back" size={24} color={textColor} />
            </Pressable>
            <Text style={[styles.headerTitle, { color: textColor }]}>
              Settings
            </Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Profile Section */}
            <View style={styles.section}>
              <Pressable
                style={[
                  styles.profileContainer,
                  { backgroundColor: cardBackground },
                ]}
                onPress={() => navigateGently("/(app)/profile", NavigationPresets.gentle)}
              >
                <View style={[styles.avatar, { backgroundColor: tintColor }]}>
                  <Text style={styles.avatarText}>
                    {user?.display_name?.charAt(0).toUpperCase() || "U"}
                  </Text>
                </View>
                <View style={styles.profileInfo}>
                  <Text style={[styles.profileName, { color: textColor }]}>
                    {user?.display_name || "User"}
                  </Text>
                  <Text style={[styles.profileEmail, { color: subtitleColor }]}>
                    {user?.email || "user@example.com"}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={subtitleColor}
                />
              </Pressable>
            </View>

            {/* Settings List */}
            <View style={styles.settingsList}>
              {/* Language */}
              <Pressable
                style={[
                  styles.settingItem,
                  { backgroundColor: cardBackground },
                ]}
                onPress={handleLanguageToggle}
              >
                <View style={styles.settingContent}>
                  <Ionicons
                    name="language-outline"
                    size={20}
                    color={textColor}
                  />
                  <Text style={[styles.settingText, { color: textColor }]}>
                    Language
                  </Text>
                </View>
                <View style={styles.settingRight}>
                  <Text style={[styles.settingValue, { color: subtitleColor }]}>
                    {language === "en" ? "English" : "ไทย"}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={subtitleColor}
                  />
                </View>
              </Pressable>

              {/* Theme */}
              <Pressable
                style={[
                  styles.settingItem,
                  { backgroundColor: cardBackground },
                ]}
                onPress={handleThemeSelection}
              >
                <View style={styles.settingContent}>
                  <Ionicons
                    name="color-palette-outline"
                    size={20}
                    color={textColor}
                  />
                  <Text style={[styles.settingText, { color: textColor }]}>
                    Theme
                  </Text>
                </View>
                <View style={styles.settingRight}>
                  <Text style={[styles.settingValue, { color: subtitleColor }]}>
                    {themeMode === "light"
                      ? "Light"
                      : themeMode === "dark"
                      ? "Dark"
                      : themeMode === "auto"
                      ? "Auto"
                      : "Time-based"}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={subtitleColor}
                  />
                </View>
              </Pressable>

              {/* Notifications */}
              <View
                style={[
                  styles.settingItem,
                  { backgroundColor: cardBackground },
                ]}
              >
                <View style={styles.settingContent}>
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    color={textColor}
                  />
                  <Text style={[styles.settingText, { color: textColor }]}>
                    Notifications
                  </Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={handleNotificationToggle}
                  trackColor={{ false: borderColor, true: tintColor + "40" }}
                  thumbColor={notificationsEnabled ? tintColor : "#f4f3f4"}
                />
              </View>

              {/* Test Notification (only show when notifications are enabled) */}
              {notificationsEnabled && (
                <Pressable
                  style={[
                    styles.settingItem,
                    { backgroundColor: cardBackground },
                  ]}
                  onPress={handleTestNotification}
                >
                  <View style={styles.settingContent}>
                    <Ionicons
                      name="flash-outline"
                      size={20}
                      color={textColor}
                    />
                    <Text style={[styles.settingText, { color: textColor }]}>
                      Test Notification
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={subtitleColor}
                  />
                </Pressable>
              )}

              {/* Privacy & Security */}
              <Pressable
                style={[
                  styles.settingItem,
                  { backgroundColor: cardBackground },
                ]}
                onPress={handlePrivacySecurity}
              >
                <View style={styles.settingContent}>
                  <Ionicons name="shield-outline" size={20} color={textColor} />
                  <Text style={[styles.settingText, { color: textColor }]}>
                    Privacy & Security
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={subtitleColor}
                />
              </Pressable>

              {/* Help & Support */}
              <Pressable
                style={[
                  styles.settingItem,
                  { backgroundColor: cardBackground },
                ]}
                onPress={handleHelpSupport}
              >
                <View style={styles.settingContent}>
                  <Ionicons
                    name="help-circle-outline"
                    size={20}
                    color={textColor}
                  />
                  <Text style={[styles.settingText, { color: textColor }]}>
                    Help & Support
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={subtitleColor}
                />
              </Pressable>

              {/* About */}
              <Pressable
                style={[
                  styles.settingItem,
                  { backgroundColor: cardBackground },
                ]}
                onPress={handleAbout}
              >
                <View style={styles.settingContent}>
                  <Ionicons
                    name="information-circle-outline"
                    size={20}
                    color={textColor}
                  />
                  <Text style={[styles.settingText, { color: textColor }]}>
                    About
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={subtitleColor}
                />
              </Pressable>

              {/* Butler Personality */}
              {settings && (
                <Pressable
                  style={[
                    styles.settingItem,
                    { backgroundColor: cardBackground },
                  ]}
                  onPress={handleButlerPersonality}
                >
                  <View style={styles.settingContent}>
                    <Ionicons
                      name="happy-outline"
                      size={20}
                      color={textColor}
                    />
                    <Text style={[styles.settingText, { color: textColor }]}>
                      Butler Personality
                    </Text>
                  </View>
                  <View style={styles.settingRight}>
                    <Text
                      style={[styles.settingValue, { color: subtitleColor }]}
                    >
                      {settings.butler.personality === "friendly"
                        ? "Friendly"
                        : settings.butler.personality === "formal"
                        ? "Formal"
                        : settings.butler.personality === "casual"
                        ? "Casual"
                        : "Enthusiastic"}
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={subtitleColor}
                    />
                  </View>
                </Pressable>
              )}

              {/* Notification Settings */}
              <Pressable
                style={[
                  styles.settingItem,
                  { backgroundColor: cardBackground },
                ]}
                onPress={() => navigateGently("/(app)/notification-settings", NavigationPresets.gentle)}
              >
                <View style={styles.settingContent}>
                  <Ionicons
                    name="settings-outline"
                    size={20}
                    color={textColor}
                  />
                  <Text style={[styles.settingText, { color: textColor }]}>
                    Notification Settings
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={subtitleColor}
                />
              </Pressable>
            </View>

            {/* Sign Out */}
            <View style={styles.section}>
              <Pressable
                style={[
                  styles.signOutButton,
                  { backgroundColor: dangerColor + "10" },
                ]}
                onPress={handleLogout}
              >
                <Ionicons
                  name="log-out-outline"
                  size={20}
                  color={dangerColor}
                />
                <Text style={[styles.signOutText, { color: dangerColor }]}>
                  Sign Out
                </Text>
              </Pressable>
            </View>

            <View style={{ height: 50 }} />
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginVertical: 16,
  },
  // Profile Section
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    opacity: 0.7,
  },
  // Settings List
  settingsList: {
    paddingHorizontal: 20,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  settingContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingText: {
    fontSize: 15,
    fontWeight: "500",
    marginLeft: 12,
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingValue: {
    fontSize: 14,
    marginRight: 8,
    opacity: 0.7,
  },
  // Sign Out
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
  },
  signOutText: {
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
  },
});
