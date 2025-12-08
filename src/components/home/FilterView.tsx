import { StyleSheet, View } from "react-native";

// constants

// custom component
import AppText from "@/src/components/AppText";
import AccordionList from "@/src/components/filterPanel/AccordionList";
import Header from "@/src/components/filterPanel/Header";
import SearchInput from "@/src/components/filterPanel/SearchInput";

export const yangonAreasBurmese = [
  {
    title: "မြောက်ရန်ကုန်",
    options: [
      { id: "1", name: "လှိုင်" },
      { id: "2", name: "မာရုံကုန်း" },
      { id: "3", name: "ကမာရွတ်" },
      { id: "4", name: "ဗဟန်း" },
    ],
  },
  {
    title: "တောင်ရန်ကုန်",
    options: [
      { id: "5", name: "ဒလ" },
      { id: "6", name: "သတကတယ်" },
      { id: "7", name: "မင်္ဂလာဒုံ" },
      { id: "8", name: "လှိုင်သာယာ" },
    ],
  },
  {
    title: "အရှေ့ရန်ကုန်",
    options: [
      { id: "9", name: "သင်္ကန်းရွာ" },
      { id: "10", name: "တောင်ဥက္ကလာပ" },
      { id: "11", name: "မြောက်ဥက္ကလာပ" },
      { id: "12", name: "ရန်ကင်း" },
    ],
  },
  {
    title: "အနောက်ရန်ကုန်",
    options: [
      { id: "13", name: "စမ်းချောင်း" },
      { id: "14", name: "အလုံ" },
      { id: "15", name: "ကျောက်တံတား" },
      { id: "16", name: "ပုဗ္ဒန်" },
    ],
  },
  {
    title: "ဗဟိုရန်ကုန်",
    options: [
      { id: "17", name: "လသာ" },
      { id: "18", name: "လမ်းမတော်" },
      { id: "19", name: "ဘိုးတတောင်" },
      { id: "20", name: "ကျောက်တံတား" },
    ],
  },
];

type FilterViewProps = {
  onClose: () => void;
};

export default function FilterView({ onClose }: FilterViewProps) {
  return (
    <View style={styles.container}>
      <Header onBack={onClose} />
      <SearchInput style={styles.searchInput} />
      <View style={{flex: 1}}>
        <AppText size={16} style={styles.title}>
          မြို့နယ်များ
        </AppText>
        <AccordionList list={yangonAreasBurmese} style={styles.accorionList} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    marginTop: 10,
    marginBottom: 25,
  },
  title: {
    fontFamily: "MiSansMyanmar-Semibold",
  },
  accorionList: {
    marginTop: 22
  }
});
