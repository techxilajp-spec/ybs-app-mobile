import React, { ComponentRef, forwardRef } from "react";
import { MapMarkerProps, Marker } from "react-native-maps";

type Coordinate = {
  latitude: number;
  longitude: number;
};

type BusPinProps = {
  coordinate: Coordinate;
  title: string;
  onPress?: () => void
} & MapMarkerProps;

const BusPin = forwardRef<ComponentRef<typeof Marker>, BusPinProps>(
  ({ coordinate, title, onPress = () => { console.log("marker pressed"); } }, ref) => {
    return (
      <Marker
        ref={ref}
        coordinate={coordinate}
        image={require("@/assets/icons/pin.png")}
        tracksViewChanges={false}
        title={title}
        onPress={onPress}
        tappable={false}
      />
    );
  }
);

BusPin.displayName = "BusPin";

export default BusPin;
