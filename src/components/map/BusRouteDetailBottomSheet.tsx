import { StyleSheet, View } from "react-native";

// react
import { useState } from "react";

// custom components
import AppBottomSheet from "@/src/components/AppBottomSheet";
import AppNavigationTabs from "@/src/components/AppNavigationTabs";
import NoticeMessage from "@/src/components/home/NoticeMessage";
import InstructionListView from "@/src/components/map/busRouteDetailSheet/InstructionListView";
import RouteListView from "@/src/components/map/busRouteDetailSheet/RouteListView";

// types
import { Route, Stop } from "@/src/types/map";

type BusRouteDetailSheetProps = {
  instructions?: any | null;
  routes: Route[];
  handleSelectBusStop: (busStop: Stop) => void;
  maxHeight: number;
  snapPoints: number[];
  activeRouteIndex: number;
  onChangeIndex?: (index: number) => void;
  onChangeRouteIndex?: (index: number) => void;
};

export default function BusRouteDetailBottomSheet({
  instructions = null,
  routes,
  handleSelectBusStop,
  snapPoints,
  maxHeight,
  activeRouteIndex,
  onChangeIndex = (index) => {},
  onChangeRouteIndex = (index) => {},
}: BusRouteDetailSheetProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const TAB_CONFIGS = [
    {
      label: "လမ်းကြောင်း Guide",
      key: "instruction",
    },
    {
      label: "မှတ်တိုင်များ",
      key: "routes",
    },
  ];

  const totalStops = routes.reduce(
    (total, route) => total + route.stops.length,
    0
  );
  TAB_CONFIGS[1].label = `${TAB_CONFIGS[1].label} ( ${totalStops} )`;
  const hasInstructions = !!instructions?.length;
  const tabConfig = hasInstructions ? TAB_CONFIGS : TAB_CONFIGS.slice(1);

  const isInstructionTab = tabConfig[activeIndex].key === TAB_CONFIGS[0].key;

  return (
    <AppBottomSheet
      snapPoints={snapPoints}
      maxDynamicContentSize={maxHeight}
      onChange={onChangeIndex}
    >
      <View style={styles.headerContainer}>
        <NoticeMessage message="မှတ်တိုင်များကိုမြင်နိုင်ရန်မြေပုံကိုအနီးကပ်ဆွဲပါ" />
        <AppNavigationTabs
          tabs={tabConfig.map((t) => t.label)}
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
          onNavigationTabPress={setActiveIndex}
          navigationTabStyle={styles.navigationTab}
        />
      </View>
      {isInstructionTab ? (
        <InstructionListView />
      ) : (
        <RouteListView
          activeRouteIndex={activeRouteIndex}
          routes={routes}
          handleSelectBusStop={handleSelectBusStop}
          onChangeRouteIndex={onChangeRouteIndex}
        />
      )}
    </AppBottomSheet>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 15,
  },
  navigationTab: {
    marginTop: 10,
    marginBottom: 20,
  },
});
