import { Image, Pressable, StyleSheet, View } from "react-native";

// custom components
import AppText from "@/src/components/AppText";

// constants
import { Colors } from "@/src/constants/color";

type HeaderProps = {
  onBack: () => void;
};

export default function Header({ onBack }: HeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable style={styles.backButton} onPress={onBack}>
        <Image
          style={styles.backIcon}
          source={require("@/assets/icons/back_arrow.png")}
        />
      </Pressable>
      <View>
        <AppText size={18} style={styles.headerTitle}>
          မြို့နယ်ရှာရန်
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    position: "relative",
    justifyContent: "center",
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
    left: 10,
    zIndex: 5,
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "MiSansMyanmar-Semibold",
    color: Colors.text.primary,
    textAlign: "center",
  },
});
