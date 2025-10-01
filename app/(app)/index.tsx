import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function AppIndex() {
  const router = useRouter();

  useEffect(() => {
    // Redirect ไปหน้า home เมื่อเข้า app routes
    router.replace("/home");
  }, [router]);

  return null;
}
