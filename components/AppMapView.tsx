import React, { forwardRef } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { MapViewProps } from "react-native-maps";

type AppMapViewProps = MapViewProps & {
  width: number;
  height: number;
  children?: React.ReactNode;
};

const yangonRegion = {
  latitude: 16.8409,
  longitude: 96.1735,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const AppMapView = forwardRef<MapView, AppMapViewProps>(
  ({ width, height, children, ...props }, ref) => {
    return (
      <View style={{ width, height }}>
        <MapView
          ref={ref}
          initialRegion={yangonRegion}
          style={styles.map}
          mapType="standard"
          showsUserLocation={true}
          showsMyLocationButton={true}
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
          {...props} // allow parent to override any MapView props
        >
          {children}
        </MapView>
      </View>
    );
  }
);

export default AppMapView;

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});
