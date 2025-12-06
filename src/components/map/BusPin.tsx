// react native map + expos
import { Marker } from "react-native-maps";

type LatLng = {
  latitude: number;
  longitude: number;
};

type BusPinProps = {
  coordinate: LatLng;
  title: string;
};

export default function BusPin({ coordinate, title }: BusPinProps) {
  return (
    <Marker
      coordinate={coordinate}
      image={require("@/assets/icons/pin.png")}
      tracksViewChanges={false}
      title={title}
    >
    </Marker>
  );
}
