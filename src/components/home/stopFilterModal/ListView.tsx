import { FlatList, StyleSheet, View } from "react-native";

// constants
import { Colors } from "@/src/constants/color";

// customComponent
import AppText from "@/src/components/AppText";
import StopCard from "@/src/components/StopCard";

type ListViewProps = {
  data: any[];
  onToggleFavourite: (stop: any) => void;
};

export default function ListView({ data, onToggleFavourite }: ListViewProps) {
  return (
    <View style={styles.container}>
      {data.length > 0 ? (
        <FlatList
          style={styles.container}
          data={data}
          renderItem={({ item }) => (
            <StopCard
              title_mm={item.title_mm}
              title_en={item.title_en}
              description={item.description}
              isFavourite={item.isFavourite}
              onToggleFavourite={() => onToggleFavourite(item)}
            />
          )}
          keyExtractor={(item) => item.title_en}
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
