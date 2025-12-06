import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useRef } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import {
  BorderRadius,
  ColorPalette,
  Shadows,
  Spacing,
  Typography,
} from "../../constants/DesignSystem";

export default function SuccessOnboarding() {
  const router = useRouter();
  const lottieRef = useRef<LottieView>(null);
  return (
    <View style={styles.container}>
      <LottieView
        ref={lottieRef}
        source={require("../../assets/confetti.json")}
        autoPlay
        loop={true}
        style={styles.lottie}
      />
      <View style={styles.contentWrapper}>
        <Ionicons
          name="checkmark-circle"
          size={64}
          color={ColorPalette.green[500]}
          style={styles.checkIcon}
        />
        <Text style={styles.title}>Nicely done!</Text>
        <Text style={styles.desc}>
          Let's help you get started with a few quick tips — or feel free to
          explore on your own.
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.outlineButton,
            pressed && { opacity: 0.7 },
          ]}
          accessibilityLabel="Explore the app"
          accessible
          onPress={() => router.push("/(app)/home")}
        >
          <Text style={styles.outlineButtonText}>Let Me Explore The App</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
          ]}
          accessibilityLabel="Help Me Get Started"
          accessible
          onPress={() => router.replace("/(app)/add-product?first=true")}
        >
          <Text style={styles.buttonText}>Help Me Get Started</Text>
          <Ionicons
            name="arrow-forward"
            size={20}
            color="#fff"
            style={{ marginLeft: 8 }}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },
  lottie: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    zIndex: 0,
  },
  contentWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing[6],
    paddingTop: Platform.OS === "android" ? Spacing[12] : 0,
    zIndex: 1,
  },
  checkIcon: {
    marginBottom: Spacing[6],
    zIndex: 1,
  },
  title: {
    ...Typography.presets.h3,
    color: ColorPalette.gray[900],
    marginBottom: Spacing[3],
    textAlign: "center",
    zIndex: 1,
  },
  desc: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.medium as any,
    color: ColorPalette.gray[600],
    textAlign: "center",
    marginBottom: Spacing[10],
    zIndex: 1,
    lineHeight: 19.2,
  },
  buttonContainer: {
    width: "100%",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: Spacing[8],
    paddingHorizontal: Spacing[6],
    zIndex: 2,
  },
  outlineButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: ColorPalette.gray[300],
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[3],
    marginBottom: Spacing[3],
    width: "100%",
  },
  outlineButtonText: {
    color: ColorPalette.gray[800],
    fontWeight: Typography.fontWeight.medium as any,
    fontSize: Typography.fontSize.md,
    lineHeight: 19.2,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ColorPalette.purple[500],
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[3],
    width: "100%",
    ...Shadows.sm,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: Typography.fontWeight.medium as any,
    fontSize: Typography.fontSize.md,
    lineHeight: 19.2,
  },
});
