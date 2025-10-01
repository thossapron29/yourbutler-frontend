import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ExpiringItemsSection from "../../components/home/ExpiringItemsSection";
import HeaderSection from "../../components/home/HeaderSection";
import QuickAddSection from "../../components/home/QuickAddSection";
import StatsSection from "../../components/home/StatsSection";
import SummaryBanner from "../../components/home/SummaryBanner";
import MarkAsPurchasedModal from "../../components/MarkAsPurchasedModal";
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
  const { t } = useI18n();
  const { fontsLoaded } = useFonts();

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

  // Theme colors - Using available colors with soft approach
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  // Define our soft color palette with better contrast
  const primaryPurple = "#5F488B"; // From color palette

  // Simple greeting
  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return t("home.greetings.morning");
    if (hour < 17) return t("home.greetings.afternoon");
    if (hour < 21) return t("home.greetings.evening");
    return t("home.greetings.night");
  }, [t]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [summaryResponse, expiringResponse] = await Promise.all([
        apiClient.getDashboardSummary(),
        apiClient.getExpiringProducts(1, 10),
      ]);

      setDashboardSummary(summaryResponse);
      setExpiringItems(expiringResponse.data);
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
  }, []);

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
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.centerContent}>
          <Text style={[styles.loadingText, { color: textColor }]}>
            {t("common.loading")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
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

          {/* Summary Banner */}
          <SummaryBanner
            hasExpiringItems={expiringItems?.length > 0}
            expiringCount={expiringItems?.length}
            primaryPurple={primaryPurple}
          />

          {/* Stats Dashboard */}
          <StatsSection
            dashboardSummary={dashboardSummary}
            primaryPurple={primaryPurple}
          />

          {/* Expiring Items */}
          <ExpiringItemsSection
            expiringItems={expiringItems}
            onMarkAsPurchased={handleMarkAsPurchased}
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
        style={[styles.floatingButton, { backgroundColor: primaryPurple }]}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContent: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollView: { flex: 1 },
  loadingText: { fontSize: 16 },
  floatingButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
