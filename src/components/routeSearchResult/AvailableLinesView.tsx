import { FlatList, StyleSheet, View } from 'react-native';

// custom component
import RouteCard from "@/src/components/RouteCard";

// types
import { Route } from '@/src/types/bus';


type AvailableLinesViewProps = {
    lines: Route[]
}

export default function AvailableLinesView({ lines } : AvailableLinesViewProps) {
    return (
        <View style={styles.container}>
            <FlatList
                style={styles.listContainer}
                data={lines}
                renderItem={({ item }) => (
                    <RouteCard
                        routeNo={item.no}
                        routeTitle={item.name}
                        routeDescription={item.description}
                        color={item.color}
                        onPress={() => console.log("hello")}
                    />
                )}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
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
    }
})