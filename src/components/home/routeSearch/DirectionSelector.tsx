import React from "react";

import { Image, Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

// custom component
import AppText from "../../AppText";

export type DirectionSelectorProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  showIndicator?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;    
};

export default function DirectionSelector({
  icon,
  title,
  description,
  showIndicator = false,
  onPress,
  style
}: DirectionSelectorProps) {
  return (
    <Pressable style={[styles.container, style]} onPress={onPress}>
      <View
        style={{
          position: "relative",
          width: 35
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
          <AppText size={14} style={styles.description}>
            {description}
          </AppText>
          <Image 
            source={require('@/assets/icons/right_arrow.png')}
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
  },
  description: {
    color: "#1F2937",
    flex: 1
  },
  selector: {
    padding: 12,
    backgroundColor: "#F2F4F7",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
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
    paddingLeft: 8
  },
  dotIcon: {
    width: 5,
    height: 5,
    backgroundColor: "#DADCE0",
    borderRadius: 2.5,
    marginBottom: 3
  },
  rightArrowIcon: {
    width: 20,
    height: 20
  }
});
