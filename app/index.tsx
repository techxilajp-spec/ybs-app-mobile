import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { Marker, Polyline } from 'react-native-maps';

import route62 from "../data/routes/route62.json";

const startingRegion = {
    latitude: route62.shape.geometry.coordinates[0][1],
    longitude: route62.shape.geometry.coordinates[0][0],
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
}


export default function HomeScreen() {
    const [route, setRoute] = useState(null);
    const [coordinates, setCoordinates] = useState([]);

    const windowHeight = Dimensions.get('window').height;

    const bottomSheetRef = useRef<BottomSheet>(null);
    const mapRef = useRef(null);
    const markersRef = useRef({});

    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    const handleSelectLocation = (latitude, longitude) => {
        mapRef.current?.animateToRegion(
            {
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            },
            1000 // duration in ms
        );

        // Hide all other callouts (optional)
        Object.values(markersRef.current).forEach((ref) => ref?.hideCallout());

        // Show only the selected marker’s callout
        markersRef.current[`${latitude}-${longitude}`]?.showCallout();
    }

    useEffect(() => {
        setRoute(route62);
        setCoordinates(
            route62.shape.geometry.coordinates.map(coordinate => {
                return {
                    latitude: coordinate[1],
                    longitude: coordinate[0],
                };
            })
        );

    }, []);
    return (
        <GestureHandlerRootView style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={startingRegion}
            >
                {route?.shape.geometry.coordinates.map((coordinate) => {
                    return (
                        <Marker
                            key={`${coordinate[0]}-${coordinate[1]}-${Math.random()}`}
                            ref={(ref) => (markersRef.current[`${coordinate[1]}-${coordinate[0]}`] = ref)}
                            coordinate={{
                                longitude: coordinate[0],
                                latitude: coordinate[1]
                            }}
                            title={`${coordinate[1]}-${coordinate[0]}`}
                        />
                    )
                })}

                <Polyline
                    coordinates={coordinates}
                    strokeColor="#f50202"
                    strokeWidth={3}
                />
            </MapView>
            <BottomSheet
                ref={bottomSheetRef}
                onChange={handleSheetChanges}
                snapPoints={["20%", "35%"]}
                style={styles.contentContainer}
                maxDynamicContentSize={windowHeight * 0.35}
            >
                <View style={{
                    backgroundColor: "#f50202",
                    padding: 8,
                    marginBottom: 6
                }}>
                    <Text style={styles.routeTitle}>{route62.name}</Text>
                </View>
                <BottomSheetFlatList
                    data={coordinates}
                    keyExtractor={item => `${item.latitude}-${item.longitude}-${Math.random()}`}
                    renderItem={({ item }) => {
                        return (
                            <Pressable onPress={() => handleSelectLocation(item.latitude, item.longitude)}>
                                <View style={styles.itemContainer}>
                                    <Text>{`${item.latitude}-${item.longitude}`}</Text>
                                </View>
                            </Pressable>
                        )
                    }}
                />
            </BottomSheet>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    map: {
        width: '100%',
        height: '100%',
    },
    contentContainer: {
        padding: 8
    },
    itemContainer: {
        padding: 12,
        marginBottom: 6,
        backgroundColor: "#eee"
    },
    routeTitle: {
        color: "#fff",
        fontSize: 14,
        fontWeight: 'semibold',
        textAlign: 'center'
    }
})