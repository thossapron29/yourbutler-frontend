import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useI18n } from "../../contexts/I18nContext";
import { useFonts } from "../../hooks/useFonts";
import { navigateGently, NavigationPresets } from "../../utils/navigation";

interface SummaryBannerProps {
  hasExpiringItems: boolean;
  expiringCount: number;
  primaryPurple: string;
}

export default function SummaryBanner({
  hasExpiringItems,
  expiringCount,
  primaryPurple,
}: SummaryBannerProps) {
  const { t } = useI18n();
  const { getFontFamily } = useFonts();

  if (!hasExpiringItems) {
    // All Good state
    return (
      <View style={styles.section}>
        <View
          style={[
            styles.enhancedShoppingListCTA,
            { backgroundColor: primaryPurple },
          ]}
        >
          <View style={styles.enhancedShoppingCTAContent}>
            <View style={styles.enhancedShoppingCTAIcon}>
              <Ionicons name="checkmark-done" size={28} color="#fff" />
            </View>
            <View style={styles.enhancedShoppingCTATextContainer}>
              <Text
                style={[
                  styles.enhancedShoppingCTATitle,
                  { fontFamily: getFontFamily("bold") },
                ]}
              >
                {t("home.allGood")}
              </Text>
              <Text
                style={[
                  styles.enhancedShoppingCTASubtitle,
                  { fontFamily: getFontFamily("regular") },
                ]}
              >
                {t("home.noItemsExpiring")}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() =>
              navigateGently("/(app)/my-items", NavigationPresets.gentle)
            }
            style={styles.circleButton}
          >
            <Ionicons name="arrow-forward" size={20} color={primaryPurple} />
          </Pressable>
        </View>
      </View>
    );
  }

  // Shopping List CTA state
  return (
    <View style={styles.section}>
      <Pressable
        style={[
          styles.enhancedShoppingListCTA,
          { backgroundColor: "#FF9500" },
        ]}
        onPress={() =>
          navigateGently("/(app)/shopping-list", NavigationPresets.gentle)
        }
      >
        <View style={styles.enhancedShoppingCTAContent}>
          <View style={styles.enhancedShoppingCTAIcon}>
            <Ionicons name="bag-add" size={28} color="#fff" />
          </View>
          <View style={styles.enhancedShoppingCTATextContainer}>
            <Text
              style={[
                styles.enhancedShoppingCTATitle,
                { fontFamily: getFontFamily("bold") },
              ]}
            >
              {t("home.shoppingListReady")}
            </Text>
            <Text
              style={[
                styles.enhancedShoppingCTASubtitle,
                { fontFamily: getFontFamily("regular") },
              ]}
            >
              {t("home.itemsExpiringSoon", {
                count: expiringCount,
              })}
            </Text>
          </View>
        </View>
        <View style={styles.enhancedShoppingCTAAction}>
          <Text
            style={[
              styles.enhancedShoppingCTAButtonText,
              { fontFamily: getFontFamily("semibold") },
            ]}
          >
            {t("home.viewList")}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: 20, paddingVertical: 16 },
  enhancedShoppingListCTA: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  enhancedShoppingCTAIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  enhancedShoppingCTAContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  enhancedShoppingCTATextContainer: {
    flex: 1,
  },
  enhancedShoppingCTATitle: { fontSize: 18, color: "#fff", marginBottom: 4 },
  enhancedShoppingCTASubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    lineHeight: 18,
  },
  enhancedShoppingCTAAction: { alignItems: "center" },
  enhancedShoppingCTAButtonText: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 4,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
});
