import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { useFonts } from "../../hooks/useFonts";
import { useThemeColor } from "../../hooks/useThemeColor";
import { apiClient, ProductItem } from "../../utils/api";
import { navigateBackGently, NavigationPresets } from "../../utils/navigation";

type FilterType = "all" | "active" | "expired" | "consumed" | "archived";

export default function MyItems() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const { fontsLoaded, getFontFamily } = useFonts();

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");

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

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchText]);

  const fetchProducts = async () => {
    try {
      const response = await apiClient.getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      Alert.alert("Error", "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchProducts();
    setIsRefreshing(false);
  }, []);

  const filterProducts = () => {
    let filtered = products;

    // Apply search filter
    if (searchText.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.category.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Simple sort by name
    filtered.sort((a, b) => a.name.localeCompare(b.name));

    setFilteredProducts(filtered);
  };

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getDaysLeft = (item: ProductItem) => {
    if (!item.expected_expiry || item.status !== "active") return null;

    const today = new Date();
    const expiryDate = new Date(item.expected_expiry);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `${Math.abs(diffDays)}d ago`;
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return `${diffDays}d`;
  };

  const renderProduct = ({ item }: { item: ProductItem }) => {
    const daysLeft = getDaysLeft(item);

    return (
      <Pressable
        style={[styles.productCard, { backgroundColor: cardBackground }]}
        onPress={() => router.push(`/(app)/product-detail?id=${item.id}`)}
      >
        <View style={styles.productRow}>
          <View style={styles.productInfo}>
            <Text
              style={[
                styles.productName,
                {
                  color: textColor,
                  fontFamily: getFontFamily("medium"),
                },
              ]}
            >
              {item.name}
            </Text>
            <Text
              style={[
                styles.productCategory,
                {
                  color: subtitleColor,
                  fontFamily: getFontFamily("regular"),
                },
              ]}
            >
              {item.category.name}
            </Text>
          </View>

          <View style={styles.productMeta}>
            {daysLeft && (
              <Text
                style={[
                  styles.daysLeft,
                  {
                    color: getStatusColor(item),
                    fontFamily: getFontFamily("medium"),
                  },
                ]}
              >
                {daysLeft}
              </Text>
            )}
            <View
              style={[
                styles.statusDot,
                { backgroundColor: getStatusColor(item) },
              ]}
            />
          </View>
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
                fontFamily: getFontFamily("medium"),
              },
            ]}
          >
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />

      {/* Minimal Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigateBackGently(NavigationPresets.gentle)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </Pressable>
        
        <Text
          style={[
            styles.headerTitle,
            {
              color: textColor,
              fontFamily: getFontFamily("semibold"),
            },
          ]}
        >
          My Items
        </Text>
        <Pressable
          style={styles.addButton}
          onPress={() => router.push("/(app)/add-product")}
        >
          <Ionicons name="add" size={24} color={tintColor} />
        </Pressable>
      </View>

      {/* Simple Search */}
      {searchText.length > 0 || filteredProducts.length > 8 ? (
        <View style={styles.searchSection}>
          <View
            style={[
              styles.searchBar,
              { backgroundColor: cardBackground, borderColor },
            ]}
          >
            <Ionicons name="search" size={18} color={subtitleColor} />
            <TextInput
              style={[styles.searchInput, { color: textColor }]}
              placeholder="Search..."
              placeholderTextColor={subtitleColor}
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText.length > 0 && (
              <Pressable onPress={() => setSearchText("")}>
                <Ionicons name="close-circle" size={18} color={subtitleColor} />
              </Pressable>
            )}
          </View>
        </View>
      ) : null}

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
    paddingVertical: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
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
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  productsList: {
    flex: 1,
  },
  productsListContent: {
    paddingHorizontal: 20,
  },
  productCard: {
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#00000010",
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  productInfo: {
    flex: 1,
    gap: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: "500",
  },
  productCategory: {
    fontSize: 14,
    opacity: 0.7,
  },
  productMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  daysLeft: {
    fontSize: 12,
    fontWeight: "500",
    minWidth: 40,
    textAlign: "right",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
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
