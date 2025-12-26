// react native
import {
  Pressable,
  ScrollView,
  StyleSheet,
  ViewStyle
} from "react-native";

// custom components
import AppText from "@/src/components/AppText";

// constants
import { Colors } from "@/src/constants/color";

type RouteTabProps = {
  tabs: string[];
  activeIndex: number;
  onTabChange?: (index : number) => void;
  style?: ViewStyle;
};

const ACTIVE_COLOR = Colors.primary;
const ACTIVE_TEXT_COLOR = "#FFFFFF";
const INACTIVE_COLOR = "#F9FAFB";
const INACTIVE_TEXT_COLOR = "#344054";

export default function RouteTab({
  tabs,
  activeIndex,
  onTabChange = (index) => {},
  style,
}: RouteTabProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.container, style]}
      contentContainerStyle={{ flexGrow: 0 }}
    >
      {tabs.map((tab, index) => (
        <Pressable
          key={index}
          style={[
            styles.tab,
            {
              backgroundColor:
                activeIndex === index ? ACTIVE_COLOR : INACTIVE_COLOR,
            },
          ]}
          onPress={() => onTabChange(index)}
        >
          <AppText
            size={12}
            style={[
              {
                color:
                  activeIndex === index
                    ? ACTIVE_TEXT_COLOR
                    : INACTIVE_TEXT_COLOR,
              },
            ]}
          >
            {tab}
          </AppText>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
  },
  tab: {
    borderColor: "#EAECF0",
    borderRadius: 4,

    paddingVertical: 8,
    paddingHorizontal: 6,

    marginRight: 8,
  },
});
