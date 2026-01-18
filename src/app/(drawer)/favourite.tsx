import { StyleSheet } from "react-native";

// react
import { useCallback, useMemo, useState } from "react";

// custom components
import AppHeader from "@/src/components/AppHeader";
import AppNavigationTabs from "@/src/components/AppNavigationTabs";
import AppScreenLayout from "@/src/components/AppScreenLayout";
import StopsListView from "@/src/components/favourite/StopsListView";

// types
import RouteListView from "@/src/components/favourite/RouteListView";
import {
  useGetFavoriteRoutes,
  useRemoveFavoriteRoute,
} from "@/src/hooks/favourite";
import { useGetFavoriteStops, useRemoveFavoriteStop } from "@/src/hooks/favouriteStops";
import { Stop } from "@/src/types/bus";
import { useFocusEffect } from "@react-navigation/native";

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

  const { data: favouriteRouteDatas, error } = useGetFavoriteRoutes();
  const favouriteRoutes = useMemo(() => {
    if(!favouriteRouteDatas) return [];
    return favouriteRouteDatas.map(route => ({
      id: route.routeId.toString(),
      no: route.routeNumberEn,
      name: route.routeName,
      description: route.busStopNamesMm,
      color: route.routeColor,
      isYps: route.isYps
    }))
  }, [favouriteRouteDatas])
  const { mutate: removeFavoriteRoute } = useRemoveFavoriteRoute();
  
  const { mutate: getFavoriteStops } = useGetFavoriteStops();
  const { mutate: removeFavoriteStop } = useRemoveFavoriteStop();

  useFocusEffect(
    useCallback(() => {
      if (activeTab === "stops") {
        getFavoriteStops(undefined, {
          onSuccess: (data: Stop[]) => {
            setBusStops(
              data.map((stop) => ({
                id: stop.id,
                name_mm: stop.name_mm,
                name_en: stop.name_en,
                road_mm: stop.road_mm,
                road_en: stop.road_en,
                lat: stop.lat,
                lng: stop.lng,
                township_id : stop.township_id,
                bus_numbers : stop.bus_numbers,
                isFavourite: true,
              }))
            );
          },
          onError: () => {
            setBusStops([]);
          },
        });
      }
    }, [activeTab, getFavoriteStops])
  )



  const handleToggleFavoriteStop = (stopId: number) => {
    const stopIdNum = Number(stopId);
    setBusStops((prev) => prev.filter((s) => s.id !== stopId));

    removeFavoriteStop(stopIdNum, {
      onError: () => {
        console.warn("Failed to remove favorite stop");
      },
    });
  };

  const handleRemoveFavoriteRoute = (routeId: number) => {
    if(!routeId) return;
    removeFavoriteRoute(routeId);
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
      {activeTab === "stops" && <StopsListView
        data={busStops}
        onToggleFavourite={handleToggleFavoriteStop}
      />}
      {activeTab === "routes" && (
        <RouteListView
          data={favouriteRoutes}
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
