import { StyleSheet, View } from "react-native";

// custom components
import OptionItem from "@/src/components/home/routeList/FilterModal/OptionItem";

//types
import { RouteFilters } from "@/src/types/filter";

type OptionListProps = {
  activeOptionId: string;
  options: RouteFilters[];
  onSelectOption: (optionId: string) => void;
};

export default function OptionList({
  activeOptionId,
  options,
  onSelectOption,
}: OptionListProps) {
  return (
    <View style={styles.container}>
      {options.map((option, index) => (
        <OptionItem
          style={{ marginBottom: index === options.length - 1 ? 0 : 25 }}
          key={option.id}
          active={activeOptionId === option.id}
          title={option.title}
          onSelectItem={() => onSelectOption(option.id)}
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
