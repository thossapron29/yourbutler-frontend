import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { useI18n } from "../../contexts/I18nContext";
import { useFonts } from "../../hooks/useFonts";
import { useThemeColor } from "../../hooks/useThemeColor";
import { DashboardSummary } from "../../utils/api";

interface StatsSectionProps {
  dashboardSummary: DashboardSummary | null;
  primaryPurple: string;
}

export default function StatsSection({
  dashboardSummary,
  primaryPurple,
}: StatsSectionProps) {
  const { t } = useI18n();
  const { getFontFamily } = useFonts();
  const cardBackground = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");

  return (
    <View style={styles.statsSection}>
      {/* Primary Stat - Most Important */}
      {(dashboardSummary?.expiring_soon_count || 0) > 0 && (
        <View style={[styles.primaryStatCard, { backgroundColor: "#FF9500" }]}>
          <View style={styles.primaryStatContent}>
            <View style={styles.primaryStatIcon}>
              <Ionicons name="warning" size={24} color="#fff" />
            </View>
            <View style={styles.primaryStatText}>
              <Text
                style={[
                  styles.primaryStatNumber,
                  { fontFamily: getFontFamily("bold") },
                ]}
              >
                {dashboardSummary?.expiring_soon_count}
              </Text>
              <Text
                style={[
                  styles.primaryStatLabel,
                  { fontFamily: getFontFamily("medium") },
                ]}
              >
                {t("home.expiringSoon")}
              </Text>
              <Text
                style={[
                  styles.primaryStatSubtext,
                  { fontFamily: getFontFamily("regular") },
                ]}
              >
                Needs attention
              </Text>
            </View>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color="#fff"
            opacity={0.7}
          />
        </View>
      )}

      {/* Secondary Stats Grid */}
      <View style={styles.secondaryStatsGrid}>
        <View
          style={[
            styles.secondaryStatCard,
            { backgroundColor: cardBackground },
          ]}
        >
          <Text
            style={[
              styles.secondaryStatNumber,
              { color: primaryPurple, fontFamily: getFontFamily("bold") },
            ]}
          >
            {dashboardSummary?.active_count || 0}
          </Text>
          <Text
            style={[
              styles.secondaryStatLabel,
              { color: textColor, fontFamily: getFontFamily("medium") },
            ]}
          >
            {t("home.activeItems")}
          </Text>
        </View>

        <View
          style={[
            styles.secondaryStatCard,
            {
              backgroundColor: "#FFF3E0",
              borderColor: "#FFE0B2",
              borderWidth: 1,
            },
          ]}
        >
          <Text
            style={[
              styles.secondaryStatNumber,
              { color: "#F57C00", fontFamily: getFontFamily("bold") },
            ]}
          >
            {dashboardSummary?.expiring_soon_count || 0}
          </Text>
          <Text
            style={[
              styles.secondaryStatLabel,
              { color: "#F57C00", fontFamily: getFontFamily("medium") },
            ]}
          >
            {t("home.expiringSoon")}
          </Text>
        </View>

        {(dashboardSummary?.expired_count || 0) > 0 && (
          <View
            style={[
              styles.secondaryStatCard,
              styles.expiredCard,
              { backgroundColor: "#FFEBEE", borderColor: "#FFCDD2" },
            ]}
          >
            <Text
              style={[
                styles.secondaryStatNumber,
                { color: "#D32F2F", fontFamily: getFontFamily("bold") },
              ]}
            >
              {dashboardSummary?.expired_count}
            </Text>
            <Text
              style={[
                styles.secondaryStatLabel,
                { color: "#D32F2F", fontFamily: getFontFamily("medium") },
              ]}
            >
              {t("home.expired")}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsSection: { paddingVertical: 16 },
  primaryStatCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryStatContent: { flexDirection: "row", alignItems: "center", flex: 1 },
  primaryStatIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  primaryStatText: { flex: 1 },
  primaryStatNumber: { fontSize: 28, color: "#fff", marginBottom: 2 },
  primaryStatLabel: { fontSize: 16, color: "#fff", marginBottom: 2 },
  primaryStatSubtext: { fontSize: 12, color: "rgba(255,255,255,0.8)" },
  secondaryStatsGrid: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
  },
  secondaryStatCard: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  expiredCard: { borderWidth: 1 },
  secondaryStatNumber: { fontSize: 20, marginBottom: 4 },
  secondaryStatLabel: { fontSize: 11, textAlign: "center" },
});
