import { Image, StyleSheet, View } from "react-native";

// custom components
import AppText from "@/src/components/AppText";

// constants
import { Colors } from "@/src/constants/color";

type BusStopProps = {
    title: string;
    road: string;
}

export default function BusStop({
    title,
    road
}: BusStopProps) {
    return (
        <View style={styles.container}>
            <Image source={require("@/assets/icons/bus.png")} style={styles.busIcon} />
            <View style={styles.detailContainer}>
                <AppText size={14} style={styles.title}>{title}</AppText>
                <AppText size={12} style={styles.road}>{`Road: ${road}`}</AppText>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 24
    },
    busIcon: {
        width: 22,
        height: 22
    },
    detailContainer: {
        flex: 1
    },
    title: {
        fontFamily: "MiSansMyanmar-Semibold",
        color: Colors.text.primary
    },
    road: {
        fontFamily: "MiSansMyanmar-Medium",
        color: Colors.text.secondary
    }
})