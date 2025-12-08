import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // 1. Load fonts
  const [fontsLoaded] = useFonts({
    "MiSansMyanmar-Normal": require("@/assets/fonts/MiSansMyanmar/ttf/MiSansMyanmar-Normal.ttf"),
    "MiSansMyanmar-Regular": require("@/assets/fonts/MiSansMyanmar/ttf/MiSansMyanmar-Regular.ttf"),
    "MiSansMyanmar-Medium": require("@/assets/fonts/MiSansMyanmar/ttf/MiSansMyanmar-Medium.ttf"),
    "MiSansMyanmar-Demibold": require("@/assets/fonts/MiSansMyanmar/ttf/MiSansMyanmar-Demibold.ttf"),
    "MiSansMyanmar-Semibold": require("@/assets/fonts/MiSansMyanmar/ttf/MiSansMyanmar-Semibold.ttf"),
    "MiSansMyanmar-Bold": require("@/assets/fonts/MiSansMyanmar/ttf/MiSansMyanmar-Bold.ttf"),
  });

  // 2. Load your initial async data
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  useEffect(() => {
    async function loadInitialData() {
      try {
        // your async tasks...
      } catch (e) {
        console.warn(e);
      } finally {
        setInitialDataLoaded(true);
      }
    }

    loadInitialData();
  }, []);

  // 3. Hide splash once everything is ready
  useEffect(() => {
    if (fontsLoaded && initialDataLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, initialDataLoaded]);

  // 4. Render nothing until ready
  if (!fontsLoaded || !initialDataLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(drawer)" />
      </Stack>
    </SafeAreaProvider>
  );
}
