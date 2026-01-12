import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image, Pressable, StyleSheet, View, ViewStyle } from "react-native";

// custom components
import AppText from "@/src/components/AppText";

// constants
import { Colors } from "@/src/constants/color";

type SearchInputProps = {
  style?: ViewStyle;
  onPress: () => void;
  value?: string | undefined;
  onClear?: () => void;
};

export default function SearchInput({ style, onPress, value, onClear }: SearchInputProps) {
  return (
    <Pressable style={[styles.container, style]} onPress={onPress}>
      <View style={styles.inputContainer}>
        <Image
          source={require("@/assets/icons/bus.png")}
          style={styles.busIcon}
        />
        <View style={styles.titleContainer}>
          <AppText size={14} style={styles.title}>
            {value ?? "မှတ်တိုင်နာမည်ကိုရိုက်ထည့်ပါ။"}
          </AppText>
        </View>
        {value ? (
          <Pressable onPress={(e) => { e.stopPropagation(); onClear?.(); }}>
            <MaterialIcons name="close" size={18} color={Colors.text.quaternary} />
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: Colors.border.disabled,
    borderRadius: 20,
  },
  inputContainer: {
    height: 48,
    backgroundColor: "#F2F4F7",
    paddingHorizontal: 14,
    borderRadius: 8,

    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  busIcon: {
    width: 24,
    height: 24,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    color: Colors.text.quaternary,
    fontFamily: "MiSansMyanmar-Regular",
  },
});
