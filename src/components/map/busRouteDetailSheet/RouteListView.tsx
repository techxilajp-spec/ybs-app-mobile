import { StyleSheet, View } from "react-native";

// react
import { useState } from "react";

// bottom sheet
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";

// custom components
import AppText from "@/src/components/AppText";
import BusStop from "@/src/components/map/busRouteDetailSheet/routeList/BusStop";
import RouteTab from "@/src/components/map/busRouteDetailSheet/routeList/RouteTab";
import RouteTitle from "@/src/components/map/busRouteDetailSheet/routeList/RouteTitle";

type Stop = {
  stopTitle: string;
  stopRoad: string;
};

type Route = {
  routeNo: number | string;
  routeTitle: string;
  stops: Stop[];
};

type RouteListViewProps = {
  routes: Route[];
  header?: React.ReactNode;
};

export default function RouteListView({ routes, header }: RouteListViewProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const selectedRoute = routes[activeIndex];
  const tabs = routes.map((route) => `Bus ${route.routeNo}`);

  return (
    <View>
      {header}
      <View style={styles.headerContainer}>
        <AppText size={16} style={styles.title}>
          စီးရမည့် ကား၏ မှတ်တိုင်များ
        </AppText>
        <RouteTab
          tabs={tabs}
          activeIndex={activeIndex}
          // onTabChange={setActiveIndex}
          style={styles.routeTab}
        />
        <RouteTitle
          routeNo={selectedRoute.routeNo.toString()}
          title={selectedRoute.routeTitle}
          style={styles.routeTitle}
        />
      </View>
      <BottomSheetFlatList
        data={selectedRoute.stops}
        renderItem={({ item }: { item: Stop }) => (
          <BusStop title={item.stopTitle} road={item.stopRoad} />
        )}
        keyExtractor={(item: Stop, index: number) =>
          `${item.stopTitle}-${index}`
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 15,
  },
  contentContainer: {
    paddingBottom: 300,
  },
  title: {
    fontFamily: "MiSansMyanmar-Demibold",
    textDecorationLine: "underline",
    marginBottom: 20,
  },
  routeTab: {
    marginBottom: 20,
  },
  routeTitle: {
    marginBottom: 24,
  },
});
