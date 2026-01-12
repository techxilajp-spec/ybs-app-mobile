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
import StopFilterModal from "@/src/components/home/StopFilterModal";
import DirectionSelector from "@/src/components/home/routeSearch/DirectionSelector";

// stores
import { useRouteSearchResultsStore } from "@/src/stores/useRouteSearchResultsStore";

// utils
import { getPublicUrl } from "@/src/utils/supabase";

// types
import {
  BusInstruction,
  Route,
  RouteSearchResult,
  Stop,
  WalkInstruction,
} from "@/src/types/map";

// data
import route32 from "@/src/data/route32.json";
import route62 from "@/src/data/route62.json";
import { useGetAds } from "@/src/hooks/ads";

const fetchData = (): RouteSearchResult[] => {
  const stops62: Stop[] = route62.shape.geometry.coordinates
    .map(([longitude, latitude]) => ({
      id: Math.random().toString(),
      name: `${latitude}~${longitude}`,
      road: Math.random().toString(),
      coordinate: {
        latitude,
        longitude,
      },
    }))
    // take every 5th stop
    .filter((_, index) => index % 5 === 0);

  const stops32: Stop[] = route32.shape.geometry.coordinates
    .map(([longitude, latitude]) => ({
      id: Math.random().toString(),
      name: `${latitude}~${longitude}`,
      road: Math.random().toString(),
      coordinate: {
        latitude,
        longitude,
      },
    }))
    // take every 5th stop
    .filter((_, index) => index % 5 === 0);

  const route62Info: Route = {
    id: route62.route_id,
    no: route62.route_id,
    name: route62.name,
    color: route62.color,
    description: "",
    coordinates: route62.shape.geometry.coordinates.map(
      ([longitude, latitude]) => ({
        latitude,
        longitude,
      })
    ),
    stops: stops62,
  };

  const route32Info: Route = {
    id: route32.route_id,
    no: route32.route_id,
    name: route32.name,
    color: route32.color,
    description: "",
    coordinates: route32.shape.geometry.coordinates.map(
      ([longitude, latitude]) => ({
        latitude,
        longitude,
      })
    ),
    stops: stops32,
  };

  const searchResults = [
    {
      id: Math.random(),
      isFastest: true,
      totalBusStop: 22,
      estimatedTime: 35,
      routes: [route62Info, route32Info],
      instructions: [
        {
          type: "walk",
          description: "Walk 200 meters to the bus stop",
        } as WalkInstruction,
        {
          type: "bus",
          busNo: "45B",
          busTitle: "Downtown Express",
          startStop: "Central Station",
          endStop: "Main Street",
        } as BusInstruction,
        {
          type: "walk",
          description: "Walk 100 meters to your destination",
        } as WalkInstruction,
        {
          type: "bus",
          busNo: "12A",
          busTitle: "City Loop",
          startStop: "Main Street",
          endStop: "Park Avenue",
        } as BusInstruction,
      ],
    },
  ];

  return searchResults;
};

export default function RouteSearchView() {
  const [showDirectionModal, setShowDirectionModal] = useState<{
    visible: boolean;
    mode: "start" | "end" | null;
  }>({
    visible: false,
    mode: null,
  });
  
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
   * Searches available routes between the selected start and end destinations and
   * makes the results accessible across screens.
   *
   */
  const searchRoutes = () => {
    const searchResults = fetchData();
    setRoutes(searchResults);
    router.push("/routeSearchResults");
  };

  return (
    <>
      <StopFilterModal
        visible={showDirectionModal.visible}
        title={
          showDirectionModal.mode === "start"
            ? "စထွက်မည့်နေရာ"
            : "သွားရောက်လိုသည့်နေရာ"
        }
        onClose={closeDirectionModal}
      />
      <View style={styles.container}>
        <View style={styles.selectorContainer}>
          {/* start point */}
          <DirectionSelector
            icon={<View style={styles.circleIcon}></View>}
            title="မှ"
            description="လက်ရှိတည်နေရာ"
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
            description="သွားရောက်လိုသည့်နေရာ"
            onPress={() => openDirectionModal("end")}
          />
        </View>
        <AppButton
          title="Bus ကားလမ်းကြောင်းကြည့်မယ်"
          onPress={searchRoutes}
          textStyle={styles.buttonText}
        />

        <AppSlider
          data={ads ?? []}
          autoPlay
          interval={2000}
          style={styles.advertisementContainer}
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
  advertisementContainer: {
    marginTop: 30,
  },
});
