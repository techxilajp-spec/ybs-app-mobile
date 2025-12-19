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
};

export default function RouteListView({ routes }: RouteListViewProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const selectedRoute = routes[activeIndex];
  const tabs = routes.map((route) => `Bus ${route.routeNo}`);

  return (
    <View style={styles.container}>
      <AppText size={16} style={styles.title}>
        စီးရမည့် ကား၏ မှတ်တိုင်များ
      </AppText>
      <RouteTab tabs={tabs} activeIndex={activeIndex} style={styles.routeTab} />
      <RouteTitle
        routeNo={selectedRoute.routeNo.toString()}
        title={selectedRoute.routeTitle}
        style={styles.routeTitle}
      />
      <BottomSheetFlatList
        data={selectedRoute.stops}
        renderItem={({ item }: { item: Stop }) => (
          <BusStop title={item.stopTitle} road={item.stopRoad} />
        )}
        keyExtractor={(item: Stop) => item.stopTitle}
        style={{
          flex: 1,
          borderWidth: 1,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
