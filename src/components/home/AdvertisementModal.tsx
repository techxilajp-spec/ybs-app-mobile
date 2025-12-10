import { ImageBackground, Modal, Pressable, StyleSheet } from "react-native";

import { useEffect, useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

// custom components
import AppText from "@/src/components/AppText";

type AdvertisementModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function AdvertisementModal({
  visible,
  onClose,
}: AdvertisementModalProps) {
  const [skipCounter, setSkipCounter] = useState<number>(5);

  useEffect(() => {
    if (!visible) return;
    setSkipCounter(5);
    const interval = setInterval(() => {
      setSkipCounter((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [visible]);

  useEffect(() => {
    if (skipCounter <= 0) {
      onClose();
    }
  }, [skipCounter]);

  const closeModal = () => {
    if (skipCounter > 0) return;
    onClose();
  };
  return (
    <Modal
      visible={visible}
      backdropColor="#FFF"
      style={styles.container}
      statusBarTranslucent={true}
    >
      <ImageBackground
        style={styles.backgroundContainer}
        resizeMode="cover"
        source={require("@/assets/images/advertisement.png")}
      >
        <SafeAreaView style={styles.safeContainer}>
          <Pressable style={styles.skipButton} onPress={closeModal}>
            <AppText size={16} style={styles.skipText}>
              Skip {skipCounter > 0 ? skipCounter : ""}
            </AppText>
          </Pressable>
        </SafeAreaView>
      </ImageBackground>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
	safeContainer: {
		flex: 1,
		position: "relative"
	},
  backgroundContainer: {
    flex: 1,
  },
  skipButton: {
    backgroundColor: "#00000033",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 30,

    position: "absolute",
    right: 20,
    top: 35,
  },
  skipText: {
    color: "#FFF",
  },
});
