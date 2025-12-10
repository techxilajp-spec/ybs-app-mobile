import React from "react";
import {
  StyleProp,
  Text,
  TextProps,
  TextStyle
} from "react-native";

interface AppTextProps extends TextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  size?: number;
}

export default function AppText({
  children,
  style,
  size = 16,
  ...rest
}: AppTextProps) {
  const color = "#1A1A1A";
  return (
    <Text
      {...rest}
      style={[
        {
          color,
          fontSize: size
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
