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
import { useTheme } from "../../contexts/ThemeContext";
import { useFonts } from "../../hooks/useFonts";
import { useThemeColor } from "../../hooks/useThemeColor";
import { apiClient } from "../../utils/api";
import { navigateBackGently, NavigationPresets } from "../../utils/navigation";

interface NotificationSettings {
  global: {
    enable_notifications: boolean;
    default_remind_days: number;
    quiet_hours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
  categories: {
    [key: string]: {
      enabled: boolean;
      remind_days: number;
      priority: "low" | "medium" | "high";
    };
  };
}

export default function NotificationSettingsPage() {
  const { user } = useAuth();
  const { themeMode } = useTheme();
  const { fontsLoaded } = useFonts();
  const router = useRouter();
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Theme colors
  const backgroundColor = useThemeColor({}, "background");
  const cardBackground = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const subtitleColor = useThemeColor({}, "subtitleText");
  const borderColor = useThemeColor({}, "borderColor");
  const tintColor = useThemeColor({}, "tint");
  const successColor = useThemeColor({}, "successColor");
  const dangerColor = useThemeColor({}, "dangerColor");

  const loadNotificationSettings = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getNotificationSettings();
      setSettings(response);
    } catch (error) {
      console.error("Failed to load notification settings:", error);
      // Default settings if API fails
      setSettings({
        global: {
          enable_notifications: true,
          default_remind_days: 3,
          quiet_hours: {
            enabled: false,
            start: "22:00",
            end: "08:00",
          },
        },
        categories: {
          fruits: { enabled: true, remind_days: 3, priority: "medium" },
          vegetables: { enabled: true, remind_days: 2, priority: "medium" },
          dairy: { enabled: true, remind_days: 1, priority: "high" },
          meat: { enabled: true, remind_days: 1, priority: "high" },
          pantry: { enabled: true, remind_days: 7, priority: "low" },
        },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const updateGlobalSetting = async (key: string, value: any) => {
    if (!settings) return;

    try {
      const updatedSettings = {
        ...settings,
        global: { ...settings.global, [key]: value },
      };
      setSettings(updatedSettings);
      await apiClient.updateNotificationSettings(updatedSettings);
    } catch (error) {
      console.error("Failed to update notification settings:", error);
      Alert.alert("Error", "Failed to update settings");
    }
  };

  const updateCategorySetting = async (
    category: string,
    key: string,
    value: any
  ) => {
    if (!settings) return;

    try {
      const updatedSettings = {
        ...settings,
        categories: {
          ...settings.categories,
          [category]: { ...settings.categories[category], [key]: value },
        },
      };
      setSettings(updatedSettings);
      await apiClient.updateNotificationSettings(updatedSettings);
    } catch (error) {
      console.error("Failed to update category settings:", error);
      Alert.alert("Error", "Failed to update category settings");
    }
  };

  const handleBackPress = () => {
    navigateBackGently(NavigationPresets.gentle);
  };

  const handleQuietHoursSetup = () => {
    Alert.alert(
      "Quiet Hours",
      "During quiet hours, notifications will be delayed until the quiet period ends.",
      [
        {
          text: "Disable",
          onPress: () =>
            updateGlobalSetting("quiet_hours", {
              ...settings?.global.quiet_hours,
              enabled: false,
            }),
        },
        {
          text: "10 PM - 8 AM",
          onPress: () =>
            updateGlobalSetting("quiet_hours", {
              enabled: true,
              start: "22:00",
              end: "08:00",
            }),
        },
        {
          text: "11 PM - 7 AM",
          onPress: () =>
            updateGlobalSetting("quiet_hours", {
              enabled: true,
              start: "23:00",
              end: "07:00",
            }),
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const handleDefaultRemindDays = () => {
    Alert.alert(
      "Default Reminder Days",
      "How many days before expiration should we remind you?",
      [
        {
          text: "1 day",
          onPress: () => updateGlobalSetting("default_remind_days", 1),
        },
        {
          text: "2 days",
          onPress: () => updateGlobalSetting("default_remind_days", 2),
        },
        {
          text: "3 days",
          onPress: () => updateGlobalSetting("default_remind_days", 3),
        },
        {
          text: "5 days",
          onPress: () => updateGlobalSetting("default_remind_days", 5),
        },
        {
          text: "7 days",
          onPress: () => updateGlobalSetting("default_remind_days", 7),
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  if (!fontsLoaded || loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: textColor }]}>
            Loading notification settings...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <Pressable style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: textColor }]}>
          Notification Settings
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Global Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Global Settings
          </Text>

          {/* Master Toggle */}
          <View
            style={[styles.settingItem, { backgroundColor: cardBackground }]}
          >
            <View style={styles.settingContent}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color={textColor}
              />
              <Text style={[styles.settingText, { color: textColor }]}>
                Enable Notifications
              </Text>
            </View>
            <Switch
              value={settings?.global.enable_notifications ?? false}
              onValueChange={(value) =>
                updateGlobalSetting("enable_notifications", value)
              }
              trackColor={{ false: borderColor, true: tintColor + "40" }}
              thumbColor={
                settings?.global.enable_notifications ? tintColor : "#f4f3f4"
              }
            />
          </View>

          {/* Default Remind Days */}
          <Pressable
            style={[styles.settingItem, { backgroundColor: cardBackground }]}
            onPress={handleDefaultRemindDays}
          >
            <View style={styles.settingContent}>
              <Ionicons name="calendar-outline" size={20} color={textColor} />
              <Text style={[styles.settingText, { color: textColor }]}>
                Default Reminder Days
              </Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={[styles.settingValue, { color: subtitleColor }]}>
                {settings?.global.default_remind_days} day
                {settings?.global.default_remind_days !== 1 ? "s" : ""}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={subtitleColor}
              />
            </View>
          </Pressable>

          {/* Quiet Hours */}
          <Pressable
            style={[styles.settingItem, { backgroundColor: cardBackground }]}
            onPress={handleQuietHoursSetup}
          >
            <View style={styles.settingContent}>
              <Ionicons name="moon-outline" size={20} color={textColor} />
              <Text style={[styles.settingText, { color: textColor }]}>
                Quiet Hours
              </Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={[styles.settingValue, { color: subtitleColor }]}>
                {settings?.global.quiet_hours.enabled
                  ? `${settings.global.quiet_hours.start} - ${settings.global.quiet_hours.end}`
                  : "Off"}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={subtitleColor}
              />
            </View>
          </Pressable>
        </View>

        {/* Category Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Category Settings
          </Text>
          <Text style={[styles.sectionSubtitle, { color: subtitleColor }]}>
            Customize notification preferences for each category
          </Text>

          {settings?.categories &&
            Object.entries(settings.categories).map(
              ([category, categorySettings]) => (
                <View
                  key={category}
                  style={[
                    styles.categoryItem,
                    { backgroundColor: cardBackground },
                  ]}
                >
                  <View style={styles.categoryHeader}>
                    <View style={styles.categoryTitleRow}>
                      <Ionicons
                        name={
                          category === "fruits"
                            ? "leaf-outline"
                            : category === "vegetables"
                            ? "nutrition-outline"
                            : category === "dairy"
                            ? "flask-outline"
                            : category === "meat"
                            ? "restaurant-outline"
                            : "bag-outline"
                        }
                        size={18}
                        color={textColor}
                      />
                      <Text
                        style={[styles.categoryTitle, { color: textColor }]}
                      >
                        {category
                          ? category.charAt(0).toUpperCase() + category.slice(1)
                          : "Unknown"}
                      </Text>
                    </View>
                    <Switch
                      value={categorySettings.enabled}
                      onValueChange={(value) =>
                        updateCategorySetting(category, "enabled", value)
                      }
                      trackColor={{
                        false: borderColor,
                        true: tintColor + "40",
                      }}
                      thumbColor={
                        categorySettings.enabled ? tintColor : "#f4f3f4"
                      }
                    />
                  </View>

                  {categorySettings.enabled && (
                    <View style={styles.categoryDetails}>
                      <Text
                        style={[
                          styles.categoryDetailText,
                          { color: subtitleColor },
                        ]}
                      >
                        Remind {categorySettings.remind_days} day
                        {categorySettings.remind_days !== 1 ? "s" : ""} before
                        expiration
                      </Text>
                      <Text
                        style={[
                          styles.categoryDetailText,
                          { color: subtitleColor },
                        ]}
                      >
                        Priority: {categorySettings.priority}
                      </Text>
                    </View>
                  )}
                </View>
              )
            )}
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 16,
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
  categoryItem: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: "500",
    marginLeft: 8,
  },
  categoryDetails: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(128, 128, 128, 0.2)",
  },
  categoryDetailText: {
    fontSize: 13,
    marginBottom: 2,
  },
});
