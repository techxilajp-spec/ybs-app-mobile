import React, { ComponentRef, forwardRef } from "react";
import { LatLng, Marker } from "react-native-maps";

type EdgePinProps = {
  coordinate: LatLng;
  title: string;
  onPress: () => void;
};

const EdgePin = forwardRef<ComponentRef<typeof Marker>, EdgePinProps>(
  ({ coordinate, title, onPress }, ref) => {
    return (
      <Marker
        ref={ref}
        coordinate={coordinate}
        image={require("@/assets/icons/startPin.png")}
        tracksViewChanges={false}
        title={title}
        onPress={onPress}
      />
    );
  }
);

EdgePin.displayName = "EdgePin";

export default EdgePin;
