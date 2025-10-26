// react
import { useEffect, useState } from "react";

// react native
import { Dimensions } from "react-native";

// expo router
import { useLocalSearchParams } from "expo-router";

import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// custom component
import AppBottomSheet from "@/components/AppBottomSheet";
import AppMapView from "@/components/AppMapView";
import CustomPolyline from "@/components/CustomPolyline";
import BusStopItem from "@/components/routeDetail/BusStopItem";
import Header from "@/components/routeDetail/Header";

// data
import routesData from "@/data/routes.json";
import BusStopData from "@/data/stops.json";
import { Route } from "@/types/route";
import { BusStop } from "@/types/stop";

const getRoute = (id: number | string): Route | null => {
  return routesData.find((route) => String(route.route_id) === String(id)) || null;
};

const getBusStop = (id: number | string): BusStop | null => {
    return BusStopData.find((stop) => stop.id == id);
}

export default function RouteDetailScreen() {
  const [routeData, setRouteData] = useState<Route | null>(null);
  const [busStops, setBusStops] = useState<BusStop[] | []>([]);
  const { width, height } = Dimensions.get("window");
  const params = useLocalSearchParams();

  useEffect(() => {
    const route = getRoute(String(params.id));
    let stops : BusStop[] = [];
    route?.stops.forEach(stop_id => {
        const stop = getBusStop(stop_id);
        if(stop) {
            stops.push(stop);
        }
     })
    setRouteData(route);
    setBusStops(stops);
  }, []);

  return (
    <GestureHandlerRootView>
      <AppMapView width={width} height={height}>
        {routeData && (
          <CustomPolyline
            color={`#${routeData.color}`}
            coordinates={routeData.shape.geometry.coordinates.map(
              ([longitude, latitude]) => ({
                latitude,
                longitude,
              })
            )}
          />
        )}
      </AppMapView>
      <AppBottomSheet
        snapPoints={["20%", "50%"]}
        scrollable={true}
        maxDynamicContentSize={height * 0.5}
      >
        {routeData && (
            <Header 
                name={routeData.name}
                stopCount={busStops.length}
            />
        )}
        <BottomSheetFlatList
          data={busStops}
          keyExtractor={(item: BusStop, index: number) => item.id}
          renderItem={({ item, index }: { item: BusStop; index: number }) => (
            <BusStopItem key={item.id} name={item.name_en} name_mm={item.name_mm} />
          )}
        />
      </AppBottomSheet>
    </GestureHandlerRootView>
  );
}
