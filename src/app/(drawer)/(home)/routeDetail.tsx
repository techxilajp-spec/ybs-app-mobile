import { StyleSheet, View } from "react-native";

// react

// expo router
import { router } from "expo-router";

// react-native-map + expo
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

// expo icons
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";

// custom components
import AppScreenLayout from "@/src/components/AppScreenLayout";
import BusPin from "@/src/components/map/BusPin";
import BusPolyLine from "@/src/components/map/BusPolyLine";
import EdgePin from "@/src/components/map/EdgePin";
import Button from "@/src/components/routeDetail/Button";

// dummy data
import route62 from "@/src/data/route62.json";
import { useMemo, useState } from "react";

const yangonRegion = {
  latitude: 16.871311,
  longitude: 96.199379,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function RouteDetail() {
  const [route, setRoute] = useState(route62);
  const onBackPress = () => {
    router.back();
  };

  const onAddFavourite = () => {};

  const routeCoordinates = useMemo(() => {
    return route.shape.geometry.coordinates.map(([longitude, latitude]) => ({
      latitude,
      longitude,
    }));
  }, [route]);

  return (
    <AppScreenLayout>
      <View style={styles.container}>
        <MapView
          style={styles.mapContainer}
          initialRegion={yangonRegion}
          provider={PROVIDER_GOOGLE}
        >
          <BusPolyLine coordinates={routeCoordinates} />
          {routeCoordinates.map((coordinate, index) => {
            const isEdge = index === 0 || index === routeCoordinates.length - 1;
            return isEdge ? <EdgePin key={index} coordinate={coordinate} title="" /> : <BusPin key={index} coordinate={coordinate} title="" />
          })}
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
