import { Redirect } from "expo-router";

export default function AppIndex() {
  // Redirect to home screen
  return <Redirect href="/(app)/home" />;
}
