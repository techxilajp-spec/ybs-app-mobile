import { Image, Pressable, StyleSheet, View } from "react-native";

// constants
import { Colors } from "@/src/constants/color";

// custom components
import AppText from "@/src/components/AppText";

// icons
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useEffect, useState } from "react";
import { useAddFavoriteStop, useIsFavoriteStop, useRemoveFavoriteStop } from "../hooks/favouriteStops";

type StopCardProps = {
  id: number;
  title_mm: string;
  title_en: string;
  road_mm: string;
  lat: number;
  lng: number;
  onPress?: () => void;
  busNumbers?: string[];
  direction_text?: string;
}

export default function StopCard({
  id,
  title_mm,
  title_en,
  road_mm,
  lat,
  lng,
  onPress,
  busNumbers = [],
  direction_text,
}: StopCardProps) {

  const { mutate: addFavoriteStop } = useAddFavoriteStop();
  const { mutate: isFavoriteStop } = useIsFavoriteStop();
  const { mutate: removeFavoriteStop } = useRemoveFavoriteStop();
  const [isFavorite, setIsFavorite] = useState(false);

  const heartIcon = isFavorite ? (
    <FontAwesome name="heart" size={20} color="red" />
  ) : (
    <Feather name="heart" size={20} color="black" />
  );

  const onAddFavourite = () => {
    if (id === null || id === undefined) return;
    if (isFavorite) {
      removeFavoriteStop(id, {
        onSuccess: () => {
          setIsFavorite(false);
        },
        onError: () => { },
      });
    } else {
      addFavoriteStop(id, {
        onSuccess: () => {
          setIsFavorite(true);
        },
        onError: () => { },
      })
    }
  }

  useEffect(() => {
    if (id) {
      isFavoriteStop(Number(id), {
        onSuccess: (data) => {
          setIsFavorite(data);
        }
      });
    }
  }, [id, isFavoriteStop])
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Image
          source={require("@/assets/icons/bus_yellow.png")}
          style={styles.busIcon}
        />
      </View>
      <View style={styles.detailContainer}>
        <View style={styles.titleRow}>
          <AppText
            size={16}
            style={styles.title_mm}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title_mm}
          </AppText>
          {direction_text && (
            <View style={[
              styles.directionBadge,
              direction_text === 'အသွား' ? styles.inboundBadge : styles.outboundBadge
            ]}>
              <AppText size={10} style={styles.directionText}>
                {direction_text}
              </AppText>
            </View>
          )}
        </View>
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

        {Array.isArray(busNumbers) && busNumbers.length > 0 && (
          <AppText
            size={14}
            style={styles.description}
          >
            ရောက်ရှိသောကားများ - {busNumbers.join(", ")}
          </AppText>
        )}
      </View>
      <View style={[styles.iconContainer, { alignItems: "flex-end"}]}>
        <Pressable onPress={onAddFavourite}>{heartIcon}</Pressable>
      </View>
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
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  directionBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 10,
  },
  inboundBadge: {
    backgroundColor: "#E7F6EC", // Light green
  },
  outboundBadge: {
    backgroundColor: "#F2F4F7", // Light gray
  },
  directionText: {
    fontFamily: "MiSansMyanmar-Medium",
    color: Colors.text.primary,
  },
});
