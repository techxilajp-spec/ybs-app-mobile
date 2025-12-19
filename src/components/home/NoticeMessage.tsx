import { StyleSheet, View, ViewStyle } from "react-native";

// expo icons
import AntDesign from "@expo/vector-icons/AntDesign";

// custom components
import AppText from "@/src/components/AppText";

type NoticeMessageProps = {
    style?: ViewStyle,
    message: string
}

export default function NoticeMessage({ message, style } : NoticeMessageProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <AntDesign name="exclamation" size={14} color="#FFF" />
      </View>
      <View style={styles.messageContainer}>
        <AppText size={14} style={styles.message}>
          {message}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FEFAEE",
    paddingHorizontal: 14,
    paddingVertical: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FDF6DE",

    flexDirection: "row",
    gap: 15,
  },
  iconContainer: {
    width: 22,
    height: 22,
    backgroundColor: "#F4D159",
    borderRadius: 11,

    justifyContent: "center",
    alignItems: "center",
  },
  messageContainer: {
    flex: 1,
  },
  message: {
    fontFamily: "MiSansMyanmar-Regular",
    color: "#000",
  },
});