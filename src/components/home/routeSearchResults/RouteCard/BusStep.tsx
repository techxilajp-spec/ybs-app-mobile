import { StyleSheet, View, ViewStyle } from "react-native";

// custom component
import AppText from "@/src/components/AppText";

// constants
import { Colors } from "@/src/constants/color";

type BusStepProps = {
  busNo: number | string;
  busTitle: string;
  startStopTitle: string;
  endStopTitle: string;
  busColor: string;
  style?: ViewStyle | ViewStyle[];
};

export default function BusStep({
  busNo,
  busTitle,
  startStopTitle,
  endStopTitle,
  busColor,
  style,
}: BusStepProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.busNoContainer, { backgroundColor: busColor }]}>
        <AppText size={20} style={styles.busNoText}>
          {busNo}
        </AppText>
      </View>
      <View style={styles.descriptionContainer}>
        <AppText size={14} style={styles.descriptionText}>
          {busTitle} ကားကို{" "}
          <AppText style={styles.stopText}>{startStopTitle}</AppText> မှ{" "}
          <AppText style={styles.stopText}>{endStopTitle}</AppText> ထိ စီးပါ။
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
  },
  busNoContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  busNoText: {
    fontWeight: 800,
    color: "#FFF",
  },
  descriptionContainer: {
    flex: 1,
  },
  descriptionText: {
    color: Colors.text.secondary,
    fontWeight: 600
  },
  stopText: {
    color: Colors.text.primary,
    fontWeight: 800,
  },
});
