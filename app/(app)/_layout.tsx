import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../../contexts/ThemeContext";
import { useThemeColor } from "../../hooks/useThemeColor";
import { useNotifications } from "../../hooks/useNotifications";

export default function AppLayout() {
  const { colorScheme } = useTheme();

  // Initialize notifications
  useNotifications();

  // Theme colors
  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");
  const tabIconDefault = useThemeColor({}, "tabIconDefault");
  const borderColor = useThemeColor({}, "borderColor");

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
