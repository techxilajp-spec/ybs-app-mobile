// react native
import { Image, StyleSheet, View } from "react-native";

// react
import { useState } from "react";

// expo router
import { router } from "expo-router";

// constants
import { Colors } from "@/src/constants/color";

// custom component
import AppButton from "@/src/components/AppButton";
import AppSlider from "@/src/components/AppSlider";
import RouteFilterModal from "@/src/components/home/RouteFilterModal";
import DirectionSelector from "@/src/components/home/routeSearch/DirectionSelector";

// stores
import { TripPlannerService } from "@/src/services/TripPlannerService";
import { useRouteSearchResultsStore } from "@/src/stores/useRouteSearchResultsStore";
import { useTripPlannerStore } from "@/src/stores/useTripPlannerStore";

// utils
import { getPublicUrl } from "@/src/utils/supabase";

// data
import { useGetAds } from "@/src/hooks/ads";

// constants
import { AD_HEIGHT } from "@/src/constants/ad";

// const fetchData = (): RouteSearchResult[] => {
//   const stops62: Stop[] = route62.shape.geometry.coordinates
//     .map(([longitude, latitude]) => ({
//       id: Math.random().toString(),
//       name: `${latitude}~${longitude}`,
//       road: Math.random().toString(),
//       coordinate: {
//         latitude,
//         longitude,
//       },
//     }))
//     // take every 5th stop
//     .filter((_, index) => index % 5 === 0);

//   const stops32: Stop[] = route32.shape.geometry.coordinates
//     .map(([longitude, latitude]) => ({
//       id: Math.random().toString(),
//       name: `${latitude}~${longitude}`,
//       road: Math.random().toString(),
//       coordinate: {
//         latitude,
//         longitude,
//       },
//     }))
//     // take every 5th stop
//     .filter((_, index) => index % 5 === 0);

//   const route62Info: Route = {
//     id: route62.route_id,
//     no: route62.route_id,
//     name: route62.name,
//     color: route62.color,
//     description: "",
//     coordinates: route62.shape.geometry.coordinates.map(
//       ([longitude, latitude]) => ({
//         latitude,
//         longitude,
//       })
//     ),
//     stops: stops62,
//   };

//   const route32Info: Route = {
//     id: route32.route_id,
//     no: route32.route_id,
//     name: route32.name,
//     color: route32.color,
//     description: "",
//     coordinates: route32.shape.geometry.coordinates.map(
//       ([longitude, latitude]) => ({
//         latitude,
//         longitude,
//       })
//     ),
//     stops: stops32,
//   };

//   const searchResults = [
//     {
//       id: Math.random(),
//       isFastest: true,
//       totalBusStop: 22,
//       estimatedTime: 35,
//       routes: [route62Info, route32Info],
//       instructions: [
//         {
//           type: "walk",
//           description: "Walk 200 meters to the bus stop",
//         } as WalkInstruction,
//         {
//           type: "bus",
//           busNo: "45B",
//           busTitle: "Downtown Express",
//           startStop: "Central Station",
//           endStop: "Main Street",
//         } as BusInstruction,
//         {
//           type: "walk",
//           description: "Walk 100 meters to your destination",
//         } as WalkInstruction,
//         {
//           type: "bus",
//           busNo: "12A",
//           busTitle: "City Loop",
//           startStop: "Main Street",
//           endStop: "Park Avenue",
//         } as BusInstruction,
//       ],
//     },
//   ];

//   return searchResults;
// };

