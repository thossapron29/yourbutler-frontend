import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useThemeColor } from "../../hooks/useThemeColor";
import { Category, ProductItem, apiClient } from "../../utils/api";
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

const statusOptions = [
  { key: 'active', label: 'Active', icon: 'checkmark-circle-outline' as const },
  { key: 'consumed', label: 'Consumed', icon: 'checkmark-done-outline' as const },
  { key: 'expired', label: 'Expired', icon: 'alert-circle-outline' as const },
  { key: 'archived', label: 'Archived', icon: 'archive-outline' as const },
];

export default function EditProduct() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form data
  const [productName, setProductName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("other");
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Theme colors
  const backgroundColor = useThemeColor({}, "background");
  const cardBackground = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const subtitleColor = useThemeColor({}, "subtitleText");
  const borderColor = useThemeColor({}, "borderColor");
  const tintColor = useThemeColor({}, "tint");
  const dangerColor = useThemeColor({}, "dangerColor");
  const successColor = useThemeColor({}, "successColor");

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      const product = await apiClient.getProductById(productId);
      
      // Populate form with existing data
      setProductName(product.name);
      setSelectedCategory(product.category.id);
      setSelectedStatus(product.status);
      setNotes(product.notes || "");
      
      if (product.expected_expiry) {
        setExpiryDate(new Date(product.expected_expiry));
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
      Alert.alert("Error", "Failed to load product details");
      navigateBackGently(NavigationPresets.gentle);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!productName.trim()) {
      Alert.alert("Error", "Please enter a product name");
      return;
    }

    if (!id) {
      Alert.alert("Error", "Product ID not found");
      return;
    }

    setIsSaving(true);
    try {
      const updateData = {
        name: productName.trim(),
        category_id: selectedCategory,
        status: selectedStatus,
        expected_expiry: expiryDate ? expiryDate.toISOString().split('T')[0] : undefined,
        notes: notes.trim() || undefined,
      };

      await apiClient.updateProduct(id, updateData);

      Alert.alert("Success", "Product updated successfully", [
        {
          text: "OK",
          onPress: () => navigateBackGently(NavigationPresets.gentle),
        },
      ]);
    } catch (error) {
      console.error("Failed to update product:", error);
      Alert.alert("Error", "Failed to update product");
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setExpiryDate(selectedDate);
    }
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: cardBackground, borderBottomColor: borderColor }]}>
        <Pressable style={styles.backButton} onPress={() => navigateBackGently(NavigationPresets.gentle)}>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: textColor }]}>
          Edit Product
        </Text>
        <Pressable
          style={[styles.saveButton, { backgroundColor: tintColor }]}
          onPress={handleUpdateProduct}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? "Saving..." : "Save"}
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Product Name */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Product Name
          </Text>
          <TextInput
            style={[
              styles.textInput,
              { backgroundColor: cardBackground, borderColor, color: textColor },
            ]}
            placeholder="Enter product name"
            placeholderTextColor={subtitleColor}
            value={productName}
            onChangeText={setProductName}
          />
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Category
          </Text>
          <View style={styles.categoriesGrid}>
            {Object.entries(categoryIcons).map(([key, icon]) => (
              <Pressable
                key={key}
                style={[
                  styles.categoryCard,
                  { backgroundColor: cardBackground, borderColor },
                  selectedCategory === key && {
                    backgroundColor: tintColor + "15",
                    borderColor: tintColor,
                  },
                ]}
                onPress={() => setSelectedCategory(key)}
              >
                <Ionicons
                  name={icon}
                  size={24}
                  color={selectedCategory === key ? tintColor : subtitleColor}
                />
                <Text
                  style={[
                    styles.categoryLabel,
                    {
                      color: selectedCategory === key ? tintColor : textColor,
                    },
                  ]}
                >
                  {categoryLabels[key]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Status Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Status
          </Text>
          <View style={styles.statusGrid}>
            {statusOptions.map((status) => (
              <Pressable
                key={status.key}
                style={[
                  styles.statusCard,
                  { backgroundColor: cardBackground, borderColor },
                  selectedStatus === status.key && {
                    backgroundColor: tintColor + "15",
                    borderColor: tintColor,
                  },
                ]}
                onPress={() => setSelectedStatus(status.key)}
              >
                <Ionicons
                  name={status.icon}
                  size={20}
                  color={selectedStatus === status.key ? tintColor : subtitleColor}
                />
                <Text
                  style={[
                    styles.statusLabel,
                    {
                      color: selectedStatus === status.key ? tintColor : textColor,
                    },
                  ]}
                >
                  {status.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Expiry Date */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Expiry Date (Optional)
          </Text>
          <Pressable
            style={[
              styles.dateButton,
              { backgroundColor: cardBackground, borderColor },
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color={subtitleColor} />
            <Text style={[styles.dateButtonText, { color: textColor }]}>
              {expiryDate ? formatDate(expiryDate) : "Select expiry date"}
            </Text>
            {expiryDate && (
              <Pressable
                style={styles.clearDateButton}
                onPress={() => setExpiryDate(null)}
              >
                <Ionicons name="close-circle" size={20} color={subtitleColor} />
              </Pressable>
            )}
          </Pressable>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Notes (Optional)
          </Text>
          <TextInput
            style={[
              styles.textArea,
              { backgroundColor: cardBackground, borderColor, color: textColor },
            ]}
            placeholder="Add any notes about this product..."
            placeholderTextColor={subtitleColor}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={expiryDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={new Date()}
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
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    minHeight: 80,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryCard: {
    width: "48%",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  statusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statusCard: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  dateButtonText: {
    fontSize: 16,
    flex: 1,
  },
  clearDateButton: {
    padding: 4,
  },
  bottomPadding: {
    height: 20,
  },
});
