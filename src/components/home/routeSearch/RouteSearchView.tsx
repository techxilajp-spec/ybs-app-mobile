import { Image, StyleSheet, View } from "react-native";

import { useState } from "react";

// expo router
import { router } from "expo-router";

// constants
import { Colors } from "@/src/constants/color";

// custom component
import AppButton from "@/src/components/AppButton";
import StopFilterModal from "@/src/components/home/StopFilterModal";
import DirectionSelector from "@/src/components/home/routeSearch/DirectionSelector";

export default function RouteSearchView() {
  const [showDirectionModal, setShowDirectionModal] = useState<{
    visible: boolean;
    mode: "start" | "end" | null;
  }>({
    visible: false,
    mode: null,
  });

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
    router.push("/routeSearchResults");
  };

  return (
    <View style={styles.container}>
      <StopFilterModal
        visible={showDirectionModal.visible}
        title={showDirectionModal.mode === "start" ? "စထွက်မည့်နေရာ" : "သွားရောက်လိုသည့်နေရာ"}
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
