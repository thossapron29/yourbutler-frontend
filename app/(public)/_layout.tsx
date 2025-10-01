import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../../contexts/ThemeContext";

export default function PublicLayout() {
  const { colorScheme } = useTheme();

  return (
    <>
      {/* StatusBar สำหรับหน้า public (onboarding, signin, etc.) */}
      <StatusBar 
        style={colorScheme === "dark" ? "light" : "dark"} 
        backgroundColor={colorScheme === "dark" ? "#000000" : "#ffffff"}
        translucent={false}
      />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}