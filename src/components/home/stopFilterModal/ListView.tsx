import { FlatList, StyleSheet, View } from "react-native";

// constants
import { Colors } from "@/src/constants/color";

// customComponent
import AppText from "@/src/components/AppText";
import StopCard from "@/src/components/StopCard";
import SkeletonCard from "@/src/components/StopSkeletonCard";
import { Stop } from "@/src/types/bus";

// utils

type ListViewProps = {
  data: Stop[];
  onPress?: (item: any) => void;
  isLoading?: boolean;
  isError?: boolean;
  isFetchingNext?: boolean;
  onEndReached?:() => void;
};

export default function ListView({
  data,
  onPress,
  isLoading = false,
  isError = false,
  isFetchingNext = false,
  onEndReached,
}: ListViewProps) {

  if (isError) {
    return <View style={styles.container} />;
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <StopCard
            id={item.id}
            title_mm={item.name_mm}
            title_en={item.name_en}
            road_mm={item.road_mm}
            lat={item.lat}
            lng={item.lng}
            onPress={() => onPress?.(item)}
            busNumbers={item.bus_numbers}
            direction_text={item.direction_text}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNext ? <SkeletonCard /> : null
        }
        ListEmptyComponent={
          <View style={styles.noDataContainer}>
            <AppText size={16} style={styles.noDataText}>
              မှတ်တိုင်ရှာမတွေ့ပါ
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
  noDataContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  noDataText: {
    color: Colors.text.disabled,
    fontWeight: "300"
  }
});
