import React from "react";
import {
    Pressable,
    StyleProp,
    StyleSheet,
    TextStyle,
    View,
    ViewStyle
} from "react-native";
import CustomText from "./CustomText";

type CustomButtonProps = {
  title: string | number;
  icon?: React.ReactNode;
  onPress?: () => void;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};
export default function CustomButton({ 
    title, 
    icon = null,
    onPress = () => {},
    buttonStyle = {},
    textStyle = {}
}: CustomButtonProps) {
  return (
    <Pressable onPress={onPress} style={[styles.button, buttonStyle]}>
      <View style={styles.content}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <CustomText title={title} style={textStyle} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 6,
  },
});
