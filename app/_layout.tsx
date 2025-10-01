import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider as CustomThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { I18nProvider } from "@/contexts/I18nContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";

function RootLayoutContent() {
  const { colorScheme } = useTheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <I18nProvider>
      <AuthProvider>
        <ErrorBoundary>
          <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <Stack
              screenOptions={{
                headerShown: false,
                gestureEnabled: true,
                animation: "slide_from_right", // Native slide animation
                presentation: "card", // Card presentation style
              }}
            >
              <Stack.Screen name="(public)" options={{ headerShown: false }} />
              <Stack.Screen name="(app)" options={{ headerShown: false }} />
            </Stack>
            {/* StatusBar แบบ adaptive ตาม theme ที่เลือก */}
            <StatusBar 
              style={colorScheme === "dark" ? "light" : "dark"} 
              backgroundColor={colorScheme === "dark" ? "#000000" : "#ffffff"}
              translucent={false}
            />
          </ThemeProvider>
        </ErrorBoundary>
      </AuthProvider>
    </I18nProvider>
  );
}

export default function RootLayout() {
  return (
    <CustomThemeProvider>
      <RootLayoutContent />
    </CustomThemeProvider>
  );
}
