import { Ionicons } from "@expo/vector-icons";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
  const textColor = useThemeColor({}, "text");
  const subtitleColor = useThemeColor({}, "subtitleText");
  const insets = useSafeAreaInsets();

  return (
    <ImageBackground
      source={require("../../assets/images/home/home_banner.png")}
      style={styles.header}
      imageStyle={styles.backgroundImage}
      resizeMode="cover"
    >
      <View
        style={[
          styles.headerContent,
          { paddingTop: insets.top + 12, paddingHorizontal: 24 },
        ]}
      >
        {/* Top Row: Greeting และ Actions ในระนาบเดียวกัน */}
        <View style={styles.topRow}>
          <View style={styles.greetingContainer}>
            <Text
              style={[
                styles.greeting,
                { color: textColor, fontFamily: getFontFamily("regular") },
              ]}
            >
              {greeting},{" "}
              <Text
                style={[styles.userName, { fontFamily: getFontFamily("bold") }]}
              >
                {user?.display_name ||
                  (user?.email ? user.email.split("@")[0] : "User")}
              </Text>
            </Text>
            <Text
              style={[
                styles.subtitle,
                {
                  color: subtitleColor,
                  fontFamily: getFontFamily("regular"),
                },
              ]}
            >
              Alfred has been monitor your items today and all are looking good!
            </Text>
          </View>

          <View style={styles.headerActions}>
            <Pressable
              onPress={() =>
                navigateGently("/(app)/settings", NavigationPresets.subtle)
              }
              style={styles.headerActionButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="settings-outline" size={24} color="#1A1A1A" />
            </Pressable>
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
                color="#1A1A1A"
              />
            </Pressable>
          </View>
        </View>

        {/* Subtitle moved under greetingContainer */}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 193,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  headerContent: {
    // paddingHorizontal and paddingTop are provided dynamically via insets
    paddingBottom: 20,
    height: "100%",
    justifyContent: "space-between",
    zIndex: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  greetingContainer: {
    flex: 1,
    marginRight: 12,
  },
  greeting: {
    fontSize: 12,
    lineHeight: 20,
  },
  userName: {
    fontSize: 12,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerActionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 20,
    opacity: 0.8,
    paddingRight: 40, // เว้นระยะไม่ให้ชนกับปุ่ม
  },
});
