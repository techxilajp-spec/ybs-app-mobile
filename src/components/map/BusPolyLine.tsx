import { Polyline } from "react-native-maps";

type Coordinate = {
  latitude: number;
  longitude: number;
};

type BusPolyLineProps = {
  color: string;
  coordinates: Coordinate[];
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
