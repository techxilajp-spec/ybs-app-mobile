import { Colors } from "@/src/constants/color";
import { Image, StyleSheet, TextInput, View, ViewStyle } from "react-native";

type SearchInputProps = {
    style?: ViewStyle
}

export default function SearchInput({
    style
}: SearchInputProps) {
    return (
        <View style={[styles.searchContainer, style]}>
            <Image 
                source={require("@/assets/icons/search.png")}
                style={styles.searchIcon}
            />
            <TextInput 
                style={styles.input}
                placeholder="ရှာဖွေရန်"
                placeholderTextColor={Colors.text.placeholder.subtitle}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    searchContainer: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderColor: Colors.border.disabled,
        borderWidth: 1,
        borderRadius: 8,

        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },
    searchIcon: {
        width: 20,
        height: 20
    },
    input: {
        flex: 1,
        fontFamily: "MiSansMyanmar-Regular",
        fontSize: 16,
    }
})