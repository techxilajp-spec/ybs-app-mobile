import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { syncFavoritesFromSupabase, syncFavoritesToSupabase } from "../services/routeFav";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  useReactQueryDevTools(queryClient);
  const [fontsLoaded] = useFonts({
    "MiSansMyanmar-Normal": require("@/assets/fonts/MiSansMyanmar/ttf/MiSansMyanmar-Normal.ttf"),
    "MiSansMyanmar-Regular": require("@/assets/fonts/MiSansMyanmar/ttf/MiSansMyanmar-Regular.ttf"),
    "MiSansMyanmar-Medium": require("@/assets/fonts/MiSansMyanmar/ttf/MiSansMyanmar-Medium.ttf"),
    "MiSansMyanmar-Demibold": require("@/assets/fonts/MiSansMyanmar/ttf/MiSansMyanmar-Demibold.ttf"),
    "MiSansMyanmar-Semibold": require("@/assets/fonts/MiSansMyanmar/ttf/MiSansMyanmar-Semibold.ttf"),
    "MiSansMyanmar-Bold": require("@/assets/fonts/MiSansMyanmar/ttf/MiSansMyanmar-Bold.ttf"),
    "Roboto-Bold": require("@/assets/fonts/Roboto/static/Roboto-Bold.ttf"),
    "Roboto-Semibold": require("@/assets/fonts/Roboto/static/Roboto-SemiBold.ttf"),
  });

  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  useEffect(() => {
    async function loadInitialData() {
      try {
        await syncFavoritesFromSupabase();
        await syncFavoritesToSupabase();
      } catch (e) {
        console.warn(e);
      } finally {
        setInitialDataLoaded(true);
      }
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    if (fontsLoaded && initialDataLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, initialDataLoaded]);

  if (!fontsLoaded || !initialDataLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(drawer)" />
        </Stack>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
