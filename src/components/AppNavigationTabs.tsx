import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";

// custom components
import AppText from "@/src/components/AppText";

type NavigationTabsProps = {
  tabs: string[];
  activeIndex: number;
  activeStates: {
    backgroundColor: string;
    color: string;
    borderColor: string;
  };
  inactiveStates: {
    backgroundColor: string;
    color: string;
    borderColor: string;
  };
  navigationTabStyle?: StyleProp<ViewStyle>;
  onNavigationTabPress: (index: number) => void;
};

type AppNavigationTabProps = {
  title: string;
  active: boolean;
  activeColors: {
    backgroundColor: string;
    color: string;
    borderColor: string;
  };
  inactiveColors: {
    backgroundColor: string;
    color: string;
    borderColor: string;
  };
  onPress: () => void;
};

function NavigationTab({
  title,
  active,
  activeColors,
  inactiveColors,
  onPress,
}: AppNavigationTabProps) {
  const tabStyle = active
    ? {
        backgroundColor: activeColors.backgroundColor,
        borderColor: activeColors.borderColor,
      }
    : {
        backgroundColor: inactiveColors.backgroundColor,
        borderColor: inactiveColors.borderColor,
      };

  const tabTextStyle = active
    ? {
        color: activeColors.color,
        fontFamily: "MiSansMyanmar-Semibold",
      }
    : {
        color: inactiveColors.color,
      };

  return (
    <Pressable style={[styles.tab, tabStyle]} onPress={onPress}>
      <AppText style={[styles.tabTitle, tabTextStyle]}>{title}</AppText>
    </Pressable>
  );
}

export default function AppNavigationTabs({
  tabs,
  activeIndex,
  activeStates,
  inactiveStates,
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
          activeColors={activeStates}
          inactiveColors={inactiveStates}
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
    paddingHorizontal: 20,
    borderRadius: 30,
    marginRight: 5,
    borderWidth: 1,
  },
  tabTitle: {
    fontSize: 14,
    fontFamily: "MiSansMyanmar-Medium",
  },
});
