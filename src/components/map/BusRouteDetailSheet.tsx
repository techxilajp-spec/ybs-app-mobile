import { StyleSheet, View } from "react-native";

// react
import { useState } from "react";

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

  const isInstructionTab = tabConfig[activeIndex].key === TAB_CONFIGS[0].key;

  const headerContent = (
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
  );

  return (
    <AppBottomSheet snapPoints={["20%", "40%"]}>
      {isInstructionTab ? (
        <InstructionListView />
      ) : (
        <RouteListView routes={routes} header={headerContent} />
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