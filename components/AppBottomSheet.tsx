import BottomSheet, {
  BottomSheetProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useMemo } from "react";
import { StyleSheet } from "react-native";

type AppBottomSheetProps = {
  children: React.ReactNode;
  snapPoints?: string[];
  scrollable?: boolean;
} & BottomSheetProps;

export default function AppBottomSheet({
  children,
  snapPoints = ["25%", "50%", "90%"],
  scrollable = false,
  ...overrideProps
}: AppBottomSheetProps) {
  const memoizedSnapPoints = useMemo(() => snapPoints, [snapPoints]);

  return (
    <BottomSheet
      snapPoints={memoizedSnapPoints}
      enablePanDownToClose={false}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.handle}
      {...overrideProps}
    >
      {scrollable ? (
        children
      ) : (
        <BottomSheetView style={styles.contentContainer}>
          {children}
        </BottomSheetView>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handle: {
    backgroundColor: "#ccc",
  },
  contentContainer: {
    flex: 1,
  },
});
