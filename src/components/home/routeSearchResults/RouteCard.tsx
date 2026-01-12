import { Pressable, StyleSheet, View } from "react-native";

// custom components
import BusStep from "@/src/components/home/routeSearchResults/RouteCard/BusStep";
import Header from "@/src/components/home/routeSearchResults/RouteCard/Header";
import Summary from "@/src/components/home/routeSearchResults/RouteCard/Summary";
import WalkStep from "@/src/components/home/routeSearchResults/RouteCard/WalkStep";

// types
import { RouteSearchResult } from "@/src/types/map";

type RouteCardProps = {
  route: RouteSearchResult;
  index: number;
  onPressCard?: () => void
}

export default function RouteCard({
  route,
  index,
  onPressCard
}: RouteCardProps) {
  const routeNames = route.routes.map((r) => r.no).join(", ");

  return (
    <Pressable style={styles.container} onPress={onPressCard}>
      <Header title={`လမ်းကြောင်း ${index + 1}`} isFastest={route.isFastest} style={styles.header} />
      <Summary
        routeNames={routeNames}
        totalBusStops={route.totalBusStop}
        estimatedTime={route.estimatedTime}
      />
      <View style={styles.stepsWrapper}>
        {route.instructions.map((instruction, idx) => {
          if (instruction.type === "walk") {
            return (
              <WalkStep
                key={idx}
                description={instruction.description}
                style={styles.stepItem}
              />
            );
          } else if (instruction.type === "bus") {
            return (
              <BusStep
                key={idx}
                busNo={instruction.busNo}
                busColor={route.routes.find((r) => r.no === instruction.busNo)?.color || "#000"}
                busTitle={instruction.busTitle}
                startStopTitle={instruction.startStop}
                endStopTitle={instruction.endStop}
                style={styles.stepItem}
              />
            );
          }
          return null;
        })}
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
    marginBottom: 15,
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
