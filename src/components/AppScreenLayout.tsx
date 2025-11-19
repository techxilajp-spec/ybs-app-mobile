import React from "react";
import {
  StyleSheet,
  ViewStyle
} from "react-native";

import { StatusBar } from 'expo-status-bar';

import { SafeAreaView } from "react-native-safe-area-context";

type AppScreenLayoutProps = {
  children: React.ReactNode;
  backgroundColor?: string; // optional background color
  contentStyle?: ViewStyle; // optional custom style for SafeAreaView
};

export default function AppScreenLayout({
  children,
  backgroundColor = "#FFFFFF",
  contentStyle
}: AppScreenLayoutProps) {
  return (
    <>
      <StatusBar translucent={true} />
      <SafeAreaView
        style={[styles.container, { backgroundColor }, contentStyle]}
      >
        {children}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
