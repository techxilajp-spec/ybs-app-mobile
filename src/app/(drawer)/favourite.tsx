import { StyleSheet } from "react-native";

import { useState } from "react";

// custom components
import AppHeader from "@/src/components/AppHeader";
import AppNavigationTabs from "@/src/components/AppNavigationTabs";
import AppScreenLayout from "@/src/components/AppScreenLayout";
import RouteListView from "@/src/components/favourite/RouteListView";
import StopsListView from "@/src/components/favourite/StopsListView";

const TAB_CONFIG = [
  {
    label: "မှတ်တိုင်များ",
    getProps: () => ({}),
    component: StopsListView,
  },
  {
    label: "ယာဉ်လိုင်းများ",
    getProps: () => ({
      style: {
        marginTop: 20
      }
    }),
    component: RouteListView
  },
];

export default function FavouriteScreen() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const { component: ActiveView, getProps } = TAB_CONFIG[activeIndex];

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
      <ActiveView {...getProps()} />
    </AppScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  navigation: {
    marginTop: 5
  }
});
