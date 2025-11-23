import { ScrollView, StyleSheet } from "react-native";

// customComponent
import AppText from "@/src/components/AppText";

export default function RecentView() {
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <AppText>Recent View</AppText>
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