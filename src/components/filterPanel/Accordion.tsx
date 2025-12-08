import { useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";

// custom components
import AppText from "@/src/components/AppText";

// expo vector icon
import Entypo from "@expo/vector-icons/Entypo";

// constants
import { Colors } from "@/src/constants/color";

type Option = {
  id: string;
  name: string;
};

type AccordionProps = {
  title: string;
  options: Option[];
};

export default function Accordion({ title, options }: AccordionProps) {
  const [expanded, setExpanded] = useState<boolean>(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    const newState = !expanded;
    setExpanded(newState);

    Animated.timing(animatedHeight, {
      toValue: newState ? 62.333 * options.length : 0,
      duration: 350,
      useNativeDriver: false,
    }).start();

    Animated.timing(rotateAnim, {
      toValue: newState ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View>
      <Pressable
        style={[styles.header, { borderBottomWidth: expanded ? 1 : 0 }]}
        onPress={toggleExpand}
      >
        <View style={styles.headerLeftSection}>
          <Entypo
            name="text-document"
            size={20}
            color={Colors.text.secondary}
          />
          <AppText size={16} style={styles.headerTitle}>
            {title}
          </AppText>
        </View>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Entypo name="chevron-down" size={24} color={Colors.primary} />
        </Animated.View>
      </Pressable>

      <Animated.View
        style={[styles.optionsContainer, { height: animatedHeight }]}
      >
        {options.map((option, index) => (
          <View key={option.id} style={styles.optionItem}>
            <AppText size={16} style={styles.optionName}>
              {option.name}
            </AppText>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 16,
    paddingHorizontal: 5,

    flexDirection: "row",
    justifyContent: "space-between",

    borderBottomWidth: 0,
    borderBottomColor: "#DBDBDB",
  },
  headerLeftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontFamily: "MiSansMyanmar-Demibold",
    color: Colors.text.primary,
  },
  optionsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#DBDBDB",
    overflow: "hidden", // IMPORTANT for animation
  },
  optionItem: {
    paddingVertical: 20,
    paddingLeft: 33,
  },
  optionName: {
    fontFamily: "MiSansMyanmar-Normal",
  },
});
