import { FlatList, StyleSheet, View } from 'react-native';

// custom component
import RouteCard from "@/src/components/home/routeList/RouteCard";

const DUMMY_ROUTES = [
    {
        no: 1,
        title: "လှည်းကူးဈေး - ဇဝန",
        description: "(လှည်းကူးတာဆုံ - ပေါက်ကုန်းရွာလယ် -အမှတ်(၂)လမ်း- ဆားတလင်းလမ်းဆုံ ... )",
        color: "#2B6CB0"
    },
    {
        no: 4,
        title: "ယုဇန - ဆူးလေ(မဟာဗန္ဓူလပန်းခြံ)",
        description: "ပဲခူးမြစ်လမ်း - သိမ်ကျောင်း - ဧရာဝတီလမ်း - ရတနာလမ်း )",
        color: "#E53E3E"
    },
    {
        no: 5,
        title: "ပါရမီ(ညောင်ပင်) - သခင်မြပန်းခြံ",
        description: "ပါရမီ(ညောင်ပင်) - ဘေလီ - သံသုမာလမ်း - လိုင်စင်ရုံး - ရတနာလမ်း - ကျိုက္ကဆံဘုရား - ကျောက်ကုန်း - မိုးကောင်းလမ်း - ရန်ကင်းလမ်း - ရန်ရှင်းလမ်း - စက်မှုကွေ့ - လမ်းနီ(မြန်မာပလာဇာ) - လှည်းတန်း - ဆင်မလိုက် -ကြည့်မြင်တိုင်ကမ်းနားလမ်း - ညဈေး - သခင်မြပန်းခြံ",
        color: "#F4D159"
    }
]

export default function AvailableLinesView() {
    return (
        <View style={styles.container}>
            <FlatList
                style={styles.listContainer}
                data={DUMMY_ROUTES}
                renderItem={({ item }) => (
                    <RouteCard
                        routeNo={item.no}
                        routeTitle={item.title}
                        routeDescription={item.description}
                        color={item.color}
                        onPress={() => console.log("hello")}
                    />
                )}
                keyExtractor={item => item.title}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    listContainer: {
        flex: 1
    }
})