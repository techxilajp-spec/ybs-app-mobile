import { StyleSheet, View } from "react-native";

// custom component
import AppText from "@/src/components/AppText";
export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <AppText>This is index Screen</AppText>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})