import { Stack } from "expo-router";

export default function HomeScreenLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="routeSearchResults"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="routeDetail"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="routeSearchDetail"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="stopSearchResults"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
