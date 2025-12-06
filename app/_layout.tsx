import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { I18nProvider } from "@/contexts/I18nContext";
import {
  ThemeProvider as CustomThemeProvider,
  useTheme,
} from "@/contexts/ThemeContext";

function NavigationProtection() {
  const { isAuthenticated, hasCompletedOnboarding, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(app)";
    const inPublicGroup = segments[0] === "(public)";

    if (!isAuthenticated) {
      // User not logged in - redirect to welcome if trying to access protected routes
      if (inAuthGroup) {
        router.replace("/(public)/welcome");
      }
    } else {
      // User is logged in
      if (!hasCompletedOnboarding) {
        // Not completed onboarding - redirect if not on onboarding screens
        if (
          inPublicGroup &&
          segments[1] !== "onboarding" &&
          segments[1] !== "success-onboarding"
        ) {
          router.replace("/(public)/onboarding");
        } else if (inAuthGroup) {
          router.replace("/(public)/onboarding");
        }
      } else {
        // Completed onboarding - redirect from public routes to app (except profile)
        if (inPublicGroup && segments[1] !== "profile") {
          router.replace("/(app)/home");
        }
      }
    }
  }, [isAuthenticated, hasCompletedOnboarding, isLoading, segments]);

  return null;
}

function RootLayoutContent() {
  const { colorScheme } = useTheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <I18nProvider>
        <AuthProvider>
          <ErrorBoundary>
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <NavigationProtection />
              <Stack
                screenOptions={{
                  headerShown: false,
                  gestureEnabled: true,
                  animation: "slide_from_right",
                  presentation: "card",
                }}
              >
                <Stack.Screen
                  name="(public)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="(app)" options={{ headerShown: false }} />
              </Stack>
              <StatusBar
                style={colorScheme === "dark" ? "light" : "dark"}
                backgroundColor={colorScheme === "dark" ? "#000000" : "#ffffff"}
                translucent={false}
              />
            </ThemeProvider>
          </ErrorBoundary>
        </AuthProvider>
      </I18nProvider>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <CustomThemeProvider>
      <RootLayoutContent />
    </CustomThemeProvider>
  );
}
