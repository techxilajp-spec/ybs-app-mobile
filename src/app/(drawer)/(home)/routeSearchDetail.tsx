// react
import { useEffect, useRef, useState } from "react";

// react native
import { Dimensions, StyleSheet, View } from "react-native";

// expo map
import MapView, {
  LatLng,
  MapMarker,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";

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

// constants
import { MAP_DELTA, MAP_LOCATIONS } from "@/src/constants/map";

// Favorites
import {
  addFavoriteRemote,
  getRouteLocalFavorites,
  removeFavoriteRemote,
  setLocalFavorites,
} from '@/src/services/routeFav';

type Stop = {
  id: string;
  name: string;
  road: string;
  coordinate: LatLng;
};

export default function RouteSearchDetail() {
  const { YANGON } = MAP_LOCATIONS;

  const [region, setRegion] = useState<Region>(YANGON);
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

  useEffect(() => {
    setRegion({
      ...YANGON,
      latitudeDelta: MAP_DELTA.INITIAL.LATITUDE,
      longitudeDelta: MAP_DELTA.INITIAL.LONGITUDE,
    });
  }, []);

  useEffect(() => {
    handleSelectBusStop(activeRoute?.stops[0]);
  }, [activeRouteIndex]);

  /**
   * Navigates back to the previous screen
   */
  const onBackPress = () => {
    router.back();
  };

  const [isFavourite, setIsFavourite] = useState(false);
  const onAddFavourite = async () => {
    if (!activeRoute) return;

    const routeIdStr = activeRoute.id.toString(); // AsyncStorage
    const routeIdNum = Number(activeRoute.id);    // Supabase

    const favorites = await getRouteLocalFavorites();

    if (favorites.includes(routeIdStr)) {
      // REMOVE (offline-first)
      await setLocalFavorites(favorites.filter(id => id !== routeIdStr));
      setIsFavourite(false);
      console.log('onAddFavourite removed');

      // Remote sync (best effort)
      removeFavoriteRemote(routeIdNum).catch(console.warn);
    } else {
      // ADD
      await setLocalFavorites([...favorites, routeIdStr]);
      setIsFavourite(true);
      console.log('onAddFavourite added');

      addFavoriteRemote(routeIdNum).catch(console.warn);
    }
    console.log('onAddFavourite ended');
  };

  useEffect(() => {
    if (!activeRoute) return;

    (async () => {
      const favorites = await getRouteLocalFavorites();
      setIsFavourite(favorites.includes(activeRoute.id.toString()));
    })();
  }, [activeRoute?.id]);

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

  const onChangeRoute = (index: number) => {
    setActiveRouteIndex(index);
    markersRef.current = {};
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
          style={[
            styles.favouriteIcon,
            isFavourite && styles.favouriteIconActive,
          ]}
          icon={
            <Feather
              name="heart"
              size={20}
              color={isFavourite ? '#fff' : 'red'}
            />
          }
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
  favouriteIconActive: {
    backgroundColor: "red",
  },
});
