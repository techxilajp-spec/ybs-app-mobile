import React, { ComponentRef, forwardRef } from "react";
import { LatLng, MapMarkerProps, Marker } from "react-native-maps";

type BusPinProps = {
  coordinate: LatLng;
  title: string;
  onPress: () => void
} & MapMarkerProps;

const BusPin = forwardRef<ComponentRef<typeof Marker>, BusPinProps>(
  ({ coordinate, title, onPress }, ref) => {
    return (
      <Marker
        ref={ref}
        coordinate={coordinate}
        image={require("@/assets/icons/pin_2x.png")}
        tracksViewChanges={true}
        title={title}
        onPress={onPress}
      />
    );
  }
);

BusPin.displayName = "BusPin";

export default BusPin;
