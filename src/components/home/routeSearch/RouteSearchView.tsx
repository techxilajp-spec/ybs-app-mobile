import { Image, StyleSheet, View } from "react-native";

// custom component
import AppButton from "@/src/components/AppButton";
import DirectionSelector from "@/src/components/home/routeSearch/DirectionSelector";

export default function RouteSearchView() {
  return (
    <View style={styles.container}>
      <View style={styles.selectorContainer}>
        {/* start point */}
        <DirectionSelector
          icon={<View style={styles.circleIcon}></View>}
          title="မှ"
          description="လက်ရှိတည်နေရာ"
          onPress={() => console.log("clicked")}
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
          onPress={() => console.log("clicked")}
        />
      </View>
      <AppButton 
        title="Bus ကားလမ်းကြောင်းကြည့်မယ်"
        onPress={() => console.log("searching route")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selectorContainer: {
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginBottom: 15
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
});
