import { FlatList, StyleSheet, ViewStyle } from "react-native";

// custom components
import StopCard from "@/src/components/StopCard";

// types
import { Stop } from "@/src/types/bus";

type StopsListViewProps = {
  style?: ViewStyle,
  data: Stop[];
  onToggleFavourite: (stopId: string) => void;
}

export default function StopsListView({
  style,
  data,
  onToggleFavourite
}: StopsListViewProps) {
  return (
    <FlatList
      data={data}
      style={[styles.listContainer, style]}
      renderItem={({ item }) => (
        <StopCard
          title_mm={item.name_mm}
          title_en={item.name_en}
          road_mm={item.road_mm}
          lat={item.lat}
          lng={item.lng}
          isFavourite={item.isFavourite}
        />
      )}
      keyExtractor={(item, index) => index + item.name_en}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1
  },
});
