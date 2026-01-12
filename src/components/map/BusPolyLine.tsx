import { LatLng, Polyline } from "react-native-maps";

type BusPolyLineProps = {
  color: string;
  coordinates: LatLng[];
};

export default function BusPolyLine({ color, coordinates }: BusPolyLineProps) {
  return (
    <Polyline
      coordinates={coordinates}
      strokeColor={color}
      strokeWidth={6}
      lineCap="round"
      lineJoin="round"
    />
  );
}
