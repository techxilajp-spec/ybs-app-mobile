import { FlatList, StyleSheet, ViewStyle } from "react-native";

// custom components
import RouteCard from "@/src/components/RouteCard";

// expo router
import { router } from "expo-router";

// types
import { Route } from "@/src/types/bus";

type RouteListViewProps = {
  data: Route[];
  style?: ViewStyle;
  onPressRemoveFavoriteRoute?: (routeId: number) => void;
};

export default function RouteListView({
  data,
  style,
  onPressRemoveFavoriteRoute,
}: RouteListViewProps) {  
  const onPressRouteCard = (routeId: string) => {
    router.push({
      pathname: "/(drawer)/(home)/routeDetail/[id]",
      params: { id: routeId },
    });
  };
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <RouteCard
          routeNo={item.no}
          routeTitle={item.name}
          routeDescription={item.description}
          color={"#" + item.color}
          isYps={item.isYps}
          onPress={() => onPressRouteCard(item.id)}
          onPressRemoveFavoriteRoute={() => {
            if (!onPressRemoveFavoriteRoute) return;
            onPressRemoveFavoriteRoute(Number(item.id));
          }}
        />
      )}
      keyExtractor={(item) => `${item.id}`}
      style={[styles.listContainer, style]}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
});
