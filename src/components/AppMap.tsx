// react
import { forwardRef } from "react";

// react-native
import { StyleSheet } from "react-native";

// react native map
import MapView from "react-native-maps";

const AppMap = forwardRef<any, any>(
    ({}, ref) => {
        return (
            <MapView 
                ref={ref}
                style={styles.mapContainer}
            >

            </MapView>
        )
    }
)

const styles = StyleSheet.create({
    mapContainer: {
        flex:1
    }
})

export default AppMap;