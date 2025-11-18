import { StyleSheet, View } from "react-native";

import AppText from "../AppText";

export default function RouteSearchView() {
    return (
        <View style={styles.container}>
            <AppText>Route Search View</AppText>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'yellow'
    }
})