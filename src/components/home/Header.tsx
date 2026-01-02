import { Image, Pressable, StyleSheet, View } from "react-native";

import { DrawerActions, useNavigation } from "@react-navigation/native";

// custom components
import AppText from "@/src/components/AppText";

export default function Header() {
  const navigation = useNavigation();

  /**
   * Opens the navigation drawer.
   */
  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.drawerMenuButton} onPress={openDrawer}>
        <Image
          style={styles.menuIcon}
          source={require("@/assets/icons/hamburger_menu.png")}
        />
      </Pressable>
      <Image
        source={require("@/assets/images/ybs_app_logo.png")}
        style={styles.logo}
      />
      <View>
        <AppText size={20} style={styles.title}>
          Bus Pin
        </AppText>
        <AppText size={18} style={styles.subTitle}>
          ဘတ်စ်ကားစီးဖို့အကောင်းဆုံးအကူ
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 15,
  },
  drawerMenuButton: {
    position: "absolute",
    top: 15,
    left: 0,
  },
  menuIcon: {
    width: 24,
    height: 24,
  },
  logo: {
    width: 44,
    height: 50,
    marginBottom: 18,
  },
  title: {
    fontFamily: "Roboto-Bold",
    textAlign: "center",
    marginBottom: 3,
  },
  subTitle: {
    textAlign: "center",
    fontFamily: "MiSansMyanmar-Demibold",
  },
});
