import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useI18n } from "../../contexts/I18nContext";
import { useFonts } from "../../hooks/useFonts";
import { useThemeColor } from "../../hooks/useThemeColor";
import { navigateGently, NavigationPresets } from "../../utils/navigation";

type IconName = keyof typeof Ionicons.glyphMap;

interface QuickAddSectionProps {
  categoryIcons: Record<string, IconName>;
  primaryPurple: string;
}

export default function QuickAddSection({
  categoryIcons,
  primaryPurple,
}: QuickAddSectionProps) {
  const { t } = useI18n();
  const { getFontFamily } = useFonts();
  const cardBackground = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const subtitleColor = useThemeColor({}, "subtitleText");
  const borderColor = useThemeColor({}, "borderColor");

  const renderQuickAddCategory = (categoryName: string, icon: IconName) => (
    <Pressable
      key={categoryName}
      style={[styles.quickCategoryButton, { backgroundColor: cardBackground }]}
      onPress={() => {
        const categoryParam = categoryName
          ? encodeURIComponent(categoryName)
          : "";
        const route = categoryParam
          ? (`/(app)/add-product?category=${categoryParam}` as any)
          : ("/(app)/add-product" as any);
        navigateGently(route, NavigationPresets.gentle);
      }}
    >
      <Ionicons name={icon} size={20} color={primaryPurple} />
      <Text
        style={[
          styles.quickCategoryText,
          { color: textColor, fontFamily: getFontFamily("medium") },
        ]}
      >
        {categoryName
          ? t(`categories.${categoryName.toLowerCase()}`)
          : categoryName}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.section}>
      <Text
        style={[
          styles.secondarySectionTitle,
          { color: subtitleColor, fontFamily: getFontFamily("semibold") },
        ]}
      >
        {t("home.quickAdd")}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.quickCategoriesContainer}
      >
        {Object.entries(categoryIcons)
          .filter(([categoryName, icon]) => categoryName && icon)
          ?.slice(0, 4)
          .map(([categoryName, icon]) =>
            renderQuickAddCategory(categoryName, icon)
          )}
        {/* Show more button */}
        <Pressable
          style={[
            styles.quickCategoryButton,
            styles.showMoreButton,
            {
              backgroundColor: cardBackground,
              borderColor,
              borderWidth: 1,
            },
          ]}
          onPress={() =>
            navigateGently("/(app)/add-product", NavigationPresets.gentle)
          }
        >
          <Ionicons
            name="add-circle-outline"
            size={20}
            color={subtitleColor}
          />
          <Text
            style={[
              styles.quickCategoryText,
              {
                color: subtitleColor,
                fontFamily: getFontFamily("medium"),
              },
            ]}
          >
            {t("home.more")}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: 20, paddingVertical: 16 },
  secondarySectionTitle: { fontSize: 16, marginBottom: 16 },
  quickCategoriesContainer: {
    paddingVertical: 10,
  },
  quickCategoryButton: {
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginRight: 12,
    borderRadius: 16,
    minWidth: 85,
    shadowColor: "rgba(95, 72, 139, 0.08)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  quickCategoryText: { fontSize: 13, marginTop: 6, textAlign: "center" },
  showMoreButton: { opacity: 0.8 },
});
