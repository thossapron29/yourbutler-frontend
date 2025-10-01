import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { apiClient } from "../../utils/api";

const steps = [
  {
    title: "What Would You Like to Name Your Butler?",
    placeholder: "Choose a name you like…",
    label: "Butler's name",
    key: "butlerName",
    type: "input",
    suggestions: ["Alfred", "Grace", "Nina", "Nobi", "Lumi"],
  },
  {
    title: "What Should Your Butler Call You?",
    subtitle: "Let your butler know how to address you.",
    placeholder: "e.g. Jamie, Pat, Joe…",
    label: "Your name",
    key: "userName",
    type: "input",
  },
  {
    title: "Stay on Track with Timely Reminders",
    desc: "Get timely reminders when your household items are running low or expiring.\n\nDon't worry — you can still see updates inside the app if you prefer not to turn on notifications.",
    type: "notification",
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [userName, setUserName] = useState("Jamie");
  const [butlerName, setButlerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isLast = step === steps.length - 1;
  const router = useRouter();
  const { setOnboardingComplete, refreshUserData } = useAuth();

  // Animation state
  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const prevStep = useRef(step);

  // Create animated values for each progress bar segment
  const segmentAnims = useRef(
    steps.map((_, i) => new Animated.Value(i === 0 ? 1 : 0))
  ).current;

  useEffect(() => {
    if (prevStep.current !== step) {
      // Slide animation for step content
      const direction = step > prevStep.current ? -1 : 1;
      slideAnim.setValue(direction * 400); // Start off-screen
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start();
      // Animate progress bar
      Animated.timing(progressAnim, {
        toValue: step,
        duration: 350,
        useNativeDriver: false,
      }).start();

      // Animate each segment
      segmentAnims.forEach((anim, i) => {
        Animated.timing(anim, {
          toValue: i <= step ? 1 : 0,
          duration: 350,
          useNativeDriver: false,
        }).start();
      });

      prevStep.current = step;
    }
  }, [step]);

  // Dummy notification permission handler
  const handleEnableNotifications = async () => {
    try {
      setIsLoading(true);

      // Request notification permissions (but don't register device since API doesn't exist)
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus === "granted") {
        Alert.alert("Success", "Notifications enabled successfully!");
      } else {
        Alert.alert(
          "Permission denied",
          "Notification permissions were not granted."
        );
      }

      // Complete onboarding
      await completeOnboardingFlow();
    } catch (error) {
      console.error("Failed to enable notifications:", error);
      Alert.alert(
        "Error",
        "Failed to enable notifications, but continuing with onboarding."
      );
      await completeOnboardingFlow();
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboardingFlow = async () => {
    try {
      // Call API to complete onboarding
      await apiClient.completeOnboarding();

      // Update local auth state
      await setOnboardingComplete();

      // Refresh user data to get latest onboarding_step
      try {
        await refreshUserData();
      } catch (error) {
        console.error("Failed to refresh user data:", error);
      }

      router.replace("/(public)/success-onboarding");
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      // Even if API fails, continue to success page
      await setOnboardingComplete();
      router.replace("/(public)/success-onboarding");
    }
  };

  const handleSkipNotifications = async () => {
    setIsLoading(true);
    await completeOnboardingFlow();
    setIsLoading(false);
  };

  const handleContinue = async () => {
    try {
      setIsLoading(true);

      // Update user profile via API
      if (step === 0 && butlerName.trim()) {
        console.log("Updating butler name:", butlerName.trim());
        await apiClient.updateUserProfile({
          butler_name: butlerName.trim(),
        });
      } else if (step === 1 && userName.trim()) {
        console.log("Updating display name:", userName.trim());
        await apiClient.updateUserProfile({
          display_name: userName.trim(),
        });
      }

      if (isLast) {
        await completeOnboardingFlow();
      } else {
        setStep((s) => s + 1);
      }
    } catch (error) {
      console.error("Failed to continue:", error);
      Alert.alert("Error", "Something went wrong, but continuing...");

      if (isLast) {
        await completeOnboardingFlow();
      } else {
        setStep((s) => s + 1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView
          contentContainerStyle={{ minHeight: "100%" }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <View
                style={[
                  styles.progressBarWrap,
                  { flex: 1, flexDirection: "row" },
                ]}
              >
                {steps.map((_, i) => (
                  <Animated.View
                    key={i}
                    style={[
                      styles.progressBar,
                      { flex: 1, marginRight: i < steps.length - 1 ? 2 : 0 },
                      i === 0
                        ? { borderTopLeftRadius: 3, borderBottomLeftRadius: 3 }
                        : {},
                      i === steps.length - 1
                        ? {
                            borderTopRightRadius: 3,
                            borderBottomRightRadius: 3,
                          }
                        : {},
                      {
                        backgroundColor: segmentAnims[i].interpolate({
                          inputRange: [0, 1],
                          outputRange: ["#E9EDFB", "#8756BC"],
                        }),
                      },
                    ]}
                  />
                ))}
              </View>
            </View>
            {/* Step Indicator */}
            <Text style={styles.stepIndicator}>{`${step + 1}/${
              steps.length
            }`}</Text>
            {/* Headline */}
            <Text style={styles.headline}>{steps[step].title}</Text>
            {/* Placeholder Box */}
            <View style={styles.placeholderBox}>
              {step === 0 && (
                /* Butler Icon for first step */
                <Image
                  source={require("../../assets/images/onboarding/onboard.png")}
                  style={styles.onboardImage}
                  resizeMode="contain"
                />
              )}
              {step === 1 && (
                /* User Icon for second step */
                <Image
                  source={require("../../assets/images/onboarding/onboard.png")}
                  style={styles.onboardImage}
                  resizeMode="contain"
                />
              )}
              {step === 2 && (
                /* Notification Icon for third step */
                <View style={styles.modernIcon}>
                  <Text style={styles.iconEmoji}>🔔</Text>
                  <View style={styles.iconAccent}>
                    <Text style={styles.accentEmoji}>✨</Text>
                  </View>
                </View>
              )}
            </View>
            {/* Step Content with animation */}
            <Animated.View
              style={{
                width: "100%",
                marginTop: steps[step].type === "input" ? 32 : 24,
                transform: [{ translateX: slideAnim }],
              }}
            >
              {steps[step].type === "input" && (
                <>
                  {/* Show subtitle if it exists */}
                  {steps[step].subtitle && (
                    <Text style={styles.subtitle}>{steps[step].subtitle}</Text>
                  )}
                  <Text style={styles.label}>{steps[step].label}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={steps[step].placeholder}
                    placeholderTextColor="#999"
                    value={step === 0 ? butlerName : userName}
                    onChangeText={step === 0 ? setButlerName : setUserName}
                    selectTextOnFocus={step === 1} // Select all text for user name field
                  />
                  {/* Show suggestion chips for butler name step */}
                  {step === 0 && steps[step].suggestions && (
                    <View style={styles.suggestionsContainer}>
                      <Text style={styles.suggestionsLabel}>Suggestions:</Text>
                      <View style={styles.suggestionsChips}>
                        {steps[step].suggestions.map((suggestion, index) => (
                          <Pressable
                            key={index}
                            style={[
                              styles.suggestionChip,
                              butlerName === suggestion &&
                                styles.suggestionChipActive,
                            ]}
                            onPress={() => setButlerName(suggestion)}
                          >
                            <Text
                              style={[
                                styles.suggestionChipText,
                                butlerName === suggestion &&
                                  styles.suggestionChipTextActive,
                              ]}
                            >
                              {suggestion}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    </View>
                  )}
                  <Pressable
                    style={styles.button}
                    onPress={handleContinue}
                    disabled={isLoading}
                  >
                    <Text style={styles.buttonText}>
                      {isLoading ? "Saving..." : isLast ? "Finish" : "Continue"}
                    </Text>
                    {!isLoading && (
                      <Ionicons
                        name="arrow-forward"
                        size={20}
                        color="#fff"
                        style={{ marginLeft: 8 }}
                      />
                    )}
                  </Pressable>
                </>
              )}
              {steps[step].type === "notification" && (
                <>
                  <Text style={styles.desc}>{steps[step].desc}</Text>
                  <View
                    style={{ flexDirection: "row", gap: 12, marginTop: 16 }}
                  >
                    <Pressable
                      style={[
                        styles.button,
                        {
                          backgroundColor: "#fff",
                          borderWidth: 1,
                          borderColor: "#E0E0E0",
                          flex: 1,
                        },
                      ]}
                      onPress={handleSkipNotifications}
                      disabled={isLoading}
                    >
                      <Text style={[styles.buttonText, { color: "#222" }]}>
                        {isLoading ? "Loading..." : "Maybe Later"}
                      </Text>
                    </Pressable>
                  </View>
                  <Pressable
                    style={[styles.button, { marginTop: 12 }]}
                    onPress={handleEnableNotifications}
                    disabled={isLoading}
                  >
                    <Text style={styles.buttonText}>
                      {isLoading ? "Enabling..." : "Enable Notifications"}
                    </Text>
                    {!isLoading && (
                      <Ionicons
                        name="arrow-forward"
                        size={20}
                        color="#fff"
                        style={{ marginLeft: 8 }}
                      />
                    )}
                  </Pressable>
                </>
              )}
            </Animated.View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 48,
    alignItems: "stretch",
  },
  progressBarWrap: {
    flexDirection: "row",
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 24,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  stepIndicator: {
    color: "#888",
    fontSize: 15,
    marginBottom: 8,
  },
  headline: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 24,
    color: "#111",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
    lineHeight: 22,
  },
  placeholderBox: {
    width: "100%",
    height: 200,
    borderRadius: 20,
    marginBottom: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  modernIcon: {
    width: 80,
    height: 80,
    backgroundColor: "#E8F0FF",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  onboardImage: {
    width: "100%",
    height: "100%",
  },
  iconEmoji: {
    fontSize: 32,
  },
  iconAccent: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 24,
    height: 24,
    backgroundColor: "#FFF9E6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  accentEmoji: {
    fontSize: 12,
  },
  label: {
    fontSize: 16,
    color: "#222",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#8756BC",
    borderRadius: 100,
    paddingVertical: 16,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },
  desc: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
    marginBottom: 8,
  },
  input: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#fff",
    fontSize: 16,
    marginBottom: 8,
    color: "#222",
  },
  backButton: {
    marginRight: 8,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  suggestionsContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  suggestionsLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  suggestionsChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  suggestionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  suggestionChipActive: {
    backgroundColor: "#E6DAF7",
    borderColor: "#D8C5F2",
  },
  suggestionChipText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  suggestionChipTextActive: {
    color: "#8756BC",
  },
});
