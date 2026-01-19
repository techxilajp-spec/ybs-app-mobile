// custom components
import { Image, Pressable, StyleSheet, TextInput, View } from "react-native";

// expo icons
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// custom components
import AppText from "@/src/components/AppText";

type HeaderProps = {
  searchText: string;
  searchPlaceholder: string;
  onSearchTextChange: (text: string) => void;
  onBackPress: () => void;
  onFilterPress: () => void;
  appliedFilterCount: number;
};

export default function Header({
  searchText,
  searchPlaceholder,
  onSearchTextChange,
  onBackPress,
  onFilterPress,
  appliedFilterCount,
}: HeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBackPress}>
        <MaterialIcons name="keyboard-backspace" size={24} color="black" />
      </Pressable>
      <View style={styles.inputContainer}>
        <View style={styles.circleIcon}>
          <View style={styles.circleIconInner}></View>
        </View>
        <TextInput
          value={searchText}
          onChangeText={onSearchTextChange}
          style={styles.input}
          placeholder={searchPlaceholder}
          placeholderTextColor="#667085"
        />
        {searchText.length > 0 && (
          <Pressable onPress={() => onSearchTextChange("")}>
            <MaterialIcons name="close" size={20} color="#667085" />
          </Pressable>
        )}
      </View>
      <Pressable style={styles.filterButton} onPress={onFilterPress}>
        {appliedFilterCount > 0 && (
          <View style={styles.filterCountBadge}>
            <AppText size={12} style={styles.filterCountBadgeText}>
              {appliedFilterCount}
            </AppText>
          </View>
        )}
        <Image
          style={styles.filterIcon}
          source={require("@/assets/icons/filter.png")}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: "#F2F4F7",
    paddingHorizontal: 15,
    borderRadius: 8,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
  },
  circleIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#000",

    justifyContent: "center",
    alignItems: "center",
  },
  circleIconInner: {
    width: 4,
    height: 4,
    backgroundColor: "#FFF",
    borderRadius: 2,
  },
  input: {
    flex: 1,
    fontFamily: "MiSansMyanmar-Regular",
    backgroundColor: "#F2F4F7",
    paddingLeft: 10,
  },
  filterButton: {
    position: "relative",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    borderColor: "#D0D5DD",
    borderWidth: 1,
  },
  filterIcon: {
    width: 20,
    height: 20,
  },
  filterCountBadge: {
    position: "absolute",
    top: 0,
    right: 0,

    width: 22,
    height: 22,
    backgroundColor: "#F4D159",
    borderRadius: 11,

    borderWidth: 1,
    borderColor: "#000000",

    transform: [{ translateX: 11 }, { translateY: -11 }],

    justifyContent: "center",
    alignItems: "center",
  },
  filterCountBadgeText: {
    fontFamily: "Roboto-Bold",
  },
});
