import { Ionicons } from "@expo/vector-icons";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { height: deviceHeight } = Dimensions.get("window");
const halfHeight = deviceHeight / 2;

WebBrowser.maybeCompleteAuthSession();

export default function SignUp() {
  const router = useRouter();
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "569545626507-rtf02opb8bjqbha0hbh5a3mqbo1b40dr.apps.googleusercontent.com", // ใช้ web client id
    scopes: ["openid", "profile", "email"],
    redirectUri: "https://auth.expo.io/@thossapron.s/YourButler",
  });

  const onAppleSignIn = async () => {
    try {
      // ตรวจสอบก่อนว่ารองรับ
      const available = await AppleAuthentication.isAvailableAsync();
      if (!available) {
        Alert.alert("อุปกรณ์นี้ไม่รองรับ Sign in with Apple");
        return;
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential) {
        router.push("/(app)/home");
      }
    } catch (e: any) {
      if (e?.code === "ERR_REQUEST_CANCELED") return; // ผู้ใช้กดยกเลิก
      // error อื่น ๆ มักมาจาก entitlement/capability หรือ build ไม่ถูกต้อง
      console.log(e);
    }
  };

  const onGoogleSignIn = () => {
    promptAsync();
  };

  useEffect(() => {
    if (response?.type === "success") {
      console.log("Google Response : ", response);
      router.push("/(app)/home");
    }
  }, [response, router]);

  return (
    <View style={styles.container}>
      <View style={[styles.topSection, { height: halfHeight }]}>
        {/* Sign-in banner image */}
        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/images/signin/signin-banner.png")}
            style={styles.bannerImage}
            resizeMode="contain"
          />
        </View>
      </View>
      <View style={[styles.bottomSection, { height: halfHeight }]}>
        <View style={{ gap: 16 }}>
          <Text style={styles.headline}>Let’s Get Started!</Text>
          <Text style={styles.subtitle}>
            We'll help track what's in your home and remind you gently before
            anything runs out.
          </Text>
        </View>
        <View style={{ gap: 12, marginTop: 24 }}>
          <Pressable style={styles.appleButton} onPress={onAppleSignIn}>
            <Ionicons
              name="logo-apple"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.appleButtonText}>Continue With Apple</Text>
          </Pressable>
          <Pressable style={styles.googleButton} onPress={onGoogleSignIn}>
            <Ionicons
              name="logo-google"
              size={20}
              color="#EA4335"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.googleButtonText}>Continue With Google</Text>
          </Pressable>

          {/* Dev Login Button */}
          <Pressable
            style={styles.devButton}
            onPress={() => router.push("/(public)/dev-login")}
          >
            <Ionicons
              name="code"
              size={20}
              color="#666"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.devButtonText}>Dev Login</Text>
          </Pressable>
        </View>
        <View style={styles.linksRow}>
          <Text
            style={styles.link}
            onPress={() => Linking.openURL("https://yourbutler.co")}
          >
            Terms & Conditions
          </Text>
          <Text
            style={styles.link}
            onPress={() => Linking.openURL("https://yourbutler.co")}
          >
            Privacy Policy
          </Text>
        </View>
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
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    paddingHorizontal: 24,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    maxHeight: 250,
  },
  bottomSection: {
    padding: 24,
    gap: 16,
    justifyContent: "space-around",
  },
  headline: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },
  appleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  appleButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  googleButtonText: {
    color: "#222",
    fontWeight: "600",
    fontSize: 16,
  },
  devButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  devButtonText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 16,
  },
  linksRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    paddingHorizontal: 8,
  },
  link: {
    color: "#8756BC",
    fontSize: 13,
    textDecorationLine: "underline",
    marginHorizontal: 4,
  },
});
