import { Image, Pressable, StyleSheet, View } from "react-native";

// custom components
import AppText from "@/src/components/AppText";

// constants
import { Colors } from "@/src/constants/color";

type BusStopProps = {
  title: string;
  road: string;
  onPress: () => void;
};

export default function BusStop({ title, road, onPress }: BusStopProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Image
        source={require("@/assets/icons/bus.png")}
        style={styles.busIcon}
      />
      <View style={styles.detailContainer}>
        <AppText size={14} style={styles.title}>
          {title}
        </AppText>
        <AppText size={12} style={styles.road}>{`Road: ${road}`}</AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
    paddingHorizontal: 20
  },
  busIcon: {
    width: 22,
    height: 22,
  },
  detailContainer: {
    flex: 1,
  },
  title: {
    fontFamily: "MiSansMyanmar-Semibold",
    color: Colors.text.primary,
  },
  road: {
    fontFamily: "MiSansMyanmar-Medium",
    color: Colors.text.secondary,
  },
});
