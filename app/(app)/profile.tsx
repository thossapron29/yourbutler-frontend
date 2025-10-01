import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useFonts } from "../../hooks/useFonts";
import { useThemeColor } from "../../hooks/useThemeColor";
import { apiClient } from "../../utils/api";
import { navigateBackGently, NavigationPresets } from "../../utils/navigation";

interface ProfileSettings {
  name: string;
  email: string;
  timezone: string;
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { fontsLoaded } = useFonts();
  const router = useRouter();
  
  const [profileData, setProfileData] = useState<ProfileSettings>({
    name: "",
    email: "",
    timezone: "UTC",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<ProfileSettings>({
    name: "",
    email: "",
    timezone: "UTC",
  });

  // Theme colors
  const backgroundColor = useThemeColor({}, "background");
  const cardBackground = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const subtitleColor = useThemeColor({}, "subtitleText");
  const borderColor = useThemeColor({}, "borderColor");
  const tintColor = useThemeColor({}, "tint");
  const dangerColor = useThemeColor({}, "dangerColor");

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getSettings();
      setProfileData(response.profile);
      setEditedData(response.profile);
    } catch (error) {
      console.error("Failed to load profile:", error);
      // Use user data if API fails
      if (user) {
        const fallbackData = {
          name: user.display_name || "",
          email: user.email || "",
          timezone: "UTC",
        };
        setProfileData(fallbackData);
        setEditedData(fallbackData);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [user]);

  const handleSave = async () => {
    if (!editedData.name.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }

    try {
      setSaving(true);
      await apiClient.updateProfileSettings({
        name: editedData.name,
        timezone: editedData.timezone,
      });
      
      // Update user context if display name changed
      if (user && editedData.name !== profileData.name) {
        await updateUser({
          ...user,
          display_name: editedData.name,
        });
      }

      setProfileData(editedData);
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedData(profileData);
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Final Confirmation",
              "This will permanently delete your account and all data. Type 'DELETE' to confirm.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "I Understand",
                  style: "destructive",
                  onPress: () => {
                    // For now, just show coming soon
                    Alert.alert("Coming Soon", "Account deletion will be available in a future update.");
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const handleBackPress = () => {
    if (isEditing) {
      Alert.alert(
        "Unsaved Changes",
        "You have unsaved changes. Do you want to discard them?",
        [
          { text: "Keep Editing", style: "cancel" },
          { text: "Discard", onPress: () => {
            handleCancel();
            navigateBackGently(NavigationPresets.gentle);
          }},
        ]
      );
    } else {
      navigateBackGently(NavigationPresets.gentle);
    }
  };

  const timezones = [
    { label: "UTC (Coordinated Universal Time)", value: "UTC" },
    { label: "Asia/Bangkok (ICT)", value: "Asia/Bangkok" },
    { label: "America/New_York (EST/EDT)", value: "America/New_York" },
    { label: "America/Los_Angeles (PST/PDT)", value: "America/Los_Angeles" },
    { label: "Europe/London (GMT/BST)", value: "Europe/London" },
    { label: "Asia/Tokyo (JST)", value: "Asia/Tokyo" },
    { label: "Australia/Sydney (AEST/AEDT)", value: "Australia/Sydney" },
  ];

  const handleTimezoneSelection = () => {
    Alert.alert(
      "Select Timezone",
      "Choose your timezone for accurate reminder times",
      [
        ...timezones.map(tz => ({
          text: tz.label,
          onPress: () => setEditedData({ ...editedData, timezone: tz.value })
        })),
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  if (!fontsLoaded || loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: textColor }]}>
            Loading profile...
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
          Profile
        </Text>
        <Pressable
          style={styles.editButton}
          onPress={isEditing ? handleSave : () => setIsEditing(true)}
          disabled={saving}
        >
          <Text style={[styles.editButtonText, { color: tintColor }]}>
            {saving ? "Saving..." : isEditing ? "Save" : "Edit"}
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Avatar */}
        <View style={styles.section}>
          <View style={[styles.avatarContainer, { backgroundColor: cardBackground }]}>
            <View style={[styles.avatar, { backgroundColor: tintColor }]}>
              <Text style={styles.avatarText}>
                {(isEditing ? editedData.name : profileData.name)?.charAt(0).toUpperCase() || "U"}
              </Text>
            </View>
            <Text style={[styles.avatarLabel, { color: subtitleColor }]}>
              Profile Picture
            </Text>
            <Text style={[styles.avatarSubtext, { color: subtitleColor }]}>
              Coming Soon
            </Text>
          </View>
        </View>

        {/* Profile Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Personal Information
          </Text>

          {/* Name */}
          <View style={[styles.inputContainer, { backgroundColor: cardBackground }]}>
            <Text style={[styles.inputLabel, { color: textColor }]}>Display Name</Text>
            {isEditing ? (
              <TextInput
                style={[styles.textInput, { color: textColor, borderColor }]}
                value={editedData.name}
                onChangeText={(text) => setEditedData({ ...editedData, name: text })}
                placeholder="Enter your name"
                placeholderTextColor={subtitleColor}
              />
            ) : (
              <Text style={[styles.inputValue, { color: textColor }]}>
                {profileData.name || "Not set"}
              </Text>
            )}
          </View>

          {/* Email (Read Only) */}
          <View style={[styles.inputContainer, { backgroundColor: cardBackground }]}>
            <Text style={[styles.inputLabel, { color: textColor }]}>Email</Text>
            <Text style={[styles.inputValue, { color: subtitleColor }]}>
              {profileData.email}
            </Text>
            <Text style={[styles.inputSubtext, { color: subtitleColor }]}>
              Email cannot be changed
            </Text>
          </View>

          {/* Timezone */}
          <View style={[styles.inputContainer, { backgroundColor: cardBackground }]}>
            <Text style={[styles.inputLabel, { color: textColor }]}>Timezone</Text>
            {isEditing ? (
              <Pressable
                style={[styles.selectButton, { borderColor }]}
                onPress={handleTimezoneSelection}
              >
                <Text style={[styles.selectButtonText, { color: textColor }]}>
                  {timezones.find(tz => tz.value === editedData.timezone)?.label || editedData.timezone}
                </Text>
                <Ionicons name="chevron-down" size={16} color={subtitleColor} />
              </Pressable>
            ) : (
              <Text style={[styles.inputValue, { color: textColor }]}>
                {timezones.find(tz => tz.value === profileData.timezone)?.label || profileData.timezone}
              </Text>
            )}
          </View>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Account Management
          </Text>

          <Pressable
            style={[styles.actionButton, { backgroundColor: cardBackground }]}
            onPress={() => Alert.alert("Coming Soon", "Export data feature will be available soon.")}
          >
            <View style={styles.actionContent}>
              <Ionicons name="download-outline" size={20} color={tintColor} />
              <Text style={[styles.actionText, { color: textColor }]}>
                Export My Data
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={subtitleColor} />
          </Pressable>

          <Pressable
            style={[styles.actionButton, { backgroundColor: cardBackground }]}
            onPress={() => Alert.alert("Coming Soon", "Data preferences will be available soon.")}
          >
            <View style={styles.actionContent}>
              <Ionicons name="shield-checkmark-outline" size={20} color={tintColor} />
              <Text style={[styles.actionText, { color: textColor }]}>
                Privacy Settings
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={subtitleColor} />
          </Pressable>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: dangerColor }]}>
            Danger Zone
          </Text>

          <Pressable
            style={[styles.dangerButton, { backgroundColor: dangerColor + "10" }]}
            onPress={handleDeleteAccount}
          >
            <Ionicons name="trash-outline" size={20} color={dangerColor} />
            <Text style={[styles.dangerButtonText, { color: dangerColor }]}>
              Delete Account
            </Text>
          </Pressable>
        </View>

        {/* Action Buttons for Edit Mode */}
        {isEditing && (
          <View style={styles.section}>
            <View style={styles.buttonRow}>
              <Pressable
                style={[styles.cancelButton, { borderColor }]}
                onPress={handleCancel}
              >
                <Text style={[styles.cancelButtonText, { color: textColor }]}>
                  Cancel
                </Text>
              </Pressable>
              
              <Pressable
                style={[styles.saveButton, { backgroundColor: tintColor }]}
                onPress={handleSave}
                disabled={saving}
              >
                <Text style={styles.saveButtonText}>
                  {saving ? "Saving..." : "Save Changes"}
                </Text>
              </Pressable>
            </View>
          </View>
        )}

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
  editButton: {
    padding: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: "600",
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
    marginBottom: 16,
  },
  avatarContainer: {
    alignItems: "center",
    padding: 24,
    borderRadius: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "600",
    color: "#fff",
  },
  avatarLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  avatarSubtext: {
    fontSize: 14,
    opacity: 0.7,
  },
  inputContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputValue: {
    fontSize: 16,
  },
  inputSubtext: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
  textInput: {
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  selectButtonText: {
    fontSize: 16,
    flex: 1,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  actionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  actionText: {
    fontSize: 15,
    fontWeight: "500",
    marginLeft: 12,
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
  },
  dangerButtonText: {
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
