import { FlatList, StyleSheet, View } from "react-native";

import { useEffect } from "react";

// expo router
import { router } from "expo-router";

// custom component
import RouteCard from "@/src/components/home/routeSearchResults/RouteCard";

// stores
import { useRouteSearchResultsStore } from "@/src/stores/useRouteSearchResultsStore";

export default function AvailableRoutesView() {
  const routes = useRouteSearchResultsStore((s) => s.routes);
  useEffect(() => {
    console.log("available route mount again");
  }, []);
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
