// react native
import { StyleSheet } from "react-native";

// custom component
import AppHeader from "@/src/components/AppHeader";
import AppScreenLayout from "@/src/components/AppScreenLayout";
import AvailableRoutes from "@/src/components/stopSearchResult/AvailableRoutes";
import StopInformation from "@/src/components/stopSearchResult/StopInformation";

export default function StopSearchResults() {
  return (
    <AppScreenLayout contentStyle={styles.container} backgroundColor="#FFFFFF">
      <AppHeader title="ရှာဖွေမှုရလဒ်" />
      <StopInformation 
        stopName="အလုံစာတိုက် ( အောက်ကြည်မြင့်တိုင် )"
        roadName="အောက်ကြည်မြင်တိုင်လမ်း"
        townshipName="ကြည်မြင်တိုင်"
        style={styles.stopInformation}
      />
      <AvailableRoutes style={styles.routeListContainer} />
    </AppScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  stopInformation: {
    marginTop: 30
  },
  routeListContainer: {
    marginTop: 28
  }
});
