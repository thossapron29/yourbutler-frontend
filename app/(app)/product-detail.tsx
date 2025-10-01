import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useThemeColor } from "../../hooks/useThemeColor";
import { ProductItem, apiClient } from "../../utils/api";
import { navigateBackGently, NavigationPresets } from "../../utils/navigation";

const categoryIcons: { [key: string]: keyof typeof Ionicons.glyphMap } = {
  "fresh-produce": "leaf-outline",
  "dairy": "cafe-outline",
  "meat-seafood": "fish-outline",
  "pantry": "library-outline",
  "frozen": "snow-outline",
  "beverages": "wine-outline",
  "snacks": "fast-food-outline",
  "health-beauty": "heart-outline",
  "household": "home-outline",
  "other": "cube-outline"
};

const categoryLabels: { [key: string]: string } = {
  "fresh-produce": "Fresh Produce",
  "dairy": "Dairy & Eggs",
  "meat-seafood": "Meat & Seafood",
  "pantry": "Pantry Items",
  "frozen": "Frozen Foods",
  "beverages": "Beverages",
  "snacks": "Snacks & Treats",
  "health-beauty": "Health & Beauty",
  "household": "Household Items",
  "other": "Other"
};

const statusConfig = {
  'active': { label: 'Active', icon: 'checkmark-circle-outline' as const, color: '#10B981' },
  'consumed': { label: 'Consumed', icon: 'checkmark-done-outline' as const, color: '#059669' },
  'expired': { label: 'Expired', icon: 'alert-circle-outline' as const, color: '#EF4444' },
  'archived': { label: 'Archived', icon: 'archive-outline' as const, color: '#6B7280' },
};

