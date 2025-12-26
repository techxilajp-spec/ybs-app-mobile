import { Image, StyleSheet, View } from "react-native";

import { useState } from "react";

// expo router
import { router } from "expo-router";

// react native map
import { LatLng } from "react-native-maps";

// constants
import { Colors } from "@/src/constants/color";

// custom component
import AppButton from "@/src/components/AppButton";
import StopFilterModal from "@/src/components/home/StopFilterModal";
import DirectionSelector from "@/src/components/home/routeSearch/DirectionSelector";

// stores
import { useRouteSearchResultsStore } from "@/src/stores/useRouteSearchResultsStore";

// data
import route32 from "@/src/data/route32.json";
import route62 from "@/src/data/route62.json";

type Stop = {
  id: string;
  name: string;
  road: string;
  coordinate: LatLng;
};

type Route = {
  no: string;
  name: string;
  color: string;
  coordinates: LatLng[];
  stops: Stop[];
};

type RouteSearchResult = {
  id: number;
  isFastest: boolean;
  totalBusStop: number;
  estimatedTime: number;
  routes: Route[];
  instructions: string[]
}

const fetchData = () : RouteSearchResult[] => {
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
    no: route62.route_id,
    name: route62.name,
    color: route62.color,
    coordinates: route62.shape.geometry.coordinates.map(
      ([longitude, latitude]) => ({
        latitude,
        longitude,
      })
    ),
    stops: stops62,
  };

  const route32Info: Route = {
    no: route32.route_id,
    name: route32.name,
    color: route32.color,
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
        "ဆင်မင်းစျေး သိုသွားပါ။",
        "သာကေတ (ရတနာအိမ်ရာ ) - အထက်ကြည့်မြင်တိုင် ကားကို ဆင်မင်းစျေးမှတ်တိုင်မှ ဆီဆိုင် မှတ်တိုင်ထိ စီးပါ။",
        "ခရမ်း - ဗိုလ်တစ်ထောင်ဘုရား ကားကို ဆီဆိုင် မှတ်တိုင် မှ ဖိုက်စတား မှတ်တိုင်အထိ စီးပါ။",
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
  const setRoutes = useRouteSearchResultsStore((s) => s.setRoutes);

  const openDirectionModal = (mode: "start" | "end") => {
    setShowDirectionModal({
      visible: true,
      mode,
    });
  };

  const closeDirectionModal = () => {
    setShowDirectionModal({
      visible: false,
      mode: null,
    });
  };

  const searchRoutes = () => {
    const searchResults = fetchData();
    setRoutes(searchResults);
    router.push("/routeSearchResults");
  };

  return (
    <View style={styles.container}>
      <StopFilterModal
        visible={showDirectionModal.visible}
        title={
          showDirectionModal.mode === "start"
            ? "စထွက်မည့်နေရာ"
            : "သွားရောက်လိုသည့်နေရာ"
        }
        onClose={closeDirectionModal}
      />
      <View style={styles.selectorContainer}>
        {/* start point */}
        <DirectionSelector
          icon={<View style={styles.circleIcon}></View>}
          title="မှ"
          description="လက်ရှိတည်နေရာ"
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
    </View>
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
