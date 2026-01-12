import { FlatList, StyleSheet, ViewStyle } from "react-native";

// custom components
import RouteCard from "@/src/components/RouteCard";

// types
import { Route } from "@/src/types/bus";

type RouteListViewProps = {
  data: Route[],
  style?: ViewStyle;
}

export default function RouteListView({
  data,
  style
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
          onPress={() => { }}
          isYps={item.isYps}
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
