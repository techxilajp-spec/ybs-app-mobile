import { StyleSheet, Text, View } from "react-native";
type HeaderProps = {
    name: String;
    stopCount: number;
}
export default function Header({
    name,
    stopCount
}: HeaderProps) {
  return (
    <View style={styles.routeHeader}>
      <View style={styles.routeIconContainer}>
        <Text style={styles.routeIcon}>🚌</Text>
      </View>
      <View style={styles.routeInfo}>
        <Text style={styles.routeTitle}>{name}</Text>
        <Text style={styles.routeSubtitle}>
          Bus Route • {stopCount} stops
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    routeHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginBottom: 8,
  },
  routeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  routeIcon: {
    fontSize: 24,
  },
  routeInfo: {
    flex: 1,
  },
  routeTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  routeSubtitle: {
    fontSize: 14,
    color: "#757575",
  },
})
