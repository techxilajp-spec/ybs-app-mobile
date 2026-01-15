// react native
import { StyleSheet, View } from "react-native";

// react
import { useState } from "react";

// expo router
import { router } from "expo-router";

// custom component
import AppButton from "@/src/components/AppButton";
import AppSlider from "@/src/components/AppSlider";
import NoticeMessage from "@/src/components/home/NoticeMessage";
import StopFilterModal from "@/src/components/home/StopFilterModal";
import SearchInput from "@/src/components/home/stopsList/SearchInput";

// data
import { useGetAds } from "@/src/hooks/ads";

// utils
import { getPublicUrl } from "@/src/utils/supabase";

// constants
import { AD_HEIGHT } from "@/src/constants/ad";

export default function StopsListView() {
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [selectedStop, setSelectedStop] = useState<any | null>(null);
  const [availableHeight, setAvailableHeight] = useState<number>(0);
  const [usedHeight, setUsedHeight] = useState<number>(0);

  // calculate dynamic height for ad slider
  const remainingHeight = availableHeight - usedHeight;
  const dynamicAdHeight = Math.min(
    AD_HEIGHT.max,
    Math.max(AD_HEIGHT.min, remainingHeight - AD_HEIGHT.buffer)
  );

  // fetch ads
  const { data: adsData } = useGetAds();
  const ads = adsData?.map((ad) => {
    const firstImage = ad.ads_images?.[0];
    const adImageUrl = firstImage?.image_url
      ? getPublicUrl(firstImage.image_url)
      : "";

    return {
      id: ad.id,
      image: adImageUrl,
    };
  });

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
    if (stopId) {
      router.push(`/stopSearchResults?stopId=${encodeURIComponent(stopId)}`);
      return;
    }

    // fallback: go to search results without specific stop
    router.push("/stopSearchResults");
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
      <View
        style={styles.container}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          setAvailableHeight(height);
        }}
      >
        <View
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setUsedHeight(height);
          }}
        >
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
        <AppSlider
          data={ads ?? []}
          autoPlay
          interval={2000}
          style={{
            width: "100%",
            height: dynamicAdHeight,
            position: "absolute",
            bottom: 20,
            marginTop: 40
          }}
        />
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
