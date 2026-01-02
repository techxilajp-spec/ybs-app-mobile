import { StyleSheet, View } from "react-native";

// bottom sheet
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";

// custom components
import AppText from "@/src/components/AppText";
import BusStop from "@/src/components/map/busRouteDetailSheet/routeList/BusStop";
import RouteTab from "@/src/components/map/busRouteDetailSheet/routeList/RouteTab";
import RouteTitle from "@/src/components/map/busRouteDetailSheet/routeList/RouteTitle";

// types
import { Route, Stop } from "@/src/types/map";


type RouteListViewProps = {
  routes: Route[];
  activeRouteIndex: number;
  handleSelectBusStop: (busStop: Stop) => void;
  onChangeRouteIndex?: (index: number) => void;
};

export default function RouteListView({
  routes,
  activeRouteIndex,
  handleSelectBusStop,
  onChangeRouteIndex = (index) => {},
}: RouteListViewProps) {
  const selectedRoute = routes[activeRouteIndex];
  const tabs = routes.map((route) => `Bus ${route.no}`);

  return (
    <View>
      {/* {header} */}
      <View style={styles.headerContainer}>
        <AppText size={16} style={styles.title}>
          စီးရမည့် ကား၏ မှတ်တိုင်များ
        </AppText>
        <RouteTab
          tabs={tabs}
          activeIndex={activeRouteIndex}
          onTabChange={onChangeRouteIndex}
          style={styles.routeTab}
        />
        <RouteTitle
          routeNo={selectedRoute.no}
          title={selectedRoute.name}
          style={styles.routeName}
        />
      </View>
      <BottomSheetFlatList
        data={selectedRoute.stops}
        renderItem={({ item }: { item: Stop }) => (
          <BusStop
            title={item.name}
            road={item.road}
            onPress={() => handleSelectBusStop(item)}
          />
        )}
        keyExtractor={(item: Stop, index: number) => `${item.name}-${index}`}
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
  routeName: {
    marginBottom: 24,
  },
});
