import { Image, Pressable, StyleSheet, View } from "react-native";

// constants
import { Colors } from "@/src/constants/color";

// custom components
import AppText from "@/src/components/AppText";

// icons
import FontAwesome from '@expo/vector-icons/FontAwesome';

type StopCardProps = {
  title_mm: string;
  title_en: string;
  road_mm: string;
  lat: number;
  lng: number;
  onPress?: () => void;
  isFavourite?: boolean;
  // onToggleFavourite: () => void;
}

export default function StopCard({
  title_mm,
  title_en,
  road_mm,
  lat,
  lng,
  onPress,
  isFavourite = false,
}: StopCardProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Image
          source={require("@/assets/icons/bus_yellow.png")}
          style={styles.busIcon}
        />
      </View>
      <View style={styles.detailContainer}>
        <AppText
          size={16}
          style={styles.title_mm}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title_mm}
        </AppText>
        <AppText
          size={14}
          style={styles.title_en}
        >
          {title_en}
        </AppText>
        <AppText
          size={14}
          style={styles.title_en}
        >
          {road_mm}
        </AppText>
        <AppText
          size={14}
          style={styles.description}
        >
          ({lat}, {lng})
        </AppText>
      </View>
      <View style={[styles.iconContainer, styles.heartIconContainer]}>
        {isFavourite ? (
          <FontAwesome name="heart" size={24} color={Colors.primary} />
        ) : (
          <FontAwesome name="heart-o" size={20} color={Colors.text.disabled} />
        )}
      </View>
      {/* <Pressable
        onPress={onToggleFavourite}
        hitSlop={10}
        style={[styles.iconContainer, styles.heartIconContainer]}
      >
        <FontAwesome
          name={isFavourite ? "heart" : "heart-o"}
          size={isFavourite ? 24 : 20}
          color={isFavourite ? Colors.primary : Colors.text.disabled}
        />
      </Pressable> */}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE'
  },
  iconContainer: {
    width: 40
  },
  heartIconContainer: {
    alignItems: "flex-end"
  },
  detailContainer: {
    flex: 1
  },
  busIcon: {
    width: 22,
    height: 22,
  },
  title_mm: {
    color: Colors.text.primary,
    fontFamily: "MiSansMyanmar-Semibold",
    marginBottom: 8
  },
  title_en: {
    color: Colors.text.secondary,
    marginBottom: 5
  },
  description: {
    color: Colors.text.primary
  }
});
