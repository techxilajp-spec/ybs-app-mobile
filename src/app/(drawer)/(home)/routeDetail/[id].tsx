// react native
import { Alert, Dimensions, StyleSheet, View } from "react-native";

// react
import { useEffect, useMemo, useRef, useState } from "react";

// expo router
import { router, useLocalSearchParams } from "expo-router";

// react-native-map
import MapView, {
  LatLng,
  MapMarker,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";

// expo location
import * as Location from "expo-location";

// icons
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";

// custom components
import AppScreenLayout from "@/src/components/AppScreenLayout";
import BusPin from "@/src/components/map/BusPin";
import BusPolyLine from "@/src/components/map/BusPolyLine";
import BusRouteDetailBottomSheet from "@/src/components/map/BusRouteDetailBottomSheet";
import EdgePin from "@/src/components/map/EdgePin";
import Button from "@/src/components/routeDetail/Button";

// constants
import { MAP_DELTA, MAP_LOCATIONS } from "@/src/constants/map";

// data
import { useGetRouteDetail, useIncreaseRouteView } from "@/src/hooks/bus-route";
import {
  useAddFavoriteRoute,
  useGetFavoriteRouteIds,
  useRemoveFavoriteRoute,
} from "@/src/hooks/favourite-route";

// types
import { Stop } from "@/src/types/map";

export default function RouteDetail() {
  const { YANGON } = MAP_LOCATIONS;

  const [region] = useState<Region>(YANGON);
  const [userLocation, setUserLocation] =
    useState<Location.LocationObject | null>(null);

  const bottomSheetHeight = useRef<number>(100);
  const mapRef = useRef<InstanceType<typeof MapView> | null>(null);
  const markersRef = useRef<Record<string, MapMarker | null>>({});
  const hasFitted = useRef<boolean>(false);
  // const userMarkerRef = useRef<MapMarker | null>(null);

  const { height: screenHeight } = Dimensions.get("screen");
  const bottomSheetMaxHeight = screenHeight * 0.55;
  const bottomSheetSnapPoints = [100, bottomSheetMaxHeight];

  const { id: routeId } = useLocalSearchParams<{ id: string }>();

  const { data: favouriteIds = [] } = useGetFavoriteRouteIds();
  const favouriteIdSet = useMemo(() => new Set(favouriteIds), [favouriteIds]);
  const isFavouriteRoute = favouriteIdSet.has(Number(routeId));

  const { mutate: addFavoriteRoute } = useAddFavoriteRoute();
  const { mutate: removeFavoriteRoute } = useRemoveFavoriteRoute();
  const { mutate: increaseRoute } = useIncreaseRouteView();
  const { data: routeData, isSuccess: isRouteDataSuccess } =
    useGetRouteDetail(routeId);
  // parsed data
  const route = useMemo(() => {
    if (!routeData) return null;
    return {
      id: routeData.routeId,
      no: routeData.routeNumberEn,
      name: routeData.routeName,
      description: "",
      color: `#${routeData.color}`,
      isYps: routeData.isYps,
      coordinates: routeData.coordinates.map(([lng, lat]) => ({
        latitude: lat,
        longitude: lng,
      })),
      stops: routeData.stops.map((stop) => ({
        id: stop.stopId,
        name: stop.name_mm,
        road: stop.road_mm,
        coordinate: {
          latitude: stop.lat,
          longitude: stop.lng,
        },
      })),
    };
  }, [routeData]);

  useEffect(() => {
    if (!isRouteDataSuccess) return;
    if (hasFitted.current) return;
    if (!route?.coordinates?.length) return;
    mapRef?.current?.fitToCoordinates(route.coordinates, {
      edgePadding: {
        top: 80,
        right: 40,
        bottom: bottomSheetMaxHeight + 40,
        left: 40,
      },
    });
    hasFitted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeData, isRouteDataSuccess]);

  useEffect(() => {
    let locationSubscriber: Location.LocationSubscription | null = null;

    // request location permission
    async function watchUserLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied!",
          "Permission to access location was denied"
        );
        return;
      }

      locationSubscriber = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 20,
        },
        (newLocation) => {
          setUserLocation(newLocation);
        }
      );
    }

    watchUserLocation();

    return () => {
      if (locationSubscriber) {
        locationSubscriber.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!routeId) return;
    // increase route view
    increaseRoute(Number(routeId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeId]);

  /**
   * Navigates back to the previous screen
   */
  const onBackPress = () => {
    router.back();
  };

  const toggleFavourite = () => {
    if (!route) return;
    if (isFavouriteRoute) {
      removeFavoriteRoute(route.id);
    } else {
      addFavoriteRoute(route.id);
    }
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
   * Animates the map to focus on a specific location
   * @param coordinates
   */
  const animateToLocation = (coordinates: LatLng) => {
    const { latitude, longitude } = coordinates;
    const offsetRatio = bottomSheetHeight.current / screenHeight;
    const adjustedLatitude = latitude - offsetRatio * MAP_DELTA.CLOSE.LATITUDE;

    mapRef.current?.animateToRegion(
      {
        latitude: adjustedLatitude,
        longitude: longitude,
        latitudeDelta: MAP_DELTA.CLOSE.LATITUDE,
        longitudeDelta: MAP_DELTA.CLOSE.LONGITUDE,
      },
      500
    );
  };

  /**
   * Selects a bus stop by showing its callout on the map
   * @param busStop
   */
  const handleSelectBusStop = (busStop: Stop) => {
    // hide all stop callouts
    Object.values(markersRef.current).forEach((ref) => ref?.hideCallout());
    // show selected stop callout
    markersRef.current[busStop.id]?.showCallout();
    animateToLocation(busStop.coordinate);
  };

  /**
   *  Handles tapping a bus stop pin by showing its callout
   * and centering the map on the stop.
   *
   * @param busStop
   */
  const onPressBusPin = (busStop: Stop) => {
    markersRef?.current[busStop.id]?.showCallout();
    animateToLocation(busStop.coordinate);
  };

  const showsUserLocation = () => {
    if (!userLocation) return;
    const userCoordinate = {
      latitude: userLocation.coords.latitude,
      longitude: userLocation.coords.longitude,
    };
    animateToLocation(userCoordinate);
  };

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
          showsMyLocationButton={false}
          onMapReady={() => {}}
        >
          {/* {userLocation && (
            <UserLocationPin
              ref={userMarkerRef}
              coordinate={{
                latitude: userLocation.coords.latitude,
                longitude: userLocation.coords.longitude,
              }}
            />
          )} */}
          {route && (
            <>
              <BusPolyLine
                coordinates={route.coordinates}
                color={route.color}
              />
              {route.stops.map((stop, index) => {
                const isEdge = index === 0 || index === route.stops.length - 1;
                const PinComponent = isEdge ? EdgePin : BusPin;
                return (
                  <PinComponent
                    ref={(ref: MapMarker | null) => {
                      markersRef.current[stop.id] = ref;
                    }}
                    key={`${stop.coordinate.latitude}-${stop.coordinate.longitude}`}
                    coordinate={stop.coordinate}
                    title={stop.name}
                    onPress={() => onPressBusPin(stop)}
                  />
                );
              })}
            </>
          )}
        </MapView>
        <Button
          style={styles.backButton}
          icon={<Ionicons name="arrow-back-sharp" size={20} color="#1C274C" />}
          onPress={onBackPress}
        />
        <Button
          style={styles.favouriteIcon}
          icon={
            isFavouriteRoute ? (
              <FontAwesome name="heart" size={20} color="red" />
            ) : (
              <Feather name="heart" size={20} color="black" />
            )
          }
          onPress={toggleFavourite}
        />
        <Button
          style={styles.showUserLocationButton}
          icon={
            <FontAwesome6
              name="location-crosshairs"
              size={20}
              color="#007AFF"
            />
          }
          onPress={showsUserLocation}
        />
        {route && (
          <BusRouteDetailBottomSheet
            routes={[route]}
            handleSelectBusStop={handleSelectBusStop}
            maxHeight={bottomSheetMaxHeight}
            snapPoints={bottomSheetSnapPoints}
            onChangeIndex={onChangeRouteDetailBottomSheetIndex}
          />
        )}
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
  showUserLocationButton: {
    position: "absolute",
    top: 65,
    right: 20,
    borderRadius: 0,
  },
});