export default function ProductDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      const product = await apiClient.getProductById(productId);
      setProduct(product);
    } catch (error) {
      console.error("Failed to fetch product:", error);
      Alert.alert("Error", "Failed to load product details");
      navigateBackGently(NavigationPresets.gentle);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!product) return;

    try {
      const updatedProduct = await apiClient.updateProduct(product.id, { status: newStatus });
      // Update local state
      setProduct({ ...product, status: newStatus });
      Alert.alert("Success", "Product status updated");
    } catch (error) {
      console.error("Failed to update product:", error);
      Alert.alert("Error", "Failed to update product status");
    }
  };

  const handleDeleteProduct = async () => {
    if (!product) return;

    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await apiClient.deleteProduct(product.id);
              Alert.alert("Success", "Product deleted", [
                {
                  text: "OK",
                  onPress: () => navigateBackGently(NavigationPresets.gentle),
                },
              ]);
            } catch (error) {
              console.error("Failed to delete product:", error);
              Alert.alert("Error", "Failed to delete product");
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getExpiryStatus = () => {
    if (!product?.expected_expiry || product.status !== 'active') return null;
    
    const today = new Date();
    const expiryDate = new Date(product.expected_expiry);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { 
        text: `Expired ${Math.abs(diffDays)} days ago`, 
        color: dangerColor,
        icon: 'alert-circle' as const
      };
    }
    if (diffDays === 0) {
      return { 
        text: 'Expires today', 
        color: dangerColor,
        icon: 'alert-circle' as const
      };
    }
    if (diffDays === 1) {
      return { 
        text: 'Expires tomorrow', 
        color: warningColor,
        icon: 'warning' as const
      };
    }
    if (diffDays <= 3) {
      return { 
        text: `${diffDays} days left`, 
        color: warningColor,
        icon: 'time' as const
      };
    }
    
    return { 
      text: `${diffDays} days left`, 
      color: successColor,
      icon: 'checkmark-circle' as const
    };
  };

  const renderStatusActions = () => {
    if (!product) return null;

    const availableActions = [];
    
    if (product.status === 'active') {
      availableActions.push(
        { key: 'consumed', label: 'Mark as Consumed', icon: 'checkmark-done', color: successColor },
        { key: 'archived', label: 'Archive', icon: 'archive', color: subtitleColor }
      );
    } else if (product.status === 'consumed') {
      availableActions.push(
        { key: 'active', label: 'Mark as Active', icon: 'checkmark-circle', color: tintColor },
        { key: 'archived', label: 'Archive', icon: 'archive', color: subtitleColor }
      );
    } else if (product.status === 'archived') {
      availableActions.push(
        { key: 'active', label: 'Restore to Active', icon: 'checkmark-circle', color: tintColor }
      );
    }

    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          Quick Actions
        </Text>
        <View style={styles.actionsGrid}>
          {availableActions.map((action) => (
            <Pressable
              key={action.key}
              style={[styles.actionButton, { backgroundColor: cardBackground, borderColor }]}
              onPress={() => handleStatusUpdate(action.key)}
            >
              <Ionicons name={action.icon as any} size={20} color={action.color} />
              <Text style={[styles.actionButtonText, { color: textColor }]}>
                {action.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.centerContent}>
          <Text style={{ color: textColor }}>Loading product...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.centerContent}>
          <Text style={{ color: textColor }}>Product not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const expiryStatus = getExpiryStatus();
  const statusInfo = statusConfig[product.status as keyof typeof statusConfig];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: cardBackground, borderBottomColor: borderColor }]}>
        <Pressable style={styles.backButton} onPress={() => navigateBackGently(NavigationPresets.gentle)}>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: textColor }]}>
          Product Details
        </Text>
        <Pressable
          style={styles.editButton}
          onPress={() => router.push(`/(app)/edit-product?id=${product.id}`)}
        >
          <Ionicons name="create-outline" size={24} color={tintColor} />
        </Pressable>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Product Header */}
        <View style={[styles.productHeader, { backgroundColor: cardBackground }]}>
          <View style={styles.productHeaderContent}>
            <Ionicons
              name={categoryIcons[product.category.id] || "cube-outline"}
              size={48}
              color={tintColor}
            />
            <View style={styles.productHeaderText}>
              <Text style={[styles.productName, { color: textColor }]}>
                {product.name}
              </Text>
              <Text style={[styles.productCategory, { color: subtitleColor }]}>
                {categoryLabels[product.category.id] || "Other"}
              </Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + "15" }]}>
            <Ionicons name={statusInfo.icon} size={16} color={statusInfo.color} />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.label}
            </Text>
          </View>
        </View>

        {/* Expiry Status */}
        {expiryStatus && (
          <View style={[styles.expiryAlert, { backgroundColor: expiryStatus.color + "15" }]}>
            <Ionicons name={expiryStatus.icon} size={20} color={expiryStatus.color} />
            <Text style={[styles.expiryAlertText, { color: expiryStatus.color }]}>
              {expiryStatus.text}
            </Text>
          </View>
        )}

        {/* Product Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Information
          </Text>
          <View style={[styles.infoCard, { backgroundColor: cardBackground, borderColor }]}>
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="library-outline" size={20} color={subtitleColor} />
                <Text style={[styles.infoLabelText, { color: subtitleColor }]}>
                  Category
                </Text>
              </View>
              <Text style={[styles.infoValue, { color: textColor }]}>
                {categoryLabels[product.category.id] || "Other"}
              </Text>
            </View>

            {product.expected_expiry && (
              <View style={styles.infoRow}>
                <View style={styles.infoLabel}>
                  <Ionicons name="calendar-outline" size={20} color={subtitleColor} />
                  <Text style={[styles.infoLabelText, { color: subtitleColor }]}>
                    Expiry Date
                  </Text>
                </View>
                <Text style={[styles.infoValue, { color: textColor }]}>
                  {formatDate(product.expected_expiry)}
                </Text>
              </View>
            )}

            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="flag-outline" size={20} color={subtitleColor} />
                <Text style={[styles.infoLabelText, { color: subtitleColor }]}>
                  Status
                </Text>
              </View>
              <View style={styles.statusInline}>
                <Ionicons name={statusInfo.icon} size={16} color={statusInfo.color} />
                <Text style={[styles.infoValue, { color: statusInfo.color }]}>
                  {statusInfo.label}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="time-outline" size={20} color={subtitleColor} />
                <Text style={[styles.infoLabelText, { color: subtitleColor }]}>
                  Product ID
                </Text>
              </View>
              <Text style={[styles.infoValue, { color: textColor }]}>
                {product.id}
              </Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {product.notes && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Notes
            </Text>
            <View style={[styles.notesCard, { backgroundColor: cardBackground, borderColor }]}>
              <Text style={[styles.notesText, { color: textColor }]}>
                {product.notes}
              </Text>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        {renderStatusActions()}

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Danger Zone
          </Text>
          <Pressable
            style={[styles.dangerButton, { backgroundColor: dangerColor + "15", borderColor: dangerColor }]}
            onPress={handleDeleteProduct}
          >
            <Ionicons name="trash-outline" size={20} color={dangerColor} />
            <Text style={[styles.dangerButtonText, { color: dangerColor }]}>
              Delete Product
            </Text>
          </Pressable>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  editButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  productHeader: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  productHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  productHeaderText: {
    flex: 1,
    marginLeft: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 16,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  expiryAlert: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  expiryAlertText: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  infoCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  infoLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoLabelText: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  statusInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  notesCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  notesText: {
    fontSize: 16,
    lineHeight: 24,
  },
  actionsGrid: {
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  bottomPadding: {
    height: 20,
  },
});
