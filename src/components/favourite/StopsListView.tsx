import { FlatList, StyleSheet, ViewStyle } from "react-native";

// custom components
import StopCard from "@/src/components/StopCard";

// types
import { Stop } from "@/src/types/bus";

type StopsListViewProps = {
  style?: ViewStyle,
  data: Stop[];
}

export default function StopsListView({
  style,
  data
}: StopsListViewProps) {
  return (
    <FlatList
      data={data}
      style={[styles.listContainer, style]}
      renderItem={({ item }) => (
        <StopCard
          title_mm={item.name_mm}
          title_en={item.name_en}
          description={item.description}
          isFavourite={item.is_favourite}
          // onToggleFavourite={() => { console.log("onToggleFavourite in stop view") }}
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
