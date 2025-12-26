// react
import { useEffect, useRef, useState } from "react";

// react native
import { Dimensions, StyleSheet, View } from "react-native";

// expo map
import MapView, { LatLng, MapMarker, PROVIDER_GOOGLE, Region } from "react-native-maps";

// expo router
import { router } from "expo-router";

// icons
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";

// expo router
import { useLocalSearchParams } from "expo-router";

// custom components
import AppScreenLayout from "@/src/components/AppScreenLayout";
import BusPin from "@/src/components/map/BusPin";
import BusPolyLine from "@/src/components/map/BusPolyLine";
import BusRouteDetailBottomSheet from "@/src/components/map/BusRouteDetailBottomSheet";
import EdgePin from "@/src/components/map/EdgePin";
import Button from "@/src/components/routeDetail/Button";

// stores
import { useRouteSearchResultsStore } from "@/src/stores/useRouteSearchResultsStore";

// data
import yangonRegion from "@/src/data/yangonRegion.json";

type Stop = {
  id: string;
  name: string;
  road: string;
  coordinate: LatLng;
};

const INITIAL_LATITUDE_DELTA = 0.3;
const INITIAL_LONGITUDE_DELTA = 0.3;
const LATITUDE_DELTA = 0.05;
const LONGITUDE_DELTA = 0.05;

export default function routeSearchDetail() {
  const [region, setRegion] = useState<Region>(yangonRegion);
  const [activeRouteIndex, setActiveRouteIndex] = useState<number>(0);
  const bottomSheetHeight = useRef<number>(100);
  const mapRef = useRef<InstanceType<typeof MapView> | null>(null);
  const markersRef = useRef<Record<string, MapMarker | null>>({});

  const { height: screenHeight } = Dimensions.get("screen");
  const bottomSheetMaxHeight = screenHeight * 0.65;
  const bottomSheetSnapPoints = [100, bottomSheetMaxHeight];

  const { id: routeId } = useLocalSearchParams<{ id: string }>();
  const searchedResults = useRouteSearchResultsStore((s) => s.routes);
  const searchedRoute = searchedResults.find(
    (route) => route.id.toString() === routeId
  );

  const routeList = searchedRoute ? searchedRoute.routes : [];

  const activeRoute = searchedRoute
    ? searchedRoute.routes[activeRouteIndex]
    : null;

  const onBackPress = () => {
    router.back();
  };

  const onAddFavourite = () => {
    // TODO: implement favourite logic
  };

  const onChangeRouteDetailBottomSheetIndex = (index: number) => {
    bottomSheetHeight.current = index == 0 ? bottomSheetSnapPoints[0] : bottomSheetMaxHeight;
  };

  const handleSelectBusStop = (busStop: Stop | null | undefined) => {
    if(!busStop) return;
    // hide all stop callouts
    Object.values(markersRef.current).forEach((ref) => ref?.hideCallout());

    // show selected stop callout
    markersRef.current[busStop.id]?.showCallout();

    // Calculate vertical map offset caused by bottom sheet
    const verticalOffsetRatio = bottomSheetHeight.current / screenHeight;
    const latitudeOffset = verticalOffsetRatio * LATITUDE_DELTA;

    const targetRegion = {
      latitude: busStop.coordinate.latitude - latitudeOffset,
      longitude: busStop.coordinate.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };

    mapRef.current?.animateToRegion(targetRegion, 500);
  };

  const onPressBusPin = (busStop: Stop) => {
    markersRef?.current[busStop.id]?.showCallout();
    // Calculate vertical map offset caused by bottom sheet
    const verticalOffsetRatio = bottomSheetHeight.current / screenHeight;
    const latitudeOffset = verticalOffsetRatio * LATITUDE_DELTA;

    const targetRegion = {
      latitude: busStop.coordinate.latitude - latitudeOffset,
      longitude: busStop.coordinate.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };

    mapRef.current?.animateToRegion(targetRegion, 500);
  }

  const onChangeRoute = (index: number) => {
    setActiveRouteIndex(index);
    markersRef.current = {};
  };

  useEffect(() => {
    setRegion({
      ...yangonRegion,
      latitudeDelta: INITIAL_LATITUDE_DELTA,
      longitudeDelta: INITIAL_LONGITUDE_DELTA,
    });
  }, []);

  useEffect(() => {
    handleSelectBusStop(activeRoute?.stops[0]);
  }, [activeRouteIndex])

  if (!searchedRoute) {
    return null;
  }

  return (
    <AppScreenLayout>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.mapContainer}
          region={region}
          initialRegion={yangonRegion}
          provider={PROVIDER_GOOGLE}
          mapType="standard"
          showsCompass={false}
          showsBuildings={true}
          showsIndoors={true}
          loadingEnabled={true}
          loadingIndicatorColor="#666666"
          loadingBackgroundColor="#eeeeee"
        >
          {activeRoute && (
            <>
              <BusPolyLine
                coordinates={activeRoute.coordinates}
                color={activeRoute.color}
              />
              {activeRoute.stops.map((stop, index) => {
                const isEdge =
                  index === 0 || index === activeRoute.stops.length - 1;
                const PinComponent = isEdge ? EdgePin : BusPin;
                return (
                  <PinComponent
                    ref={(ref: MapMarker | null) => {
                      markersRef.current[stop.id] = ref;
                    }}
                    key={`${stop.id}-${stop.coordinate.latitude}-${stop.coordinate.longitude}`}
                    coordinate={stop.coordinate}
                    title={`${index}-${stop.name}`}
                    onPress={() => onPressBusPin(stop)}
                  />
                );
              })}
            </>
          )}
        </MapView>
        <Button
          style={styles.backButton}
          icon={<Ionicons name="arrow-back-sharp" size={20} color="#101828" />}
          onPress={onBackPress}
        />
        <Button
          style={styles.favouriteIcon}
          icon={<Feather name="heart" size={20} color="#101828" />}
          onPress={onAddFavourite}
        />
        <BusRouteDetailBottomSheet
          routes={routeList}
          maxHeight={bottomSheetMaxHeight}
          snapPoints={bottomSheetSnapPoints}
          handleSelectBusStop={handleSelectBusStop}
          activeRouteIndex={activeRouteIndex}
          onChangeRouteIndex={onChangeRoute}
          onChangeIndex={onChangeRouteDetailBottomSheetIndex}
        />
      </View>
    </AppScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  mapContainer: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 15,
    left: 20,
  },
  favouriteIcon: {
    position: "absolute",
    top: 15,
    right: 20,
  },
});
