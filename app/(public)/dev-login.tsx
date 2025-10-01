import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { apiClient } from "../../utils/api";

export default function DevLogin() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [apiUrl, setApiUrl] = useState(apiClient.getBaseUrl());
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleDevLogin = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter an email address");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    try {
      setIsLoading(true);
      
      // Update API base URL
      apiClient.setBaseUrl(apiUrl);
      
      const loggedInUser = await login(email.trim(), name.trim() || undefined);
      
      // Check onboarding status from API response
      if (loggedInUser && loggedInUser.onboarding_step && loggedInUser.onboarding_step >= 3) {
        // User has completed onboarding, go to home
        router.replace("/(app)/home");
      } else {
        // User needs to complete onboarding
        router.replace("/(public)/onboarding");
      }
    } catch (error) {
      console.error("Dev login failed:", error);
      Alert.alert(
        "Login Failed",
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSignUp = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBackToSignUp}>
            <Ionicons name="arrow-back" size={24} color="#222" />
          </Pressable>
          <Text style={styles.headerTitle}>Dev Login</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.formSection}>
            <Text style={styles.title}>Development Login</Text>
            <Text style={styles.subtitle}>
              Quick login for development and testing purposes.
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>API URL</Text>
              <TextInput
                style={styles.input}
                placeholder="http://localhost:8080"
                placeholderTextColor="#999"
                value={apiUrl}
                onChangeText={setApiUrl}
                keyboardType="url"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address *</Text>
              <TextInput
                style={styles.input}
                placeholder="dev@example.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Dev User"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                editable={!isLoading}
              />
            </View>

            <Pressable
              style={[
                styles.loginButton,
                (isLoading || !email.trim()) && styles.loginButtonDisabled,
              ]}
              onPress={handleDevLogin}
              disabled={isLoading || !email.trim()}
            >
              {isLoading ? (
                <Text style={styles.loginButtonText}>Logging in...</Text>
              ) : (
                <>
                  <Text style={styles.loginButtonText}>Login</Text>
                  <Ionicons
                    name="arrow-forward"
                    size={20}
                    color="#fff"
                    style={{ marginLeft: 8 }}
                  />
                </>
              )}
            </Pressable>
          </View>

          {/* Warning Notice */}
          <View style={styles.warningContainer}>
            <View style={styles.warningHeader}>
              <Ionicons name="warning" size={20} color="#FF9500" />
              <Text style={styles.warningTitle}>Development Only</Text>
            </View>
            <Text style={styles.warningText}>
              This login method is for development purposes only and should not
              be used in production environments.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    justifyContent: "space-between",
  },
  formSection: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#222",
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#222",
    backgroundColor: "#fff",
  },
  loginButton: {
    backgroundColor: "#347CFF",
    borderRadius: 8,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  loginButtonDisabled: {
    backgroundColor: "#A0A0A0",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  warningContainer: {
    backgroundColor: "#FFF9E6",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: "#FF9500",
  },
  warningHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF9500",
    marginLeft: 8,
  },
  warningText: {
    fontSize: 14,
    color: "#B8860B",
    lineHeight: 20,
  },
});
