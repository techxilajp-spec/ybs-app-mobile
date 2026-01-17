import { StyleSheet, View } from "react-native";

// bottom sheet
import {
  BottomSheetSectionList
} from "@gorhom/bottom-sheet";

// custom components
import AppText from "@/src/components/AppText";
import BusStop from "@/src/components/map/busRouteDetailSheet/routeList/BusStop";
import RouteTitle from "@/src/components/map/busRouteDetailSheet/routeList/RouteTitle";

// types
import { Route, Stop } from "@/src/types/map";

type RouteSection = {
  id: string | number;
  no: string;
  name: string;
  description: string;
  color: string;
  data: Stop[];
};

type RouteListViewProps = {
  routes: Route[];
  handleSelectBusStop: (busStop: Stop) => void;
};

export default function RouteListView({
  routes,
  handleSelectBusStop,
}: RouteListViewProps) {
  const formattedRoutes: RouteSection[] = routes.map((route) => ({
    id: route.id,
    no: route.no,
    name: route.name,
    description: route.description,
    color: route.color,
    data: route.stops,
  }));

  return (
    <View>
      {/* {header} */}
      <View style={styles.headerContainer}>
        <AppText size={16} style={styles.title}>
          စီးရမည့် ကား၏ မှတ်တိုင်များ
        </AppText>
      </View>
      <BottomSheetSectionList
        sections={formattedRoutes}
        keyExtractor={(item: RouteSection) => item.id}
        renderItem={({ item }: { item: Stop }) => (
          <BusStop
            title={item.name}
            road={item.road}
            onPress={() => handleSelectBusStop(item)}
          />
        )}
        renderSectionHeader={({ section }: { section: RouteSection }) => (
          <RouteTitle
            routeNo={section.no}
            color={section.color}
            title={section.name}
            style={styles.routeName}
          />
        )}
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
    paddingBottom: 200,
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
