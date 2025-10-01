import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useI18n } from "../../contexts/I18nContext";
import { useFonts } from "../../hooks/useFonts";
import { useThemeColor } from "../../hooks/useThemeColor";
import { ExpiringProduct } from "../../utils/api";

interface ExpiringItemCardProps {
  item: ExpiringProduct;
  onMarkAsPurchased: (id: string, name: string) => void;
  primaryPurple: string;
}

export default function ExpiringItemCard({
  item,
  onMarkAsPurchased,
  primaryPurple,
}: ExpiringItemCardProps) {
  const { t } = useI18n();
  const { getFontFamily } = useFonts();
  const cardBackground = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const subtitleColor = useThemeColor({}, "subtitleText");

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryStatus = (expiryDate: string) => {
    const days = getDaysUntilExpiry(expiryDate);
    if (days < 0)
      return {
        text: t("home.expired"),
        color: "#D32F2F",
        bgColor: "#FFEBEE",
      };
    if (days === 0)
      return {
        text: t("home.expiresToday"),
        color: "#D32F2F",
        bgColor: "#FFEBEE",
      };
    if (days === 1)
      return {
        text: t("home.expiresTomorrow"),
        color: "#F57C00",
        bgColor: "#FFF3E0",
      };
    if (days <= 3)
      return {
        text: t("home.daysLeft", { days }),
        color: "#F57C00",
        bgColor: "#FFF3E0",
      };
    if (days <= 7)
      return {
        text: t("home.daysLeft", { days }),
        color: primaryPurple,
        bgColor: "#F3E5F5",
      };
    return {
      text: t("home.daysLeft", { days }),
      color: "#424242",
      bgColor: "#F5F5F5",
    };
  };

  const status = getExpiryStatus(item.expected_expiry);

  return (
    <View style={[styles.expiringItem, { backgroundColor: cardBackground }]}>
      <View style={styles.expiringItemContent}>
        <Text
          style={[
            styles.expiringItemName,
            { color: textColor, fontFamily: getFontFamily("semibold") },
          ]}
        >
          {item.name}
        </Text>
        <Text
          style={[
            styles.expiringItemCategory,
            { color: subtitleColor, fontFamily: getFontFamily("regular") },
          ]}
        >
          {item.category_name || t("home.noCategory")}
        </Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Pressable
          onPress={() => onMarkAsPurchased(item.id, item.name)}
          style={[styles.purchaseButton, { backgroundColor: "#E8F5E8" }]}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={16}
            color="#4CAF50"
          />
        </Pressable>
        <View
          style={[styles.statusBadge, { backgroundColor: status.bgColor }]}
        >
          <Text
            style={[
              styles.statusText,
              { color: status.color, fontFamily: getFontFamily("medium") },
            ]}
          >
            {status.text}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  expiringItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  expiringItemContent: { flex: 1 },
  expiringItemName: { fontSize: 16, marginBottom: 2 },
  expiringItemCategory: { fontSize: 14 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 12 },
  purchaseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
});
