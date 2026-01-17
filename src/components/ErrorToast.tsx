import { Dimensions, Pressable, StyleSheet, View, ViewStyle } from 'react-native';

// toast
import Toast from 'react-native-toast-message';

// expo icons
import Entypo from '@expo/vector-icons/Entypo';

// custom components
import AppText from '@/src/components/AppText';

type ErrorToastProps = {
    title: string,
    message: string,
    style?: ViewStyle
}

export default function ErrorToast({
    title,
    message,
    style
}: ErrorToastProps) {
    const { width: screenWidth } = Dimensions.get("window");

    /**
     * hide toast
     */
    const hideToast = () => {
        Toast.hide();
    }

    return (
        <View style={[styles.container, { width: screenWidth - 40 }, style]}>
            <View style={styles.outerCircle}>
                <View style={styles.innerCircle}>
                    <Entypo name="cross" size={14} color="#FFF" />
                </View>
            </View>
            <View style={{ paddingRight: 20}}>
                <AppText size={16} style={styles.title}>{title}</AppText>
                <AppText size={14} style={styles.message}>{message}</AppText>
            </View>
            <Pressable onPress={hideToast} style={styles.dismissButton}>
                <Entypo name="cross" size={24} color="#EF4444" />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: "relative",

        backgroundColor: "#FEF2F2",
        paddingHorizontal: 16,
        paddingVertical: 18,

        flexDirection: "row",
        gap: 16,

        borderWidth: 1,
        borderColor: "#EF4444",
        borderRadius: 16,
    },
    outerCircle: {
        backgroundColor: "#FFF",

        width: 24,
        height: 24,
        borderRadius: 12,

        borderWidth: 2,
        borderColor: "#EF4444",

        justifyContent: "center",
        alignItems: "center"
    },
    innerCircle: {
        width: 16,
        height: 16,
        backgroundColor: "#EF4444",
        borderRadius: 9,

        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        color: "#7F1D1D",
        fontFamily: "Roboto-Semibold",
        marginBottom: 5
    },
    message: {
        color: "#7F1D1D",
        fontFamily: "Roboto-Medium",
    },
    dismissButton: {
        position: "absolute",
        right: 12,
        top: 18
    }
})