import { Pressable, StyleSheet, View } from "react-native";

// expo icons
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

// custom components
import CustomText from "../CustomText";
type RouteItemProps = {
  routeNo: number | string;
  routeName: string;
  onPress?: (isActive: boolean, route_id: number | string) => void;
  onDetailPress?: (route_id: number | string) => void;
  isActive?: boolean;
  color: string
};

export default function RouteItem({
  routeNo,
  routeName,
  onPress = (routeNo) => console.log(routeNo),
  onDetailPress = (routeNo) => console.log(routeNo),
  isActive = false,
  color
}: RouteItemProps) {
  const maxWords = 3;
  const words = routeNo.toString().trim().split("");
  const displayRouteNo =
    words.length > maxWords
      ? words.slice(0, maxWords).join(" ") + " ..."
      : routeNo;
  return (
    <Pressable style={styles.itemContainer} onPress={() => onPress(isActive, routeNo)}>
      {isActive && <View style={[styles.activeBar, {backgroundColor: color}]} />}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingRight: 10,
          paddingLeft: 15,
          paddingVertical: 10,
        }}
      >
        <View style={styles.routeNoContainer}>
          <CustomText title={displayRouteNo} style={styles.routeNo} />
        </View>
        <View style={styles.routeNameContainer}>
          <CustomText title={routeName} />
        </View>
        <View style={styles.detailButtonContainer}>
          <Pressable onPress={() => onDetailPress(routeNo)}>
            <FontAwesome5 name="list-alt" size={30} color="black" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "#FFF",
    borderBottomColor: "#e6e6e6ff",
    borderBottomWidth: 1,
    position: "relative",
  },
  routeNoContainer: {
    width: 50,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  routeNo: {
    fontSize: 20,
    fontWeight: "bold",
  },
  routeNameContainer: {
    flex: 1,
  },
  detailButtonContainer: {
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  activeBar: {
    width: 6,
    height: "100%",
    position: "absolute",
  },
});
