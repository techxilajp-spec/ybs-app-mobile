import { FlatList, StyleSheet, ViewStyle } from "react-native";

// custom components
import RouteCard from "@/src/components/RouteCard";

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
          onPress={() => {}}
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
