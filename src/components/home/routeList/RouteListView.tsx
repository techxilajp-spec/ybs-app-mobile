import { StyleSheet, View } from "react-native";

// custom component
import RouteCard from "@/src/components/home/routeList/RouteCard";
import RouteListFilter from "./RouteListFilter";

export default function RouteListView() {
  return (
    <View style={styles.container}>
      <RouteListFilter />
      <View style={{ marginTop: 20 }}>
        <RouteCard />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
