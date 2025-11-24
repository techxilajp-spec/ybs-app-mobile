import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useSQLiteContext } from "expo-sqlite";

const ROUTE_DATA = [
  {
    id: 22,
    title: "အနောက်ပိုင်းတက္ကသိုလ် - သခင်မြပန်းခြံ",
    description:
      "(လှည်းကူးတာဆုံ - ပေါက်ကုန်းရွာလယ် -အမှတ်(၂)လမ်း- ဆားတလင်းလမ်းဆုံ  )",
  },
  {
    id: 14,
    title: "ပါရမီ(ညောင်ပင်) - သခင်မြပန်းခြံ",
    description: "( အောင်မင်္ဂလာအဝေးပြေး - အမှတ်(၃)လမ်းဆုံ - ခရေပင်းလမ်းခွဲ  )",
  },
  {
    id: 30,
    title: "မြောက်ဒဂုံ - သခင်မြပန်းခြံ",
    description:
      "( မြောက်ဒဂုံ(ထားဝယ်ချောင်) - ၅၀ကွေ့ - ပြည်ထောင်စုလမ်း -  ၄၆ လမ်းဆုံ )",
  },
];

export default function HomeScreen() {
  const db = useSQLiteContext();
  const [favouriteIds, setFavouriteIds] = useState<number[]>([]);

  const routes = useMemo(() => {
    return ROUTE_DATA.map((route) => ({
      ...route,
      is_favourite: favouriteIds.includes(route.id),
    }));
  }, [favouriteIds]);

  const addToFavourites = async (id: number) => {
    const route = ROUTE_DATA.find((r) => r.id === id);
    if (!route) return;

    await db.runAsync(
      `INSERT INTO favourite_routes (route_no, title, description)
     VALUES (?, ?, ?)`,
      [route.id, route.title, route.description]
    );

    loadFavourites(); // refresh UI
  };

  const removeFromFavourites = async (id: number) => {
    await db.runAsync("DELETE FROM favourite_routes WHERE route_no = ?", [id]);
    loadFavourites();
  };

  const loadFavourites = async () => {
    const rows = await db.getAllAsync("SELECT route_no FROM favourite_routes");
    console.log(rows);
    setFavouriteIds(rows.map((row) => row.route_no));
  };

  useEffect(() => {
    loadFavourites();
  }, []);
  return (
    <View style={styles.container}>
      {routes.map((route) => (
        <View style={styles.routeCard} key={route.title}>
          <View style={{ marginBottom: 5 }}>
            <Text style={styles.routeTitle}>{route.title}</Text>
            <Text style={styles.routeDescription}>{route.description}</Text>
          </View>
          {route.is_favourite ? (
            <Pressable
              onPress={() => removeFromFavourites(route.id)}
              style={styles.removeButton}
            >
              <Text style={{ color: "#dc3545", textAlign: "center" }}>
                Remove From Favourite
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => addToFavourites(route.id)}
              style={styles.addButton}
            >
              <Text style={{ color: "#ffd801", textAlign: "center" }}>
                Add To Favourite
              </Text>
            </Pressable>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  routeCard: {
    padding: 15,
    borderRadius: 15,
    borderColor: "#c3c2c2ff",
    borderWidth: 1,
    marginBottom: 10,
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  routeDescription: {
    fontSize: 14,
    color: "#4b4b4bff",
  },
  addButton: {
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ffd801",
    borderRadius: 8,
  },
  removeButton: {
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#dc3545",
    borderRadius: 8,
  },
});
