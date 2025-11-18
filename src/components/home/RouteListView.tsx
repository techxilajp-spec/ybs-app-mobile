import { StyleSheet, View } from "react-native";

import AppText from "../AppText";

export default function RouteListView() {
    return (
        <View style={styles.container}>
            <AppText>Route List View</AppText>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'yellow'
    }
})