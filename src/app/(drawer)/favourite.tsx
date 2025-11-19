import { StyleSheet } from "react-native";

// components
import AppHeader from "@/src/components/AppHeader";
import AppScreenLayout from "@/src/components/AppScreenLayout";

export default function FavouriteScreen() {
    return (
        <AppScreenLayout contentStyle={styles.container}>
            <AppHeader title="ကြိုက်နှစ်သက်မှုများ"/>
        </AppScreenLayout>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20
    }
})