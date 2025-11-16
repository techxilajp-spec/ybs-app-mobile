"use client";

import { useAuthProvider } from "@/src/hooks/auth/useAuthProvider";
import { User } from "@/src/models/user";
import {
  router,
  useRootNavigationState,
  useSegments,
  type Href,
} from "expo-router";
import { createContext, ReactNode, useContext, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
interface AuthContextType {
  isLoggedIn: boolean | null;
  loading: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  user: User | null;
  asyncSetUser: (user: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn, loading, login, logout, user, asyncSetUser } = useAuthProvider();
  const segments = useSegments();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (loading || !rootNavigationState?.key) return;

    const rootSegment = (segments[0] ?? "") as string;
    const inAuthGroup = rootSegment === "(auth)";

    if (isLoggedIn && inAuthGroup) {
      router.replace("/(tabs)" as Href);
    } else if (!isLoggedIn && !inAuthGroup) {
      router.replace("/(auth)" as Href);
    }
  }, [isLoggedIn, segments, loading, rootNavigationState]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, loading, login, logout, user, asyncSetUser }}>
      {children}
    </AuthContext.Provider>
  );
}