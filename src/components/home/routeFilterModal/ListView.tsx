import { FlatList, StyleSheet, View } from "react-native";

// constants
import { Colors } from "@/src/constants/color";

// customComponent
import AppText from "@/src/components/AppText";
import StopCard from "@/src/components/StopCard";
import { Stop } from "@/src/types/bus";

type ListViewProps = {
  data: Stop[];
  onPress?: (item: any) => void;
};

export default function ListView({ data, onPress }: ListViewProps) {
  return (
    <View style={styles.container}>
      {data.length > 0 ? (
        <FlatList
          style={styles.container}
          data={data}
          renderItem={({ item }) => (
            <StopCard
              title_mm={item.name_mm}
              title_en={item.name_en}
              road_mm={item.road_mm}
              lat={item.lat}
              lng={item.lng}
              isFavourite={item.isFavourite}
              onPress={() => onPress && onPress(item)}
            // onToggleFavourite={() => { }}
            />
          )}
          keyExtractor={(item, index) => index + item.name_en}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={[styles.container, styles.noDataContainer]}>
          <AppText size={16} style={styles.noDataText}>ဘတ်စ်ကား ရှာမတွေ့ပါ</AppText>
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
