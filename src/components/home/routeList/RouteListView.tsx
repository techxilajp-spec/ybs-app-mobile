// react native
import { FlatList, StyleSheet, View } from "react-native";

// react
import { useEffect, useState } from "react";

//expo router
import { router } from "expo-router";

// custom component
import RouteCard from "@/src/components/RouteCard";
import FilterModal from "@/src/components/home/routeList/FilterModal";
import RouteListFilter from "@/src/components/home/routeList/RouteListFilter";

// type
import { Route } from "@/src/types/bus";
import { RouteFilters } from "@/src/types/filter";

// data
import { Filters } from "@/src/constants/filters";
import routeData from "@/src/data/routes.json";

export default function RouteListView() {
  const { routes: routeFilterOptions } = Filters;
  const [activeOption, setActiveOption] = useState<RouteFilters>(
    routeFilterOptions[0]
  );
  const [routes, setRoutes] = useState<Route[]>([]);
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);

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
   */
  const onPressRouteCard = () => {
    router.push("/(drawer)/(home)/routeDetail");
  };

  /**
   * Sets the selected filter option as active by its id.
   * @param id selected option id
   */
  const onSelectFilterOption = (id: string) => {
    const selectedOption = routeFilterOptions.find((option) => option.id == id);
    if (!selectedOption) return;
    setActiveOption(selectedOption);
  };

  useEffect(() => {
    setRoutes(routeData);
  }, []);
  return (
    <>
      <View style={styles.container}>
        <RouteListFilter onPressFilterButton={openFilterModal} />
        <FlatList
          style={{ marginTop: 20 }}
          data={routes}
          renderItem={({ item }) => (
            <RouteCard
              routeNo={item.no}
              routeTitle={item.name}
              routeDescription={item.description}
              color={item.color}
              onPress={onPressRouteCard}
            />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
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
