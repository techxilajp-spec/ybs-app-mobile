import { FlatList, StyleSheet, ViewStyle } from "react-native";

// custom components
import RouteCard from "@/src/components/RouteCard";

// types
import { Route } from "@/src/types/bus";
import { favouriteRouteRequest } from "@/src/types/favourite";

type RouteListViewProps = {
  data: Route[];
  style?: ViewStyle;
  onPressRemoveFavoriteRoute?: (body: favouriteRouteRequest) => void;
};

export default function RouteListView({
  data,
  style,
  onPressRemoveFavoriteRoute,
}: RouteListViewProps) {
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <RouteCard
          routeNo={item.no}
          routeTitle={item.name}
          routeDescription={item.description}
          color={item.color}
          isYps={item.isYps}
          onPress={() => {}}
          onPressRemoveFavoriteRoute={() => {
            if (!onPressRemoveFavoriteRoute) return;
            onPressRemoveFavoriteRoute({
              routeId: Number(item.id),
              routeName: item.name,
              routeNumberEn: item.no,
              routeNumberMm: item.description,
              color: item.color,
              isYps: item.isYps,
            });
          }}
        />
      )}
      keyExtractor={(item) => `${item.no}-${item.id}`}
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
