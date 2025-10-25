import React from "react";
import { StyleSheet, View } from "react-native";
import { MapMarkerProps, Marker } from "react-native-maps";

type CustomMarkerProps = {
  children?: React.ReactNode;
} & MapMarkerProps;

export default function CustomMarker({
  children,
  ...overrideProps
}: CustomMarkerProps) {
  return (
    <Marker
      {...overrideProps}
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
    backgroundColor: "#F44336",
    borderColor: "#C62828",
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  inner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2196F3",
  }
});
