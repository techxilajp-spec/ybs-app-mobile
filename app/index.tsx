import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
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
    const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);

    const windowHeight = Dimensions.get('window').height;

    const bottomSheetRef = useRef<BottomSheet>(null);
    const mapRef = useRef(null);
    const markersRef = useRef({});

    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    const handleSelectLocation = (latitude, longitude) => {
        if(!latitude || !longitude) return;
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

    const watchUserLocation = async () => {
        Location.watchPositionAsync({
            accuracy: Location.Accuracy.High,
            timeInterval: 3000,   // every 3 seconds
            distanceInterval: 5,  // or every 5 meters
        }, (newLocation) => {
            setUserLocation(newLocation);
        })
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

        async function getCurrentLocation() {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            console.log(location);
            setUserLocation(location);
        }
        getCurrentLocation();

        // track location
        watchUserLocation();
    }, []);

    useEffect(() => {
        console.log(userLocation);
    }, [userLocation])
    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={{
                position: "absolute",
                top: 50,
                right: 10,
                zIndex: 10
            }}>
                <Button
                    title='View Current Location'
                    onPress={() => handleSelectLocation(userLocation?.coords.latitude, userLocation?.coords.longitude)}
                />
            </View>
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

                {userLocation && (
                    <Marker
                        coordinate={{
                            latitude: userLocation.coords.latitude,
                            longitude: userLocation.coords.longitude
                        }}
                    >
                        <View style={styles.userMarker}></View>
                    </Marker>
                )}

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
        flex: 1,
        position: "relative"
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
    },
    userMarker: {
        width: 16,
        height: 16,
        backgroundColor: '#007AFF',
        borderColor: '#FFFFFF',
        borderWidth: 2,
        borderRadius: 8
    }
})