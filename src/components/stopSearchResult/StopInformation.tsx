// react native
import { StyleSheet, View, ViewStyle } from "react-native";

// custom components
import AppText from "@/src/components/AppText";

// constants
import { Colors } from "@/src/constants/color";

type StopInformationProps = {
  stopName: string;
  roadName: string;
  townshipName: string;
  lat: number;
  lng: number;
  style?: ViewStyle;
};

export default function StopInformation({
  stopName,
  roadName,
  townshipName,
  lat,
  lng,
  style,
}: StopInformationProps) {
  return (
    <View style={[styles.container, style]}>
      <AppText size={16} style={styles.stopName}>
        {stopName}
      </AppText>
      <AppText
        size={14}
        style={{
          marginBottom: 7,
        }}
      >
        Road :{" "}
        <AppText size={14} style={styles.busName}>
          {roadName}
        </AppText>
      </AppText>
      <AppText size={14}>
        TownShip :{" "}
        <AppText size={14} style={styles.townShipName}>
          {townshipName}
        </AppText>
      </AppText>
      <AppText size={14} style={{ marginTop: 7 }}>
        Location :{" "}
        <AppText size={14} style={styles.townShipName}>
          ({lat}, {lng})
        </AppText>
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F6F4FE",

    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,

    borderWidth: 1,
    borderColor: Colors.border.primary,
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
  },
  stopName: {
    color: Colors.text.primary,
    fontFamily: "MiSansMyanmar-Semibold",
    marginBottom: 20,
  },
  busName: {
    fontFamily: "MiSansMyanmar-Regular",
    color: "#000",
  },
  townShipName: {
    fontFamily: "MiSansMyanmar-Regular",
    color: "#000",
  },
});
