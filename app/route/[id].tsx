// react
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// react-native-map
import MapView, { MapMarker, Marker, Region } from "react-native-maps";

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
import stopsData from "@/data/stops.json";
import { Route } from "@/types/route";
import { BusStop } from "@/types/stop";

const getRoute = (id: string | number): Route | undefined => {
  return routesData.find((route) => route.route_id === id) as Route | undefined;
};

const getBusStop = (id: number | string): BusStop | undefined => {
  return stopsData.find((stop) => stop.id == id) as BusStop | undefined;
};

const mapAnimateDuration = 900;

export default function RouteDetailScreen() {
  const [routeData, setRouteData] = useState<Route | null>(null);
  const { width, height } = Dimensions.get("window");
  const bottomSheetHeight = useRef<number | null>(null);
  const mapRef = useRef<MapView>(null);
  const markersRef = useRef<Record<string, MapMarker | null>>({}); // markers ref
  const params = useLocalSearchParams();

  const snapPoints = useMemo(() => ["20%", "50%"], []);

  const coordinates = useMemo(() => {
    if (!routeData?.shape.geometry.coordinates) return [];
    return routeData.shape.geometry.coordinates.map(
      ([longitude, latitude]) => ({
        latitude,
        longitude,
      })
    );
  }, [routeData]);

  const busStops = useMemo(() => {
    if (!routeData?.stops) return [];
    return routeData.stops
      .map(getBusStop)
      .filter((stop): stop is BusStop => Boolean(stop));
  }, [routeData]);

  const onPressBusStopItem = (stopId: string) => {
    if (!stopId) return;

    const currentStop = busStops.find((stop) => stop.id === stopId);
    if (!currentStop) return;

    const latitudeDelta = 0.005;
    const longitudeDelta = 0.005;

    // Calculate bottom sheet height
    const point = snapPoints[0];
    const defaultHeight =
      typeof point === "string" && point.includes("%")
        ? (parseFloat(point) / 100) * height
        : Number(point);

    const sheetHeight = bottomSheetHeight.current || defaultHeight;

    // Visible map height above bottom sheet
    const visibleMapHeight = height - sheetHeight;

    // Latitude per pixel
    const latPerPixel = latitudeDelta / height;

    // Offset to move the marker to center of visible area
    const offsetLat = latPerPixel * (visibleMapHeight / 2 - height / 2);
    // height / 2 is map center, visibleMapHeight / 2 is new visual center

    const adjustedLat = Number(currentStop.lat) + offsetLat;

    mapRef.current?.animateToRegion(
      {
        latitude: adjustedLat,
        longitude: Number(currentStop.lng),
        latitudeDelta,
        longitudeDelta,
      },
      mapAnimateDuration
    );

    Object.values(markersRef.current).forEach((ref) => ref?.hideCallout());

    setTimeout(() => {
      markersRef.current[currentStop.id]?.showCallout();
    }, mapAnimateDuration + 50);
  };

  const handleSheetChanges = useCallback((index: number) => {
    console.log("Sheet is changed");
    const point = snapPoints[index];
    const numericHeight =
      typeof point === "string" && point.includes("%")
        ? (parseFloat(point) / 100) * height
        : Number(point);
    bottomSheetHeight.current = numericHeight;
  }, []);

  useEffect(() => {
    const route = getRoute(String(params.id));
    if (route) {
      setRouteData(route);
    }
  }, []);

  useEffect(() => {
    if (mapRef.current && coordinates.length > 0) {
      const start = coordinates[0];
      const region: Region = {
        ...start,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      mapRef.current.animateToRegion(region, mapAnimateDuration);
    }
  }, [coordinates]);

  return (
    <GestureHandlerRootView>
      <AppMapView ref={mapRef} width={width} height={height}>
        <CustomPolyline
          color={routeData ? `#${routeData.color}` : ""}
          coordinates={coordinates}
        />
        {busStops.map((stop, index) => (
          <Marker
            key={`${stop.id}-$${index}`}
            coordinate={{
              latitude: Number(stop.lat),
              longitude: Number(stop.lng),
            }}
            title={stop.name_en}
            description={stop.name_mm}
            ref={(ref: MapMarker | null) => {
              markersRef.current[stop.id] = ref;
            }}
          />
        ))}
      </AppMapView>
      <AppBottomSheet
        snapPoints={snapPoints}
        scrollable={true}
        maxDynamicContentSize={height * 0.5}
        onChange={handleSheetChanges}
      >
        {routeData && (
          <Header name={routeData.name} stopCount={busStops.length} />
        )}
        <BottomSheetFlatList
          data={busStops}
          keyExtractor={(item: BusStop, index: number) => item.id}
          renderItem={({ item, index }: { item: BusStop; index: number }) => (
            <BusStopItem
              key={item.id}
              name={item.name_en}
              name_mm={item.name_mm}
              onPress={() => onPressBusStopItem(item.id)}
            />
          )}
        />
      </AppBottomSheet>
    </GestureHandlerRootView>
  );
}
