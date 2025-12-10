import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

// custom components
import AppText from "@/src/components/AppText";

// constants
import { Colors } from "@/src/constants/color";

type OptionItemProps = {
  style?: ViewStyle;
  active: boolean;
  title: string;
  onSelectItem: () => void
};

export default function OptionItem({ active, title, style, onSelectItem }: OptionItemProps) {
  const activeColor = active ? Colors.primary : "#CBD5E1";
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onSelectItem}>
      <View style={[styles.circleIcon, { backgroundColor: activeColor }]}>
        <View style={styles.innerCircle}></View>
      </View>
      <AppText style={styles.title} size={16}>
        {title}
      </AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
  },
  title: {
    fontFamily: "MiSansMyanmar-Semibold",
    color: Colors.text.secondary,
  },
  circleIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,

    justifyContent: "center",
    alignItems: "center",
  },
  innerCircle: {
    backgroundColor: "#FFF",
    width: 5,
    height: 5,
    borderRadius: 3,
  },
});
