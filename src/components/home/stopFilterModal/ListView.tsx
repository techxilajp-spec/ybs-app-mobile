import { FlatList, StyleSheet, View } from "react-native";

// constants
import { Colors } from "@/src/constants/color";

// customComponent
import AppText from "@/src/components/AppText";
import StopCard from "@/src/components/StopCard";
import SkeletonCard from "@/src/components/StopSkeletonCard";
import { Stop } from "@/src/types/bus";
import { ScrollView } from "react-native-gesture-handler";

type ListViewProps = {
  data: Stop[];
  onPress?: (item: any) => void;
  hasNextStops: boolean;
  isFetchingNextStops: boolean;
  isStopsLoading: boolean;
  fetchNextPage: () => void;
  isStopsError: boolean;
};

export default function ListView({ data, onPress, hasNextStops, isFetchingNextStops, fetchNextPage, isStopsLoading, isStopsError }: ListViewProps) {
  return (
    <>
      {isStopsLoading ? (
        // skeleton view
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          style={{
            marginTop: 20,
            flex: 1,
          }}
        >
          {new Array(4).fill(0).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </ScrollView>
      ) : isStopsError ? (
        <View></View>
      ) : (
        <View style={styles.container}>
          {data.length > 0 ? (
            <FlatList
              style={styles.container}
              data={data}
              renderItem={({ item }) => (
                <StopCard
                  id={item.id}
                  title_mm={item.name_mm}
                  title_en={item.name_en}
                  road_mm={item.road_mm}
                  lat={item.lat}
                  lng={item.lng}
                  onPress={() => onPress && onPress(item)}
                  busNumbers={item.bus_numbers}
                />
              )}
              keyExtractor={(item, index) => index + item.name_en}
              showsVerticalScrollIndicator={false}
              onEndReached={() => {
                if (hasNextStops && !isFetchingNextStops) {
                  fetchNextPage();
                }
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={isFetchingNextStops ? <SkeletonCard /> : null}
            />
          ) : (
            <View style={[styles.container, styles.noDataContainer]}>
              <AppText size={16} style={styles.noDataText}>မှတ်တိုင်ရှာမတွေ့ပါ</AppText>
            </View>
          )}
        </View>
      )}

    </>
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
