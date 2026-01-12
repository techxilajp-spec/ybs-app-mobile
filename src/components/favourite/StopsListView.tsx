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
          title_mm={item.title_mm}
          title_en={item.title_en}
          lat={item.lat}
          lng={item.lng}
          isFavourite={item.isFavourite}
          onToggleFavourite={() => onToggleFavourite(item.id)}
        />
      )}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1
  },
});
