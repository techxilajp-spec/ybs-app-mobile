import { Image, StyleSheet, View, ViewStyle } from "react-native";

// custom component
import AppText from "@/src/components/AppText";

// constants
import { Colors } from "@/src/constants/color";

type WalkStepProps = {
    description: string;
    style?: ViewStyle | ViewStyle[];
}

export default function WalkStep({
    description,
    style
}: WalkStepProps) {
    return (
        <View style={[styles.container, style]}>
            <Image source={require("@/assets/icons/man_walking.png")} style={styles.icon} />
            <AppText size={14} style={styles.text}>{description}</AppText>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 26
    },
    icon: {
        width: 32,
        height: 32
    },
    text: {
        flex: 1,
        color: Colors.text.primary,
        fontWeight: 600
    }
})