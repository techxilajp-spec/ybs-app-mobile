import { Image, StyleSheet, View } from "react-native";

// custom component
import AppText from "@/src/components/AppText";

// constants
import { Colors } from "@/src/constants/color";

export default function Summary() {
    return (
        <View>
            <View style={styles.row}>
                <Image source={require("@/assets/icons/bus1.png")} style={styles.busIcon} />
                <AppText size={16} style={styles.availableRoutesText}>Bus 89, 34</AppText>
            </View>
            <View style={[styles.row, { marginTop: 25 }]}>
                <View style={styles.button}>
                    <AppText size={12} style={styles.buttonText}>Total Bus Stop : 22</AppText>
                </View>
                <View style={styles.button}>
                    <AppText size={12} style={styles.buttonText}>Est : 35 minutes</AppText>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    busIcon: {
        width: 20,
        height: 20
    },
    availableRoutesText: {
        color: Colors.text.tertiary,
        fontWeight: "800"
    },
    button: {
        backgroundColor: "#F9FAFB",
        padding: 8,
        borderRadius: 4,
        borderColor: "#EAECF0",
        borderWidth: 1
    },
    buttonText: {
        color: "#344054",
        fontWeight: 600
    }
})