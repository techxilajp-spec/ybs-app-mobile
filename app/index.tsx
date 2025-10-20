import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
    Button,
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { MapMarker, Marker, Polyline } from "react-native-maps";

import route62 from "@/data/routes/route62.json";

/**
 * starting region
 */
const startingRegion = {
  latitude: route62.shape.geometry.coordinates[0][1],
  longitude: route62.shape.geometry.coordinates[0][0],
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export default function HomeScreen() {
  const [coordinates, setCoordinates] = useState<any>([]); // route coordinates
  const [userLocation, setUserLocation] =
    useState<Location.LocationObject | null>(null); // user location

  const windowHeight = Dimensions.get("window").height; // window height

  const bottomSheetRef = useRef<BottomSheet>(null); // bottom sheet ref
  const mapRef = useRef<MapView>(null); // map ref
  const markersRef = useRef<Record<string, MapMarker | null>>({}); // markers ref

  /**
   * handle select location
   * @param latitude latitude
   * @param longitude longitude
   */
  const handleSelectLocation = (latitude: number, longitude: number) => {
    // if latitude or longitude is not valid, return
    if (!latitude || !longitude) return;

    // animate to region
    mapRef.current?.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );

    // Hide all other callouts (optional)
    Object.values(markersRef.current).forEach((ref) => ref?.hideCallout());

    // Show only the selected marker’s callout
    markersRef.current[`${latitude}-${longitude}`]?.showCallout();
  };

  /**
   * watch user location
   */
  const watchUserLocation = async () => {
    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 3000, // every 3 seconds
        distanceInterval: 5, // or every 5 meters
      },
      (newLocation) => {
        setUserLocation(newLocation);
      }
    );
  };

  /**
   * set route and coordinates
   */
  useEffect(() => {
    const mappedCoordinates = route62.shape.geometry.coordinates.map((coordinate) => {
      return {
        latitude: coordinate[1],
        longitude: coordinate[0],
      };
    });
    setCoordinates(mappedCoordinates);

    async function getCurrentLocation() {
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
    }
    getCurrentLocation();

    // track location
    watchUserLocation();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View
        style={{
          position: "absolute",
          top: 50,
          right: 10,
          zIndex: 10,
        }}
      >
        <Button
          title="View Current Location"
          onPress={() =>
            handleSelectLocation(
              userLocation?.coords.latitude || 0,
              userLocation?.coords.longitude || 0
            )
          }
        />
      </View>
      <MapView ref={mapRef} style={styles.map} initialRegion={startingRegion}>
        {coordinates.length > 1 && (
          <Polyline
            coordinates={coordinates}
            strokeColor="#0000FF"
            strokeWidth={6}
            zIndex={1}
          />
        )}

        {coordinates.map((coord: { latitude: number; longitude: number }) => (
          <Marker
            key={`${coord.longitude}-${coord.latitude}`}
            ref={(ref: MapMarker | null) => {
              markersRef.current[`${coord.latitude}-${coord.longitude}`] = ref;
            }}
            coordinate={coord}
            title={`${coord.latitude}-${coord.longitude}`}
            zIndex={2}
          />
        ))}

        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
            }}
            zIndex={3}
          >
            <View style={styles.userMarker}></View>
          </Marker>
        )}
      </MapView>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={["20%", "35%"]}
        style={styles.contentContainer}
        maxDynamicContentSize={windowHeight * 0.35}
      >
        <View
          style={{
            backgroundColor: "#f50202",
            padding: 8,
            marginBottom: 6,
          }}
        >
          <Text style={styles.routeTitle}>{route62.name}</Text>
        </View>
        <BottomSheetFlatList
          data={coordinates}
          keyExtractor={(item: { latitude: number; longitude: number }) =>
            `${item.latitude}-${item.longitude}-${Math.random()}`
          }
          renderItem={({
            item,
          }: {
            item: { latitude: number; longitude: number };
          }) => {
            return (
              <Pressable
                onPress={() =>
                  handleSelectLocation(item.latitude, item.longitude)
                }
              >
                <View style={styles.itemContainer}>
                  <Text>{`${item.latitude}-${item.longitude}`}</Text>
                </View>
              </Pressable>
            );
          }}
        />
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    padding: 8,
  },
  itemContainer: {
    padding: 12,
    marginBottom: 6,
    backgroundColor: "#eee",
  },
  routeTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "semibold",
    textAlign: "center",
  },
  userMarker: {
    width: 16,
    height: 16,
    backgroundColor: "#007AFF",
    borderColor: "#FFFFFF",
    borderWidth: 2,
    borderRadius: 8,
  },
});
