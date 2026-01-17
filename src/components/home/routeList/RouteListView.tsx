// react native
import { FlatList, ScrollView, StyleSheet, View } from "react-native";

// react
import { useEffect, useState } from "react";

//expo router
import { router } from "expo-router";

// debounce
import { useDebounce } from "use-debounce";

// custom component
import FilterModal from "@/src/components/home/routeList/FilterModal";
import RouteListFilter from "@/src/components/home/routeList/RouteListFilter";
import RouteCard from "@/src/components/RouteCard";
import SkeletonCard from "@/src/components/RouteSkeletonCard";

// type
import { RouteFilters } from "@/src/types/filter";

// data
import { Filters } from "@/src/constants/filters";
import { useGetRoutes } from "@/src/hooks/bus-route";

// util
import { showErrorToast } from "@/src/utils/toast";

// constants
import { Message } from "@/src/constants/message";

export default function RouteListView() {
  const { routes: routeFilterOptions } = Filters;
  const [activeOption, setActiveOption] = useState<RouteFilters>(
    routeFilterOptions[0]
  );
  const [busNumber, setBusNumber] = useState<string>("");
  const [debouncedBusNumber] = useDebounce(busNumber, 1000);
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);

  const errorMessage = Message.error;

  const isYpsServiceRoutes = activeOption.id === "YBS_SERVICE_ROUTES";
  const {
    data: routeDatas,
    error: routesError,
    isLoading: isRoutesLoading,
    isError: isRoutesError,
    fetchNextPage: fextNextRoutes,
    hasNextPage: hasNextRoutes,
    isFetching: isFetchingRoutes,
    isFetchingNextPage: isFetchingNextRoutes,
  } = useGetRoutes(isYpsServiceRoutes, debouncedBusNumber);
  const routes = routeDatas?.pages.flatMap((page) => page.data) ?? [];

  /**
   * Opens the filter modal
   * to choose between YPS card–supported routes and all routes.
   */
  const closeFilterModal = () => {
    setFilterModalVisible(false);
  };

  /**
   * Closes the filter modal
   */
  const openFilterModal = () => {
    setFilterModalVisible(true);
  };

  /**
   * go to route detail page
   * @param routeId
   */
  const onPressRouteCard = (routeId: string) => {
    router.push({
      pathname: "/(drawer)/(home)/routeDetail/[id]",
      params: { id: routeId },
    });
  };

  /**
   * Sets the selected filter option as active by its id.
   * @param id selected option id
   */
  const onSelectFilterOption = (id: string) => {
    const selectedOption = routeFilterOptions.find(
      (option) => option.id === id
    );
    if (!selectedOption) return;
    setActiveOption(selectedOption);
    closeFilterModal();
  };

  useEffect(() => {
    if (isRoutesError && routesError) {
      showErrorToast(errorMessage.something_wrong, errorMessage.route_list);
    }
  }, [isRoutesError, routesError]);

  return (
    <>
      <View style={styles.container}>
        <RouteListFilter
          busNumber={busNumber}
          onChangeBusNumber={setBusNumber}
          onPressFilterButton={openFilterModal}
        />
        {isRoutesLoading ? (
          // skeleton view
          <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            style={{
              marginTop: 20,
              flex: 1,
            }}
          >
            {new Array(4).fill(0).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </ScrollView>
        ) : isRoutesError ? (
          <View></View>
        ) : (
          <FlatList
            style={{ marginTop: 20 }}
            data={routes}
            keyExtractor={(item) => item.routeId.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <RouteCard
                routeNo={item.routeNumberEn}
                routeTitle={item.routeName}
                routeDescription={item.busStopNamesMm}
                color={`#${item.routeColor}`}
                onPress={() => onPressRouteCard(item.routeId.toString())}
                isYps={item.isYps}
              />
            )}
            onEndReached={() => {
              if (hasNextRoutes && !isFetchingNextRoutes) {
                fextNextRoutes();
              }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={isFetchingNextRoutes ? <SkeletonCard /> : null}
            ListEmptyComponent={!isRoutesLoading ? <View /> : null}
          />
        )}
      </View>
      <FilterModal
        visible={filterModalVisible}
        onClose={closeFilterModal}
        options={routeFilterOptions}
        activeOptionId={activeOption.id}
        onSelectOption={onSelectFilterOption}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
