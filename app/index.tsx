// react
import { useEffect, useState } from "react";

// react native
import { Dimensions, StyleSheet } from "react-native";

// expo router
import { router } from "expo-router";

// gestureHandler
import { GestureHandlerRootView } from "react-native-gesture-handler";

// bottom sheet
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";

// custom components
import AppBottomSheet from "@/components/AppBottomSheet";
import AppMapView from "@/components/AppMapView";
import CustomPolyline from "@/components/CustomPolyline";
import RouteItem from "@/components/home/RouteItem";

// data
import routesData from "@/data/routes.json";
import { Route } from "@/types/route";

export default function HomeScreen() {
  const [displayedRoutes, setDisplayedRoutes] = useState<Route[]>([]);
  const { width, height } = Dimensions.get("window");

  const showRoute = (routeId: number | string) => {
    const selectedRoute = routesData.find((route) => route.route_id == routeId);
    if (!selectedRoute) return;

    setDisplayedRoutes((prev) => {
      const alreadyVisible = prev.some((r) => r.route_id === routeId);
      if (alreadyVisible) return prev;
      return [...prev, selectedRoute];
    });
  };

  const hideRoute = (route_id: number | string) => {
    setDisplayedRoutes((prev) =>
      prev.filter((route) => route.route_id !== route_id)
    );
  };

  const isActiveRoute = (route_id: number | string) => {
    const isActive =
      displayedRoutes.filter((route) => route.route_id === route_id).length > 0;
    return isActive;
  };

  const onPressRoute = (isActive: boolean, route_id: number | string) => {
    isActive ? hideRoute(route_id) : showRoute(route_id);
  };

  const onPressDetailRoute = (route_id : number | string) => {
    router.push(`/route/${route_id}`);

  }

  useEffect(() => {
    console.log(displayedRoutes.length);
  }, [displayedRoutes]);
  
  return (
    <GestureHandlerRootView style={styles.container}>
      <AppMapView width={width} height={height}>
        {displayedRoutes.map((route, routeIndex) => {
          const coordinates = route.shape.geometry.coordinates.map(
            ([longitude, latitude]) => ({
              latitude,
              longitude,
            })
          );

          return (
            <CustomPolyline key={route.route_id} coordinates={coordinates} color={`#${route.color}`} />
          );
        })}
      </AppMapView>
      <AppBottomSheet
        snapPoints={["20%", "40%"]}
        scrollable={true}
        maxDynamicContentSize={height * 0.4}
      >
        <BottomSheetFlatList
          data={routesData}
          keyExtractor={(item: Route, index: number) => item.route_id}
          renderItem={({ item, index }: { item: Route; index: number }) => (
            <RouteItem
              routeNo={item.route_id}
              routeName={item.name}
              onPress={onPressRoute}
              onDetailPress={onPressDetailRoute}
              isActive={isActiveRoute(item.route_id)}
              color={`#${item.color}`}
            />
          )}
        />
      </AppBottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
