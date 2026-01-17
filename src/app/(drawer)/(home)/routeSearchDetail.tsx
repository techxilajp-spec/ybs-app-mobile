// react
import { useEffect, useRef, useState } from "react";

// react native
import { Alert, Dimensions, StyleSheet, View } from "react-native";

// expo map
import MapView, { MapMarker, PROVIDER_GOOGLE, Region } from "react-native-maps";

// expo location
import * as Location from "expo-location";

// expo router
import { router, useLocalSearchParams } from "expo-router";

// icons
import Ionicons from "@expo/vector-icons/Ionicons";

// custom components
import AppScreenLayout from "@/src/components/AppScreenLayout";
import BusPin from "@/src/components/map/BusPin";
import BusPolyLine from "@/src/components/map/BusPolyLine";
import BusRouteDetailBottomSheet from "@/src/components/map/BusRouteDetailBottomSheet";
import EdgePin from "@/src/components/map/EdgePin";
import Button from "@/src/components/routeDetail/Button";

// stores
import { useRouteSearchResultsStore } from "@/src/stores/useRouteSearchResultsStore";

// constants
import { MAP_DELTA, MAP_LOCATIONS } from "@/src/constants/map";

import { Stop } from "@/src/types/map";

export default function RouteSearchDetail() {
  const { YANGON } = MAP_LOCATIONS;

  const [region, setRegion] = useState<Region>(YANGON);

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
  const stops = routeList.flatMap((route) => route.stops);

  useEffect(() => {
    setRegion({
      ...YANGON,
      latitudeDelta: MAP_DELTA.INITIAL.LATITUDE,
      longitudeDelta: MAP_DELTA.INITIAL.LONGITUDE,
    });
    handleSelectBusStop(stops[0]);

    // ask location permission
    async function requestPremission() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied!",
          "Permission to access location was denied"
        );
        return;
      }
    }

    requestPremission();
  }, []);

  /**
   * Navigates back to the previous screen
   */
  const onBackPress = () => {
    router.back();
  };

  /**
   * Updates the bottom sheet height based on its current index.
   * @param index
   */
  const onChangeRouteDetailBottomSheetIndex = (index: number) => {
    bottomSheetHeight.current =
      index === 0 ? bottomSheetSnapPoints[0] : bottomSheetMaxHeight;
  };

  /**
   * Animates the map to focus on a specific bus stop
   * @param stop
   */
  const animateToStop = (stop: Stop) => {
    const offsetRatio = bottomSheetHeight.current / screenHeight;
    const adjustedLatitude =
      stop.coordinate.latitude - offsetRatio * MAP_DELTA.DEFAULT.LATITUDE;

    mapRef.current?.animateToRegion(
      {
        latitude: adjustedLatitude,
        longitude: stop.coordinate.longitude,
        latitudeDelta: MAP_DELTA.DEFAULT.LATITUDE,
        longitudeDelta: MAP_DELTA.DEFAULT.LONGITUDE,
      },
      500
    );
  };

  /**
   * Selects a bus stop by showing its callout on the map
   * @param busStop
   */
  const handleSelectBusStop = (busStop: Stop | null | undefined) => {
    if (!busStop) return;
    // hide all stop callouts
    Object.values(markersRef.current).forEach((ref) => ref?.hideCallout());
    // show selected stop callout
    markersRef.current[busStop.id]?.showCallout();
    animateToStop(busStop);
  };

  /**
   *  Handles tapping a bus stop pin by showing its callout
   * and centering the map on the stop.
   *
   * @param busStop
   */
  const onPressBusPin = (busStop: Stop) => {
    markersRef?.current[busStop.id]?.showCallout();
    animateToStop(busStop);
  };

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
          initialRegion={YANGON}
          provider={PROVIDER_GOOGLE}
          mapType="standard"
          showsCompass={false}
          showsBuildings={true}
          showsIndoors={true}
          loadingEnabled={true}
          loadingIndicatorColor="#666666"
          loadingBackgroundColor="#eeeeee"
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {routeList.map((route) => (
            <>
              <BusPolyLine
                coordinates={route.coordinates}
                color={route.color}
              />
            </>
          ))}
          {stops.map((stop, index) => {
            const isEdge = index === 0 || index === stops.length - 1;
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
        </MapView>
        <Button
          style={styles.backButton}
          icon={<Ionicons name="arrow-back-sharp" size={20} color="#101828" />}
          onPress={onBackPress}
        />
        <BusRouteDetailBottomSheet
          routes={routeList}
          maxHeight={bottomSheetMaxHeight}
          snapPoints={bottomSheetSnapPoints}
          handleSelectBusStop={handleSelectBusStop}
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
    top: 8,
    left: 20,
  },
  favouriteIcon: {
    position: "absolute",
    top: 15,
    right: 20,
  },
  favouriteIconActive: {
    backgroundColor: "red",
  },
});
