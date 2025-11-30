import { Image, Pressable, StyleSheet, View } from "react-native";

import { router } from "expo-router";

// constants
import { Colors } from "@/src/constants/color";

// custom components
import AppText from "@/src/components/AppText";

type AppHeaderProps = {
    title: string
}

export default function AppHeader({
    title
} : AppHeaderProps) {
    const goBackToHomeScreen = () => {
        router.back();
    }
    return (
        <View style={styles.container}>
            <Pressable style={styles.backButton} onPress={goBackToHomeScreen}>
                <Image 
                    style={styles.backIcon}
                    source={require("@/assets/icons/back_arrow.png")}
                />
            </Pressable>
            <AppText size={18} style={styles.title}>{title}</AppText>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 50,
        position: 'relative',
        justifyContent: 'center'
    },
    titleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontWeight: "semibold",
        color: Colors.text.primary,
        textAlign: 'center'
    },
    backIcon: {
        width: 20,
        height: 15
    },
    backButton: {
        width: 50,
        height: 50,

        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 5,
        justifyContent: 'center'
    },
})