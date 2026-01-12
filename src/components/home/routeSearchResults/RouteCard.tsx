import { Pressable, StyleSheet, View } from "react-native";

// custom components
import BusStep from "@/src/components/home/routeSearchResults/RouteCard/BusStep";
import Header from "@/src/components/home/routeSearchResults/RouteCard/Header";
import Summary from "@/src/components/home/routeSearchResults/RouteCard/Summary";
import WalkStep from "@/src/components/home/routeSearchResults/RouteCard/WalkStep";

type RouteCardProps = {
  onPressCard?: () => void
}

export default function RouteCard({
  onPressCard
}: RouteCardProps) {
  return (
    <Pressable style={styles.container} onPress={onPressCard}>
      <Header isFastest={true} style={styles.header} />
      <Summary />
      <View style={styles.stepsWrapper}>
        <WalkStep
          description="ဆင်မင်းစျေး သိုသွားပါ။"
          style={styles.stepItem}
        />
        <BusStep
          busNo={89}
          busColor="#E53E3E"
          busTitle="သာကေတ (ရတနာအိမ်ရာ ) - အထက်ကြည့်မြင်တိုင်"
          startStopTitle="ဆင်မင်းစျေးမှတ်တိုင်"
          endStopTitle="ဆီဆိုင် မှတ်တိုင်"
          style={styles.stepItem}
        />
        <BusStep
          busNo={34}
          busColor="#815AD5"
          busTitle="ခရမ်း - ဗိုလ်တစ်ထောင်ဘုရား"
          startStopTitle="ဆီဆိုင် မှတ်တိုင်"
          endStopTitle="ဖိုက်စတား မှတ်တိုင်"
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#D0D5DD",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  header: {
    marginBottom: 5,
  },

  stepsWrapper: {
    marginTop: 18,
  },

  stepItem: {
    marginBottom: 20,
  },
});