export default function RouteSearchView() {
  const [showDirectionModal, setShowDirectionModal] = useState<{
    visible: boolean;
    mode: "start" | "end" | null;
  }>({
    visible: false,
    mode: null,
  });

  const [availableHeight, setAvailableHeight] = useState<number>(0);
  const [usedHeight, setUsedHeight] = useState<number>(0);

  // calculate dynamic height for ad slider
  const remainingHeight = availableHeight - usedHeight;
  const dynamicAdHeight = Math.min(
    AD_HEIGHT.max,
    Math.max(AD_HEIGHT.min, remainingHeight - AD_HEIGHT.buffer)
  );

  // fetch ads
  const { data: adsData } = useGetAds();
  const ads = adsData?.map((ad) => {
    const firstImage = ad.ads_images?.[0];
    const adImageUrl = firstImage?.image_url
      ? getPublicUrl(firstImage.image_url)
      : "";

    return {
      id: ad.id,
      image: adImageUrl,
    };
  });

  const [isSearching, setIsSearching] = useState(false);

  // const [startStop, setStartStop] = useState<any>(null); // Replaced by store
  // const [endStop, setEndStop] = useState<any>(null); // Replaced by store

  const {
    startLocation: startStop,
    endLocation: endStop,
    setStartLocation,
    setEndLocation,
  } = useTripPlannerStore();

  const setRoutes = useRouteSearchResultsStore((s) => s.setRoutes);

  /**
   * Opens the direction selection modal for choosing a start or end destination.
   * @param mode destination types (start or end)
   */
  const openDirectionModal = (mode: "start" | "end") => {
    setShowDirectionModal({
      visible: true,
      mode,
    });
  };

  /**
   * Closes the direction selection modal
   */
  const closeDirectionModal = () => {
    setShowDirectionModal({
      visible: false,
      mode: null,
    });
  };

  /**
   * Handles the selection of a bus stop.
   * @param stop The selected bus stop.
   */
  const handleSelect = (stop: any) => {
    if (showDirectionModal.mode === "start") {
      setStartLocation(stop);
    } else if (showDirectionModal.mode === "end") {
      setEndLocation(stop);
    }
  };

  /**
   * Searches available routes between the selected start and end destinations and
   * makes the results accessible across screens.
   *
   */
  /**
   * Searches available routes between the selected start and end destinations and
   * makes the results accessible across screens.
   *
   */
  const searchRoutes = async () => {
    // Current location fallback logic
    if (!startStop) {
      alert("Please select a start destination.");
      return;
    }

    if (!endStop && showDirectionModal.mode !== "end") {
      alert("Please select a destination.");
      return;
    }

    // Safety check if endStop might be null (though UI suggests selecting it)
    if (!endStop) {
      // Just for safety
      alert("Please select a destination.");
      return;
    }

    // STRICT ID CHECK
    if (!startStop.id || !endStop.id) {
      alert("Please select valid bus stops from the list.");
      return;
    }

    setIsSearching(true);
    try {
      // Show loading indicator if possible (omitted for brevity, can add state)
      /* 
      // Coordinate based search - COMMENTED OUT
      const startCoord = {
        latitude: startStop.lat || startStop.coordinate?.latitude || 0,
        longitude: startStop.lng || startStop.coordinate?.longitude || 0
      };
      const endCoord = {
        latitude: endStop.lat || endStop.coordinate?.latitude || 0,
        longitude: endStop.lng || endStop.coordinate?.longitude || 0
      };

      console.log("Searching routes from:", startCoord, "to:", endCoord);
      const results = await TripPlannerService.planTrip(startCoord, endCoord);
      */
      const results = await TripPlannerService.planTripById(
        startStop.id.toString(),
        endStop.id.toString()
      );

      setRoutes(results);
      router.push("/routeSearchResults");
    } catch (e) {
      console.error(e);
      alert("Failed to plan trip. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      <RouteFilterModal
        visible={showDirectionModal.visible}
        title={
          showDirectionModal.mode === "start"
            ? "စထွက်မည့်နေရာ"
            : "သွားရောက်လိုသည့်နေရာ"
        }
        onClose={closeDirectionModal}
        onSelect={handleSelect}
      />
      <View
        style={styles.container}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          setAvailableHeight(height);
        }}
      >
        <View
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setUsedHeight(height);
          }}
        >
          <View style={styles.selectorContainer}>
            {/* start point */}
            <DirectionSelector
              icon={<View style={styles.circleIcon}></View>}
              title="မှ"
              description={
                startStop ? startStop.name_mm : "မှတ်တိုင်ရွေးချယ်ပါ"
              }
              subtitle={
                startStop
                  ? `${(
                      startStop.lat ||
                      startStop.coordinate?.latitude ||
                      0
                    ).toFixed(5)}, ${(
                      startStop.lng ||
                      startStop.coordinate?.longitude ||
                      0
                    ).toFixed(5)}`
                  : undefined
              }
              value=""
              onPress={() => openDirectionModal("start")}
              showIndicator={true}
              style={{ marginBottom: 8 }}
            />

            {/* end point */}
            <DirectionSelector
              icon={
                <Image
                  source={require("@/assets/icons/bus.png")}
                  style={styles.busIcon}
                />
              }
              title="သို"
              description={endStop ? endStop.name_mm : "သွားရောက်လိုသည့်နေရာ"}
              subtitle={
                endStop
                  ? `${(
                      endStop.lat ||
                      endStop.coordinate?.latitude ||
                      0
                    ).toFixed(5)}, ${(
                      endStop.lng ||
                      endStop.coordinate?.longitude ||
                      0
                    ).toFixed(5)}`
                  : undefined
              }
              onPress={() => openDirectionModal("end")}
            />
          </View>
          <AppButton
            title="Bus ကားလမ်းကြောင်းကြည့်မယ်"
            onPress={searchRoutes}
            loading={isSearching}
            textStyle={styles.buttonText}
          />
        </View>

        <AppSlider
          data={ads ?? []}
          autoPlay
          interval={2000}
          style={{
            width: "100%",
            height: dynamicAdHeight,
            position: "absolute",
            bottom: 20,
            marginTop: 40,
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selectorContainer: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: Colors.border.disabled,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  startDirectionSelector: {
    marginBottom: 12,
  },
  circleIcon: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#4A4949",
    marginTop: 3,
    marginLeft: 3,
  },
  busIcon: {
    width: 22,
    height: 22,
  },
  buttonText: {
    fontFamily: "MiSansMyanmar-Medium",
  },
});
