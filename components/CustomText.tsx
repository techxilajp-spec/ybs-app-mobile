import React from "react";
import {
    StyleProp,
    StyleSheet,
    Text,
    TextProps,
    TextStyle,
} from "react-native";

type CustomTextProps = {
  title: string | number;
  style?: StyleProp<TextStyle>;
} & TextProps;

export default function CustomText({
  title,
  style,
  ...props
}: CustomTextProps) {
  return (
    <Text style={[styles.text, style]} {...props}>
      {title}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: "normal",
    color: "#000",
    flexShrink: 1,
    includeFontPadding: false,
  },
});
