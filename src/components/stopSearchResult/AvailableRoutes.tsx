// react native
import { FlatList, StyleSheet, View, ViewStyle } from "react-native";

// expo router
import { router } from "expo-router";

// custom components
import AppText from "@/src/components/AppText";
import RouteCard from "@/src/components/RouteCard";

// constants
import { Colors } from "@/src/constants/color";

// type
import { Route } from "@/src/types/bus";

type AvailableRoutesProps = {
  routes: Route[];
  style?: ViewStyle;
};

export default function AvailableRoutes({
  routes,
  style,
}: AvailableRoutesProps) {
  const onPressRouteCard = (routeId: string) => {
    router.push({
      pathname: "/routeDetail/[id]",
      params: { id: routeId },
    });
  };
  return (
    <View style={[styles.container, style]}>
      <AppText style={styles.title}>ရောက်ရှိသောယာဉ်လိုင်းများ</AppText>
      <FlatList
        style={{ marginTop: 20 }}
        data={routes}
        renderItem={({ item }) => (
          <RouteCard
            routeNo={item.no}
            routeTitle={item.name}
            routeDescription={item.description}
            color={item.color}
            isYps={item.isYps}
            onPress={() => onPressRouteCard(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: Colors.text.primary,
    fontFamily: "MiSansMyanmar-Semibold",
  },
});
