import { StyleSheet } from "react-native";

// react
import { useEffect, useState } from "react";

// custom components
import AppHeader from "@/src/components/AppHeader";
import AppNavigationTabs from "@/src/components/AppNavigationTabs";
import AppScreenLayout from "@/src/components/AppScreenLayout";
import RouteListView from "@/src/components/favourite/RouteListView";
import StopsListView from "@/src/components/favourite/StopsListView";

// data
import ROUTE_LIST from "@/src/data/routes.json";
import STOP_LIST from "@/src/data/stops.json";

// types
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

  const activeTab = TAB_CONFIG[activeIndex].key;

  useEffect(() => {
    setBusStops(STOP_LIST);
    setRoutes(ROUTE_LIST);
  }, [])

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
