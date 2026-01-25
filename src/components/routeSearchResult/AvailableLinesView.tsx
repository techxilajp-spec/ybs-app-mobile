import { FlatList, StyleSheet, View } from 'react-native';

// custom component
import AppText from "@/src/components/AppText";
import RouteCard from "@/src/components/RouteCard";

// constants

// types
import { Colors } from '@/src/constants/color';
import { Route } from '@/src/types/bus';


type AvailableLinesViewProps = {
    lines: Route[]
}

export default function AvailableLinesView({ lines }: AvailableLinesViewProps) {
    return (
        <View style={styles.container}>
            <FlatList
                style={styles.listContainer}
                data={lines}
                renderItem={({ item }) => (
                    <RouteCard
                        routeId={Number(item.id)}
                        routeNo={item.no}
                        routeTitle={item.name}
                        routeDescription={item.description}
                        color={item.color}
                        onPress={() => console.log("hello")}
                        isYps={item.isYps}
                    />
                )}
                keyExtractor={(item, index) => index + item.id}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <AppText size={16} style={styles.emptyText}>
                            ယာဉ်လိုင်းမတွေ့ပါ
                        </AppText>
                        <AppText size={14} style={styles.emptySubtext}>
                            ကျေးဇူးပြု၍ အခြားနေရာများကို ရွေးချယ်ကြည့်ပါ
                        </AppText>
                    </View>
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    listContainer: {
        flex: 1
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 60,
        paddingHorizontal: 20,
    },
    emptyText: {
        color: Colors.text.primary,
        fontWeight: "600",
        marginBottom: 8,
        textAlign: "center",
    },
    emptySubtext: {
        color: Colors.text.secondary,
        textAlign: "center",
    },
})