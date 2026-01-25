// react native
import { StyleSheet, View } from "react-native";

// react
import { useEffect, useMemo } from "react";

// expo router
import { useLocalSearchParams } from "expo-router";

// custom component
import AppHeader from "@/src/components/AppHeader";
import AppScreenLayout from "@/src/components/AppScreenLayout";
import AppText from "@/src/components/AppText";
import RouteSkeletonCard from "@/src/components/RouteSkeletonCard";
import StopInformationSkeleton from "@/src/components/StopInformationSkeleton";
import AvailableRoutes from "@/src/components/stopSearchResult/AvailableRoutes";
import StopInformation from "@/src/components/stopSearchResult/StopInformation";

// hooks
import { useGetStopDetail, useIncreaseStopView } from "@/src/hooks/bus-stop";
import { useAddFavoriteStop, useGetFavoriteStopIds, useRemoveFavoriteStop } from "../../../hooks/favourite-stop";

// message
import { Message } from "@/src/constants/message";

// utils
import { showErrorToast } from "@/src/utils/toast";

// constants
import { Colors } from "@/src/constants/color";

export default function StopSearchResults() {
  const { error : errorMessage } = Message;
  const { stopId } = useLocalSearchParams<{ stopId: string }>();

  // fetch stop data
  const {
    data: stopData,
    isLoading: isStopLoading,
    isError: isStopError,
    error: stopError,
  } = useGetStopDetail(String(stopId ?? ""));
  const availableRoutes = useMemo(() => {
    if (!stopData) return [];
    return stopData.routes.map((route) => ({
      id: route.routeId.toString(),
      no: route.routeNumberEn ?? route.routeNumberMm ?? "",
      name: route.routeName,
      description: route.busStopNamesMm,
      color: `#${route.color}`,
      isYps: route.isYps,
    }));
  }, [stopData]);

  const { data: favouriteIds = [] } = useGetFavoriteStopIds();
  const favouriteIdSet = useMemo(() => new Set(favouriteIds), [favouriteIds]);
  const isFavoriteStop = favouriteIdSet.has(Number(stopId));

  const { mutate: addFavoriteStop } = useAddFavoriteStop();
  const { mutate: removeFavoriteStop } = useRemoveFavoriteStop();

  // increase stop view count
  const { mutate: increaseStopView } = useIncreaseStopView();

  const parsedName = (mm?: string, en?: string) => mm ?? en ?? "";
  const stopName = parsedName(stopData?.nameMm, stopData?.nameEn);
  const roadName = parsedName(stopData?.roadMm, stopData?.roadEn);
  const townshipName = parsedName(stopData?.townshipMm, stopData?.townshipEn);

  useEffect(() => {
    if(isStopError && stopError) {
      showErrorToast(errorMessage.something_wrong, errorMessage.stop_not_found)
    }
  }, [isStopError, stopError])

  useEffect(() => {
    if(!stopId) return;
    increaseStopView(Number(stopId));
  }, [stopId])

  const onToggleFavourite = () => {
    const id = Number(stopId);
    if(!id) return;
    if(isFavoriteStop) {
      removeFavoriteStop(id)
    } else {
      addFavoriteStop(id);
    }
  }

  return (
    <AppScreenLayout contentStyle={styles.container} backgroundColor="#FFFFFF">
      <AppHeader title="ရှာဖွေမှုရလဒ်" />
      {isStopLoading ? (
        // skeletons
        <View style={{ flex: 1 }}>
          <StopInformationSkeleton style={styles.stopInformation} />
          <View style={styles.routeListContainer}>
            {new Array(4).fill(0).map((_, index) => (
              <RouteSkeletonCard key={index} />
            ))}
          </View>
        </View>
      ) : isStopError ? (
        <View style={styles.errorContainer}>
          <AppText size={14} style={styles.errorMessage}>{errorMessage.stop_not_found}</AppText>
        </View>
      ) : (
        <>
          <StopInformation
            stopName={stopName}
            roadName={roadName}
            townshipName={townshipName}
            lat={16.80528}
            lng={96.15611}
            style={styles.stopInformation}
            isFavourite={isFavoriteStop}
            onToggleFavourite={onToggleFavourite}
          />
          <AvailableRoutes
            style={styles.routeListContainer}
            routes={availableRoutes}
          />
        </>
      )}
    </AppScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  stopInformation: {
    marginTop: 30,
  },
  routeListContainer: {
    marginTop: 28,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  errorMessage: {
    color: Colors.text.disabled,
    fontFamily: 'MiSansMyanmar-Medium'
  }
});
