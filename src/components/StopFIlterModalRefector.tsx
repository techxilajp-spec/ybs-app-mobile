import { useMemo, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";

// custom components
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
import { useGetRecentStops } from "@/src/hooks/recent";

// type
import { Option } from "@/src/types/accordian";

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
  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);
  const [selectedFilterOptions, setSelectedFilterOptions] = useState<Option[]>(
    []
  );
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
  } = useGetStops(undefined, debouncedSearchText);
  const stops = useMemo(
    () => stopDatas?.pages.flatMap((page) => page.data) ?? [],
    [stopDatas]
  );

  const {
    data: recentStopDatas,
    isLoading: isRecentStopsLoading,
    isError: isRecentStopsError,
  } = useGetRecentStops();
  const recentStops = recentStopDatas ?? [];

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
      config = {
        data: recentStops,
        isLoading: isRecentStopsLoading,
        isError: isRecentStopsError,
        isFetchingNext: false,
        onEndReached: undefined,
      };
    }

    return config;
  }, [
    stops,
    isStopsLoading,
    isStopsError,
    isFetchingNextStops,
    hasNextStops,
    recentStops,
    isRecentStopsLoading,
    isRecentStopsError,
  ]);

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
          <View>
            <Header
              searchText={searchText}
              searchPlaceholder={title}
              onSearchTextChange={setSearchText}
              onBackPress={onClose}
              onFilterPress={showFilter}
              appliedFilterCount={appliedFilterCount}
            />
            {isSearchActive ? (
              // Search Results
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
              // Recent && Favourite
              <View></View>
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
