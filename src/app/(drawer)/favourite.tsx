import { StyleSheet } from "react-native";

// react
import { useCallback, useEffect, useState } from "react";

// custom components
import AppHeader from "@/src/components/AppHeader";
import AppNavigationTabs from "@/src/components/AppNavigationTabs";
import AppScreenLayout from "@/src/components/AppScreenLayout";
import StopsListView from "@/src/components/favourite/StopsListView";

// types
import api from "@/src/api";
import RouteListView from "@/src/components/favourite/RouteListView";
import {
  useGetFavoriteRoutes,
  useRemoveFavoriteRoute,
} from "@/src/hooks/favourite";
import { useGetFavoriteStops, useRemoveFavoriteStop } from "@/src/hooks/favouriteStops";
import { Route, Stop } from "@/src/types/bus";
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
  const [routes, setRoutes] = useState<Route[]>([]);

  const activeTab = TAB_CONFIG[activeIndex].key;

  const { mutate: getFavoriteRoutes } = useGetFavoriteRoutes();
  const { mutate: removeFavoriteRoute } = useRemoveFavoriteRoute();
  const { mutate: getFavoriteStops } = useGetFavoriteStops();
  const { mutate: removeFavoriteStop } = useRemoveFavoriteStop();

  useEffect(() => {
    if (activeTab === "stops") {
      getFavoriteStops(undefined, {
        onSuccess: (data) => {
          setBusStops(
            data.map((stop) => ({
              id: stop.id,
              title_mm: stop.name_mm,
              title_en: stop.name_en,
              description: stop.road_mm ?? stop.road_en,
              lat: stop.lat,
              lng: stop.lng,
              isFavourite: true,
            }))
          );
        },
        onError: () => {
          setBusStops([]);
        },
      });
    }
  }, [activeTab, getFavoriteStops]);


  const handleToggleFavoriteStop = (stopId: string) => {
    const stopIdNum = Number(stopId);
    setBusStops((prev) => prev.filter((s) => s.id !== stopId));

    removeFavoriteStop(stopIdNum, {
      onError: () => {
        console.warn("Failed to remove favorite stop");
      },
    });
  };

  useEffect(() => {
    if (activeTab === "stops") {
      loadFavouriteStops();
    }
  }, [activeTab]);

  async function loadFavouriteStops() {
    try {
      const data = await api.favouriteStopsApi.getFavoriteStops();

      const mapped: Stop[] = data.map((stop) => ({
        id: stop.id,
        title_mm: stop.name_mm,
        title_en: stop.name_en,
        description: stop.road_mm ?? stop.road_en,
        lat: stop.lat,
        lng: stop.lng,
        isFavourite: true,
      }));

      setBusStops(mapped);
    } catch (error) {
      console.warn("Failed to load favorite stops", error);
      setBusStops([]);
    }
  }


  const handleRemoveFavoriteRoute = (routeId: number) => {
    removeFavoriteRoute(routeId, {
      onSuccess: () => {
        getFavoriteRoutes(undefined, {
          onSuccess: (data) => {
            setRoutes(
              data.map((da) => ({
                id: da.id,
                no: da.number_en,
                name: da.name,
                description: da.number_mm,
                color: da.color,
                isYps: da.is_yps,
              }))
            );
          },
        });
      },
      onError: (error) => {
        console.log("Failed to remove favorite route", error);
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      if (activeTab === "routes") {
        getFavoriteRoutes(undefined, {
          onSuccess: (data) => {
            setRoutes(
              data.map((da) => ({
                id: da.id,
                no: da.number_en,
                name: da.name,
                description: da.number_mm,
                color: da.color,
                isYps: da.is_yps,
              }))
            );
          },
        });
      }
    }, [activeTab, getFavoriteRoutes])
  );

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
          data={routes}
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
