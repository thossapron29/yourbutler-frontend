import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";
import { useFonts } from "../../hooks/useFonts";

interface SummaryBannerProps {
  hasExpiringItems: boolean;
  expiringCount: number; // expiring soon
  expiredCount?: number; // new: expired items
}

export default function SummaryBanner({
  hasExpiringItems,
  expiringCount,
  expiredCount = 0,
}: SummaryBannerProps) {
  const { getFontFamily } = useFonts();
  // Compute variant once and render a single layout
  const config = (() => {
    if (expiredCount > 0) {
      return {
        bgColor: "#FFE4E9",
        titleColor: "#1A1A1A",
        subtitleColor: "#1A1A1A",
        title:
          expiredCount +
          " " +
          (expiredCount === 1 ? "Item Expired" : "Items Expired"),
        subtitle:
          "Item(s) are now added to the shopping list. Your shopping is now ready.",
        icon: require("../../assets/images/home/expired.png"),
      } as const;
    }
    if (hasExpiringItems) {
      return {
        bgColor: "#FFEFD4",
        titleColor: "#1A1A1A",
        subtitleColor: "#1A1A1A",
        title:
          expiringCount +
          " " +
          (expiringCount === 1 ? "Item Expiring Soon" : "Items Expiring Soon"),
        subtitle:
          "Item(s) are now added to the shopping list. Your shopping is now ready.",
        icon: require("../../assets/images/home/expired_soon.png"),
      } as const;
    }
    return {
      bgColor: "#8756BC",
      titleColor: "#FFFFFF",
      subtitleColor: "#FFFFFF",
      title: "All Good!",
      subtitle: "No items expiring in the next 7 days.",
      icon: require("../../assets/images/home/all_good.png"),
    } as const;
  })();

  return (
    <View style={styles.section}>
      <View
        style={[
          styles.enhancedShoppingListCTA,
          { backgroundColor: config.bgColor },
        ]}
      >
        <View style={styles.enhancedShoppingCTAContent}>
          <View style={styles.enhancedShoppingCTATextContainer}>
            <View style={styles.titleRow}>
              <Image
                source={config.icon}
                style={styles.inlineIcon}
                resizeMode="contain"
              />
              <Text
                style={[
                  styles.enhancedShoppingCTATitle,
                  {
                    fontFamily: getFontFamily("bold"),
                    color: config.titleColor,
                  },
                ]}
              >
                {config.title}
              </Text>
            </View>
            <Text
              style={[
                styles.enhancedShoppingCTASubtitle,
                {
                  fontFamily: getFontFamily("regular"),
                  color: config.subtitleColor,
                },
              ]}
            >
              {config.subtitle}
            </Text>
          </View>
        </View>
        <View style={styles.circleButton}>
          <Ionicons name="arrow-forward" size={20} color="#111" />
        </View>
      </View>
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
    // 🪽 Shadow: 0px 1px 2px 0px #0000001A
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    // 🧱 Border: 1px solid #EEEBF0
    borderWidth: 1,
    borderColor: "#EEEBF0",
  },
  // Variant backgrounds now provided inline via config
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  inlineIcon: {
    width: 14,
    height: 14,
    marginRight: 6,
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
