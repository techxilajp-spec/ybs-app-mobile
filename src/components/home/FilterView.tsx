// react
import { useState } from "react";

// react native
import { StyleSheet, View } from "react-native";

// constants
import { Colors } from "@/src/constants/color";

// custom component
import AppButton from "@/src/components/AppButton";
import AppText from "@/src/components/AppText";
import AccordionList from "@/src/components/filterPanel/AccordionList";
import Header from "@/src/components/filterPanel/Header";
import SearchInput from "@/src/components/filterPanel/SearchInput";
import OptionTab from "@/src/components/home/stopFilterModal/OptionTab";

// type
import { Accordian, Option } from "@/src/types/accordian";

type FilterViewProps = {
  onClose: () => void;
  data: Accordian[];
  selectedOptions: Option[];
  onOptionListSelect: (optionList: Option[]) => void;
};

export default function FilterView({
  onClose,
  data,
  selectedOptions,
  onOptionListSelect,
}: FilterViewProps) {
  const [selectedAccordionOptions, setSelectedAccordionOptions] =
    useState<Option[]>(selectedOptions);

  const hasSelectedAccordionOptions  = selectedAccordionOptions.length > 0;

  /**
   * Handles selection and deselection of an accordion option.
   *
   * If the option is already selected, it will be removed from the selected options.
   * If it is not selected, it will be added to the selected options.
   *
   * @param selectedOption - The option that was selected or deselected by the user.
   */
  const onAccordionOptionSelect = (selectedOption: Option) => {
    setSelectedAccordionOptions((options) => {
      const isSelected =
        options.filter((option) => option.id === selectedOption.id).length > 0;

      if (isSelected) {
        return options.filter((option) => option.id !== selectedOption.id);
      }

      return [...options, selectedOption];
    });
  };

  /**
   * Removes a selected option from the options list.
   *
   * @param optionId - The ID of the option to remove.
   */
  const removeOption = (optionId: string) => {
    setSelectedAccordionOptions((options: Option[]) => {
      return options.filter((option: Option) => option.id !== optionId);
    });
  };

  /**
   * Applies the currently selected accordion options as the active filter.
   */
  const filterOptions = () => {
    onOptionListSelect(selectedAccordionOptions);
    onClose();
  };

  /**
   * Cancel Filters
   */
  const removeOptions = () => {
    onOptionListSelect([]);
    onClose();
  };

  return (
    <View style={styles.container}>
      <Header onBack={onClose} />
      <SearchInput style={styles.searchInput} />
      {hasSelectedAccordionOptions && (
        <View style={styles.optionTabContainer}>
          {selectedAccordionOptions.map((option) => (
            <OptionTab
              key={option.id}
              title={option.name}
              remove={() => removeOption(option.id)}
            />
          ))}
        </View>
      )}
      <View style={{ flex: 1 }}>
        <AppText size={16} style={styles.title}>
          မြို့နယ်များ
        </AppText>
        <AccordionList
          list={data}
          selectedOptions={selectedAccordionOptions}
          style={styles.accorionList}
          onOptionSelect={onAccordionOptionSelect}
        />
        <View style={styles.buttonContainer}>
          <AppButton
            title={`စစ်ထုတ်ရန် ${hasSelectedAccordionOptions ? `( ${selectedAccordionOptions.length} )` : "" }`}
            style={styles.filterButton}
            textStyle={styles.filterText}
            onPress={filterOptions}
          />
          <AppButton
            title="ပယ်ဖျက်ရန်"
            style={styles.cancelButton}
            textStyle={styles.cancelText}
            onPress={removeOptions}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    marginTop: 10,
    marginBottom: 25,
  },
  title: {
    fontFamily: "MiSansMyanmar-Semibold",
  },
  accorionList: {
    marginTop: 22,
  },
  buttonContainer: {
    paddingVertical: 20,
  },
  filterButton: {
    marginBottom: 10,
  },
  filterText: {
    fontFamily: "MiSansMyanmar-Medium",
  },
  cancelButton: {
    backgroundColor: "#FAEEED",
  },
  cancelText: {
    color: Colors.primary,
    fontFamily: "MiSansMyanmar-Medium",
  },
  optionTabContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 32,
  },
});
