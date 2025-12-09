import { FlatList, StyleSheet, ViewStyle } from "react-native";

// custom component
import Accordion from "@/src/components/filterPanel/Accordion";
import { useState } from "react";

type AccordionListProps = {
  list: any[];
  style?: ViewStyle;
};

export default function AccordionList({ list, style }: AccordionListProps) {
  const [activeAccordionIndex, setActiveAccordionIndex] = useState<
    number | null
  >(null);
  return (
    <FlatList
      style={[styles.container, style]}
      data={list}
      renderItem={({ item, index }) => (
        <Accordion
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
