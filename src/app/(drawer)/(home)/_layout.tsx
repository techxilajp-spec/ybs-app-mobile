import { Stack } from "expo-router";

export default function HomeScreenLayout() {
    return (
        <Stack>
            <Stack.Screen 
                name="index"
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen 
                name="routeSearchResults"
                options={{
                    headerShown: false
                }}
            />
        </Stack>
    )
}