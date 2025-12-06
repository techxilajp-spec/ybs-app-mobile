import { Colors } from "@/src/constants/color";
import { Polyline } from "react-native-maps";

type LatLng = {
  latitude: number;
  longitude: number;
};

type BusPolyLineProps = {
  coordinates: LatLng[];
};

export default function BusPolyLine({ coordinates }: BusPolyLineProps) {
  return (
    <Polyline
      coordinates={coordinates}
      strokeColor={Colors.primary}
      strokeWidth={6}
      lineCap="round"
      lineJoin="round"
    />
  );
}
