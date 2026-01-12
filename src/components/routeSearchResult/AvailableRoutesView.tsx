import { FlatList, StyleSheet, View } from "react-native";


// expo router
import { router } from "expo-router";

// custom component
import RouteCard from "@/src/components/home/routeSearchResults/RouteCard";

// types
import { RouteSearchResult } from "@/src/types/map";

type AvailableRoutesViewProps = {
  routes: RouteSearchResult[]
}

export default function AvailableRoutesView({
  routes
}: AvailableRoutesViewProps) {
  return (
    <View style={styles.container}>
      <FlatList
        data={routes}
        renderItem={({ item }) => (
          <RouteCard onPressCard={() => router.push({
            pathname: "/routeSearchDetail",
            params: {
              id: item.id,
            }
          })} />
        )}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
