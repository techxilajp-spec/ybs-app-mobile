import React from "react";
import {
    Pressable,
    StyleProp,
    StyleSheet,
    TextStyle,
    ViewStyle
} from "react-native";

// custom component
import AppText from "@/src/components/AppText";

export type AppButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export default function AppButton({
  title,
  onPress,
  disabled = false,
  style,
  textStyle,
}: AppButtonProps) {
  return (
    <Pressable
      style={[styles.button, disabled && styles.disabledButton, style]}
      onPress={onPress}
      disabled={disabled}
    >
        <AppText style={[styles.title, textStyle]}>{title}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    backgroundColor: "#E64B32",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  disabledButton: {
    backgroundColor: "#A5C0EB",
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
