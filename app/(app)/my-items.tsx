import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useFonts } from "../../hooks/useFonts";
import { useThemeColor } from "../../hooks/useThemeColor";
import { apiClient, ProductItem } from "../../utils/api";
import { navigateBackGently, NavigationPresets } from "../../utils/navigation";
import { useI18n } from "../../contexts/I18nContext";

type FilterType = "all" | "active" | "expiring" | "expired" | "consumed" | "archived";

export default function MyItems() {
  const { isAuthenticated, hasCompletedOnboarding } = useAuth();
  const router = useRouter();
  const { colorScheme } = useTheme();
  const { fontsLoaded, getLocalizedFontFamily } = useFonts();
  const { language } = useI18n();

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  // Theme colors
  const backgroundColor = useThemeColor({}, "background");
  const cardBackground = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const subtitleColor = useThemeColor({}, "subtitleText");
  const borderColor = useThemeColor({}, "borderColor");
  const tintColor = useThemeColor({}, "tint");
  const dangerColor = useThemeColor({}, "dangerColor");
  const successColor = useThemeColor({}, "successColor");
  const warningColor = useThemeColor({}, "warningColor");

  // Helper functions
  const startOfToday = useCallback(() => {
    const d = new Date();
    d.setHours(0,0,0,0);
    return d;
  }, []);

  const isExpiringSoon = useCallback((item: ProductItem) => {
    if (!item.expected_expiry || item.status !== "active") return false;
    const today = startOfToday();
    const expiry = new Date(item.expected_expiry);
    expiry.setHours(0,0,0,0);
    const within7 = new Date(today);
    within7.setDate(within7.getDate() + 7);
    return expiry >= today && expiry <= within7;
  }, [startOfToday]);

  const fetchProducts = useCallback(async () => {
    if (!isAuthenticated || !hasCompletedOnboarding) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      Alert.alert("Error", "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, hasCompletedOnboarding]);

  useEffect(() => {
    if (isAuthenticated && hasCompletedOnboarding) {
      fetchProducts();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, hasCompletedOnboarding, fetchProducts]);

  const filterProducts = useCallback(() => {
    let filtered = products;

    // Apply filter type
    if (filter === "active") {
      filtered = filtered.filter((i) => i.status === "active");
    } else if (filter === "expired") {
      filtered = filtered.filter((i) => i.status === "expired" || (i.status === "active" && i.expected_expiry && new Date(i.expected_expiry) < startOfToday()));
    } else if (filter === "expiring") {
      filtered = filtered.filter((i) => isExpiringSoon(i));
    }

    // Apply search filter
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.category.name.toLowerCase().includes(q)
      );
    }

    // Sort: nearer expiry first, fallback name
    filtered.sort((a, b) => {
      const ea = a.expected_expiry ? new Date(a.expected_expiry).getTime() : Infinity;
      const eb = b.expected_expiry ? new Date(b.expected_expiry).getTime() : Infinity;
      if (ea !== eb) return ea - eb;
      return a.name.localeCompare(b.name);
    });

    setFilteredProducts(filtered);
  }, [products, searchText, filter, startOfToday, isExpiringSoon]);

  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchProducts();
    setIsRefreshing(false);
  }, [fetchProducts]);

  const getStatusColor = (item: ProductItem) => {
    if (item.status === "consumed") return successColor;
    if (item.status === "archived") return subtitleColor;

    if (item.expected_expiry && item.status === "active") {
      const today = new Date();
      const expiryDate = new Date(item.expected_expiry);
      const diffTime = expiryDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return dangerColor;
      if (diffDays <= 3) return warningColor;
    }

    return tintColor;
  };

  const formatDateBadge = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const getExpiryBadgeStyle = (item: ProductItem) => {
    if (!item.expected_expiry) return { bg: "#EBEEF1", fg: subtitleColor };
    const today = startOfToday();
    const expiry = new Date(item.expected_expiry);
    expiry.setHours(0,0,0,0);
    if (expiry < today) return { bg: "#FDECEF", fg: dangerColor }; // expired
    const soon = new Date(today);
    soon.setDate(soon.getDate() + 7);
    if (expiry <= soon) return { bg: "#FFF0D6", fg: "#F57C00" }; // expiring soon
    return { bg: "#E8F8EA", fg: "#2E7D32" }; // safe
  };

  const renderProduct = ({ item }: { item: ProductItem }) => {
    const badge = getExpiryBadgeStyle(item);
    return (
      <Pressable
        style={[styles.productCard, { backgroundColor: cardBackground, borderColor, }]}
        onPress={() => router.push(`/(app)/product-detail?id=${item.id}`)}
      >
        <View style={styles.productRow}>
          <View style={styles.productInfo}>
            <Text
              style={[
                styles.productName,
                { color: textColor, fontFamily: getLocalizedFontFamily(language, "medium") },
              ]}
            >
              {item.name}
            </Text>
            <Text
              style={[
                styles.productCategory,
                { color: subtitleColor, fontFamily: getLocalizedFontFamily(language, "regular") },
              ]}
            >
              {item.category.name}
            </Text>
            {item.expected_expiry && (
              <View style={[styles.expiryBadge, { backgroundColor: badge.bg }] }>
                <Ionicons name="calendar-outline" size={12} color={badge.fg} />
                <Text style={[styles.expiryText, { color: badge.fg, fontFamily: getLocalizedFontFamily(language, "medium") }]}>
                  {`Expiry : ${formatDateBadge(item.expected_expiry)}`}
                </Text>
              </View>
            )}
          </View>

          <Ionicons name="chevron-forward" size={20} color={subtitleColor} />
        </View>
      </Pressable>
    );
  };

  if (!fontsLoaded) {
    return null;
  }

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <StatusBar
          barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        />
        <View style={styles.centerContent}>
          <Ionicons name="cube-outline" size={48} color={tintColor} />
          <Text
            style={[
              styles.loadingText,
              {
                color: textColor,
                fontFamily: getLocalizedFontFamily(language, "medium"),
              },
            ]}
          >
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Counts for header and chips
  const counts = useMemo(() => {
    const total = products.length;
    const active = products.filter(p => p.status === 'active').length;
    const expiring = products.filter(p => isExpiringSoon(p)).length;
    return { total, active, expiring };
  }, [products]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />

      {/* 🧭 Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigateBackGently(NavigationPresets.gentle)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text
            style={[styles.headerTitle, { color: textColor, fontFamily: getLocalizedFontFamily(language, "semibold") }]}
          >
            My Items
          </Text>
          <Text
            style={[styles.headerSubtitle, { color: subtitleColor, fontFamily: getLocalizedFontFamily(language, "regular") }]}
          >
            {`${counts.total} items`}
          </Text>
        </View>
        <Pressable
          style={styles.addButton}
          onPress={() => router.push("/(app)/add-product")}
        >
          <Ionicons name="add" size={24} color={tintColor} />
        </Pressable>
      </View>

      {/* 🔎 Search + Sort */}
      <View style={styles.searchSection}>
        <View style={[styles.searchBar, { backgroundColor: cardBackground, borderColor }]}>
          <Ionicons name="search" size={18} color={subtitleColor} />
          <TextInput
            style={[styles.searchInput, { color: textColor, fontFamily: getLocalizedFontFamily(language, "regular") }]}
            placeholder="Search items"
            placeholderTextColor={subtitleColor}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <Pressable onPress={() => setSearchText("") }>
              <Ionicons name="close-circle" size={18} color={subtitleColor} />
            </Pressable>
          )}
        </View>
      </View>

      {/* 🧪 Filter chips */}
      <View style={styles.filtersRow}>
        <Pressable
          style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
          onPress={() => setFilter('all')}
        >
          <Ionicons name="apps-outline" size={14} color={filter === 'all' ? '#5F488B' : subtitleColor} />
          <Text style={[styles.filterText, { color: filter === 'all' ? '#5F488B' : subtitleColor, fontFamily: getLocalizedFontFamily(language, 'medium') }]}>
            {`All (${counts.total})`}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterChip, filter === 'active' && styles.filterChipActive]}
          onPress={() => setFilter('active')}
        >
          <Ionicons name="checkmark-circle-outline" size={14} color={filter === 'active' ? '#5F488B' : subtitleColor} />
          <Text style={[styles.filterText, { color: filter === 'active' ? '#5F488B' : subtitleColor, fontFamily: getLocalizedFontFamily(language, 'medium') }]}>
            {`Active (${counts.active})`}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterChip, filter === 'expiring' && styles.filterChipActive]}
          onPress={() => setFilter('expiring')}
        >
          <Ionicons name="time-outline" size={14} color={filter === 'expiring' ? '#5F488B' : subtitleColor} />
          <Text style={[styles.filterText, { color: filter === 'expiring' ? '#5F488B' : subtitleColor, fontFamily: getLocalizedFontFamily(language, 'medium') }]}>
            {`Expiring (${counts.expiring})`}
          </Text>
        </Pressable>
      </View>

      {/* Products List */}
      {filteredProducts.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="cube-outline" size={64} color={subtitleColor} />
          <Text style={[styles.emptyTitle, { color: textColor }]}>
            {searchText ? "No items found" : "No items yet"}
          </Text>
          <Text style={[styles.emptySubtitle, { color: subtitleColor }]}>
            {searchText
              ? "Try adjusting your search"
              : "Add your first item to start tracking"}
          </Text>
          {!searchText && (
            <Pressable
              style={[styles.emptyButton, { backgroundColor: tintColor }]}
              onPress={() => router.push("/(app)/add-product")}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.emptyButtonText}>Add First Item</Text>
            </Pressable>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          style={styles.productsList}
          contentContainerStyle={styles.productsListContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={tintColor}
            />
          }
          removeClippedSubviews={true}
          maxToRenderPerBatch={15}
          updateCellsBatchingPeriod={50}
          windowSize={10}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "600",
  },
  headerSubtitle: { fontSize: 12, marginTop: 4 },
  addButton: {
    padding: 8,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 12,
    textAlign: "center",
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    paddingTop: 8,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    // Shadow 0px 1px 2px 0px #0000001A
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEEBF0',
    backgroundColor: '#FFFFFF',
  },
  filterChipActive: {
    backgroundColor: '#F4EEFF',
    borderColor: '#E3DAF7',
  },
  filterText: { fontSize: 12 },
  productsList: {
    flex: 1,
  },
  productsListContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  productCard: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    // unified card spec
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  productInfo: {
    flex: 1,
    gap: 6,
  },
  productName: {
    fontSize: 16,
    fontWeight: "500",
  },
  productCategory: {
    fontSize: 14,
    opacity: 0.7,
  },
  expiryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  expiryText: { fontSize: 12 },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  emptyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
