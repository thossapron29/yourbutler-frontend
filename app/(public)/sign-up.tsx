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
import {
  ColorPalette,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
} from "@/constants/DesignSystem";

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
            source={require("../../assets/images/signin/signin_butler_figma.png")}
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
          <Pressable
            style={({ pressed }) => [
              styles.appleButton,
              pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] },
            ]}
            onPress={onAppleSignIn}
          >
            <Ionicons name="logo-apple" size={20} color="#FFFFFF" />
            <Text style={styles.appleButtonText}>Continue With Apple</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.googleButton,
              pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] },
            ]}
            onPress={onGoogleSignIn}
          >
            <Ionicons name="logo-google" size={20} color="#EA4335" />
            <Text style={styles.googleButtonText}>Continue With Google</Text>
          </Pressable>

          {/* Dev Login Button */}
          <Pressable
            style={({ pressed }) => [
              styles.devButton,
              pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] },
            ]}
            onPress={() => router.push("/(public)/dev-login")}
          >
            <Ionicons name="code" size={20} color={ColorPalette.gray[600]} />
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
    backgroundColor: ColorPalette.gray[50],
  },
  topSection: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: ColorPalette.gray[100],
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    paddingHorizontal: Spacing.xl,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    maxHeight: 250,
  },
  bottomSection: {
    padding: Spacing.xl,
    gap: Spacing.lg,
    justifyContent: "space-around",
  },
  headline: {
    ...Typography.presets.h3,
    color: ColorPalette.gray[900],
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.presets.bodyRegular,
    color: ColorPalette.gray[600],
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
  },
  appleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000000",
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    justifyContent: "center",
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  appleButtonText: {
    ...Typography.presets.bodyMedium,
    color: "#FFFFFF",
    fontWeight: Typography.fontWeight.semibold,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: ColorPalette.gray[300],
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    justifyContent: "center",
    gap: Spacing.sm,
    ...Shadows.xs,
  },
  googleButtonText: {
    ...Typography.presets.bodyMedium,
    color: ColorPalette.gray[900],
    fontWeight: Typography.fontWeight.semibold,
  },
  devButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ColorPalette.gray[100],
    borderWidth: 1,
    borderColor: ColorPalette.gray[400],
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    justifyContent: "center",
    gap: Spacing.sm,
  },
  devButtonText: {
    ...Typography.presets.bodyMedium,
    color: ColorPalette.gray[600],
    fontWeight: Typography.fontWeight.semibold,
  },
  linksRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.sm,
  },
  link: {
    ...Typography.presets.caption,
    color: ColorPalette.purple[400],
    textDecorationLine: "underline",
    marginHorizontal: Spacing.xs,
  },
});
