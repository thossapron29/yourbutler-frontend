import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  BorderRadius,
  ColorPalette,
  Spacing,
  Typography,
} from "../../constants/DesignSystem";
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
  const { t, language } = useI18n();
  const { getLocalizedFontFamily } = useFonts();
  const cardBackground = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const subtitleColor = useThemeColor({}, "subtitleText");
  const borderColor = useThemeColor({}, "borderColor");

  // 🧭 helper: สร้างเส้นทางไปหน้า add-product พร้อมพารามิเตอร์หมวดหมู่ (ถ้ามี)
  const buildAddProductRoute = (categoryName?: string) => {
    if (categoryName) {
      const categoryParam = encodeURIComponent(categoryName);
      return `/(app)/add-product?category=${categoryParam}` as any;
    }
    return "/(app)/add-product" as any;
  };

  // 🧩 QuickCategory: ปุ่มเพิ่มด่วนหนึ่งรายการ
  const QuickCategory = ({ name, icon }: { name: string; icon: IconName }) => (
    <Pressable
      key={name}
      style={({ pressed }) => [
        styles.quickCategoryButton,
        { backgroundColor: cardBackground },
        pressed && { opacity: 0.7 },
      ]}
      accessibilityRole="button"
      accessibilityLabel={name}
      onPress={() =>
        navigateGently(buildAddProductRoute(name), NavigationPresets.gentle)
      }
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={24} color={primaryPurple} />
      </View>
      <Text
        style={[
          styles.quickCategoryText,
          {
            color: textColor,
            fontFamily: getLocalizedFontFamily(language, "regular"),
          },
        ]}
      >
        {name ? t(`categories.${name.toLowerCase()}`) : name}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.section}>
      {/* ⚡ Quick Add: ส่วนลัดสำหรับเพิ่มรายการตามหมวดหมู่ยอดนิยม */}
      <Text
        style={[
          styles.secondarySectionTitle,
          {
            color: subtitleColor,
            fontFamily: getLocalizedFontFamily(language, "semibold"),
          },
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
          .map(([categoryName, icon]) => (
            <QuickCategory key={categoryName} name={categoryName} icon={icon} />
          ))}
        {/* ➕ Show more button */}
        <Pressable
          style={({ pressed }) => [
            styles.quickCategoryButton,
            styles.showMoreButton,
            {
              backgroundColor: cardBackground,
              borderColor,
              borderWidth: 1,
            },
            pressed && { opacity: 0.7 },
          ]}
          accessibilityRole="button"
          accessibilityLabel={t("home.more")}
          onPress={() =>
            navigateGently("/(app)/add-product", NavigationPresets.gentle)
          }
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name="add-circle-outline"
              size={24}
              color={subtitleColor}
            />
          </View>
          <Text
            style={[
              styles.quickCategoryText,
              {
                color: subtitleColor,
                fontFamily: getLocalizedFontFamily(language, "regular"),
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
  section: {
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[4],
  },
  secondarySectionTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold as any,
    marginBottom: Spacing[4],
    lineHeight: 19.2,
  },
  quickCategoriesContainer: {
    paddingVertical: Spacing[2],
  },
  quickCategoryButton: {
    alignItems: "center",
    marginRight: Spacing[3],
    minWidth: 64,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: ColorPalette.gray[100],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing[2],
  },
  quickCategoryText: {
    fontSize: Typography.fontSize.sm,
    lineHeight: 14.4,
    textAlign: "center",
  },
  showMoreButton: {
    opacity: 0.8,
  },
});
