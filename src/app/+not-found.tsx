import { StyleSheet, View } from 'react-native';

// custom components
import AppText from "@/src/components/AppText";

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <AppText>Screen Not Found</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  }
});