import {
  Image,
  StyleSheet,
  View
} from "react-native";

import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

// custom component
import AppText from "./AppText";

import { Colors } from "../constants/color";

export default function AppDrawerContent(props: DrawerContentComponentProps) {
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
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
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
  }
})


