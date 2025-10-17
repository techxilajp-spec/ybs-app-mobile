import { useAuthProvider } from "@/hooks/auth/useAuthProvider";
import { AuthProvider } from "@/utils/providers/AuthProvider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

export default function RootLayout() {
  const { isLoggedIn, loading } = useAuthProvider();

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {isLoggedIn || loading ? (
          <Stack.Screen name="tabs" />
        ) : (
          <Stack.Screen name="auth" />
        )}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
