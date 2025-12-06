import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { apiClient, User } from "../utils/api";
import { unregisterDevice } from "../utils/notifications";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  login: (email: string, name?: string) => Promise<User>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  setOnboardingComplete: () => Promise<void>;
  updateUser: (updatedUser: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;
  const hasCompletedOnboarding = !!(
    user?.onboarding_step &&
    typeof user.onboarding_step === "number" &&
    user.onboarding_step >= 3
  );

  // Debug log
  console.log("AuthContext Debug:", {
    isAuthenticated,
    hasCompletedOnboarding,
    onboarding_step: user?.onboarding_step,
    user_id: user?.id,
    display_name: user?.display_name,
    email: user?.email,
    butler_name: user?.butler_name,
  });

  // Load stored auth data on app start
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const [accessToken, refreshToken, userData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER),
      ]);

      if (accessToken && userData) {
        try {
          const parsedUser: User = JSON.parse(userData);
          // Validate user object has required properties
          if (
            parsedUser &&
            typeof parsedUser === "object" &&
            parsedUser.id &&
            parsedUser.email
          ) {
            apiClient.setAccessToken(accessToken);
            setUser(parsedUser);

            // Try to refresh token if we have a refresh token to ensure it's still valid
            if (refreshToken) {
              try {
                await handleRefreshToken(refreshToken);
              } catch (error) {
                // If refresh fails, logout
                console.error("Token refresh failed:", error);
                await logout();
              }
            }
          } else {
            console.error("Invalid user data in storage:", parsedUser);
            await logout();
          }
        } catch (parseError) {
          console.error("Failed to parse user data:", parseError);
          await logout();
        }
      }
    } catch (error) {
      console.error("Failed to load stored auth:", error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshToken = async (refreshToken: string) => {
    try {
      const response = await apiClient.refreshToken({
        refresh_token: refreshToken,
      });

      // Store new tokens
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.ACCESS_TOKEN, response.access_token],
        [STORAGE_KEYS.REFRESH_TOKEN, response.refresh_token],
      ]);

      apiClient.setAccessToken(response.access_token);
    } catch (error) {
      console.error("Failed to refresh token:", error);
      await logout();
      throw error;
    }
  };

  const login = async (email: string, name?: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.devLogin({ email, name });

      // Store tokens
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.ACCESS_TOKEN, response.tokens.access_token],
        [STORAGE_KEYS.REFRESH_TOKEN, response.tokens.refresh_token],
      ]);

      apiClient.setAccessToken(response.tokens.access_token);

      // Fetch complete user data from /api/me
      const completeUserData = await apiClient.getCurrentUser();

      // Validate the complete user data
      if (
        completeUserData &&
        typeof completeUserData === "object" &&
        completeUserData.id &&
        completeUserData.email
      ) {
        // Store complete user data
        await AsyncStorage.setItem(
          STORAGE_KEYS.USER,
          JSON.stringify(completeUserData)
        );
        setUser(completeUserData);

        return completeUserData;
      } else {
        console.error(
          "Invalid user data received during login:",
          completeUserData
        );
        throw new Error("Invalid user data received");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Only unregister device if user is logged in
      if (user) {
        await unregisterDevice();
      }

      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER,
      ]);

      apiClient.setAccessToken("");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const setOnboardingComplete = useCallback(async () => {
    try {
      if (user) {
        // อัพเดท user object ใน state
        const updatedUser = { ...user, onboarding_step: 3 };
        setUser(updatedUser);

        // บันทึกใน AsyncStorage
        await AsyncStorage.setItem(
          STORAGE_KEYS.USER,
          JSON.stringify(updatedUser)
        );

        // ในอนาคตอาจจะเพิ่ม API call เพื่ออัพเดทใน server
        // await api.updateUserOnboardingStep(3);
      }
    } catch (error) {
      console.error("Error setting onboarding complete:", error);
    }
  }, [user]);
  const refreshAuth = async () => {
    const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (refreshToken) {
      await handleRefreshToken(refreshToken);
    } else {
      throw new Error("No refresh token available");
    }
  };

  const refreshUserData = async () => {
    try {
      const updatedUserData = await apiClient.getCurrentUser();

      // Validate the updated user data
      if (
        updatedUserData &&
        typeof updatedUserData === "object" &&
        updatedUserData.id &&
        updatedUserData.email
      ) {
        setUser(updatedUserData);

        // Store updated user data
        await AsyncStorage.setItem(
          STORAGE_KEYS.USER,
          JSON.stringify(updatedUserData)
        );
      } else {
        console.error("Invalid user data received from API:", updatedUserData);
        throw new Error("Invalid user data received");
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      throw error;
    }
  };

  const updateUser = useCallback(async (updatedUser: User) => {
    try {
      setUser(updatedUser);
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER,
        JSON.stringify(updatedUser)
      );
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        hasCompletedOnboarding,
        login,
        logout,
        refreshAuth,
        refreshUserData,
        setOnboardingComplete,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
