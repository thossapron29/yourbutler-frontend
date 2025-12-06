import {
  BorderRadius,
  ColorPalette,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/DesignSystem";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { height: deviceHeight } = Dimensions.get("window");
const halfHeight = deviceHeight / 2;

export default function Welcome() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/(public)/sign-up");
  };  return (
    <View style={styles.container}>
      {/* Top Section - Image */}
      <View style={[styles.topSection, { height: halfHeight }]}>
        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/images/welcome/welcome_graphic_figma.png")}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </View>
      </View>

      {/* Bottom Section - Content */}
      <View style={[styles.bottomSection, { height: halfHeight }]}>
        <View style={styles.contentContainer}>
          {/* Title & Subtitle */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Welcome to YourButler</Text>
            <Text style={styles.subtitle}>
              Keeping track of everything at home, so you don't have to.
            </Text>
          </View>

          {/* Features List */}
          <View style={styles.featuresList}>
            <View style={styles.featureRow}>
              <View style={styles.checkIcon}>
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.featureText}>See what's expiring soon</Text>
            </View>
            <View style={styles.featureRow}>
              <View style={styles.checkIcon}>
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.featureText}>Get gentle reminders</Text>
            </View>
            <View style={styles.featureRow}>
              <View style={styles.checkIcon}>
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.featureText}>Simplify your shopping</Text>
            </View>
          </View>
        </View>

        {/* Get Started Button */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleGetStarted}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorPalette.gray[50], // #FEFEFE - Off-white background
  },
  topSection: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: ColorPalette.gray[100], // #FBFBFB - Surface background
  },
  imageContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  bannerImage: {
    width: "100%",
    height: "142.86%",
    marginTop: 0,
  },
  bottomSection: {
    padding: Spacing.xl, // 24px - Design system spacing
    gap: Spacing.lg, // 16px - Design system gap
    justifyContent: "space-around",
  },
  contentContainer: {
    gap: Spacing.xl, // 24px - Between sections
  },
  headerSection: {
    gap: Spacing.sm, // 8px - Between title and subtitle
  },
  title: {
    ...Typography.presets.h3, // Figtree 32px Bold (from design system)
    color: ColorPalette.gray[900], // #2D2D2D - Primary text
    marginBottom: Spacing.sm, // 8px
  },
  subtitle: {
    ...Typography.presets.bodyMedium, // Figtree 16px Medium (from design system)
    color: ColorPalette.gray[600], // #6B7280 - Secondary text
    lineHeight: Typography.fontSize.md * Typography.lineHeight.snug, // 16px * 1.375 = 22px
  },
  featuresList: {
    gap: Spacing.md, // 12px - Between feature items (most common from Figma)
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md, // 12px - Design system gap
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full, // Fully rounded (from design system)
    backgroundColor: ColorPalette.purple[400], // #8655BB - Purple variant (closer to original)
    justifyContent: "center",
    alignItems: "center",
  },
  featureText: {
    ...Typography.presets.bodyMedium, // Figtree 16px Medium
    color: ColorPalette.gray[700], // #4B5563 - Feature text
    lineHeight: Typography.fontSize.md * Typography.lineHeight.tight, // 20px line height
    flex: 1,
  },
  button: {
    backgroundColor: ColorPalette.purple[400], // #8655BB - Purple button (matching checkIcon)
    paddingVertical: Spacing.lg, // 16px vertical (from design system)
    paddingHorizontal: Spacing.xl, // 24px horizontal
    borderRadius: BorderRadius.lg, // 12px - Design system radius
    alignItems: "center",
    marginTop: Spacing.sm, // 8px
    ...Shadows.purple, // Purple-tinted shadow (from design system)
  },
  buttonPressed: {
    backgroundColor: ColorPalette.purple[500], // Darker on press
    transform: [{ scale: 0.98 }], // Subtle press effect
  },
  buttonText: {
    ...Typography.presets.bodyMedium, // Figtree 16px Medium
    color: "#FFFFFF", // White text
    fontWeight: Typography.fontWeight.semibold, // 600 weight
  },
});
