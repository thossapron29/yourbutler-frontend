import { Redirect } from "expo-router";

export default function PublicIndex() {
  // Redirect to welcome screen
  return <Redirect href="/(public)/welcome" />;
}
