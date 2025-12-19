import { StyleSheet } from "react-native";

// react
import { useState } from "react";

// bottom sheet
import { BottomSheetView } from "@gorhom/bottom-sheet";

// custom components
import AppBottomSheet from "@/src/components/AppBottomSheet";
import AppNavigationTabs from "@/src/components/AppNavigationTabs";
import NoticeMessage from "@/src/components/home/NoticeMessage";
import InstructionListView from "@/src/components/map/busRouteDetailSheet/InstructionListView";
import RouteListView from "@/src/components/map/busRouteDetailSheet/RouteListView";

type Instructions = any;
type Route = any;

type BusRouteDetailSheetProps = {
  instructions?: Instructions[] | null;
  routes: Route;
};

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

export default function BusRouteDetailSheet({
  instructions = null,
  routes,
}: BusRouteDetailSheetProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const hasInstructions = !!instructions?.length;
  const tabConfig = hasInstructions ? TAB_CONFIGS : TAB_CONFIGS.slice(1);

  return (
    <AppBottomSheet snapPoints={["20%", "40%"]} scrollable={true}>
      <BottomSheetView style={styles.bottomSheetContainer}>
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
        {tabConfig[activeIndex].key === TAB_CONFIGS[0].key ? (
          <InstructionListView />
        ) : (
          <RouteListView routes={routes} />
        )}
      </BottomSheetView>
    </AppBottomSheet>
  );
}

const styles = StyleSheet.create({
  bottomSheetContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingBottom: 22,
  },
  navigationTab: {
    marginTop: 10,
    marginBottom: 20,
  },
});
