import { useRouter } from "expo-router";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { height: deviceHeight } = Dimensions.get("window");
const halfHeight = deviceHeight / 2;

export default function Welcome() {
  const router = useRouter();

  const handlePress = () => {
    router.push("/sign-up");
  };

  return (
    <View style={styles.container}>
      <View style={[styles.topSection, { height: halfHeight }]}>
        {/* Welcome banner image */}
        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/images/welcome/banner_welcome.png")}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </View>
      </View>
      <View style={[styles.bottomSection, { height: halfHeight }]}>
        <View style={{ gap: 24 }}>
          <View>
            <Text style={styles.title1}>Welcome to YourButler</Text>
            <Text style={styles.subtitle}>
              Keeping track of everything at home, so you don't have to.
            </Text>
          </View>

          <View style={{ gap: 12 }}>
            <View style={styles.featureRow}>
              <View style={styles.checkIcon}>
                <Text style={styles.checkText}>✓</Text>
              </View>
              <Text style={styles.featureText}>See what's expiring soon</Text>
            </View>
            <View style={styles.featureRow}>
              <View style={styles.checkIcon}>
                <Text style={styles.checkText}>✓</Text>
              </View>
              <Text style={styles.featureText}>Get gentle reminders</Text>
            </View>
            <View style={styles.featureRow}>
              <View style={styles.checkIcon}>
                <Text style={styles.checkText}>✓</Text>
              </View>
              <Text style={styles.featureText}>Simplify your shopping</Text>
            </View>
          </View>
        </View>

        <Pressable style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topSection: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "#f8fafc",
  },
  imageContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  bannerImage: {
    width: "100%",
    height: "142.86%",
    marginTop: 0,
  },
  bottomSection: {
    padding: 24,
    gap: 16,
    justifyContent: "space-around",
  },
  title1: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#8756BC",
    justifyContent: "center",
    alignItems: "center",
  },
  checkText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  featureText: {
    fontSize: 16,
    color: "#444",
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#8756BC",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#8756BC",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
