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

import busStopsData from "@/data/bus-stops.json";
import route62 from "@/data/routes/route62.json";

type BusStop = {
  id: string;
  name: string;
  name_mm: string;
  latitude: number;
  longitude: number;
};

const busStopsMap = busStopsData.bus_stops as Record<string, BusStop>;

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
  const [busStops, setBusStops] = useState<BusStop[]>([]); // bus stops
  const [userLocation, setUserLocation] =
    useState<Location.LocationObject | null>(null); // user location

  const windowHeight = Dimensions.get("window").height; // window height

  const bottomSheetRef = useRef<BottomSheet>(null); // bottom sheet ref
  const mapRef = useRef<MapView>(null); // map ref
  const markersRef = useRef<Record<string, MapMarker | null>>({}); // markers ref

  /**
   * handle select bus stop
   * @param busStop bus stop object
   */
  const handleSelectBusStop = (busStop: BusStop) => {
    if (!busStop) return;

    bottomSheetRef.current?.snapToIndex(0);

    const sheetOpenDelay = 250; // ms
    const mapAnimateDuration = 900; // ms 

    setTimeout(() => {
      const windowHeight = Dimensions.get("window").height;
      const mapHeight = windowHeight;

      const bottomSheetHeightPx = windowHeight * 0.2;
      const pixelOffset = bottomSheetHeightPx / 2;

      const latitudeDelta = 0.005;
      const latOffsetDegrees = (pixelOffset / mapHeight) * latitudeDelta;
      const centerLatitude = busStop.latitude - latOffsetDegrees;

      mapRef.current?.animateToRegion(
        {
          latitude: centerLatitude,
          longitude: busStop.longitude,
          latitudeDelta,
          longitudeDelta: 0.005,
        },
        mapAnimateDuration
      );

      Object.values(markersRef.current).forEach((ref) => ref?.hideCallout());

      setTimeout(() => {
        markersRef.current[busStop.id]?.showCallout();
      }, mapAnimateDuration + 50); 
    }, sheetOpenDelay);
  };

  /**
   * handle select location (for user location)
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
   * set route, coordinates, and bus stops
   */
  useEffect(() => {
    const mappedCoordinates = route62.shape.geometry.coordinates.map(
      (coordinate) => {
        return {
          latitude: coordinate[1],
          longitude: coordinate[0],
        };
      }
    );
    setCoordinates(mappedCoordinates);

    // Process bus stops from route stops and bus stops data
    const routeBusStops: BusStop[] = route62.stops
      .map((stopId: number) => {
        const stopData = busStopsMap[stopId.toString()];
        return stopData ? stopData : null;
      })
      .filter((stop): stop is BusStop => stop !== null);

    setBusStops(routeBusStops);

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
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={startingRegion}
        mapType="standard"
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
        showsBuildings={true}
        showsTraffic={false}
        showsIndoors={true}
        showsPointsOfInterest={true}
        toolbarEnabled={false}
        loadingEnabled={true}
        loadingIndicatorColor="#666666"
        loadingBackgroundColor="#eeeeee"
      >
        {/* Render route polyline with realistic Google Maps styling */}
        {coordinates.length > 1 && (
          <>
            {/* Background/border line for route depth effect */}
            <Polyline
              coordinates={coordinates}
              strokeColor="#1565C0"
              strokeWidth={8}
              zIndex={1}
              lineCap="round"
              lineJoin="round"
            />
            {/* Main route line */}
            <Polyline
              coordinates={coordinates}
              strokeColor="#2196F3"
              strokeWidth={6}
              zIndex={2}
              lineCap="round"
              lineJoin="round"
            />
          </>
        )}

        {/* Bus stops with names */}
        {busStops.map((busStop: BusStop, index: number) => {
          const isStart = index === 0;
          const isEnd = index === busStops.length - 1;

          return (
            <Marker
              key={busStop.id + index}
              ref={(ref: MapMarker | null) => {
                markersRef.current[busStop.id] = ref;
              }}
              coordinate={{
                latitude: busStop.latitude,
                longitude: busStop.longitude,
              }}
              anchor={{ x: 0.5, y: 0.5 }}
              zIndex={3}
              title={busStop.name}
              description={busStop.name_mm}
            >
              <View
                style={[
                  styles.busStopMarker,
                  isStart && styles.startMarker,
                  isEnd && styles.endMarker,
                ]}
              >
                <View style={styles.busStopInner} />
              </View>
            </Marker>
          );
        })}

        {/* User location with Google Maps style */}
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
            }}
            anchor={{ x: 0.5, y: 0.5 }}
            zIndex={4}
          >
            <View style={styles.userLocationMarker}>
              <View style={styles.userLocationDot} />
            </View>
          </Marker>
        )}
      </MapView>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={["20%", "35%", "50%", "65%", "80%", "95%", "100%"]}
        style={styles.contentContainer}
        maxDynamicContentSize={windowHeight * 0.35}
      >
        <View style={styles.routeHeader}>
          <View style={styles.routeIconContainer}>
            <Text style={styles.routeIcon}>🚌</Text>
          </View>
          <View style={styles.routeInfo}>
            <Text style={styles.routeTitle}>{route62.name}</Text>
            <Text style={styles.routeSubtitle}>
              Bus Route • {busStops.length} stops
            </Text>
          </View>
        </View>
        <BottomSheetFlatList
          data={busStops}
          keyExtractor={(item: BusStop, index: number) => item.id + index}
          renderItem={({ item, index }: { item: BusStop; index: number }) => {
            return (
              <Pressable onPress={() => handleSelectBusStop(item)}>
                <View style={styles.itemContainer}>
                  <View style={styles.busStopInfo}>
                    <Text style={styles.busStopName}>{item.name}</Text>
                    <Text style={styles.busStopNameMm}>{item.name_mm}</Text>
                  </View>
                  <View style={styles.busStopNumber}>
                    <Text style={styles.stopNumberText}>{index + 1}</Text>
                  </View>
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
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: 8,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
  },
  busStopInfo: {
    flex: 1,
  },
  busStopName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  busStopNameMm: {
    fontSize: 14,
    color: "#757575",
  },
  busStopNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2196F3",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  stopNumberText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  routeHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginBottom: 8,
  },
  routeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  routeIcon: {
    fontSize: 24,
  },
  routeInfo: {
    flex: 1,
  },
  routeTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  routeSubtitle: {
    fontSize: 14,
    color: "#757575",
  },
  userLocationMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(66, 133, 244, 0.3)",
    borderWidth: 2,
    borderColor: "#4285F4",
    alignItems: "center",
    justifyContent: "center",
  },
  userLocationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4285F4",
  },
  busStopMarker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: "#2196F3",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  startMarker: {
    backgroundColor: "#4CAF50",
    borderColor: "#2E7D32",
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  endMarker: {
    backgroundColor: "#F44336",
    borderColor: "#C62828",
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  busStopInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2196F3",
  },
});
