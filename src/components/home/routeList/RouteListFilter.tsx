import { Image, Pressable, StyleSheet, TextInput, View } from "react-native";

type RouteListFilterProps = {
  onPressFilterButton: () => void
}

export default function RouteListFilter({
  onPressFilterButton
}: RouteListFilterProps) {
  return (
    <View style={styles.filterContainer}>
      <View style={styles.inputContainer}>
        <View style={styles.busIconContainer}>
          <Image
            style={styles.busIcon}
            source={require("@/assets/icons/bus.png")}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="ဘက်စကားနံပါတ်အားရိုက်ထည့်ပါ"
          placeholderTextColor="#667085"
        />
      </View>
      <Pressable style={styles.filterButton} onPress={onPressFilterButton}>
        <Image
          style={styles.filterIcon}
          source={require("@/assets/icons/filter.png")}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    backgroundColor: "#FFF",

    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D0D5DD",

    flexDirection: "row",
    gap: 5,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: "#F2F4F7",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8
  },
  busIconContainer: {
    padding: 5
  },
  busIcon: {
    width: 22,
    height: 22,
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderColor: '#D0D5DD',
    borderWidth: 1
  },
  filterIcon: {
    width: 20,
    height: 20
  },
  input: {
    flex: 1,
    fontSize: 14
  },
});
