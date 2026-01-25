import { useEffect, useMemo, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";

// custom components
import NavigationTabs from "@/src/components/AppNavigationTabs";
import FilterView from "@/src/components/home/FilterView";
import AppliedFilterSummary from "@/src/components/home/stopFilterModal/AppliedFilterSummary";
import Header from "@/src/components/home/stopFilterModal/Header";
import ListView from "@/src/components/home/stopFilterModal/ListView";

// safe area
import { SafeAreaView } from "react-native-safe-area-context";

// debounce
import { useDebounce } from "use-debounce";

// data
import { useGetAreas, useGetStops } from "@/src/hooks/bus-stop";
import { useGetFavoriteStops } from "@/src/hooks/favourite-stop";
import { useGetRecentStops } from "@/src/hooks/recent";

// type
import { Option } from "@/src/types/accordian";

const TABS = ["လတ်တလော", "နှစ်သက်မှု"];

type StopFilterModalProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  onSelect: (stop: any) => void;
  showCurrentLocation?: boolean;
};

export default function StopFilterModal({
  visible,
  title,
  onClose,
  onSelect,
  showCurrentLocation,
}: StopFilterModalProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);
  const [selectedFilterOptions, setSelectedFilterOptions] = useState<Option[]>(
    []
  );
  const selectedOptionIds = selectedFilterOptions
    .map(option => Number(option.id));

  const [searchText, setSearchText] = useState<string>("");
  const [debouncedSearchText] = useDebounce(searchText, 500);

  const appliedFilterCount = selectedFilterOptions.length;
  const hasAppliedFilters = appliedFilterCount > 0;
  const hasSearchText = searchText.trim().length > 0;
  const isSearchActive = hasSearchText || hasAppliedFilters;

  // retrieve area data
  const { data: areasData } = useGetAreas();
  const areas = areasData ?? [];

  // retrieve stops list data
  const {
    data: stopDatas,
    isLoading: isStopsLoading,
    isError: isStopsError,
    fetchNextPage: fextNextStops,
    hasNextPage: hasNextStops,
    isFetchingNextPage: isFetchingNextStops,
  } = useGetStops(selectedOptionIds, debouncedSearchText);
  const stops = useMemo(
    () => stopDatas?.pages.flatMap((page) => page.data) ?? [],
    [stopDatas]
  );

  // retrieve recent stops
  const {
    data: recentStopDatas,
    isLoading: isRecentStopsLoading,
    isError: isRecentStopsError,
  } = useGetRecentStops();
  const recentStops = recentStopDatas ?? [];

  // retreive favourite stops
  const {
    data: favouriteStopDatas,
    isLoading: isFavouriteStopsLoading,
    isError: isFavouriteStopsError,
  } = useGetFavoriteStops();
  const favouriteStops = favouriteStopDatas ?? [];

  const listConfig = useMemo(() => {
    let config;
    if (isSearchActive) {
      config = {
        data: stops,
        isLoading: isStopsLoading,
        isError: isStopsError,
        isFetchingNext: isFetchingNextStops,
        onEndReached: () => {
          if (hasNextStops && !isFetchingNextStops) {
            fextNextStops();
          }
        },
      };
    } else {
      const isRecentActive = activeIndex === 0;
      if (isRecentActive) {
        config = {
          data: recentStops,
          isLoading: isRecentStopsLoading,
          isError: isRecentStopsError,
          isFetchingNext: false,
          onEndReached: undefined,
        };
      } else {
        config = {
          data: favouriteStops,
          isLoading: isFavouriteStopsLoading,
          isError: isFavouriteStopsError,
          isFetchingNext: false,
          onEndReached: undefined,
        };
      }
    }

    return config;
  }, [
    activeIndex,
    isSearchActive,
    stops,
    isStopsLoading,
    isStopsError,
    isFetchingNextStops,
    hasNextStops,
    recentStops,
    isRecentStopsLoading,
    isRecentStopsError,
    favouriteStops,
    isFavouriteStopsLoading,
    isFavouriteStopsError
  ]);

  useEffect(() => {
    if(visible) {
      setSearchText("");
    }
  }, [visible])

  // area filter related methods

  /**
   * Shows the filter panel.
   */
  const showFilter = () => {
    setIsFilterVisible(true);
  };

  /**
   * Hides the filter panel.
   */
  const hideFilter = () => {
    setIsFilterVisible(false);
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

  /**
   * Select a list of city options
   *
   * @param selectedOptionList - The list of selected city options.
   */
  const onOptionListSelect = (selectedOptionList: Option[]) => {
    setSelectedFilterOptions(selectedOptionList);
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
          // Filter View
          <FilterView
            onClose={hideFilter}
            data={areas}
            selectedOptions={selectedFilterOptions}
            onOptionListSelect={onOptionListSelect}
          />
        ) : (
          <View style={styles.flex1}>
            <Header
              searchText={searchText}
              searchPlaceholder={title}
              onSearchTextChange={setSearchText}
              onBackPress={onClose}
              onFilterPress={showFilter}
              appliedFilterCount={appliedFilterCount}
            />
            {isSearchActive ? (
              <View>
                {hasAppliedFilters && (
                  <AppliedFilterSummary
                    filters={selectedFilterOptions}
                    onRemoveFilter={removeOption}
                    onClearAll={clearOptions}
                    style={styles.filterSummary}
                  />
                )}
              </View>
            ) : (
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
            <ListView
              data={listConfig.data}
              onPress={(item) => {
                // pass the selected stop back to parent
                onSelect(item);
                // close modal
                onClose();
              }}
              isLoading={listConfig.isLoading}
              isError={listConfig.isError}
              isFetchingNext={listConfig.isFetchingNext}
              onEndReached={listConfig.onEndReached}
            />
          </View>
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
  filterSummary: {
    marginBottom: 18,
  },
  flex1: {
    flex: 1,
  },
});
