import { useState } from "react";
import { ImageBackground, StyleSheet } from "react-native";

// custom component
import NavigationTabs from "@/src/components/AppNavigationTabs";
import AppScreenLayout from "@/src/components/AppScreenLayout";
import AdvertisementModal from "@/src/components/home/AdvertisementModal";
import Header from "@/src/components/home/Header";
import RouteListView from "@/src/components/home/routeList/RouteListView";
import RouteSearchView from "@/src/components/home/routeSearch/RouteSearchView";
import StopsListView from "@/src/components/home/stopsList/StopsListView";

// constants
import { Colors } from "@/src/constants/color";

const TAB_CONFIG = [
  {
    label: "လမ်းကြောင်းရှာမယ်",
    component: RouteSearchView,
  },
  {
    label: "မှတ်တိုင်များ",
    component: StopsListView,
  },
  {
    label: "ယာဉ်လိုင်းများ",
    component: RouteListView,
  },
];

export default function HomeScreen() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isAdvertisementVisible, setIsAdvertisementVisible] =
    useState<boolean>(true);
  const { component: ActiveView } = TAB_CONFIG[activeIndex];

  const hideAdvertisement = () => {
    setIsAdvertisementVisible(false);
  };

  return (
    <>
      <AdvertisementModal
        visible={isAdvertisementVisible}
        onClose={hideAdvertisement}
      />
      <ImageBackground
        style={{ flex: 1 }}
        resizeMode="cover"
        source={require("@/assets/images/app_background.png")}
      >
        <AppScreenLayout contentStyle={styles.container}>
          <Header />
          <NavigationTabs
            tabs={TAB_CONFIG.map((t) => t.label)}
            activeIndex={activeIndex}
            activeStates={{
              backgroundColor: Colors.primary,
              color: "#FFF",
              borderColor: Colors.primary,
            }}
            inactiveStates={{
              backgroundColor: Colors.secondary,
              color: Colors.text.primary,
              borderColor: "#EEEEEE",
            }}
            navigationTabStyle={{
              marginTop: 30,
              marginBottom: 18,
            }}
            onNavigationTabPress={setActiveIndex}
          />
          <ActiveView />
        </AppScreenLayout>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
});
