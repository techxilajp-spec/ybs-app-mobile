import { FlatList, Pressable, StyleSheet, View } from "react-native";

// constants
import { Colors } from "@/src/constants/color";

// customComponent
import AppText from "@/src/components/AppText";
import StopCard from "@/src/components/StopCard";

type ListViewProps = {
  data: any[];
  onItemPress?: (item: any) => void;
};

export default function ListView({ data, onItemPress }: ListViewProps) {
  return (
    <View style={styles.container}>
      {data.length > 0 ? (
        <FlatList
          style={styles.container}
          data={data}
          renderItem={({ item }) => (
            <Pressable onPress={() => onItemPress?.(item)}>
              <StopCard
                title_mm={item.name_mm ?? ""}
                title_en={item.name_en ?? ""}
                description={
                  item.description ?? (item.lat && item.lng ? `${item.lat}, ${item.lng}` : "")
                }
                isFavourite={item.is_favourite ?? false}
              />
            </Pressable>
          )}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={[styles.container, styles.noDataContainer]}>
            <AppText size={16} style={styles.noDataText}>Data များမရှိသေးပါ</AppText>
        </View>
      )}
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
