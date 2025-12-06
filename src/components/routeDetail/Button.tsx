import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";

import { JSX } from "react";

// expo-icons

// constants
import { Colors } from "@/src/constants/color";

type ButtonProps = {
    style?: StyleProp<ViewStyle>,
    icon: JSX.Element,
    onPress: () => void
}

export default function Button({
    style,
    icon,
    onPress
}: ButtonProps) {
    return (
        <Pressable style={[styles.buttonContainer, style]} onPress={onPress}>
            {icon}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        position: "absolute",

        width: 40,
        height: 40,
        backgroundColor: "#FFF",
        borderColor: Colors.border.secondary,
        borderRadius: 20,

        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
})