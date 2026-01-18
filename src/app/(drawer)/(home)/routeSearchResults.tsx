// react native
import { StyleSheet } from "react-native";

// react
import { useMemo, useState } from "react";

// custom components
import AppHeader from "@/src/components/AppHeader";
import NavigationTabs from "@/src/components/AppNavigationTabs";
import AppScreenLayout from "@/src/components/AppScreenLayout";
import AvailableLinesView from "@/src/components/routeSearchResult/AvailableLinesView";
import AvailableRoutesView from "@/src/components/routeSearchResult/AvailableRoutesView";

// store
import { useRouteSearchResultsStore } from "@/src/stores/useRouteSearchResultsStore";

// types
type TabKey = "routes" | "lines";

// tab configuration
const TABS: { key: TabKey; label: string }[] = [
  { key: "routes", label: "လမ်းကြောင်း" },
  { key: "lines", label: "ရောက်သည့်ယာဉ်လိုင်းများ" },
];

export default function RouteSearchResultScreen() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const activeTabKey = TABS[activeTabIndex].key;

  // read store once; used only for passing data between screens
  const routeData = useRouteSearchResultsStore.getState().routes || [];

  /**
   * Flatten all routes from search results into a single list
   * for rendering available lines. Calculated once.
   */
  const flattenedRoutes = useMemo(() => {
    if (!routeData || routeData.length === 0) return [];

    const allRoutes = routeData?.flatMap((item) =>
      item.routes.map((route) => ({
        id: String(route.id),
        no: route.no,
        name: route.name,
        description: route.description,
        color: route.color,
        isYps: route.isYps,
      }))
    );

    // Deduplicate by ID
    const uniqueRoutesMap = new Map();
    allRoutes.forEach((route) => {
      if (!uniqueRoutesMap.has(route.id)) {
        uniqueRoutesMap.set(route.id, route);
      }
    });

    return Array.from(uniqueRoutesMap.values());
  }, [routeData]);

  return (
    <AppScreenLayout contentStyle={styles.container} backgroundColor="#FFFFFF">
      <AppHeader title="ရှာဖွေမှုရလဒ်" />
      <NavigationTabs
        tabs={TABS.map((t) => t.label)}
        activeIndex={activeTabIndex}
        onNavigationTabPress={setActiveTabIndex}
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
      />

      {activeTabKey === "routes" && <AvailableRoutesView routes={routeData} />}
      {activeTabKey === "lines" && <AvailableLinesView lines={flattenedRoutes} />}
    </AppScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  navigation: {
    marginTop: 30,
    marginBottom: 18,
  },
});
