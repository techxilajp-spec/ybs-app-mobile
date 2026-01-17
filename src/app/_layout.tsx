// react
import { useEffect, useState } from "react";

// react native related
import { SafeAreaProvider } from "react-native-safe-area-context";

// react query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// expo related
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

// dev tools
import { useReactQueryDevTools } from "@dev-plugins/react-query";

// toast
import Toast from 'react-native-toast-message';

// api
import getSplahAd from "../api/ads/getSplashAd";

// config
import { toastConfig } from "../config/toast.config";

// stores
import { useAdvertisementStore } from "../stores/useAdvertisementStore";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000
    }
  }
});

export default function RootLayout() {
  const setAdvertisement = useAdvertisementStore((s) => s.setAdvertisement);
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
        const data = await getSplahAd();
        if(data) setAdvertisement(data);
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
        <Toast config={toastConfig}/>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
