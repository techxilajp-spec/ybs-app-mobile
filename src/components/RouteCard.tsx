import { Image, Pressable, StyleSheet, View } from "react-native";

// custom component
import AppText from "@/src/components/AppText";

type RouteCardProps = {
  routeNo: string | number;
  routeTitle: string;
  routeDescription: string;
  color: string;
  onPress: () => void
};

export default function RouteCard({
  routeNo,
  routeTitle,
  routeDescription,
  color,
  onPress
}: RouteCardProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={[styles.routeNo, { backgroundColor: color }]}>
        <AppText size={20} style={{ color: "#FFF", fontWeight: "semibold" }}>
          {routeNo}
        </AppText>
      </View>
      <View style={styles.routeDetailContainer}>
        <Image
          source={require("@/assets/icons/bus.png")}
          style={styles.busIcon}
        />
        <View style={styles.ypsBadge}>
          <AppText size={10} style={{ fontWeight: "bold" }}>
            YPS
          </AppText>
        </View>
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
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D0D5DD",

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
    color: "#1F2937",
    fontWeight: 800,
    marginBottom: 5,
  },
  routeDescription: {
    color: "#4B5563",
  },
});
