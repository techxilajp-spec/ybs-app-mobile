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
  loading?: boolean;
  loadingText?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export default function AppButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  loadingText = "ရှာဖွေနေသည်...",
  style,
  textStyle,
}: AppButtonProps) {
  return (
    <Pressable
      style={[styles.button, (disabled || loading) && styles.disabledButton, style]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <AppText style={[styles.title, textStyle]}>
        {loading ? loadingText : title}
      </AppText>
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
