import { useState } from "react";
import { StyleSheet } from "react-native";

// custom component
import AppScreenLayout from "@/src/components/AppScreenLayout";
import Header from "@/src/components/home/Header";
import NavigationTabs from "@/src/components/home/NavigationTabs";
import RouteListView from "@/src/components/home/routeList/RouteListView";
import RouteSearchView from "@/src/components/home/routeSearch/RouteSearchView";
import StopsListView from "@/src/components/home/stopsList/StopsListView";

// constants
import { Colors } from "@/src/constants/color";

const TAB_CONFIG = [
  {
    label: "Bus လမ်းကြောင်းများ",
    component: RouteSearchView,
    getProps: () => ({
    }),
  },
  {
    label: "မှတ်တိုင်များ",
    component: StopsListView,
    getProps: () => ({
    }),
  },
  {
    label: "ယာဉ်လိုင်းများ",
    component: RouteListView,
    getProps: () => ({
    }),
  },
];

export default function HomeScreen() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const { component: ActiveView, getProps } = TAB_CONFIG[activeIndex];

  return (
    <AppScreenLayout contentStyle={styles.container} backgroundColor="#FFF">
      <Header />

      <NavigationTabs
        tabs={TAB_CONFIG.map(t => t.label)}
        activeIndex={activeIndex}
        activeStates={{
          backgroundColor: Colors.primary,
          color: '#FFF',
          borderColor: Colors.primary
        }}
        inactiveStates={{
          backgroundColor: Colors.secondary,
          color: '#2F2F2F',
          borderColor: '#EEEEEE'
        }}
        navigationTabStyle={{
          marginTop: 30,
          marginBottom: 18,
        }}
        onNavigationTabPress={setActiveIndex}
      />

      <ActiveView  {...getProps()} />
    </AppScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20
  },
});
