// react
import { useState } from "react";

// react native
import { FlatList, StyleSheet, ViewStyle } from "react-native";

// custom component
import Accordion from "@/src/components/filterPanel/Accordion";

// type
import { Accordian, Option } from "@/src/types/accordian";

type AccordionListProps = {
  list: Accordian[];
  selectedOptions: Option[];
  style?: ViewStyle;
  onOptionSelect: (option: Option) => void;
};

export default function AccordionList({
  list,
  selectedOptions,
  style,
  onOptionSelect,
}: AccordionListProps) {
  const [activeAccordionIndex, setActiveAccordionIndex] = useState<
    number | null
  >(null);
  return (
    <FlatList
      style={[styles.container, style]}
      data={list}
      renderItem={({ item, index }) => (
        <Accordion
          selectedOptionIds={selectedOptions.map(option => option.id)}
          onOptionSelect={onOptionSelect}
          onExpand={() =>
            setActiveAccordionIndex(
              activeAccordionIndex === index ? null : index
            )
          }
          expanded={activeAccordionIndex === index}
          title={item.title}
          options={item.options}
        />
      )}
      keyExtractor={(item) => item.title}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
