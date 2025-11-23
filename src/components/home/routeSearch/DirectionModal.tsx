import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { useState } from "react";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// custom components
import NavigationTabs from "@/src/components/home/NavigationTabs";
import FavouriteView from "@/src/components/home/routeSearch/directionModal/FavouriteView";
import RecentView from "@/src/components/home/routeSearch/directionModal/RecentView";

type DirectionModalProps = {
  visible: boolean;
  mode: "start" | "end";
  onClose: () => void;
};

const TAB_CONFIG = [
  {
    label: "လတ်တလော",
    component: RecentView,
    getProps: () => ({}),
  },
  {
    label: "နှစ်သက်မှု",
    component: FavouriteView,
    getProps: () => ({}),
  },
];

const TABS = ["လတ်တလော", "နှစ်သက်မှု"];

export default function DirectionModal({
  visible,
  mode,
  onClose,
}: DirectionModalProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const { component: ActiveView, getProps } = TAB_CONFIG[activeIndex];
  return (
    <Modal visible={visible} backdropColor="#FFF" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onClose}>
            <MaterialIcons name="keyboard-backspace" size={24} color="black" />
          </Pressable>
          <View style={styles.inputContainer}>
            <View style={styles.circleIcon}>
              <View style={styles.circleIconInner}></View>
            </View>
            <TextInput
              style={styles.input}
              placeholder={mode === "start" ? "စထွက်မည့်နေရာ" : "သွားရောက်လိုသည့်နေရာ"}
              placeholderTextColor="#667085"
            />
          </View>
          <Pressable style={styles.filterButton}>
            <Image
              style={styles.filterIcon}
              source={require("@/assets/icons/filter.png")}
            />
          </Pressable>
        </View>
        <View style={{ flex: 1 }}>
          <NavigationTabs
            tabs={TABS}
            activeIndex={activeIndex}
            activeStates={{
              backgroundColor: '#F9F9F9',
              color: '#1F2937',
              borderColor: '#EEEEEE'
            }}
            inactiveStates={{
              backgroundColor: '#FFF',
              color: '#2F2F2F',
              borderColor: '#EEEEEE'
            }}
            onNavigationTabPress={setActiveIndex}
            navigationTabStyle={{
              marginBottom: 18
            }}
          />
          <ActiveView {...getProps()} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: 8,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: "#F2F4F7",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 8,

    flexDirection: "row",
    alignItems: "center",
  },
  circleIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#000",

    justifyContent: "center",
    alignItems: "center",
  },
  circleIconInner: {
    width: 4,
    height: 4,
    backgroundColor: "#FFF",
    borderRadius: 2,
  },
  input: {
    backgroundColor: "#F2F4F7",
    flex: 1,
    paddingLeft: 10,
  },
  filterButton: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    borderColor: "#D0D5DD",
    borderWidth: 1,
  },
  filterIcon: {
    width: 20,
    height: 20,
  },
});
