import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useFonts } from "../../hooks/useFonts";
import { useThemeColor } from "../../hooks/useThemeColor";
import { navigateGently, NavigationPresets } from "../../utils/navigation";

interface HeaderSectionProps {
  greeting: string;
}

export default function HeaderSection({ greeting }: HeaderSectionProps) {
  const { user } = useAuth();
  const { getFontFamily } = useFonts();
  const cardBackground = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const subtitleColor = useThemeColor({}, "subtitleText");

  return (
    <View style={[styles.header, { backgroundColor: cardBackground }]}>
      <View style={styles.headerContent}>
        <View style={styles.greetingContainer}>
          <Text
            style={[
              styles.greeting,
              { color: textColor, fontFamily: getFontFamily("bold") },
            ]}
          >
            {greeting}
          </Text>
          <Text
            style={[
              styles.userName,
              {
                color: subtitleColor,
                fontFamily: getFontFamily("regular"),
              },
            ]}
          >
            {user?.display_name ||
              (user?.email ? user.email.split("@")[0] : "User")}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            onPress={() =>
              navigateGently("/(app)/notifications", NavigationPresets.subtle)
            }
            style={styles.headerActionButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={subtitleColor}
            />
          </Pressable>
          <Pressable
            onPress={() =>
              navigateGently("/(app)/settings", NavigationPresets.subtle)
            }
            style={styles.headerActionButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="settings-outline" size={24} color={subtitleColor} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greetingContainer: { flex: 1 },
  greeting: { fontSize: 20, marginBottom: 4 },
  userName: { fontSize: 14 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 4 },
  headerActionButton: {
    padding: 12,
    borderRadius: 8,
  },
});
