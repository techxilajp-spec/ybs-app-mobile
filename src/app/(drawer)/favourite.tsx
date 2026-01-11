import { StyleSheet } from "react-native";

// react
import { useEffect, useState } from "react";

// custom components
import AppHeader from "@/src/components/AppHeader";
import AppNavigationTabs from "@/src/components/AppNavigationTabs";
import AppScreenLayout from "@/src/components/AppScreenLayout";
import RouteListView from "@/src/components/favourite/RouteListView";
import StopsListView from "@/src/components/favourite/StopsListView";

import { getRouteLocalFavorites } from "@/src/services/routeFav";
import { supabase } from "@/src/utils/supabase";


// types
import { getStopLocalFavorites } from "@/src/services/stopFav";
import { Route, Stop } from "@/src/types/bus";
type TabKey = "stops" | "routes";

const TAB_CONFIG: {
  key: TabKey;
  label: string;
}[] = [
    { key: "stops", label: "မှတ်တိုင်များ" },
    { key: "routes", label: "ယာဉ်လိုင်းများ" },
  ];

export default function FavouriteScreen() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [busStops, setBusStops] = useState<Stop[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const activeTab = TAB_CONFIG[activeIndex].key;

  useEffect(() => {
    if (activeTab === "routes") {
      loadFavouriteRoutes();
    }

    if (activeTab === "stops") {
      loadFavouriteStops();
    }
  }, [activeTab]);

  async function loadFavouriteStops() {
    setLoading(true);

    // get favorite stop IDs from AsyncStorage
    const favoriteIds = await getStopLocalFavorites();
    if (favoriteIds.length === 0) {
      setBusStops([]);
      setLoading(false);
      return;
    }

    // fetch real stops from Supabase
    const { data, error } = await supabase
      .from("stops")
      .select("*")
      .in("id", favoriteIds);
    if (error) {
      console.warn("Failed to load favorite stops", error);
      setBusStops([]);
    } else {
      // mark them as favourite for UI
      const withFavFlag = (data ?? []).map(stop => ({
        id: stop.id,
        title_mm: stop.name_mm,
        title_en: stop.name_en,
        description: stop.road_mm ?? stop.road_en,
        lat: stop.lat,
        lng: stop.lng,
        isFavourite: true,
      }));

      setBusStops(withFavFlag);
    }

    setLoading(false);
  }

  async function loadFavouriteRoutes() {
    setLoading(true);

    // get favorite route IDs from AsyncStorage
    const favoriteIds = await getRouteLocalFavorites();

    if (favoriteIds.length === 0) {
      setRoutes([]);
      setLoading(false);
      return;
    }

    // fetch real routes from Supabase
    const { data, error } = await supabase
      .from("routes")
      .select("*")
      .in("id", favoriteIds)
      .eq("del_flg", 0);

    if (error) {
      console.warn("Failed to load favorite routes", error);
    } else {
      setRoutes(data ?? []);
    }

    setLoading(false);
  }


  return (
    <AppScreenLayout contentStyle={styles.container} backgroundColor="#FFFFFF">
      <AppHeader title="ကြိုက်နှစ်သက်မှုများ" />
      <AppNavigationTabs
        tabs={TAB_CONFIG.map((t) => t.label)}
        activeIndex={activeIndex}
        activeStates={{
          backgroundColor: "#F9F9F9",
          color: "#1F2937",
          borderColor: "#EEEEEE",
        }}
        inactiveStates={{
          backgroundColor: "#FFF",
          color: "#2F2F2F",
          borderColor: "#EEEEEE",
        }}
        navigationTabStyle={styles.navigation}
        onNavigationTabPress={setActiveIndex}
      />
      {activeTab === "stops" && <StopsListView data={busStops} />}
      {activeTab === "routes" && <RouteListView data={routes} style={{ marginTop: 20 }} />}
    </AppScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  navigation: {
    marginTop: 5,
  },
});
