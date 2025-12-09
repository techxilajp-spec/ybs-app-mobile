import { Modal, Pressable, StyleSheet, View } from "react-native";

// custom component
import AppText from "../../AppText";

// constants

type FilterModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function FilterModal({ visible, onClose }: FilterModalProps) {
  return (
    <Modal
      visible={visible}
      backdropColor="#0000004D"
      statusBarTranslucent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.container} onPress={onClose}>
        <View style={styles.bottomSheet}>
            <View style={styles.bottomSheetHeader}>
                <View style={styles.barIcon}></View>
            </View>
            <View style={styles.optionContainer}>
                <AppText>Hello World</AppText>
            </View>
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
    borderTopLeftRadius: 20
  },
  bottomSheetHeader: {
    height: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#D0D5DD',
    justifyContent: "center",
    alignItems: "center"
  },
  barIcon: {
    width: 32,
    height: 4,
    backgroundColor: "#D0D5DD",
    borderRadius: 2
  },
  optionContainer: {
    paddingHorizontal: 28,
    paddingTop: 35,
    paddingBottom: 40
  }
});
