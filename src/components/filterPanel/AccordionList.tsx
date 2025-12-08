import { FlatList, StyleSheet, ViewStyle } from "react-native";

// custom component
import Accordion from "@/src/components/filterPanel/Accordion";

type AccordionListProps = {
    list: any[],
    style?: ViewStyle
}

export default function AccordionList({
    list,
    style
}: AccordionListProps) {
    return (
        <FlatList 
            style={[styles.container, style]}
            data={list}
            renderItem={({item}) => (
                <Accordion 
                    title={item.title}
                    options={item.options}
                />
            )}
            keyExtractor={(item) => item.title}
            showsVerticalScrollIndicator={false}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})