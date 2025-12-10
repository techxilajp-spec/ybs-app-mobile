import { Modal, Pressable, StyleSheet, View } from "react-native";

// custom component
import OptionList from "@/src/components/home/routeList/FilterModal/OptionList";
import { useState } from "react";

type FilterModalProps = {
  visible: boolean;
  onClose: () => void;
};

const routeFilterOptions = [
  "ယာဉ်လိုင်းများအားလုံး ( Default )",
  "YPS Service ရရှိသော ယာဉ်များ",
];

export default function FilterModal({ visible, onClose }: FilterModalProps) {
  const [activeOptionIndex, setActiveOptionIndex] = useState<number>(0);

  const selectOption = (index: number) => {
    setActiveOptionIndex(index);
  };

  return (
    <Modal
      visible={visible}
      backdropColor="#0000004D"
      statusBarTranslucent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.container} onPress={onClose}>
        <View style={styles.bottomSheet} onStartShouldSetResponder={() => true}>
          <View style={styles.bottomSheetHeader}>
            <Pressable style={styles.barIcon} onPress={onClose}></Pressable>
          </View>
          <OptionList
            options={routeFilterOptions}
            activeIndex={activeOptionIndex}
            onSelectOptions={selectOption}
          />
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#FFF",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  bottomSheetHeader: {
    height: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#D0D5DD",
    justifyContent: "center",
    alignItems: "center",
  },
  barIcon: {
    width: 32,
    height: 4,
    backgroundColor: "#D0D5DD",
    borderRadius: 2,
  },
});
