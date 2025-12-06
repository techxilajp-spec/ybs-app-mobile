import { FlatList, StyleSheet, ViewStyle } from "react-native";

// custom components
import StopCard from "@/src/components/StopCard";

type StopsListViewProps = {
  style?: ViewStyle
}

const DummyDatas = [
  {
    title_mm: "အလုံစာတိုက် ( ကမ်းနားလမ်း )",
    title_en: "Ahlone Sar Tike ( Kan Nar Road )",
    description: "( 16.81891194040748, 96.1352775209624 )",
    isFavourite: false,
  },
  {
    title_mm: "စာတိုက်ကြီး ( ကြည်မြင့်တိုင် ကမ်းနားလမ်း )",
    title_en: "Sar Tike ( Lower Kyi Myint Tine )",
    description: "( 16.784547668526493, 96.15749597725802 )",
    isFavourite: false,
  },
  {
    title_mm: "စာတိုက် ( မြင်တော်သာလမ်း )",
    title_en: "Sar Tike ( Myin Taw Tar Road )",
    description: "( 16.81891194040748, 96.1352775209624 )",
    isFavourite: false,
  },
  {
    title_mm: "သိမ်ဖြူစာတိုက််",
    title_en: "Post Office Bus Stop , Thein Phyu Road.",
    description: "( 16.81891194040748, 96.1352775209624 )",
    isFavourite: true,
  }
];

export default function StopsListView({
  style
}: StopsListViewProps) {
  return (
    <FlatList
      data={DummyDatas}
      style={[styles.listContainer, style]}
      renderItem={({ item }) => (
        <StopCard
          title_mm={item.title_mm}
          title_en={item.title_en}
          description={item.description}
          isFavourite={item.isFavourite}
        />
      )}
      keyExtractor={(item) => item.title_en}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1
  },
});
