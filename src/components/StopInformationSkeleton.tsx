import { Animated, StyleSheet, View, ViewStyle } from "react-native";

// react
import { useEffect, useRef } from "react";

// linear gradient
import { LinearGradient } from "expo-linear-gradient";

// constants
import { Colors } from "../constants/color";

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

type StopInformationSkeletonProps = {
    style?: ViewStyle
}

export default function StopInformationSkeleton({
    style
} : StopInformationSkeletonProps) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-120, 120],
  });

  return (
    <View style={[styles.container, style]}>
      {new Array(4).fill(0).map((_, index) => (
        <View key={index} style={[styles.skeletonBar, { marginBottom: index === 0 ? 20 : 7 }]}>
          <AnimatedGradient
            colors={["#F8F8F8", "#EDEDED", "#F8F8F8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              StyleSheet.absoluteFill,
              {
                transform: [{ translateX }],
              },
            ]}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",

    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,

    borderWidth: 1,
    borderColor: Colors.border.primary,
    borderRadius: 8,
  },
  skeletonBar: {
    height: 15,
    width: "100%",
    borderRadius: 5,
    backgroundColor: "#F8F8F8",
    overflow: "hidden", // important for shimmer
  },
});
