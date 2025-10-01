import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useI18n } from "../../contexts/I18nContext";
import { useFonts } from "../../hooks/useFonts";
import { useThemeColor } from "../../hooks/useThemeColor";
import { ExpiringProduct } from "../../utils/api";
import { navigateGently, NavigationPresets } from "../../utils/navigation";
import ExpiringItemCard from "./ExpiringItemCard";

interface ExpiringItemsSectionProps {
  expiringItems: ExpiringProduct[];
  onMarkAsPurchased: (id: string, name: string) => void;
  primaryPurple: string;
}

export default function ExpiringItemsSection({
  expiringItems,
  onMarkAsPurchased,
  primaryPurple,
}: ExpiringItemsSectionProps) {
  const { t } = useI18n();
  const { getFontFamily } = useFonts();
  const cardBackground = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const subtitleColor = useThemeColor({}, "subtitleText");

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.prioritySectionTitleContainer}>
          <Ionicons
            name="time-outline"
            size={20}
            color={primaryPurple}
            style={{ marginRight: 8 }}
          />
          <Text
            style={[
              styles.prioritySectionTitle,
              { color: textColor, fontFamily: getFontFamily("bold") },
            ]}
          >
            {t("home.expiringSoon")}
          </Text>
          {expiringItems?.length > 0 && (
            <View
              style={[
                styles.itemCountBadge,
                { backgroundColor: primaryPurple },
              ]}
            >
              <Text
                style={[
                  styles.itemCountText,
                  { fontFamily: getFontFamily("medium") },
                ]}
              >
                {expiringItems.length}
              </Text>
            </View>
          )}
        </View>
        <Pressable
          onPress={() =>
            navigateGently("/(app)/my-items", NavigationPresets.gentle)
          }
        >
          <Text
            style={[
              styles.seeAllText,
              {
                color: primaryPurple,
                fontFamily: getFontFamily("semibold"),
              },
            ]}
          >
            {t("common.seeAll")}
          </Text>
        </Pressable>
      </View>

      {expiringItems?.length > 0 ? (
        <View>
          {expiringItems.slice(0, 4).map((item) => (
            <ExpiringItemCard
              key={item.id}
              item={item}
              onMarkAsPurchased={onMarkAsPurchased}
              primaryPurple={primaryPurple}
            />
          ))}
        </View>
      ) : (
        <View style={[styles.emptyCard, { backgroundColor: cardBackground }]}>
          <Ionicons name="checkmark-circle" size={48} color="#34C759" />
          <Text
            style={[
              styles.emptyTitle,
              { color: textColor, fontFamily: getFontFamily("semibold") },
            ]}
          >
            {t("home.allGood")}
          </Text>
          <Text
            style={[
              styles.emptySubtitle,
              {
                color: subtitleColor,
                fontFamily: getFontFamily("regular"),
              },
            ]}
          >
            {t("home.noItemsExpiring")}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: 20, paddingVertical: 16 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  prioritySectionTitleContainer: { flexDirection: "row", alignItems: "center" },
  prioritySectionTitle: { fontSize: 22 },
  itemCountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  itemCountText: { color: "#fff", fontSize: 12 },
  seeAllText: { fontSize: 14 },
  emptyCard: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
    borderRadius: 16,
    shadowColor: "rgba(95, 72, 139, 0.06)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyTitle: { fontSize: 18, marginTop: 16, marginBottom: 8 },
  emptySubtitle: { fontSize: 15, textAlign: "center", lineHeight: 22 },
});
