import { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// custom component
import Header from "@/src/components/home/Header";
import NavigationTabs from "@/src/components/home/NavigationTabs";
import RouteListView from "@/src/components/home/RouteListView";
import RouteSearchView from "@/src/components/home/RouteSearchView";
import StopsListView from "@/src/components/home/StopsListView";

const TABS = ["Bus လမ်းကြောင်းများ", "မှတ်တိုင်များ", "ယာဉ်လိုင်းများ"];

const VIEWS = [RouteSearchView, StopsListView, RouteListView];

export default function HomeScreen() {
  const [activeIndex, setActiveIndex] = useState(0);

  const ActiveView = VIEWS[activeIndex];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
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
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#FFF",
  },
});
