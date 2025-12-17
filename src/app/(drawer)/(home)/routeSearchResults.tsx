// react native
import { StyleSheet } from "react-native";

// react
import { useState } from "react";

// custom components
import AppHeader from "@/src/components/AppHeader";
import NavigationTabs from "@/src/components/AppNavigationTabs";
import AppScreenLayout from "@/src/components/AppScreenLayout";
import AvailableLinesView from "@/src/components/routeSearchResult/AvailableLinesView";
import AvailableRoutesView from "@/src/components/routeSearchResult/AvailableRoutesView";

const TAB_CONFIG = [
  {
    label: "လမ်းကြောင်း",
    component: AvailableRoutesView,
    getProps: () => ({}),
  },
  {
    label: "ရောက်သည့်ယာဉ်လိုင်းများ",
    component: AvailableLinesView,
    getProps: () => ({}),
  },
];

export default function RouteSearchResultScreen() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const { component: ActiveView, getProps } = TAB_CONFIG[activeIndex];

  return (
    <AppScreenLayout contentStyle={styles.container} backgroundColor="#FFFFFF">
      <AppHeader title="ရှာဖွေမှုရလဒ်" />

      <NavigationTabs
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

      <ActiveView  {...getProps()} />
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
