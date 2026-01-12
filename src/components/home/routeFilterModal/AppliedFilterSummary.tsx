import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

// components
import AppText from "@/src/components/AppText";
import OptionTab from "@/src/components/home/stopFilterModal/OptionTab";

// types
import { Option } from "@/src/types/accordian";

type AppliedFilterSummaryProps = {
  filters: Option[];
  onRemoveFilter: (filterId: string) => void;
  onClearAll: () => void;
  style?: ViewStyle
};

export default function AppliedFilterSummary({
  filters,
  onRemoveFilter,
  onClearAll,
  style = {}
}: AppliedFilterSummaryProps) {
  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.filterList}>
        {filters.map((filter) => (
          <OptionTab
            key={filter.id}
            title={filter.name}
            remove={() => onRemoveFilter(filter.id)}
          />
        ))}
      </View>

      <View style={styles.summaryRow}>
        <AppText size={18} style={styles.summaryText}>
          {`Filter Applied Result (${filters.length})`}
        </AppText>

        <Pressable onPress={onClearAll}>
          <AppText size={14} style={styles.clearText}>
            Remove Filter
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {},

  filterList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 32,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  summaryText: {
    fontFamily: "Roboto-Semibold",
  },

  clearText: {
    color: "#E64B32",
    textDecorationLine: "underline",
  },
});
