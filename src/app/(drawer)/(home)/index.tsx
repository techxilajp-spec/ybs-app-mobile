import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ImageBackground,
  StyleSheet,
  View,
} from "react-native";

// custom component`
import NavigationTabs from "@/src/components/AppNavigationTabs";
import AppScreenLayout from "@/src/components/AppScreenLayout";
import AdvertisementModal from "@/src/components/home/AdvertisementModal";
import Header from "@/src/components/home/Header";
import RouteListView from "@/src/components/home/routeList/RouteListView";
import RouteSearchView from "@/src/components/home/routeSearch/RouteSearchView";
import StopsListView from "@/src/components/home/stopsList/StopsListView";

// stores
import { useAdvertisementStore } from "@/src/stores/useAdvertisementStore";

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

const HORIZONTAL_PADDING = 20;

export default function HomeScreen() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const { width: screenWidth } = Dimensions.get("window");
  const contentViewWidth = screenWidth - HORIZONTAL_PADDING * 2;

  const advertisement = useAdvertisementStore((s) => s.advertisement);
  const hasSeenAdvertisement = useAdvertisementStore(
    (s) => s.hasSeenAdvertisement
  );
  const setHasSeenAdvertisement = useAdvertisementStore(
    (s) => s.setHasSeenAdvertisement
  );
  const hideAdvertisement = () => {
    setHasSeenAdvertisement(true);
  };

  const onTabPress = (index: number) => {
    setActiveIndex(index);
    Animated.timing(translateX, {
      toValue: -index * contentViewWidth,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      {advertisement && (
        <AdvertisementModal
          visible={!hasSeenAdvertisement}
          onClose={hideAdvertisement}
          data={advertisement}
        />
      )}
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
            onNavigationTabPress={onTabPress}
          />
          {/* <ActiveView /> */}
          <View style={styles.sliderContainer}>
            <Animated.View
              style={[
                styles.slider,
                {
                  width: contentViewWidth * TAB_CONFIG.length,
                  transform: [{ translateX }],
                },
              ]}
            >
              {TAB_CONFIG.map(({ component: Component }, index) => {
                const opacity = translateX.interpolate({
                  inputRange: [
                    -(index + 1) * contentViewWidth,
                    -index * contentViewWidth,
                    -(index - 1) * contentViewWidth,
                  ],
                  outputRange: [0, 1, 0],
                  extrapolate: "clamp",
                });

                return (
                  <Animated.View
                    key={index}
                    style={{
                      width: contentViewWidth,
                      flex: 1,
                      opacity,
                    }}
                  >
                    <Component />
                  </Animated.View>
                );
              })}
            </Animated.View>
          </View>
        </AppScreenLayout>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  sliderContainer: {
    flex: 1,
    overflow: "hidden",
  },
  slider: {
    flexDirection: "row",
    flex: 1,
  },
});
