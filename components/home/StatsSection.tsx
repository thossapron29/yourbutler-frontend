import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useI18n } from "../../contexts/I18nContext";
import { useFonts } from "../../hooks/useFonts";
import { useThemeColor } from "../../hooks/useThemeColor";
import { DashboardSummary } from "../../utils/api";

interface StatsSectionProps {
  dashboardSummary: DashboardSummary | null;
  primaryPurple: string;
}

// 🧩 StatCard: การ์ดสรุป 1 ใบที่แสดงจำนวน + ชื่อ + งานศิลป์มุมขวาบน
interface StatCardProps {
  count: number;
  label: string;
  backgroundColor: string;
  countColor: string;
  labelColor: string;
  imageSource: ImageSourcePropType;
  countFontFamily: string;
  labelFontFamily: string;
}

function StatCard({
  count,
  label,
  backgroundColor,
  countColor,
  labelColor,
  imageSource,
  countFontFamily,
  labelFontFamily,
}: StatCardProps) {
  return (
    <View style={[styles.card, { backgroundColor }]}>
      {/* 🧮 เนื้อหา: ตัวเลขและชื่อ อยู่บนสุดเพื่อทับเลเยอร์วงกลม */}
      <View style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.count,
              { color: countColor, fontFamily: countFontFamily },
            ]}
          >
            {count}
          </Text>
          <Text
            style={[
              styles.label,
              { color: labelColor, fontFamily: labelFontFamily },
            ]}
          >
            {label}
          </Text>
        </View>
      </View>

      {/* 🎨 งานศิลป์มุมขวาบน: วงกลม 2 ชั้น + รูปไอเท็ม */}
      <View style={styles.cornerArt} pointerEvents="none">
        <View style={styles.circleOne} />
        <View style={styles.circleTwo} />
        <Image
          source={imageSource}
          style={styles.cornerImage}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

export default function StatsSection({
  dashboardSummary,
  primaryPurple,
}: StatsSectionProps) {
  const { t, language } = useI18n();
  const { getLocalizedFontFamily } = useFonts();
  const cardBackground = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");

  return (
    <View style={styles.statsSection}>
      {/* 📊 แถวสรุป 3 การ์ด: Active | Expiring soon | Expired */}
      <View style={styles.cardsRow}>
        {/* ✅ Active items */}
        <StatCard
          count={dashboardSummary?.active_count ?? 0}
          label={t("home.activeItems")}
          backgroundColor={cardBackground}
          countColor={primaryPurple}
          labelColor={textColor}
          imageSource={require("../../assets/images/home/all_good_item.png")}
          countFontFamily={getLocalizedFontFamily(language, "bold")}
          labelFontFamily={getLocalizedFontFamily(language, "medium")}
        />

        {/* ⏰ Expiring soon */}
        <StatCard
          count={dashboardSummary?.expiring_soon_count ?? 0}
          label={t("home.expiringSoon")}
          backgroundColor="#FFFFFF"
          countColor="#FFB020"
          labelColor="#4A4A4A"
          imageSource={require("../../assets/images/home/expired_soon_item.png")}
          countFontFamily={getLocalizedFontFamily(language, "bold")}
          labelFontFamily={getLocalizedFontFamily(language, "medium")}
        />

        {/* ⚠️ Expired */}
        <StatCard
          count={dashboardSummary?.expired_count ?? 0}
          label={t("home.expired")}
          backgroundColor="#FFFFFF"
          countColor="#D32F2F"
          labelColor="#4A4A4A"
          imageSource={require("../../assets/images/home/expired_item.png")}
          countFontFamily={getLocalizedFontFamily(language, "bold")}
          labelFontFamily={getLocalizedFontFamily(language, "medium")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsSection: { paddingVertical: 8 },
  cardsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
  },
  card: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 16,
    position: "relative",
    // 🪽 Shadow ตามสเปก: 0px 1px 2px 0px #0000001A
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    // 🧱 Border ตามสเปก: 1px solid #EEEBF0
    borderWidth: 1,
    borderColor: "#EEEBF0",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    zIndex: 2,
  },
  count: { fontSize: 24, marginBottom: 2 },
  label: { fontSize: 12 },
  cornerArt: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 64,
    height: 64,
    overflow: "hidden",
    // 🔲 ให้มุมบนขวาของกรอบ cornerArt โค้งเท่ากับการ์ด เพื่อไม่ให้เป็นขอบเหลี่ยม
    borderTopRightRadius: 16,
    zIndex: 1,
  },
  circleOne: {
    position: "absolute",
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: "#EFEFEF",
    top: -70,
    right: -64,
  },
  circleTwo: {
    position: "absolute",
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: "#E6E6E6",
    top: -100,
    right: -64,
  },
  cornerImage: {
    position: "absolute",
    width: 32,
    height: 32,
    top: 10,
    right: 10,
  },
});
