import { Image, Pressable, StyleSheet, View } from "react-native";

// constants
import { Colors } from "@/src/constants/color";

// custom component
import AppText from "@/src/components/AppText";

type FilterViewProps = {
    onClose: () => void
}

export default function FilterView({
    onClose
}: FilterViewProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onClose}>
          <Image
            style={styles.backIcon}
            source={require("@/assets/icons/back_arrow.png")}
          />
        </Pressable>
        <AppText size={18} style={styles.headerTitle}>
          မြို့နယ်ရှာရန်
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 50,
    position: "relative",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: '#000'
  },
  backIcon: {
    width: 20,
    height: 15,
  },
  backButton: {
    width: 50,
    height: 50,

    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 5,
    justifyContent: "center",
  },
  headerTitle: {
    fontWeight: "semibold",
    color: Colors.text.primary,
    textAlign: "center",
  },
  
});
