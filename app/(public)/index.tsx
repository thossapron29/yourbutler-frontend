import AuthGuard from "../../components/AuthGuard";
import Welcome from "./welcome";

export default function Index() {
  return (
    <AuthGuard>
      <Welcome />
    </AuthGuard>
  );
}
