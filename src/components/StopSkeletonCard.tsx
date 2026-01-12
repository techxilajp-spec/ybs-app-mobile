import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";

type StopSkeletonCardProps = {
  style?: ViewStyle;
};

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

export default function StopSkeletonCard({ style }: StopSkeletonCardProps) {
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
      {/* Skeleton Circle */}
      <View style={styles.skeletonCircle}>
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

      {/* Skeleton Bars */}
      <View style={styles.rightContent}>
        <View style={styles.skeletonBar}>
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
        <View style={{ height: 8 }} />
        <View style={[styles.skeletonBar, { width: "60%" }]}>
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
        <View style={{ height: 8 }} />
        <View style={[styles.skeletonBar, { width: "40%" }]}>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  skeletonCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#F8F8F8",
    overflow: "hidden", // important for shimmer
  },
  rightContent: {
    flex: 1,
    marginLeft: 15,
  },
  skeletonBar: {
    height: 10,
    width: "100%",
    borderRadius: 5,
    backgroundColor: "#F8F8F8",
    overflow: "hidden", // important for shimmer
  },
});
