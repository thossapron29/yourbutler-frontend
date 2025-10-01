import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, hasCompletedOnboarding } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const inAuthGroup = segments[0] === "(app)";
      const inPublicGroup = segments[0] === "(public)";
      
      if (hasCompletedOnboarding) {
        // User completed onboarding, redirect to home if in public routes (except profile)
        if (inPublicGroup && segments[1] !== "profile") {
          router.replace("/(app)/home");
        }
      } else {
        // User hasn't completed onboarding, redirect to onboarding if not already there
        if (!inPublicGroup || (segments[1] !== "onboarding" && segments[1] !== "success-onboarding")) {
          router.replace("/(public)/onboarding");
        }
      }
    } else if (!isLoading && !isAuthenticated) {
      // User is not logged in, redirect to welcome if not already in public routes
      const inPublicGroup = segments[0] === "(public)";
      if (!inPublicGroup) {
        router.replace("/(public)/welcome");
      }
    }
  }, [isAuthenticated, isLoading, hasCompletedOnboarding, router, segments]);

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#347CFF" />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
