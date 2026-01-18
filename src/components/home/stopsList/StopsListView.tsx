// react native
import { Alert, StyleSheet, View } from "react-native";

// react
import { useState } from "react";

// expo router
import { router } from "expo-router";

// custom component
import AppButton from "@/src/components/AppButton";
import NoticeMessage from "@/src/components/home/NoticeMessage";
import StopFilterModal from "@/src/components/home/StopFilterModal";
import SearchInput from "@/src/components/home/stopsList/SearchInput";

// message
import { Message } from "@/src/constants/message";

export default function StopsListView() {
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [selectedStop, setSelectedStop] = useState<any | null>(null);

  const { error : errorMessage } = Message;

  /**
   * Opens the stop filter modal
   */
  const openStopFilterModal = () => {
    setShowFilterModal(true);
  };

  /**
   * Closes the stop filter modal
   */
  const closeStopFilterModal = () => {
    setShowFilterModal(false);
  };

  /**
   * Navigates to the results page that displays a list of search results.
   */
  const searchBusStops = () => {
    const stopId = selectedStop?.id;
    const hasSelectedStop = selectedStop && stopId;
    if(!hasSelectedStop) {
      Alert.alert("Invalid Input", errorMessage.empty_stop_name);
      return;
    }

    router.push({
      pathname: "/stopSearchResults",
      params: {
        stopId: encodeURIComponent(stopId)
      }
    })
  };

  return (
    <>
      <StopFilterModal
        visible={showFilterModal}
        title=""
        onClose={closeStopFilterModal}
        onSelect={(stop) => {
          setSelectedStop(stop);
        }}
      />
      <View style={styles.container}>
        <View>
          <SearchInput
            onPress={openStopFilterModal}
            style={styles.searchInput}
            value={selectedStop?.name_mm ?? selectedStop?.name_en}
            onClear={() => setSelectedStop(null)}
          />
          <NoticeMessage
            style={styles.noticeMessage}
            message="ရှာဖွေရာတွင်အတိုကောက်စာလုံးများကိုအသုံးပြုပြီးရှာဖွေပါ.. ဥပမာ စာတိုက်မှတ်တိုင် ဆိုလျှင် “ စတ “ ၊ ဖြင့်ရှာကာပေါ်လာသောမှတ်တိုင်ကိုရွေးချယ်ပါ။"
          />
          <AppButton title="မှတ်တိုင်ရှာမယ်" onPress={searchBusStops} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative"
  },
  searchInput: {
    marginBottom: 15,
  },
  noticeMessage: {
    marginBottom: 20,
  }
});
