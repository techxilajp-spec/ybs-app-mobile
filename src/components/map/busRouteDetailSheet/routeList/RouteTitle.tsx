// react native
import { StyleSheet, View, ViewStyle } from "react-native";

// custom components
import AppText from "@/src/components/AppText";

type RouteTitleProps = {
  color: string;
  routeNo: string;
  title: string;
	style?: ViewStyle
};

export default function RouteTitle({ routeNo, color, title, style }: RouteTitleProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.routeNoContainer, { backgroundColor: color}]}>
        <AppText size={18} style={styles.routeNo}>
          {routeNo}
        </AppText>
      </View>
      <View style={styles.routeTitleContainer}>
        <AppText size={16} style={styles.routeTitle}>
          {title}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20
  },
  routeNoContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },
  routeNo: {
    color: "#FFFFFF",
  },
  routeTitleContainer: {
    flex: 1,
  },
  routeTitle: {
    fontFamily: "MiSansMyanmar-Semibold",
  },
});
