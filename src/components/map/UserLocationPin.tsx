import React, { ComponentRef, forwardRef } from "react";
import { StyleSheet, View } from "react-native";
import { LatLng, MapMarkerProps, Marker } from "react-native-maps";

type UserLocationPinProps = {
  coordinate: LatLng;
  title?: string;
  onPress?: () => void;
} & MapMarkerProps;

const UserLocationPin = forwardRef<ComponentRef<typeof Marker>, UserLocationPinProps>(
  ({ coordinate, title = "", onPress = () => {} }, ref) => {
    return (
      <Marker ref={ref} coordinate={coordinate} title={title} onPress={onPress} tracksViewChanges={true}>
        <View style={styles.circle}></View>
      </Marker>
    );
  }
);

UserLocationPin.displayName = "UserLocationPin";

export default UserLocationPin;

const styles = StyleSheet.create({
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#ff0000",
    borderWidth: 2,
    borderColor: "white",
  },
});
