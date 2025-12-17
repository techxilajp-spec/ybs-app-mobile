// react native
import { FlatList, StyleSheet, View, ViewStyle } from "react-native";

// expo router
import { router } from "expo-router";

// custom components
import AppText from "@/src/components/AppText";
import RouteCard from "@/src/components/RouteCard";

// constants
import { Colors } from "@/src/constants/color";

const DUMMY_ROUTES = [
  {
    no: 1,
    title: "လှည်းကူးဈေး - ဇဝန",
    description:
      "(လှည်းကူးတာဆုံ - ပေါက်ကုန်းရွာလယ် -အမှတ်(၂)လမ်း- ဆားတလင်းလမ်းဆုံ ... )",
    color: "#2B6CB0",
  },
  {
    no: 2,
    title: "ယုဇန -အောင်မင်္ဂလာအဝေးပြေး",
    description: "ပဲခူးမြစ်လမ်း - စက်မှုဇုန်၂ – လှော်ကားလမ်း - ၂၀ကုန်တိုက် )",
    color: "#E53E3E",
  },
  {
    no: 3,
    title: "ယုဇန - ဗိုလ်ချုပ်အောင်ဆန်းလမ်း",
    description: "ပဲခူးမြစ်လမ်း - စက်မှုဇုန်၂ – လှော်ကားလမ်း - ၂၀ကုန်တိုက် )",
    color: "#E53E3E",
  },
  {
    no: 4,
    title: "ယုဇန - ဆူးလေ(မဟာဗန္ဓူလပန်းခြံ)",
    description: "ပဲခူးမြစ်လမ်း - သိမ်ကျောင်း - ဧရာဝတီလမ်း - ရတနာလမ်း )",
    color: "#E53E3E",
  },
  {
    no: 5,
    title: "ပါရမီ(ညောင်ပင်) - သခင်မြပန်းခြံ",
    description:
      "ပါရမီ(ညောင်ပင်) - ဘေလီ - သံသုမာလမ်း - လိုင်စင်ရုံး - ရတနာလမ်း - ကျိုက္ကဆံဘုရား - ကျောက်ကုန်း - မိုးကောင်းလမ်း - ရန်ကင်းလမ်း - ရန်ရှင်းလမ်း - စက်မှုကွေ့ - လမ်းနီ(မြန်မာပလာဇာ) - လှည်းတန်း - ဆင်မလိုက် -ကြည့်မြင်တိုင်ကမ်းနားလမ်း - ညဈေး - သခင်မြပန်းခြံ",
    color: "#F4D159",
  },
];

type AvailableRoutesProps = {
  style?: ViewStyle;
};

export default function AvailableRoutes({ style }: AvailableRoutesProps) {
  const onPressRouteCard = () => {
    router.push("/routeDetail");
  };
  return (
    <View style={[styles.container, style]}>
      <AppText style={styles.title}>ရောက်ရှိသောယာဉ်လိုင်းများ</AppText>
      <FlatList
        style={{ marginTop: 20 }}
        data={DUMMY_ROUTES}
        renderItem={({ item }) => (
          <RouteCard
            routeNo={item.no}
            routeTitle={item.title}
            routeDescription={item.description}
            color={item.color}
            onPress={onPressRouteCard}
          />
        )}
        keyExtractor={(item) => item.title}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: Colors.text.primary,
    fontFamily: "MiSansMyanmar-Semibold",
  },
});
