import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useRef } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

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
          size={72}
          color="#4BB543"
          style={styles.checkIcon}
        />
        <Text style={styles.title}>Nicely Done!</Text>
        <Text style={styles.desc}>
          Your account is all set!{"\n"}Let's help you get started with a few
          quick tips — or feel free to explore on your own.
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.outlineButton}
          accessibilityLabel="Explore the app"
          accessible
          onPress={() => router.push("/(app)/home")}
        >
          <Text style={styles.outlineButtonText}>Let Me Explore The App</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          accessibilityLabel="Help Me Get Started"
          accessible
          onPress={() => router.replace("/add-product?first=true" as any)}
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
    backgroundColor: "#fff",
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
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "android" ? 48 : 0,
    zIndex: 1,
  },
  checkIcon: {
    marginBottom: 24,
    zIndex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#222",
    marginBottom: 12,
    textAlign: "center",
    zIndex: 1,
  },
  desc: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: 40,
    zIndex: 1,
    lineHeight: 22,
  },
  buttonContainer: {
    width: "100%",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 32,
    paddingHorizontal: 24,
    zIndex: 2,
  },
  outlineButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    paddingVertical: 16,
    marginBottom: 12,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  outlineButtonText: {
    color: "#222",
    fontWeight: "500",
    fontSize: 17,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#347CFF",
    borderRadius: 8,
    paddingVertical: 16,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },
});
