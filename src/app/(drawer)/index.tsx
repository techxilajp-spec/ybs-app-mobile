import { useState } from "react";
import { StyleSheet } from "react-native";

// custom component
import AppScreenLayout from "@/src/components/AppScreenLayout";
import Header from "@/src/components/home/Header";
import NavigationTabs from "@/src/components/home/NavigationTabs";
import RouteListView from "@/src/components/home/routeList/RouteListView";
import RouteSearchView from "@/src/components/home/routeSearch/RouteSearchView";
import StopsListView from "@/src/components/home/stopsList/StopsListView";

const TABS = ["Bus လမ်းကြောင်းများ", "မှတ်တိုင်များ", "ယာဉ်လိုင်းများ"];
const VIEWS = [RouteSearchView, StopsListView, RouteListView];

export default function HomeScreen() {
  const [activeIndex, setActiveIndex] = useState(0);

  const ActiveView = VIEWS[activeIndex];

  return (
    <AppScreenLayout contentStyle={styles.container} backgroundColor="#FFF">
      <Header />

      <NavigationTabs
        tabs={TABS}
        activeIndex={activeIndex}
        navigationTabStyle={{
          marginTop: 30,
          marginBottom: 18,
        }}
        onNavigationTabPress={setActiveIndex}
      />

      <ActiveView />
    </AppScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20
  },
});
