// react native
import { StyleSheet } from "react-native";

// react
import React from "react";

// bottom sheet
import BottomSheet, {
  BottomSheetProps
} from "@gorhom/bottom-sheet";

type AppBottomSheetProps = {
  children: React.ReactNode;
  scrollable?: boolean;
} & BottomSheetProps;

export default function AppBottomSheet({
  children,
  scrollable = false,
  ...overrideProps
}: AppBottomSheetProps) {
  console.log(overrideProps);
  
  return (
    <BottomSheet
      enablePanDownToClose={false}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.handle}
      {...overrideProps}
    >
      {children}
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
    width: 94,
    backgroundColor: "#ECECEC",
  },
  contentContainer: {
    flex: 1,
  },
});
