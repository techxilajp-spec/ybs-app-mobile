import {
  Image,
  StyleSheet,
  View
} from "react-native";

import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem
} from "@react-navigation/drawer";

// custom component
import AppText from "./AppText";

// icons

import { Colors } from "../constants/color";

export default function AppDrawerContent(props: DrawerContentComponentProps) {
  const filteredItems = props.state.routes.filter((_, index) => index !== 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          style={styles.appLogo}
          source={require('@/assets/images/ybs_app_logo.png')} 
        />
        <AppText size={18} style={styles.headerTitle}>Bus Pin</AppText>
      </View>
      {/* <AppText>This is header</AppText> */}
      <DrawerContentScrollView 
        {...props}
        contentContainerStyle={{
          paddingTop: 0
        }}
      >
        {filteredItems.map((route, index) => (
          <DrawerItem 
            key={route.name}
            label="ကြိုက်နှစ်သက်မှုများ"
            onPress={() => props.navigation.navigate(route.name)}
            labelStyle={styles.drawerItemLabel}
            style={{ marginTop: 20 }}
          />
        ))}
      </DrawerContentScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    padding: 30,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerTitle: {
    color: '#FFF',
    fontWeight: 'bold'
  },
  appLogo: {
    width: 51,
    height: 57,
    marginRight: 30
  },
  drawerItemLabel: {
    color: '#2F2F2F',
    fontSize: 18,
    fontWeight: "semibold"
  }
})


