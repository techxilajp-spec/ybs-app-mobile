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
  weight?: "regular" | "medium" | "bold";
  size?: number;
}

export default function AppText({
  children,
  style,
  weight = "regular",
  size = 16,
  ...rest
}: AppTextProps) {
  const color = "#1A1A1A";

  const fontFamilyMap = {
    regular: "System",
    medium: "System",
    bold: "System",
  };
  return (
    <Text
      {...rest}
      style={[
        {
          color,
          fontSize: size,
          fontFamily: fontFamilyMap[weight],
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
