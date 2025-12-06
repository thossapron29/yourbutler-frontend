import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderSection from "../../components/home/HeaderSection";
import QuickAddSection from "../../components/home/QuickAddSection";
import StatsSection from "../../components/home/StatsSection";
import SummaryBanner from "../../components/home/SummaryBanner";
import MarkAsPurchasedModal from "../../components/MarkAsPurchasedModal";
import {
  BorderRadius,
  ColorPalette,
  Shadows,
  Spacing,
  Typography,
} from "../../constants/DesignSystem";
import { useAuth } from "../../contexts/AuthContext";
import { useI18n } from "../../contexts/I18nContext";
import { useFonts } from "../../hooks/useFonts";
import {
  TransitionPresets,
  usePageTransition,
} from "../../hooks/usePageTransition";
import { useThemeColor } from "../../hooks/useThemeColor";
import { apiClient, DashboardSummary, ExpiringProduct } from "../../utils/api";
import { navigateGently, NavigationPresets } from "../../utils/navigation";

// Category icons mapping for quick add
type IconName = keyof typeof Ionicons.glyphMap;

const categoryIcons: Record<string, IconName> = {
  Pantry: "fast-food-outline",
  Fresh: "nutrition-outline",
  Personal: "brush-outline",
  Beauty: "rose-outline",
  Laundry: "shirt-outline",
  Household: "document-outline",
};

export default function Home() {
  const { isAuthenticated, hasCompletedOnboarding } = useAuth();
  const { t, language } = useI18n();
  const { fontsLoaded, getLocalizedFontFamily } = useFonts();

  const [dashboardSummary, setDashboardSummary] =
    useState<DashboardSummary | null>(null);
  const [expiringItems, setExpiringItems] = useState<ExpiringProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mark as Purchased Modal
  const [markModalVisible, setMarkModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Use gentle page transition hook
  const { animatedStyle } = usePageTransition(TransitionPresets.page);

  // Theme colors
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const primaryPurple = ColorPalette.purple[500];

  // Simple greeting
  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return t("home.greetings.morning");
    if (hour < 17) return t("home.greetings.afternoon");
    if (hour < 21) return t("home.greetings.evening");
    return t("home.greetings.night");
  }, [t]);

  useEffect(() => {
    // Only fetch data if user is authenticated and completed onboarding
    if (isAuthenticated && hasCompletedOnboarding) {
      fetchDashboardData();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, hasCompletedOnboarding]);

  const fetchDashboardData = useCallback(async () => {
    // Double check authentication before making API calls
    if (!isAuthenticated || !hasCompletedOnboarding) {
      setIsLoading(false);
      return;
    }

    try {
      const [summaryResponse, expiringResponse] = await Promise.all([
        apiClient.getDashboardSummary(),
        apiClient.getExpiringProducts(1, 10),
      ]);

  setDashboardSummary(summaryResponse);
  setExpiringItems(expiringResponse.items || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load dashboard data";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, hasCompletedOnboarding]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchDashboardData();
    setIsRefreshing(false);
  }, [fetchDashboardData]);

  const handleMarkAsPurchased = useCallback((id: string, name: string) => {
    setSelectedProduct({ id, name });
    setMarkModalVisible(true);
  }, []);

  if (!fontsLoaded || isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor }]}
        edges={["top", "left", "right"]}
      >
        <View style={styles.centerContent}>
          <Text
            style={[
              styles.loadingText,
              { color: textColor, fontFamily: getLocalizedFontFamily(language, "medium") },
            ]}
          >
            {t("common.loading")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={primaryPurple}
            colors={[primaryPurple]}
            progressBackgroundColor="#F8F7FF"
            titleColor={primaryPurple}
            title={isRefreshing ? t("common.refreshing") : ""}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={animatedStyle}>
          {/* Header */}
          <HeaderSection greeting={getGreeting()} />

          <View style={{ marginTop: -Math.round(193 * 0.3) }}>
            <SummaryBanner
              hasExpiringItems={
                (dashboardSummary?.expiring_soon_count || 0) > 0
              }
              expiringCount={dashboardSummary?.expiring_soon_count || 0}
              expiredCount={dashboardSummary?.expired_count || 0}
            />
          </View>

          {/* Stats summary: Active, Expiring soon, Expired */}
          <StatsSection
            dashboardSummary={dashboardSummary}
            primaryPurple={primaryPurple}
          />

          {/* Quick Add */}
          <QuickAddSection
            categoryIcons={categoryIcons}
            primaryPurple={primaryPurple}
          />

          <View style={{ height: 100 }} />
        </Animated.View>
      </ScrollView>

      {/* Floating Add Button */}
      <Pressable
        style={({ pressed }) => [
          styles.floatingButton,
          { backgroundColor: primaryPurple },
          pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
        ]}
        onPress={() =>
          navigateGently("/(app)/add-product", NavigationPresets.gentle)
        }
      >
        <Ionicons name="add" size={24} color="#fff" />
      </Pressable>

      {/* Mark as Purchased Modal */}
      {selectedProduct && (
        <MarkAsPurchasedModal
          visible={markModalVisible}
          onClose={() => {
            setMarkModalVisible(false);
            setSelectedProduct(null);
          }}
          onSuccess={() => {
            handleRefresh();
          }}
          productId={selectedProduct.id}
          productName={selectedProduct.name}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContent: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollView: { flex: 1 },
  loadingText: { 
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.medium as any,
  },
  floatingButton: {
    position: "absolute",
    bottom: Spacing[6],
    right: Spacing[6],
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.sm,
  },
});
