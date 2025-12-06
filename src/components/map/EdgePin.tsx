

// react native map + expos
import { Marker } from "react-native-maps";

type LatLng = {
  latitude: number;
  longitude: number;
};

type EdgePinProps = {
  coordinate: LatLng;
  title: string;
};

export default function EdgePin({ coordinate, title }: EdgePinProps) {
  return (
    <Marker
      coordinate={coordinate}
      image={require("@/assets/icons/startPin.png")}
      tracksViewChanges={false}
      title={title}
    >
    </Marker>
  );
}
