import { StyleSheet, View } from 'react-native';

// custom component
import RouteCard from '@/src/components/home/routeSearchResults/RouteCard';

export default function AvailableRoutesView() {
    return (
        <View style={styles.container}>
            <RouteCard />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})