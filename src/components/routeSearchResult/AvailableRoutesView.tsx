import { FlatList, StyleSheet, View } from "react-native";

// expo router
import { router } from "expo-router";

// custom component
import AppText from "@/src/components/AppText";
import RouteCard from "@/src/components/home/routeSearchResults/RouteCard";

// constants
import { Colors } from "@/src/constants/color";

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
        renderItem={({ item, index }) => (
          <RouteCard
            route={item}
            index={index}
            onPressCard={() => router.push({
              pathname: "/routeSearchDetail",
              params: {
                id: item.id,
              }
            })}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AppText size={16} style={styles.emptyText}>
              ယာဉ်လမ်းကြောင်းမတွေ့ပါ
            </AppText>
            <AppText size={14} style={styles.emptySubtext}>
              ကျေးဇူးပြု၍ အခြားနေရာများကို ရွေးချယ်ကြည့်ပါ
            </AppText>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    color: Colors.text.primary,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    color: Colors.text.secondary,
    textAlign: "center",
  },
});
