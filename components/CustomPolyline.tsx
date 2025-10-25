import { Polyline } from "react-native-maps";

type CoordinateType = {
  latitude: number;
  longitude: number;
};

type CustomPolylineProps = {
  coordinates: CoordinateType[];
  color?: string
};

const defaultColor = "#5ea5f6ff"

export default function CustomPolyline({ coordinates, color = defaultColor }: CustomPolylineProps) {
  return (
    <>
      <Polyline
        coordinates={coordinates}
        strokeColor={color}
        strokeWidth={5}
        zIndex={1}
        lineCap="round"
        lineJoin="round"
      />
    </>
  );
}
