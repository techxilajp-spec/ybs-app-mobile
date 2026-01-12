// react native
import { FlatList, ScrollView, StyleSheet, View } from "react-native";

// react
import { useState } from "react";

//expo router
import { router } from "expo-router";

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

export default function RouteListView() {
  const { routes: routeFilterOptions } = Filters;
  const [activeOption, setActiveOption] = useState<RouteFilters>(
    routeFilterOptions[0]
  );
  const [busNumber, setBusNumber] = useState<string>("");
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);

  const isYpsServiceRoutes = activeOption.id === "YBS_SERVICE_ROUTES";
  const {
    isPending: isRoutesLoading,
    isError: isRoutesError,
    data: routes,
    error: routesError,
  } = useGetRoutes(isYpsServiceRoutes, busNumber);

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
            style={{
              marginTop: 20,
              flex: 1,
            }}
          >
            {new Array(4).fill(0).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </ScrollView>
        ) : (
          // route list view
          <FlatList
            style={{ marginTop: 20 }}
            data={routes ?? []}
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
            keyExtractor={(item) => item.routeId.toString()}
            showsVerticalScrollIndicator={false}
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
