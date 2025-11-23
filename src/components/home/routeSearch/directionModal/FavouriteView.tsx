import { ScrollView, StyleSheet } from "react-native";

// customComponent
import AppText from "@/src/components/AppText";

export default function FavouriteView() {
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <AppText>Favourite View</AppText>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#000'
    }
})