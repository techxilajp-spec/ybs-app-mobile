import React, { useEffect, useRef, useState } from "react";

import {
  Animated,
  Dimensions,
  FlatList,
  ImageBackground,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  View,
  ViewStyle
} from "react-native";

const { width } = Dimensions.get("window");

type SliderItem = {
  id: number | string;
  image: string;
  url?: string;
};

type Props = {
  data: SliderItem[];
  autoPlay?: boolean;
  interval?: number;
  style?: ViewStyle;
};

export default function ({
  data,
  autoPlay = true,
  interval = 3000,
  style,
}: Props) {
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const [currentIndex, setCurrentIndex] = useState(0);
  const isUserScrolling = useRef(false);

  // Auto slide
  useEffect(() => {
    if (!autoPlay || data.length === 0) return;

    const timer = setInterval(() => {
      if (isUserScrolling.current) return;

      const nextIndex = currentIndex === data.length - 1 ? 0 : currentIndex + 1;

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setCurrentIndex(nextIndex);
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, autoPlay, interval, data.length]);

  /**
   * update acitve index after scrolling slide
   * @param event
   */
  const onMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
    isUserScrolling.current = false;
  };

  const openUrl = async (url: string = "") => {
    const supported = await Linking.canOpenURL(url);
    if(supported) {
      await Linking.openURL(url);
    }
  }

  if (data.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Animated.FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item: SliderItem) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={() => {
          isUserScrolling.current = true;
        }}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        renderItem={({ item }) => (
          <ImageBackground style={{ flex: 1 }} source={{ uri: item.image }}>
            <Pressable style={styles.slide} onPress={() => openUrl(item.url)} />
          </ImageBackground>
        )}
      />

      {/* Pagination dots */}
      {data.length > 0 && (
        <View style={styles.dotsContainer}>
          {data.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentIndex === index && styles.activeDot]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    borderRadius: 10,
    overflow: "hidden",
  },
  slide: {
    width: width - 40,
    height: 125,
    borderRadius: 12,
  },
  dotsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",

    position: "absolute",
    bottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#333",
  },
});
