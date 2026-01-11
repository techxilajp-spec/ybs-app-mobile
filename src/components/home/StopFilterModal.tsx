// react native
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

// react
import { useEffect, useState } from "react";

// expo icons
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// custom components
import NavigationTabs from "@/src/components/AppNavigationTabs";
import AppText from "@/src/components/AppText";
import FilterView from "@/src/components/home/FilterView";
import AppliedFilterSummary from "@/src/components/home/stopFilterModal/AppliedFilterSummary";
import ListView from "@/src/components/home/stopFilterModal/ListView";

// safe area
import { SafeAreaView } from "react-native-safe-area-context";

// type
import { Accordian, Option } from "@/src/types/accordian";
import { Stop } from "@/src/types/bus";

// data
import stopList from "@/src/data/stop_filter_data.json";
import yangonAreasBurmese from "@/src/data/yangon_areas.json";
import { addFavoriteRemote, getStopLocalFavorites, removeFavoriteRemote, setStopLocalFavorites } from "@/src/services/stopFav";

type StopFilterModalProps = {
  visible: boolean;
  title: string;
  showCurrentLocation?: boolean;
  onClose: () => void;
};

const TABS = ["လတ်တလော", "နှစ်သက်မှု"];

const fetchStops = () => {
  return stopList.searchResult;
};

export default function StopFilterModal({
  visible,
  showCurrentLocation = false,
  title,
  onClose,
}: StopFilterModalProps) {
  const [areaFilters, setAreaFilters] = useState<Accordian[]>([]);
  const [stopsList, setStopsList] = useState<Stop[]>([]);

  const [searchText, setSearchText] = useState<string>("");
  const [selectedFilterOptions, setSelectedFilterOptions] = useState<Option[]>(
    []
  );

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);

  const hasSelectedOptions = selectedFilterOptions.length > 0;
  const isValidSearchText = searchText.trim() !== "";
  const canSearch = hasSelectedOptions || isValidSearchText;

  /**
   * Shows the filter panel.
   */
  const showFilters = () => {
    setIsFilterVisible(true);
  };

  /**
   * Hides the filter panel.
   */
  const hileFilters = () => {
    setIsFilterVisible(false);
  };

  /**
   * Select a list of city options
   *
   * @param selectedOptionList - The list of selected city options.
   */
  const onOptionListSelect = (selectedOptionList: Option[]) => {
    setSelectedFilterOptions(selectedOptionList);
    fetchStops();
  };

  /**
   * Removes a selected option from the options list.
   *
   * @param optionId - The ID of the option to remove.
   */
  const removeOption = (optionId: string) => {
    setSelectedFilterOptions((options) => {
      return options.filter((option) => option.id !== optionId);
    });
  };

  /**
   * Clear all selected Options
   */
  const clearOptions = () => {
    setSelectedFilterOptions([]);
  };

  async function applyStopFavorites(stops: Stop[]) {
    const favoriteIds = await getStopLocalFavorites();

    return stops.map(stop => ({
      ...stop,
      isFavourite: favoriteIds.includes(stop.id.toString()),
    }));
  }

  useEffect(() => {
    const loadStops = async () => {
      let sourceStops: Stop[];

      if (canSearch) {
        sourceStops = fetchStops();
      } else {
        const source = activeIndex === 0 ? "recent" : "favourite";
        sourceStops = stopList[source];
      }

      const withFavorites = await applyStopFavorites(sourceStops);
      setStopsList(withFavorites);
    };

    loadStops();
  }, [activeIndex, canSearch]);


  useEffect(() => {
    // dummy initialization
    setAreaFilters(yangonAreasBurmese);
  }, []);
  const toggleFavourite = async (stop: Stop) => {
    // UI update (instant)
    setStopsList(prev =>
      prev.map(s =>
        s.id === stop.id
          ? { ...s, isFavourite: !s.isFavourite }
          : s
      )
    );

    const stopIdStr = stop.id.toString();   // AsyncStorage
    const stopIdNum = Number(stop.id);      // Supabase

    const favorites = await getStopLocalFavorites();

    if (favorites.includes(stopIdStr)) {
      // REMOVE (offline-first)
      await setStopLocalFavorites(
        favorites.filter(id => id !== stopIdStr)
      );

      removeFavoriteRemote(stopIdNum).catch(console.warn);
    } else {
      // ADD
      await setStopLocalFavorites([...favorites, stopIdStr]);

      addFavoriteRemote(stopIdNum).catch(console.warn);
    }

    console.log("stop favourite toggled.......", stop);
  };

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
          <FilterView
            onClose={hileFilters}
            data={areaFilters}
            selectedOptions={selectedFilterOptions}
            onOptionListSelect={onOptionListSelect}
          />
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
                  placeholder={title}
                  placeholderTextColor="#667085"
                />
              </View>
              <Pressable style={styles.filterButton} onPress={showFilters}>
                {selectedFilterOptions.length > 0 && (
                  <View style={styles.filterCountBadge}>
                    <AppText size={12} style={styles.filterCountBadgeText}>
                      {selectedFilterOptions.length}
                    </AppText>
                  </View>
                )}
                <Image
                  style={styles.filterIcon}
                  source={require("@/assets/icons/filter.png")}
                />
              </Pressable>
            </View>

            <View style={{ flex: 1 }}>
              {selectedFilterOptions.length > 0 && (
                <AppliedFilterSummary
                  filters={selectedFilterOptions}
                  onRemoveFilter={removeOption}
                  onClearAll={clearOptions}
                  style={styles.filterSummary}
                />
              )}
              {!canSearch && (
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
              <ListView data={stopsList}
                onToggleFavourite={toggleFavourite}
              />
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
    position: "relative",
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
  filterCountBadge: {
    position: "absolute",
    top: 0,
    right: 0,

    width: 22,
    height: 22,
    backgroundColor: "#F4D159",
    borderRadius: 11,

    borderWidth: 1,
    borderColor: "#000000",

    transform: [{ translateX: 11 }, { translateY: -11 }],

    justifyContent: "center",
    alignItems: "center",
  },
  filterCountBadgeText: {
    fontFamily: "Roboto-Bold",
  },
  filterSummary: {
    marginBottom: 18,
  },
});
