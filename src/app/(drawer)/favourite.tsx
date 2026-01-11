import { StyleSheet } from "react-native";

// react
import { useEffect, useState } from "react";

// custom components
import AppHeader from "@/src/components/AppHeader";
import AppNavigationTabs from "@/src/components/AppNavigationTabs";
import AppScreenLayout from "@/src/components/AppScreenLayout";
import RouteListView from "@/src/components/favourite/RouteListView";
import StopsListView from "@/src/components/favourite/StopsListView";

import { supabase } from "@/src/utils/supabase";

// types
import {
  useGetFavoriteRoutes,
  useRemoveFavoriteRoute,
} from "@/src/hooks/favourite";
import { getStopLocalFavorites } from "@/src/services/stopFav";
import { Stop } from "@/src/types/bus";
import { favouriteRouteRequest } from "@/src/types/favourite";
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

  const activeTab = TAB_CONFIG[activeIndex].key;

  const { data: routes } = useGetFavoriteRoutes(
    activeTab || ""
  );

  const { mutate: removeFavoriteRoute } = useRemoveFavoriteRoute();

  useEffect(() => {
    if (activeTab === "stops") {
      loadFavouriteStops();
    }
  }, [activeTab]);

  async function loadFavouriteStops() {

    // get favorite stop IDs from AsyncStorage
    const favoriteIds = await getStopLocalFavorites();
    if (favoriteIds.length === 0) {
      setBusStops([]);
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
      const withFavFlag = (data ?? []).map((stop) => ({
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
  }

  const handleRemoveFavoriteRoute = (body: favouriteRouteRequest) => {
    removeFavoriteRoute(body, {
      onSuccess: () => {
        console.log("Favorite route removed");
      },
      onError: (error) => {
        console.log("Failed to remove favorite route", error);
      },
    });
  };

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
      {activeTab === "routes" && (
        <RouteListView
          data={
            routes?.map((r) => ({
              id: r.routeId?.toString(),
              no: r.routeNumberEn,
              name: r.routeName,
              description: r.routeNumberMm,
              color: r.color,
              isYps: r.isYps,
            })) || []
          }
          style={{ marginTop: 20 }}
          onPressRemoveFavoriteRoute={handleRemoveFavoriteRoute}
        />
      )}
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
