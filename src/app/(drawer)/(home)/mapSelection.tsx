// react
import { useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

// expo router
import { router, useLocalSearchParams } from "expo-router";

// react-native-maps
import MapView, { LatLng, MapMarker, PROVIDER_GOOGLE } from "react-native-maps";

// icons
import Ionicons from "@expo/vector-icons/Ionicons";

// components
import AppButton from "@/src/components/AppButton";
import AppScreenLayout from "@/src/components/AppScreenLayout";
import AppText from "@/src/components/AppText";

// stores
import { useTripPlannerStore } from "@/src/stores/useTripPlannerStore";

// constants
import { Colors } from "@/src/constants/color";
import { MAP_DELTA, MAP_LOCATIONS } from "@/src/constants/map";

export default function MapSelectionScreen() {
    const { mode } = useLocalSearchParams<{ mode: "start" | "end" }>();
    const { YANGON } = MAP_LOCATIONS;

    const startLocation = useTripPlannerStore((s) => s.startLocation);
    const endLocation = useTripPlannerStore((s) => s.endLocation);

    const setStartLocation = useTripPlannerStore((s) => s.setStartLocation);
    const setEndLocation = useTripPlannerStore((s) => s.setEndLocation);

    const [selectedCoordinate, setSelectedCoordinate] = useState<LatLng | null>(() => {
        if (mode === "start" && startLocation && startLocation.coordinate) {
            return startLocation.coordinate;
        } else if (mode === "end" && endLocation && endLocation.coordinate) {
            return endLocation.coordinate;
        }
        return null;
    });

    const mapRef = useRef<MapView>(null);

    const handleMapPress = (e: any) => {
        setSelectedCoordinate(e.nativeEvent.coordinate);
    };

    const handleConfirm = () => {
        if (!selectedCoordinate) return;

        // Create a pseudo-stop object from the coordinate
        const locationStop = {
            id: "custom-location",
            name_mm: "မြေပုံမှရွေးချယ်ထားသောနေရာ",
            name_en: "Selected Location",
            road_mm: "",
            road_en: "",
            lat: selectedCoordinate.latitude,
            lng: selectedCoordinate.longitude,
            coordinate: {
                latitude: selectedCoordinate.latitude,
                longitude: selectedCoordinate.longitude
            },
            isFavourite: false
        };

        if (mode === "start") {
            setStartLocation(locationStop as any);
        } else {
            setEndLocation(locationStop as any);
        }

        router.dismissAll();
        router.replace("/(drawer)/(home)");
    };

    return (
        <AppScreenLayout>
            <View style={styles.container}>
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={
                        selectedCoordinate
                            ? {
                                latitude: selectedCoordinate.latitude,
                                longitude: selectedCoordinate.longitude,
                                latitudeDelta: MAP_DELTA.CLOSE.LATITUDE,
                                longitudeDelta: MAP_DELTA.CLOSE.LONGITUDE,
                            }
                            : { ...YANGON, ...MAP_DELTA.DEFAULT }
                    }
                    provider={PROVIDER_GOOGLE}
                    onPress={handleMapPress}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                >
                    {selectedCoordinate && (
                        <MapMarker coordinate={selectedCoordinate} />
                    )}
                </MapView>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <View style={styles.titleContainer}>
                        <AppText size={16} style={styles.title}>
                            {mode === "start" ? "စထွက်မည့်နေရာရွေးပါ" : "ရောက်ရှိမည့်နေရာရွေးပါ"}
                        </AppText>
                        <AppText size={12} style={styles.subtitle}>
                            မြေပုံပေါ်တွင် နှိပ်၍ နေရာမှတ်ပါ
                        </AppText>
                    </View>
                </View>

                {selectedCoordinate && (
                    <View style={styles.footer}>
                        <AppButton
                            title="ဒီနေရာကိုရွေးမယ်"
                            onPress={handleConfirm}
                        />
                    </View>
                )}
            </View>
        </AppScreenLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
        top: -60,
    },
    header: {
        position: 'absolute',
        top: -50,
        left: 10,
        right: 10,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    backButton: {
        padding: 5,
        marginRight: 10,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontWeight: 'bold',
        color: Colors.text.primary,
    },
    subtitle: {
        color: Colors.text.secondary,
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
});
