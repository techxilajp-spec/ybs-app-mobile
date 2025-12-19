// react native
import { StyleSheet, View } from "react-native";

// react
import { useState } from "react";

// expo router
import { router } from "expo-router";

// custom component
import AppButton from "@/src/components/AppButton";
import NoticeMessage from "@/src/components/home/NoticeMessage";
import StopFilterModal from "@/src/components/home/StopFilterModal";
import SearchInput from "@/src/components/home/stopsList/SearchInput";

export default function StopsListView() {
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);

  const openStopFilterModal = () => {
    setShowFilterModal(true);
  };

  const closeStopFilterModal = () => {
    setShowFilterModal(false);
  };

  const searchBusStops = () => {
    router.push("/stopSearchResults");
  };

  return (
    <>
      <StopFilterModal
        visible={showFilterModal}
        title=""
        onClose={closeStopFilterModal}
      />
      <View style={styles.container}>
        <SearchInput onPress={openStopFilterModal} style={styles.searchInput} />
        <NoticeMessage
          style={styles.noticeMessage}
          message="ရှာဖွေရာတွင်အတိုကောက်စာလုံးများက်ိအသုံးပြုပြီးရှာဖွေပါ..ဥပမာ
                  စာတိုက်မှတ်တိုင် ဆိုလျှင် “ စတ “ ၊
                  ဖြင့်ရှာကာပေါ်လာသောမှတ်တိုင်ကိုရွေးချယ်ပါ။"
        />
        <AppButton title="မှတ်တိုင်ရှာမယ်" onPress={searchBusStops} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    marginBottom: 15,
  },
  noticeMessage: {
    marginBottom: 40,
  },
});
