import { StyleSheet } from "react-native";

// react
import { useEffect, useMemo, useState } from "react";

// custom components
import AppHeader from "@/src/components/AppHeader";
import AppNavigationTabs from "@/src/components/AppNavigationTabs";
import AppScreenLayout from "@/src/components/AppScreenLayout";
import RouteListView from "@/src/components/favourite/RouteListView";
import StopsListView from "@/src/components/favourite/StopsListView";

// constants
import { Message } from "@/src/constants/message";

// utils
import { showErrorToast } from "@/src/utils/toast";

// data
import {
  useGetFavoriteRoutes,
  useRemoveFavoriteRoute,
} from "@/src/hooks/favourite";
import {
  useGetFavoriteStops,
  useRemoveFavoriteStop,
} from "@/src/hooks/favouriteStops";

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
  const activeTab = TAB_CONFIG[activeIndex].key;

  // favourite routes
  const { data: favouriteRouteDatas, isError: isFavouriteRouteError } =
    useGetFavoriteRoutes();
  const favouriteRoutes = useMemo(() => {
    if (!favouriteRouteDatas) return [];
    return favouriteRouteDatas.map((route) => ({
      id: route.routeId.toString(),
      no: route.routeNumberEn,
      name: route.routeName,
      description: route.busStopNamesMm,
      color: route.routeColor,
      isYps: route.isYps,
    }));
  }, [favouriteRouteDatas]);
  const { mutate: removeFavoriteRoute } = useRemoveFavoriteRoute();

  // favourite stops
  const { data: favouriteStopDatas, isError: isFavouriteStopError } =
    useGetFavoriteStops();
  const favouriteStops = useMemo(() => {
    if (!favouriteStopDatas) return [];
    return favouriteStopDatas.map((stop) => ({
      id: stop.id,
      name_mm: stop.name_mm,
      name_en: stop.name_en,
      road_mm: stop.road_mm,
      road_en: stop.road_en,
      lat: stop.lat,
      lng: stop.lng,
      township_id: stop.township_id,
      bus_numbers: stop.bus_numbers,
      isFavourite: true,
    }));
  }, [favouriteStopDatas]);
  const { mutate: removeFavoriteStop } = useRemoveFavoriteStop();

  const handleToggleFavoriteStop = (stopId: number) => {
    if (!stopId) return;
    removeFavoriteStop(stopId);
  };

  const handleRemoveFavoriteRoute = (routeId: number) => {
    if (!routeId) return;
    removeFavoriteRoute(routeId);
  };

  useEffect(() => {
    if (isFavouriteRouteError || isFavouriteStopError) {
      console.log("Face error");
      const title = Message.error.something_wrong;
      const message = isFavouriteRouteError
        ? Message.error.route_list
        : Message.error.stop_not_found;
      showErrorToast(title, message);
    }
  }, [isFavouriteStopError, isFavouriteRouteError]);

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
      {activeTab === "stops" && (
        <StopsListView
          data={favouriteStops}
          onToggleFavourite={handleToggleFavoriteStop}
        />
      )}
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
