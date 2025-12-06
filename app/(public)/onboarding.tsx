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
import {
  BorderRadius,
  ColorPalette,
  Shadows,
  Spacing,
  Typography,
} from "../../constants/DesignSystem";
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
    subtitle: "Stay up-to-date",
    title: "Make Sure You Never Miss a Refill",
    desc: "Get timely reminders when your household items are running low or expiring. Don't worry — you can still see updates inside the app if you prefer not to turn on notifications.",
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
                  source={require("../../assets/images/onboarding/robutler_complete_figma.png")}
                  style={styles.onboardImage}
                  resizeMode="contain"
                />
              )}
              {step === 1 && (
                /* User Icon for second step */
                <Image
                  source={require("../../assets/images/onboarding/robutler_complete_figma.png")}
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
                            style={({ pressed }) => [
                              styles.suggestionChip,
                              butlerName === suggestion &&
                                styles.suggestionChipActive,
                              pressed && { opacity: 0.7 },
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
                    style={({ pressed }) => [
                      styles.button,
                      pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
                    ]}
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
                  {steps[step].subtitle && (
                    <Text style={styles.subtitle}>{steps[step].subtitle}</Text>
                  )}
                  <Text style={styles.desc}>{steps[step].desc}</Text>
                  <Pressable
                    style={({ pressed }) => [
                      styles.secondaryButton,
                      pressed && { opacity: 0.7 },
                    ]}
                    onPress={handleSkipNotifications}
                    disabled={isLoading}
                  >
                    <Text style={styles.secondaryButtonText}>
                      {isLoading ? "Loading..." : "Maybe Later"}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      styles.button,
                      pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
                    ]}
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
    backgroundColor: "#FFFFFF",
    paddingHorizontal: Spacing[6],
    paddingTop: Spacing[12],
    alignItems: "stretch",
  },
  progressBarWrap: {
    flexDirection: "row",
    height: 6,
    borderRadius: BorderRadius.xs,
    overflow: "hidden",
    marginBottom: Spacing[6],
  },
  progressBar: {
    height: 6,
    borderRadius: BorderRadius.xs,
  },
  stepIndicator: {
    color: ColorPalette.gray[600],
    fontSize: Typography.fontSize.sm,
    marginBottom: Spacing[2],
  },
  headline: {
    ...Typography.presets.h3,
    color: ColorPalette.gray[900],
    marginBottom: Spacing[6],
  },
  subtitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.medium as any,
    color: ColorPalette.gray[600],
    marginBottom: Spacing[4],
    lineHeight: 19.2,
  },
  placeholderBox: {
    width: "100%",
    height: 200,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing[8],
    justifyContent: "center",
    alignItems: "center",
  },
  modernIcon: {
    width: 80,
    height: 80,
    backgroundColor: ColorPalette.purple[50],
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  onboardImage: {
    width: "100%",
    height: "100%",
  },
  iconEmoji: {
    fontSize: Typography.fontSize["2xl"],
  },
  iconAccent: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 24,
    height: 24,
    backgroundColor: ColorPalette.purple[50],
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  accentEmoji: {
    fontSize: 12,
  },
  label: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.medium as any,
    color: ColorPalette.gray[800],
    marginBottom: Spacing[2],
  },
  button: {
    backgroundColor: ColorPalette.purple[500],
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[3],
    marginTop: Spacing[4],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.sm,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: Typography.fontWeight.medium as any,
    fontSize: Typography.fontSize.md,
    lineHeight: 19.2,
  },
  desc: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.medium as any,
    color: ColorPalette.gray[600],
    lineHeight: 19.2,
    marginBottom: Spacing[2],
  },
  input: {
    width: "100%",
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[6],
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: ColorPalette.gray[300],
    backgroundColor: "#FFFFFF",
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.medium as any,
    lineHeight: 19.2,
    marginBottom: Spacing[2],
    color: ColorPalette.gray[800],
  },
  backButton: {
    marginRight: Spacing[2],
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  suggestionsContainer: {
    marginTop: Spacing[4],
    marginBottom: Spacing[2],
  },
  suggestionsLabel: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.medium as any,
    color: ColorPalette.gray[600],
    marginBottom: Spacing[2],
  },
  suggestionsChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing[2],
  },
  suggestionChip: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    backgroundColor: ColorPalette.gray[50],
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: ColorPalette.gray[300],
  },
  suggestionChipActive: {
    backgroundColor: ColorPalette.purple[100],
    borderColor: ColorPalette.purple[200],
  },
  suggestionChipText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium as any,
    lineHeight: 14.4,
    color: ColorPalette.gray[600],
  },
  suggestionChipTextActive: {
    color: ColorPalette.purple[500],
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: ColorPalette.gray[300],
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[3],
    marginTop: Spacing[4],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: ColorPalette.gray[800],
    fontWeight: Typography.fontWeight.medium as any,
    fontSize: Typography.fontSize.md,
    lineHeight: 19.2,
  },
});
