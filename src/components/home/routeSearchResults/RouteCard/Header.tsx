import { Image, StyleSheet, View, ViewStyle } from "react-native";

// custom component
import AppText from "@/src/components/AppText";

// constants
import { Colors } from "@/src/constants/color";

type HeaderProps = {
  isFastest?: boolean;
  style?: ViewStyle | ViewStyle[];
};

export default function Header({ isFastest, style }: HeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        <AppText size={14} style={styles.title}>
          လမ်းကြောင်း ၁
        </AppText>
        {isFastest && (
          <View style={styles.badge}>
            <AppText size={14} style={styles.badgeText}>
              Fastest
            </AppText>
          </View>
        )}
      </View>
      <Image source={require("@/assets/icons/location.png")} style={styles.icon} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontWeight: "800",
  },
  badge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 4,
  },
  badgeText: {
    color: "#FFF",
  },
  icon: {
    width: 40,
    height: 40
  }
});
