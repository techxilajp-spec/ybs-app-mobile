import React from "react";

import {
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

// custom component
import AppText from "@/src/components/AppText";

// constants
import { Colors } from "@/src/constants/color";

export type DirectionSelectorProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  value?: string;
  showIndicator?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function DirectionSelector({
  icon,
  title,
  description,
  value = "",
  showIndicator = false,
  onPress,
  style,
  subtitle,
}: DirectionSelectorProps & { subtitle?: string }) {
  return (
    <Pressable style={[styles.container, style]} onPress={onPress}>
      <View
        style={{
          position: "relative",
          width: 35,
        }}
      >
        <View style={styles.iconContainer}>{icon}</View>
        {showIndicator && (
          <View style={styles.indicator}>
            {new Array(5).fill(0).map((_, index) => (
              <View key={index} style={styles.dotIcon} />
            ))}
          </View>
        )}
      </View>
      <View style={{ flex: 1 }}>
        <AppText size={14} style={styles.title}>
          {title}
        </AppText>
        <View style={styles.selector}>
          <View style={{ flex: 1 }}>
            <AppText
              size={14}
              style={[
                styles.inputText,
                {
                  color:
                    value.trim() !== ""
                      ? Colors.text.secondary
                      : Colors.text.primary,
                },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {value.trim() !== "" ? value.trim() : description}
            </AppText>
            {/* {subtitle && (
              <AppText
                size={12}
                style={{ color: Colors.text.description, marginTop: 2, fontFamily: "MiSansMyanmar-Regular" }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {subtitle}
              </AppText>
            )} */}
          </View>
          <Image
            source={require("@/assets/icons/right_arrow.png")}
            style={styles.rightArrowIcon}
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  iconContainer: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  title: {
    color: "#8F959D",
    marginBottom: 8,
    fontFamily: "MiSansMyanmar-Regular",
  },
  inputText: {
    flex: 1,
    fontFamily: "MiSansMyanmar-Regular",
  },
  selector: {
    padding: 12,
    backgroundColor: "#F2F4F7",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  startIcon: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#4A4949",
  },
  indicator: {
    marginTop: 40,
    paddingLeft: 8,
  },
  dotIcon: {
    width: 5,
    height: 5,
    backgroundColor: "#DADCE0",
    borderRadius: 2.5,
    marginBottom: 3,
  },
  rightArrowIcon: {
    width: 20,
    height: 20,
  },
});
