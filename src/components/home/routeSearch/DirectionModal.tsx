import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { useEffect, useState } from "react";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// custom components
import NavigationTabs from "@/src/components/AppNavigationTabs";
import FilterView from "@/src/components/home/FilterView";
import ListView from "@/src/components/home/routeSearch/directionModal/ListView";

import { SafeAreaView } from "react-native-safe-area-context";

type DirectionModalProps = {
  visible: boolean;
  mode: "start" | "end" | null;
  onClose: () => void;
};

const TABS = ["လတ်တလော", "နှစ်သက်မှု"];

const DummyDatas = {
  recent: [
    {
      title_mm: "အလုံစာတိုက် ( အောက်ကြည်မြင့်တိုင် )",
      title_en: "Ahlone Sar Tike ( Lower Kyi Myint Tine )",
      description: "( 16.784547668526493, 96.15749597725802 )",
      isFavourite: false,
    },
    {
      title_mm: "အလုံစာတိုက် ( ကမ်းနားလမ်း )",
      title_en: "Ahlone Sar Tike ( Kan Nar Road )",
      description: "( 16.81891194040748, 96.1352775209624 )",
      isFavourite: false,
    },
    {
      title_mm: "စာတိုက်ကြီး ( ကြည်မြင့်တိုင် ကမ်းနားလမ်း )",
      title_en: "Sar Tike ( Lower Kyi Myint Tine )",
      description: "( 16.784547668526493, 96.15749597725802 )",
      isFavourite: false,
    },
    {
      title_mm: "စာတိုက် ( မြင်တော်သာလမ်း )",
      title_en: "Sar Tike ( Myin Taw Tar Road )",
      description: "( 16.81891194040748, 96.1352775209624 )",
      isFavourite: false,
    },
    {
      title_mm: "သိမ်ဖြူစာတိုက််",
      title_en: "Post Office Bus Stop , Thein Phyu Road.",
      description: "( 16.81891194040748, 96.1352775209624 )",
      isFavourite: false,
    },
  ],
  favourite: [
    {
      title_mm: "သိမ်ဖြူစာတိုက်မှတ်တိုင်",
      title_en: "Post Office Bus Stop , Thein Phyu Road.",
      description: "( 16.784547668526493, 96.15749597725802 )",
      isFavourite: true,
    },
  ],
  searchResult: [
    {
      title_mm: "စာတိုက် ( မြင်တော်သာလမ်း )",
      title_en: "Sar Tike ( Myin Taw Tar Road )",
      description: "( 16.81891194040748, 96.1352775209624 )",
      isFavourite: false,
    },
    {
      title_mm: "သိမ်ဖြူစာတိုက်မှတ်တိုင်",
      title_en: "Post Office Bus Stop , Thein Phyu Road.",
      description: "( 16.784547668526493, 96.15749597725802 )",
      isFavourite: true,
    },
  ],
};

export default function DirectionModal({
  visible,
  mode,
  onClose,
}: DirectionModalProps) {
  const [searchText, setSearchText] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [stopsList, setStopsList] = useState<any[]>([]);
  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);

  const isValidSearchText = searchText.trim().length > 0;

  const showFilters = () => {
    setIsFilterVisible(true);
  };

  const hileFilters = () => {
    setIsFilterVisible(false);
  }

  useEffect(() => {
    if (isValidSearchText) {
      setStopsList(DummyDatas.searchResult);
      return;
    }
    const source = activeIndex === 0 ? "recent" : "favourite";
    setStopsList(DummyDatas[source]);
  }, [activeIndex, searchText]);

  useEffect(() => {
    console.log("modal initalized");
  }, []);
  return (
    <Modal
      visible={visible}
      backdropColor="#FFF"
      onRequestClose={onClose}
      animationType="slide"
      statusBarTranslucent={true}
    >
      <SafeAreaView style={styles.container}>
        {isFilterVisible ? (
          <FilterView onClose={hileFilters} />
        ) : (
          <>
            <View style={styles.header}>
              <Pressable onPress={onClose}>
                <MaterialIcons
                  name="keyboard-backspace"
                  size={24}
                  color="black"
                />
              </Pressable>
              <View style={styles.inputContainer}>
                <View style={styles.circleIcon}>
                  <View style={styles.circleIconInner}></View>
                </View>
                <TextInput
                  value={searchText}
                  onChangeText={setSearchText}
                  style={styles.input}
                  placeholder={
                    mode === "start" ? "စထွက်မည့်နေရာ" : "သွားရောက်လိုသည့်နေရာ"
                  }
                  placeholderTextColor="#667085"
                />
              </View>
              <Pressable style={styles.filterButton} onPress={showFilters}>
                <Image
                  style={styles.filterIcon}
                  source={require("@/assets/icons/filter.png")}
                />
              </Pressable>
            </View>
            <View style={{ flex: 1 }}>
              {!isValidSearchText && (
                <NavigationTabs
                  tabs={TABS}
                  activeIndex={activeIndex}
                  activeStates={{
                    backgroundColor: "#F9F9F9",
                    color: "#1F2937",
                    borderColor: "#EEEEEE",
                  }}
                  inactiveStates={{
                    backgroundColor: "#FFF",
                    color: "#2F2F2F",
                    borderColor: "#EEEEEE",
                  }}
                  onNavigationTabPress={setActiveIndex}
                  navigationTabStyle={{
                    marginBottom: 18,
                  }}
                />
              )}
              <ListView data={stopsList} />
            </View>
          </>
        )}
      </SafeAreaView>
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
    flex: 1,
    fontFamily: "MiSansMyanmar-Regular",
    backgroundColor: "#F2F4F7",
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
