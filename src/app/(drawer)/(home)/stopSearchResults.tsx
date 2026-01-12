// react native
import { StyleSheet } from "react-native";

// react
import { useEffect, useState } from "react";

// custom component
import AppHeader from "@/src/components/AppHeader";
import AppScreenLayout from "@/src/components/AppScreenLayout";
import AvailableRoutes from "@/src/components/stopSearchResult/AvailableRoutes";
import StopInformation from "@/src/components/stopSearchResult/StopInformation";

// type
import { Route } from "@/src/types/bus";

// data
import Routes from "@/src/data/routes.json";

const fetchData = () => {
  return Routes;
}

export default function StopSearchResults() {
  const [availableRoutes, setAvailableRoutes] = useState<Route[]>([]);

  useEffect(() => {
    const data = fetchData();
    setAvailableRoutes(data);
  }, []);

  return (
    <AppScreenLayout contentStyle={styles.container} backgroundColor="#FFFFFF">
      <AppHeader title="ရှာဖွေမှုရလဒ်" />
      <StopInformation
        stopName="အလုံစာတိုက် ( အောက်ကြည်မြင့်တိုင် )"
        roadName="အောက်ကြည်မြင်တိုင်လမ်း"
        townshipName="ကြည်မြင်တိုင်"
        lat={16.80528}
        lng={96.15611}
        style={styles.stopInformation}
      />
      <AvailableRoutes style={styles.routeListContainer} routes={availableRoutes} />
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
