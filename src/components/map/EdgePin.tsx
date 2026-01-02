import React, { ComponentRef, forwardRef } from "react";
import { Marker } from "react-native-maps";

type Coordinate = {
  latitude: number;
  longitude: number;
};

type EdgePinProps = {
  coordinate: Coordinate;
  title: string;
  onPress?: () => void;
};

const EdgePin = forwardRef<ComponentRef<typeof Marker>, EdgePinProps>(
  ({ coordinate, title, onPress = () => { console.log("pressed edge pin"); } }, ref) => {
    return (
      <Marker
        ref={ref}
        coordinate={coordinate}
        image={require("@/assets/icons/startPin.png")}
        tracksViewChanges={false}
        title={title}
      />
    );
  }
);

EdgePin.displayName = "EdgePin";

export default EdgePin;
