import BottomSheet, { BottomSheetProps } from "@gorhom/bottom-sheet";
import React, { forwardRef } from "react";
import { StyleSheet } from "react-native";

type AppBottomSheetProps = {
  children: React.ReactNode;
  scrollable?: boolean;
} & BottomSheetProps;

const AppBottomSheet = forwardRef<any, AppBottomSheetProps>(
  ({ children, scrollable = false, ...overrideProps }, ref) => {
    return (
      <BottomSheet
        ref={ref}
        enablePanDownToClose={false}
        backgroundStyle={styles.background}
        handleIndicatorStyle={styles.handle}
        enableContentPanningGesture={true}
        {...overrideProps}
      >
        {children}
      </BottomSheet>
    );
  }
);

AppBottomSheet.displayName = "AppBottomSheet";

export default AppBottomSheet;

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
