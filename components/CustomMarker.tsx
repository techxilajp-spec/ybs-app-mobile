import React from "react";
import { StyleSheet, View } from "react-native";
import { MapMarkerProps, Marker } from "react-native-maps";

type CoordinateType = {
  latitude: number;
  longitude: number;
};

type CustomMarkerProps = {
  coordinate: CoordinateType,
  children?: React.ReactNode;
} & MapMarkerProps;

export default function CustomMarker({
  children,
  coordinate,
  ...overrideProps
}: CustomMarkerProps) {
  return (
    <Marker
      {...overrideProps}
      coordinate={coordinate}
    >
      {children || (
        <View style={styles.outer}>
          <View style={styles.inner} />
        </View>
      )}
    </Marker>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: "#2196F3",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  inner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2196F3",
  }
});
