import { StyleSheet, View } from "react-native";

import AppText from "../AppText";

export default function StopsListView() {
    return (
        <View style={styles.container}>
            <AppText>Stop List View</AppText>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'yellow'
    }
})