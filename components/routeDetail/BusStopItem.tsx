import { Pressable, StyleSheet, Text, View } from "react-native";

type BusStopItemProps = {
  name: string;
  name_mm: string;
  onPress?: () => void
};
export default function BusStopItem({ name, name_mm, onPress = () => console.log("clicked") }: BusStopItemProps) {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.itemContainer}>
        <View style={styles.busStopInfo}>
          <Text style={styles.busStopName}>{name}</Text>
          <Text style={styles.busStopNameMm}>{name_mm}</Text>
        </View>
        <View></View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: 8,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
  },
  busStopInfo: {
    flex: 1,
  },
  busStopName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  busStopNameMm: {
    fontSize: 14,
    color: "#757575",
  },
  busStopNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2196F3",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  stopNumberText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
