import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { useThemeColor } from "../../hooks/useThemeColor";
import { apiClient, Category, Preset } from "../../utils/api";
import { navigateBackGently, NavigationPresets } from "../../utils/navigation";

// Category icons mapping - using minimal Ionicons
const categoryIcons: Record<string, any> = {
  Pantry: "fast-food-outline", // 🥫 Canned food - dry food, snacks, condiments, grains, cereal
  Fresh: "nutrition-outline", // 🥦 Broccoli - meat, vegetables, fruits, refrigerated or frozen items
  Personal: "brush-outline", // 🪥 Toothbrush - shampoo, soap, toothpaste, deodorant, sanitary items
  Beauty: "rose-outline", // 💄 Lipstick - skincare, makeup, hair treatments
  Laundry: "shirt-outline", // 🧺 Laundry basket - detergent, fabric softener, laundry pods or powders
  Household: "document-outline", // 🧻 Roll of paper - toilet paper, trash bags, dish soap, cleaning sprays
};

// Unit Picker Overlay Component

// Date Picker Overlay Component
interface DatePickerOverlayProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onClose: () => void;
}

const DatePickerOverlay: React.FC<DatePickerOverlayProps> = ({
  selectedDate,
  onDateSelect,
  onClose,
}) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isDisabled = date < today;

      days.push({
        date,
        day,
        isDisabled,
        isSelected:
          selectedDate &&
          date.getDate() === selectedDate.getDate() &&
          date.getMonth() === selectedDate.getMonth() &&
          date.getFullYear() === selectedDate.getFullYear(),
        isToday: date.toDateString() === new Date().toDateString(),
      });
    }

    return days;
  };

  const handleDatePress = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return;
    onDateSelect(date);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={true}
      onRequestClose={onClose}
    >
      <View style={overlayStyles.overlay}>
        <View style={overlayStyles.container}>
          <View style={overlayStyles.header}>
            <Text style={overlayStyles.title}>Select Date</Text>
            <Pressable style={overlayStyles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </Pressable>
          </View>

          <View style={overlayStyles.monthNavigation}>
            <Pressable
              style={overlayStyles.navButton}
              onPress={goToPreviousMonth}
            >
              <Ionicons name="chevron-back" size={24} color="#333" />
            </Pressable>

            <Text style={overlayStyles.monthYear}>
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </Text>

            <Pressable style={overlayStyles.navButton} onPress={goToNextMonth}>
              <Ionicons name="chevron-forward" size={24} color="#333" />
            </Pressable>
          </View>

          <View style={overlayStyles.calendar}>
            {/* Weekday headers */}
            <View style={overlayStyles.weekdayHeader}>
              {weekdays.map((weekday) => (
                <View key={weekday} style={overlayStyles.weekdayCell}>
                  <Text style={overlayStyles.weekdayText}>{weekday}</Text>
                </View>
              ))}
            </View>

            {/* Calendar grid */}
            <View style={overlayStyles.calendarGrid}>
              {days.map((dayData, index) => (
                <View key={index} style={overlayStyles.dayCell}>
                  {dayData && (
                    <Pressable
                      style={[
                        overlayStyles.dayButton,
                        dayData.isSelected && overlayStyles.selectedDay,
                        dayData.isToday &&
                          !dayData.isSelected &&
                          overlayStyles.todayDay,
                        dayData.isDisabled && overlayStyles.disabledDay,
                      ]}
                      onPress={() =>
                        !dayData.isDisabled && handleDatePress(dayData.date)
                      }
                      disabled={dayData.isDisabled}
                    >
                      <Text
                        style={[
                          overlayStyles.dayText,
                          dayData.isSelected && overlayStyles.selectedDayText,
                          dayData.isToday &&
                            !dayData.isSelected &&
                            overlayStyles.todayDayText,
                          dayData.isDisabled && overlayStyles.disabledDayText,
                        ]}
                      >
                        {dayData.day}
                      </Text>
                    </Pressable>
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const overlayStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  monthNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  navButton: {
    padding: 8,
  },
  monthYear: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    minWidth: 150,
    textAlign: "center",
  },
  calendar: {
    marginBottom: 20,
  },
  weekdayHeader: {
    flexDirection: "row",
    marginBottom: 10,
  },
  weekdayCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.285714285714286%", // 1/7
    aspectRatio: 1,
    padding: 2,
  },
  dayButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  selectedDay: {
    backgroundColor: "#007AFF",
  },
  todayDay: {
    backgroundColor: "#E3F2FD",
  },
  disabledDay: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: 14,
    color: "#333",
  },
  selectedDayText: {
    color: "white",
    fontWeight: "600",
  },
  todayDayText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  disabledDayText: {
    color: "#ccc",
  },
});

export default function AddProduct() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isFirstProduct = params.first === "true";
  const { colorScheme } = useTheme(); // เพิ่มการใช้ theme context

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [presets, setPresets] = useState<Preset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
  const [loadingPresets, setLoadingPresets] = useState(false);
  const [productName, setProductName] = useState("");
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Duration-based expiry
  const [durationValue, setDurationValue] = useState("");
  const [durationUnit, setDurationUnit] = useState("days");

  // Theme colors
  const backgroundColor = useThemeColor({}, "background");
  const cardBackground = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const subtitleColor = useThemeColor({}, "subtitleText");
  const borderColor = useThemeColor({}, "borderColor");
  const tintColor = useThemeColor({}, "tint");

  useEffect(() => {
    fetchCategories();
  }, []);

  // Auto-select category from URL params and reset form when component mounts
  useEffect(() => {
    if (categories.length > 0 && params.category) {
      const categoryToSelect = categories.find(
        (cat) => cat.Name === params.category
      );
      if (categoryToSelect) {
        handleCategorySelect(categoryToSelect);
      } else {
        resetForm();
      }
    } else {
      resetForm();
    }
  }, [categories, params.category]);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await apiClient.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      Alert.alert("Error", "Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchPresets = async (categoryId: string) => {
    try {
      setLoadingPresets(true);
      // สร้าง URL สำหรับ presets by category
      const response = await fetch(
        `${apiClient.getBaseUrl()}/catalog/categories/${categoryId}/presets`
      );
      const data = await response.json();
      console.log("Presets response:", data);
      setPresets(data.data || []);
    } catch (error) {
      console.error("Failed to fetch presets:", error);
      Alert.alert("Error", "Failed to load product presets");
      setPresets([]);
    } finally {
      setLoadingPresets(false);
    }
  };

  const resetForm = () => {
    setSelectedCategory(null);
    setPresets([]);
    setSelectedPreset(null);
    setProductName("");
    setExpiryDate(null);
    setDurationValue("");
    setDurationUnit("days");
    setIsLoading(false);
  };

  const handleCategorySelect = async (category: Category) => {
    setSelectedCategory(category);
    setSelectedPreset(null);
    setProductName("");
    setExpiryDate(null);
    setDurationValue("");

    // Fetch presets for selected category
    await fetchPresets(category.ID);
  };

  const handlePresetSelect = (preset: Preset) => {
    setSelectedPreset(preset);
    setProductName(preset.Name);

    // Auto-calculate expiry date from DefaultShelfDays
    if (preset.DefaultShelfDays) {
      const today = new Date();
      const expiryDate = new Date(
        today.getTime() + preset.DefaultShelfDays * 24 * 60 * 60 * 1000
      );
      setExpiryDate(expiryDate);
      setDurationValue(preset.DefaultShelfDays.toString());
      setDurationUnit("days");
    }
  };

  const calculateExpiryFromDuration = (value: string, unit: string) => {
    if (!value || isNaN(Number(value))) return null;

    const today = new Date();
    const numValue = Number(value);

    switch (unit) {
      case "days":
        return new Date(today.getTime() + numValue * 24 * 60 * 60 * 1000);
      case "months":
        const monthsDate = new Date(today);
        monthsDate.setMonth(monthsDate.getMonth() + numValue);
        return monthsDate;
      case "years":
        const yearsDate = new Date(today);
        yearsDate.setFullYear(yearsDate.getFullYear() + numValue);
        return yearsDate;
      default:
        return null;
    }
  };

  const handleDurationChange = (value: string) => {
    setDurationValue(value);
    const calculatedDate = calculateExpiryFromDuration(value, durationUnit);
    setExpiryDate(calculatedDate);
  };

  const handleUnitChange = (unit: string) => {
    setDurationUnit(unit);
    if (durationValue) {
      const calculatedDate = calculateExpiryFromDuration(durationValue, unit);
      setExpiryDate(calculatedDate);
    }
  };

  const handleDateSelect = (date: Date) => {
    setExpiryDate(date);
    setShowDatePicker(false);
    // Clear duration when date is selected directly
    setDurationValue("");
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
    // Clear duration when opening date picker
    setDurationValue("");
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleAddProduct = async () => {
    if (!selectedCategory) {
      Alert.alert("Error", "Please select a category");
      return;
    }

    if (!productName.trim()) {
      Alert.alert("Error", "Please enter a product name");
      return;
    }

    try {
      setIsLoading(true);

      const productData = {
        category_id: selectedCategory.ID,
        name: productName.trim(),
        expected_expiry: expiryDate
          ? expiryDate.toISOString().split("T")[0]
          : undefined,
        preset_id: selectedPreset?.ID || undefined,
      };

      await apiClient.createProduct(productData);

      // แสดงการแจ้งเตือนสำเร็จ
      Alert.alert(
        "Success!",
        `"${productName.trim()}" has been added to your inventory.`,
        [{ text: "OK" }]
      );

      // Reset form and navigate
      resetForm();

      if (isFirstProduct) {
        router.replace("/product-added-success" as any);
      } else {
        // ใช้ replace แทน push และเพิ่ม timestamp เพื่อ trigger refresh
        router.replace({
          pathname: "/(app)/home",
          params: { refresh: Date.now().toString() },
        } as any);
      }
    } catch (error) {
      console.error("Failed to create product:", error);
      Alert.alert("Error", "Failed to add product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    navigateBackGently(NavigationPresets.gentle);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
      paddingBottom: 0, // ไม่เว้น space สำหรับ tab bar
    },
    header: {
      backgroundColor: backgroundColor,
      paddingTop: Platform.OS === "ios" ? 50 : 30,
      paddingBottom: 15,
      borderBottomWidth: 0.5,
      borderBottomColor: borderColor,
    },
    headerContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
    },
    cancelButton: {
      padding: 8,
    },
    headerTitle: {
      color: textColor,
      fontSize: 18,
      fontWeight: "600",
      flex: 1,
      textAlign: "center",
      marginHorizontal: 16,
    },
    postButton: {
      backgroundColor: tintColor,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    postButtonDisabled: {
      backgroundColor: borderColor,
    },
    postButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    postButtonTextDisabled: {
      color: subtitleColor,
    },
    content: {
      flex: 1,
      backgroundColor: backgroundColor,
      paddingHorizontal: 16, // เพิ่ม horizontal padding
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: Platform.OS === "ios" ? 40 : 30,
    },
    section: {
      paddingVertical: 20, // เพิ่มจาก 16
      paddingHorizontal: 4,
    },
    sectionTitle: {
      color: textColor,
      fontSize: 22, // เพิ่มจาก 20
      fontWeight: "bold",
      marginBottom: 8, // เพิ่มจาก 6
    },
    sectionSubtitle: {
      color: subtitleColor,
      fontSize: 15, // เพิ่มจาก 14
      marginBottom: 16, // เพิ่มจาก 12
    },
    loadingContainer: {
      alignItems: "center",
      padding: 20,
    },
    loadingText: {
      color: subtitleColor,
      fontSize: 16,
    },
    categoriesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8, // ลด gap อีก
      justifyContent: "space-between",
    },
    categoryCard: {
      width: "31%",
      backgroundColor: cardBackground,
      borderRadius: 8, // ลดจาก 10
      padding: 6, // ลดจาก 12
      alignItems: "center",
      borderWidth: 1,
      borderColor: borderColor,
      minHeight: 45, // ลดจาก 60
    },
    categoryCardSelected: {
      borderColor: tintColor,
      backgroundColor: tintColor + "15", // ลดความเข้มของ background
      borderWidth: 2, // เพิ่มความหนาของ border เมื่อเลือก
    },
    categoryIcon: {
      marginBottom: 2, // ลดจาก 4
    },
    categoryText: {
      color: textColor,
      fontSize: 10, // ลดจาก 12
      textAlign: "center",
      fontWeight: "500",
      lineHeight: 12, // ลดจาก 14
    },
    categoryTextSelected: {
      color: tintColor,
    },
    textInput: {
      backgroundColor: cardBackground,
      borderRadius: 12, // เพิ่มจาก 10
      padding: 16, // เพิ่มจาก 14
      color: textColor,
      fontSize: 16,
      borderWidth: 1,
      borderColor: borderColor,
      minHeight: 52, // เพิ่มจาก 48
    },
    dateInput: {
      backgroundColor: cardBackground,
      borderRadius: 12, // เพิ่มจาก 10
      padding: 16, // เพิ่มจาก 14
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderWidth: 1,
      borderColor: borderColor,
      minHeight: 52, // เพิ่มจาก 48
    },
    dateInputText: {
      color: textColor,
      fontSize: 16,
    },
    durationContainer: {
      marginBottom: 20, // เพิ่มจาก 16
    },
    durationInputContainer: {
      flexDirection: "row",
      gap: 10, // เพิ่มจาก 8
      marginBottom: 8,
    },
    durationInput: {
      flex: 1,
      backgroundColor: cardBackground,
      borderRadius: 12, // เพิ่มจาก 10
      padding: 16, // เพิ่มจาก 14
      color: textColor,
      fontSize: 16,
      borderWidth: 1,
      borderColor: borderColor,
      minHeight: 52, // เพิ่มจาก 48
      textAlign: "center",
    },
    unitButtonsContainer: {
      flex: 2,
      flexDirection: "row",
      backgroundColor: cardBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: borderColor,
      overflow: "hidden",
    },
    unitButton: {
      flex: 1,
      paddingVertical: 16,
      backgroundColor: cardBackground,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 52,
    },
    unitButtonSelected: {
      backgroundColor: tintColor,
    },
    unitButtonText: {
      fontSize: 14,
      fontWeight: "500",
      color: textColor,
    },
    unitButtonTextSelected: {
      color: "#fff",
      fontWeight: "600",
    },
    presetsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 3,
      justifyContent: "flex-start", // เปลี่ยนจาก space-between
    },
    presetLabel: {
      color: subtitleColor,
      fontSize: 12,
      fontWeight: "400",
      marginBottom: 8,
      marginTop: 4,
    },
    presetCard: {
      backgroundColor: "transparent", // เปลี่ยนจาก cardBackground
      borderRadius: 16, // ลดจาก 20
      paddingVertical: 6, // ลดจาก 8
      paddingHorizontal: 10, // ลดจาก 12
      borderWidth: 1,
      borderColor: borderColor + "60", // ทำให้จางลง
      marginRight: 2,
      marginBottom: 2,
    },
    presetCardSelected: {
      borderColor: tintColor,
      backgroundColor: tintColor + "10", // ลดความเข้มลง
      borderWidth: 1.5, // ลดจาก 2
    },
    presetIcon: {
      marginBottom: 4,
    },
    presetText: {
      color: subtitleColor, // เปลี่ยนจาก textColor เป็น subtitleColor
      fontSize: 11, // ลดจาก 12
      fontWeight: "400", // ลดจาก 500
    },
    presetTextSelected: {
      color: tintColor,
      fontWeight: "500", // ลดจาก 600
    },
    presetDays: {
      color: subtitleColor,
      fontSize: 11,
      fontWeight: "400",
    },
  });

  return (
    <View style={styles.container}>
      {/* StatusBar ที่ sync กับ theme */}
      <StatusBar
        style={colorScheme === "dark" ? "light" : "dark"}
        backgroundColor={colorScheme === "dark" ? "#000000" : "#ffffff"}
        translucent={false}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Pressable style={styles.cancelButton} onPress={handleCancel}>
            <Ionicons name="arrow-back" size={24} color={textColor} />
          </Pressable>

          <Text style={styles.headerTitle}>
            {isFirstProduct ? "Add Your First Product" : "Add Product"}
          </Text>

          <Pressable
            style={[
              styles.postButton,
              (!selectedCategory || !productName.trim() || isLoading) &&
                styles.postButtonDisabled,
            ]}
            onPress={handleAddProduct}
            disabled={!selectedCategory || !productName.trim() || isLoading}
          >
            <Text
              style={[
                styles.postButtonText,
                (!selectedCategory || !productName.trim() || isLoading) &&
                  styles.postButtonTextDisabled,
              ]}
            >
              {isLoading ? "Adding..." : "Add"}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Content */}
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="never"
          contentContainerStyle={styles.scrollContent}
        >
          {/* Categories Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>
            <Text style={styles.sectionSubtitle}>
              What type of product are you adding?
            </Text>

            {loadingCategories ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading categories...</Text>
              </View>
            ) : (
              <View style={styles.categoriesGrid}>
                {categories.map((category) => (
                  <Pressable
                    key={category.ID}
                    style={[
                      styles.categoryCard,
                      selectedCategory?.ID === category.ID &&
                        styles.categoryCardSelected,
                    ]}
                    onPress={() => handleCategorySelect(category)}
                  >
                    <Ionicons
                      name={categoryIcons[category.Name] || "cube-outline"}
                      size={16} // เพิ่มจาก 14
                      color={
                        selectedCategory?.ID === category.ID
                          ? tintColor
                          : subtitleColor
                      }
                      style={styles.categoryIcon}
                    />
                    <Text
                      style={[
                        styles.categoryText,
                        selectedCategory?.ID === category.ID &&
                          styles.categoryTextSelected,
                      ]}
                    >
                      {category.Name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Product Name Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Name</Text>
            <Text style={styles.sectionSubtitle}>
              What's the name of your product?
            </Text>

            {/* Product Presets - แสดงใน section นี้ */}
            {selectedCategory && (
              <>
                {loadingPresets ? (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading presets...</Text>
                  </View>
                ) : presets.length > 0 ? (
                  <>
                    <View style={styles.presetsGrid}>
                      {presets.slice(0, 6).map((preset) => (
                        <Pressable
                          key={preset.ID}
                          style={[
                            styles.presetCard,
                            selectedPreset?.ID === preset.ID &&
                              styles.presetCardSelected,
                          ]}
                          onPress={() => handlePresetSelect(preset)}
                        >
                          <Text
                            style={[
                              styles.presetText,
                              selectedPreset?.ID === preset.ID &&
                                styles.presetTextSelected,
                            ]}
                          >
                            {preset.Name}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </>
                ) : null}
              </>
            )}

            <View
              style={{
                marginTop: selectedCategory && presets.length > 0 ? 16 : 0,
              }}
            >
              <TextInput
                style={styles.textInput}
                placeholder="Enter product name"
                placeholderTextColor={subtitleColor}
                value={productName}
                onChangeText={setProductName}
                autoCapitalize="words"
                returnKeyType="done"
              />
            </View>
          </View>

          {/* How long will it last Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How long will it last?</Text>
            <Text style={styles.sectionSubtitle}>
              Set duration or pick a specific date
            </Text>

            {/* Duration Input */}
            <View style={styles.durationContainer}>
              <View style={styles.durationInputContainer}>
                <TextInput
                  style={styles.durationInput}
                  placeholder="0"
                  placeholderTextColor={subtitleColor}
                  value={durationValue}
                  onChangeText={handleDurationChange}
                  keyboardType="numeric"
                  maxLength={3}
                />
                <View style={styles.unitButtonsContainer}>
                  <Pressable
                    style={[
                      styles.unitButton,
                      durationUnit === "days" && styles.unitButtonSelected,
                    ]}
                    onPress={() => handleUnitChange("days")}
                  >
                    <Text
                      style={[
                        styles.unitButtonText,
                        durationUnit === "days" &&
                          styles.unitButtonTextSelected,
                      ]}
                    >
                      Days
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.unitButton,
                      durationUnit === "months" && styles.unitButtonSelected,
                    ]}
                    onPress={() => handleUnitChange("months")}
                  >
                    <Text
                      style={[
                        styles.unitButtonText,
                        durationUnit === "months" &&
                          styles.unitButtonTextSelected,
                      ]}
                    >
                      Months
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.unitButton,
                      durationUnit === "years" && styles.unitButtonSelected,
                    ]}
                    onPress={() => handleUnitChange("years")}
                  >
                    <Text
                      style={[
                        styles.unitButtonText,
                        durationUnit === "years" &&
                          styles.unitButtonTextSelected,
                      ]}
                    >
                      Years
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Date Picker */}
            <Pressable style={styles.dateInput} onPress={openDatePicker}>
              <Text style={styles.dateInputText}>
                {expiryDate ? formatDate(expiryDate) : "Select specific date"}
              </Text>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={subtitleColor}
              />
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Date Picker Overlay */}
      {showDatePicker && (
        <DatePickerOverlay
          selectedDate={expiryDate}
          onDateSelect={handleDateSelect}
          onClose={() => setShowDatePicker(false)}
        />
      )}
    </View>
  );
}
