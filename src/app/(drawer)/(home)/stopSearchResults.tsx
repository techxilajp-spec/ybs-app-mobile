// react native
import { StyleSheet } from "react-native";

// react
import { useEffect, useState } from "react";

// expo router
import { useLocalSearchParams } from "expo-router";

// custom component
import AppHeader from "@/src/components/AppHeader";
import AppScreenLayout from "@/src/components/AppScreenLayout";
import AvailableRoutes from "@/src/components/stopSearchResult/AvailableRoutes";
import StopInformation from "@/src/components/stopSearchResult/StopInformation";

// hooks
import { useGetStopDetail } from "@/src/hooks/bus-stop";

// type
import { Route } from "@/src/types/bus";

export default function StopSearchResults() {
  const { stopId } = useLocalSearchParams<{ stopId: string }>();
  const { data, isLoading, error } = useGetStopDetail(String(stopId ?? ""));

  const [availableRoutes, setAvailableRoutes] = useState<Route[]>([]);

  useEffect(() => {
    if (!data) return;

    const routes = (data.routes || []).map((r: any) => ({
      id: String(r.routeId),
      no: r.routeNumberEn ?? r.routeNumberMm ?? "",
      name: r.routeName ?? "",
      description: "",
      color: r.color ?? "#000",
      isYps: !!r.isYps,
    }));

    setAvailableRoutes(routes);
  }, [data]);

  const stopName = data?.nameMm ?? data?.nameEn ?? "";
  const roadName = data?.roadMm ?? data?.roadEn ?? "";
  const townshipName = data?.townshipMm ?? data?.townshipEn ?? "";

  return (
    <AppScreenLayout contentStyle={styles.container} backgroundColor="#FFFFFF">
      <AppHeader title="ရှာဖွေမှုရလဒ်" />
      <StopInformation
        stopName={stopName}
        roadName={roadName}
        townshipName={townshipName}
        style={styles.stopInformation}
      />
      <AvailableRoutes style={styles.routeListContainer} routes={availableRoutes} />
    </AppScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  stopInformation: {
    marginTop: 30
  },
  routeListContainer: {
    marginTop: 28
  }
});
