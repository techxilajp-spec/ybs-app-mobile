import { StyleSheet, View } from "react-native";

// custom components
import OptionItem from "@/src/components/home/routeList/FilterModal/OptionItem";

type OptionListProps = {
  activeIndex: number;
  options: string[];
  onSelectOptions: (index: number) => void;
};

export default function OptionList({
  activeIndex,
  options,
  onSelectOptions,
}: OptionListProps) {
  return (
    <View style={styles.container}>
      {options.map((option, index) => (
        <OptionItem
          style={{ marginBottom: index === options.length - 1 ? 0 : 25 }}
          key={option}
          active={activeIndex === index}
          title={option}
          onSelectItem={() => onSelectOptions(index)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 28,
    paddingTop: 35,
    paddingBottom: 40,
  },
});
