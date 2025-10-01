import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useThemeColor } from "../../hooks/useThemeColor";
import { useNotifications } from "../../hooks/useNotifications";

export default function AppLayout() {
  const { isAuthenticated, hasCompletedOnboarding, isLoading } = useAuth();
  const router = useRouter();
  const { colorScheme } = useTheme(); // ใช้ custom theme context แทน useColorScheme

  // Initialize notifications
  useNotifications();

  // Theme colors
  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");
  const tabIconDefault = useThemeColor({}, "tabIconDefault");
  const borderColor = useThemeColor({}, "borderColor");

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // ถ้าไม่ได้ login ให้กลับไปหน้า welcome
        router.replace("/(public)/welcome");
      } else if (!hasCompletedOnboarding) {
        // ถ้า login แล้วแต่ยังไม่เสร็จ onboarding ให้กลับไปหน้า onboarding
        router.replace("/(public)/onboarding");
      }
    }
  }, [isAuthenticated, hasCompletedOnboarding, isLoading, router]);

  // แสดง loading ระหว่างเช็ค auth state
  if (isLoading || !isAuthenticated || !hasCompletedOnboarding) {
    return null; // หรือแสดง loading spinner
  }

  return (
    <>
      {/* StatusBar ที่ sync กับ theme ที่เลือก */}
      <StatusBar
        style={colorScheme === "dark" ? "light" : "dark"}
        backgroundColor={colorScheme === "dark" ? "#000000" : "#ffffff"}
        translucent={false}
      />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: tintColor,
          tabBarInactiveTintColor: tabIconDefault,
          tabBarStyle: {
            backgroundColor: backgroundColor,
            borderTopWidth: 1,
            borderTopColor: borderColor,
            height: 90,
            paddingBottom: 20,
            paddingTop: 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "500",
          },
          tabBarShowLabel: true, // แสดง label/title
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            href: null, // ซ่อนจาก tab bar
          }}
        />
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="my-items"
          options={{
            title: "My Items",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "cube" : "cube-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="shopping-list"
          options={{
            title: "Shopping List",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "list" : "list-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="add-product"
          options={{
            href: null, // ซ่อนจาก tab bar
            tabBarStyle: { display: "none" }, // ซ่อน tab bar เมื่ออยู่ในหน้านี้
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            href: null, // ซ่อนจาก tab bar
            tabBarStyle: { display: "none" }, // ซ่อน tab bar เมื่ออยู่ในหน้านี้
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            href: null, // ซ่อนจาก tab bar
            tabBarStyle: { display: "none" }, // ซ่อน tab bar เมื่ออยู่ในหน้านี้
          }}
        />
        <Tabs.Screen
          name="edit-product"
          options={{
            href: null, // ซ่อนจาก tab bar
            tabBarStyle: { display: "none" }, // ซ่อน tab bar เมื่ออยู่ในหน้านี้
          }}
        />
        <Tabs.Screen
          name="product-detail"
          options={{
            href: null, // ซ่อนจาก tab bar
            tabBarStyle: { display: "none" }, // ซ่อน tab bar เมื่ออยู่ในหน้านี้
          }}
        />
        <Tabs.Screen
          name="notification-detail"
          options={{
            href: null, // ซ่อนจาก tab bar
            tabBarStyle: { display: "none" }, // ซ่อน tab bar เมื่ออยู่ในหน้านี้
          }}
        />
        <Tabs.Screen
          name="widget-preview"
          options={{
            href: null, // ซ่อนจาก tab bar
            tabBarStyle: { display: "none" }, // ซ่อน tab bar เมื่ออยู่ในหน้านี้
          }}
        />
        <Tabs.Screen
          name="notification-settings"
          options={{
            href: null, // ซ่อนจาก tab bar
            tabBarStyle: { display: "none" }, // ซ่อน tab bar เมื่ออยู่ในหน้านี้
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            href: null, // ซ่อนจาก tab bar
            tabBarStyle: { display: "none" }, // ซ่อน tab bar เมื่ออยู่ในหน้านี้
          }}
        />
      </Tabs>
    </>
  );
}
