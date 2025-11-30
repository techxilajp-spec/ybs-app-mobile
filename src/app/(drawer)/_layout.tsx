import { Drawer } from "expo-router/drawer";

// components
import AppDrawerContent from "@/src/components/AppDrawerContent";

export default function DrawerLayout() {
  return (
    <Drawer drawerContent={AppDrawerContent}>
      <Drawer.Screen
        name="(home)"
        options={{
          headerShown: false
        }}
      />
      <Drawer.Screen
        name="favourite"
        options={{
          headerShown: false
        }}
      />
    </Drawer>
  );
}
