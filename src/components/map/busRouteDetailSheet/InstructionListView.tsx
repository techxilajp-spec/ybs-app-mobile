import { StyleSheet, View } from "react-native";

// bottomSheet
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

// components
import AppText from "@/src/components/AppText";
import Summary from "@/src/components/home/routeSearchResults/RouteCard/Summary";

// constants
import { Colors } from "@/src/constants/color";

// types
import { InstructionInfo } from "@/src/types/map";

type InstructionListViewProps = {
  instructionInfo: InstructionInfo;
};

export default function InstructionListView({
  instructionInfo,
}: InstructionListViewProps) {
  const { routeNumbers, estimatedTime, totalBusStops, instructions } =
    instructionInfo;

  return (
    <View style={styles.container}>
      <BottomSheetScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Summary
          routeNames={routeNumbers.join(" ,")}
          totalBusStops={totalBusStops}
          estimatedTime={estimatedTime}
        />
        <View style={styles.instructionListContainer}>
          {instructions.map((instruction, idx) => {
            if (instruction.type === "walk") {
              return (
                <AppText size={14} style={styles.instructionText} key={idx}>
                  {instruction.description}
                </AppText>
              );
            } else if (instruction.type === "bus") {
              return (
                <AppText style={styles.instructionText} size={14} key={idx}>
                  {instruction.busTitle} ကားကို{" "}
                  <AppText style={styles.highlightedText} size={14}>
                    {instruction.startStop}
                  </AppText>{" "}
                  မှ{" "}
                  <AppText style={styles.highlightedText} size={14}>
                    {instruction.endStop}
                  </AppText>{" "}
                  ထိ စီးပါ။
                </AppText>
              );
            }
          })}
        </View>
      </BottomSheetScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  scrollContainer: {
    flex: 1
  },
  instructionListContainer: {
    marginTop: 20,
  },
  instructionText: {
    color: Colors.text.secondary,
    marginBottom: 10,
  },
  highlightedText: {
    color: Colors.text.primary,
    fontWeight: 800,
  },
});
