import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";

// custom components
import AppText from "@/src/components/AppText";

// constants
import { Colors } from "@/src/constants/color";

type NavigationTabsProps = {
  tabs: string[];
  activeIndex: number;
  navigationTabStyle?: StyleProp<ViewStyle>;
  onNavigationTabPress: (index: number) => void;
};

type NavigationTabProps = {
  title: string;
  active: boolean;
  onPress: () => void;
};

function NavigationTab({ title, active, onPress }: NavigationTabProps) {
  const tabStyle = active
    ? {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
      }
    : {
        backgroundColor: Colors.secondary,
        borderColor: "#EEE",
      };

  const tabTextColor = active ? "#FFF" : "#2F2F2F";

  return (
    <Pressable style={[styles.tab, tabStyle]} onPress={onPress}>
      <AppText style={[styles.tabTitle, { color: tabTextColor }]}>
        {title}
      </AppText>
    </Pressable>
  );
}

export default function NavigationTabs({
  tabs,
  activeIndex,
  navigationTabStyle = {},
  onNavigationTabPress,
}: NavigationTabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.container, navigationTabStyle]}
      contentContainerStyle={{ flexGrow: 0 }}
    >
      {tabs.map((title, index) => (
        <NavigationTab
          key={title}
          title={title}
          active={activeIndex === index}
          onPress={() => onNavigationTabPress(index)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginRight: 8,
    borderWidth: 1,
  },
  tabTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
});
