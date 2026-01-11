import { Image, Pressable, StyleSheet, View } from "react-native";

// custom component
import AppText from "@/src/components/AppText";

// constants
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "../constants/color";

type RouteCardProps = {
  routeNo: string | number;
  routeTitle: string;
  routeDescription: string;
  color: string;
  onPress: () => void;
  onPressRemoveFavoriteRoute?: () => void;
  isYps: boolean;
};

export default function RouteCard({
  routeNo,
  routeTitle,
  routeDescription,
  color,
  onPress,
  onPressRemoveFavoriteRoute,
  isYps,
}: RouteCardProps) {
  return (
    <View
      style={{
        position: "relative",
      }}
    >
      <Pressable style={styles.container} onPress={onPress}>
        <View style={[styles.routeNo, { backgroundColor: color }]}>
          <AppText size={20} style={{ color: "#FFF", fontWeight: "semibold" }}>
            {routeNo}
          </AppText>
        </View>
        <View style={styles.routeDetailContainer}>
          {!onPressRemoveFavoriteRoute && <Image
            source={require("@/assets/icons/bus.png")}
            style={styles.busIcon}
          />}
          {isYps && (
            <View style={styles.ypsBadge}>
              <AppText size={10} style={{ fontWeight: "bold" }}>
                YPS
              </AppText>
            </View>
          )}
          <AppText
            size={16}
            style={styles.routeTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {routeTitle}
          </AppText>
          <AppText
            size={14}
            style={styles.routeDescription}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {routeDescription}
          </AppText>
        </View>
      </Pressable>

      {
        onPressRemoveFavoriteRoute && (
          <Pressable style={styles.removeFavoriteContainer} onPress={onPressRemoveFavoriteRoute}>
            <FontAwesome name="heart" size={20} color="red" />
          </Pressable>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border.disabled,

    flexDirection: "row",
    alignItems: "center",

    position: "relative",
    marginBottom: 10,
  },
  busIcon: {
    width: 22,
    height: 22,
    position: "absolute",
    top: 0,
    right: 0,
  },
  ypsBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,

    backgroundColor: "#F4D159",
    paddingVertical: 2,
    paddingHorizontal: 8,

    borderRadius: 6,
  },
  routeNo: {
    width: 54,
    height: 54,
    backgroundColor: "#2B6CB0",
    borderRadius: 27,

    justifyContent: "center",
    alignItems: "center",
  },
  routeDetailContainer: {
    flex: 1,
    marginLeft: 15,
    paddingRight: 40,
  },
  routeTitle: {
    fontFamily: "MiSansMyanmar-Semibold",
    color: Colors.text.primary,
    marginBottom: 5,
  },
  routeDescription: {
    color: Colors.text.secondary,
    fontFamily: "MiSansMyanmar-Regular",
  },
  removeFavoriteContainer: {
    position: "absolute",
    top: 14,
    right: 14,
  },
});
