/**
 * @deprecated This component is no longer needed.
 * Auth protection is now handled in route group layouts:
 * - (app)/_layout.tsx: Protects authenticated routes
 * - Root _layout.tsx: Uses AuthContext for global auth state
 * 
 * This file is kept for backward compatibility but should not be used.
 * Use Expo Router's layout-based protection instead.
 */

import { ReactNode } from "react";

export default function AuthGuard({ children }: { children: ReactNode }) {
  // Auth logic moved to layouts - this is now a passthrough
  return <>{children}</>;
}
