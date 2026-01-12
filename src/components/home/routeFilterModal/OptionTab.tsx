import { Pressable, StyleSheet, View } from "react-native";

// custom component
import AppText from "@/src/components/AppText";

// icons
import Entypo from '@expo/vector-icons/Entypo';

type OptionTabProps = {
    title: string;
    remove: () => void;
}

export default function OptionTab({
    title,
    remove
}: OptionTabProps) {
    return (
        <View style={styles.container}>
            <AppText size={14} style={styles.title}>{title}</AppText>
            <Pressable onPress={remove}>
                <Entypo name="cross" size={20} color="black" />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        paddingVertical: 6,
        backgroundColor: "#FFEFB7",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#EEEEEE",

        flexDirection: "row",
        alignItems: "center",
        gap: 5
    },
    title: {
        fontFamily: "MiSansMyanmar-Medium"
    }
})