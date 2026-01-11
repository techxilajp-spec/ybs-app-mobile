// react native
import { Dimensions, StyleSheet, View } from "react-native";

// react
import { useEffect, useMemo, useRef, useState } from "react";

// expo router
import { router, useLocalSearchParams } from "expo-router";

// react-native-map
import MapView, { MapMarker, PROVIDER_GOOGLE, Region } from "react-native-maps";

// icons
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
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
import { useGetRouteDetail } from "@/src/hooks/bus-route";

// types
import {
  useAddFavoriteRoute,
  useIsFavoriteRoute,
  useRemoveFavoriteRoute,
} from "@/src/hooks/favourite";
import { Stop } from "@/src/types/map";

export default function RouteDetail() {
  const ACTIVE_ROUTE_INDEX = 0;
  const { YANGON } = MAP_LOCATIONS;

  const [region, setRegion] = useState<Region>(YANGON);

  const bottomSheetHeight = useRef<number>(100);
  const mapRef = useRef<InstanceType<typeof MapView> | null>(null);
  const markersRef = useRef<Record<string, MapMarker | null>>({});

  const { height: screenHeight } = Dimensions.get("screen");
  const bottomSheetMaxHeight = screenHeight * 0.65;
  const bottomSheetSnapPoints = [100, bottomSheetMaxHeight];
  const [isFavorite, setIsFavorite] = useState(false);

  const { id: routeId } = useLocalSearchParams<{ id: string }>();

  const { mutate: addFavoriteRoute } = useAddFavoriteRoute();
  const { mutate: isFavoriteRoute } = useIsFavoriteRoute();
  const { mutate: removeFavoriteRoute } = useRemoveFavoriteRoute();

  const { data: routeData } = useGetRouteDetail(routeId);
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
    setRegion({
      ...YANGON,
      latitudeDelta: MAP_DELTA.INITIAL.LATITUDE,
      longitudeDelta: MAP_DELTA.INITIAL.LONGITUDE,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Navigates back to the previous screen
   */
  const onBackPress = () => {
    router.back();
  };

  const onAddFavourite = () => {
    if (!route) return;

    if (isFavorite) {
      removeFavoriteRoute(route.id, {
        onSuccess: () => {
          setIsFavorite(false);
        },
        onError: () => {},
      });
    } else {
      addFavoriteRoute(route.id, {
        onSuccess: () => {
          setIsFavorite(true);
        },
        onError: () => {},
      });
    }
  };

  const heartIcon = isFavorite ? (
    <FontAwesome name="heart" size={20} color="red" />
  ) : (
    <Feather name="heart" size={20} color="black" />
  );

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
  const handleSelectBusStop = (busStop: Stop) => {
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

  /**
   * Checks if a route is favorited
   */
  useEffect(() => {
    if (routeId) {
      isFavoriteRoute(Number(routeId), {
        onSuccess: (data) => {
          setIsFavorite(data);
        },
      });
    }
  }, [routeId, isFavoriteRoute]);

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
        >
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
          icon={<Ionicons name="arrow-back-sharp" size={20} color="blue" />}
          onPress={onBackPress}
        />
        <Button
          style={styles.favouriteIcon}
          icon={heartIcon}
          onPress={onAddFavourite}
        />
        {route && (
          <BusRouteDetailBottomSheet
            routes={[route]}
            handleSelectBusStop={handleSelectBusStop}
            maxHeight={bottomSheetMaxHeight}
            snapPoints={bottomSheetSnapPoints}
            onChangeIndex={onChangeRouteDetailBottomSheetIndex}
            activeRouteIndex={ACTIVE_ROUTE_INDEX}
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
});
