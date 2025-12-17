// react native
import { StyleSheet, View } from "react-native";

// react
import { useState } from "react";

// expo router
import { router } from "expo-router";

// custom component
import AppButton from "@/src/components/AppButton";
import StopFilterModal from "@/src/components/home/StopFilterModal";
import NoticeMessage from "@/src/components/home/stopsList/NoticeMessage";
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
  }

  return (
    <>
      <StopFilterModal 
        visible={showFilterModal}
        title=""
        onClose={closeStopFilterModal}
      />
      <View style={styles.container}>
        <SearchInput onPress={openStopFilterModal} style={styles.searchInput} />
        <NoticeMessage style={styles.noticeMessage} />
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
