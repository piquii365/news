import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { StyleSheet } from "react-native";

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedView } from "@/scripts/themed-view";
import Footer from "@/components/footer";
import TopNav from "@/components/top-nav";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const queryClient = new QueryClient();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <ThemedView style={styles.wrapper}>
          <TopNav />
          <Slot />
          <Footer />
        </ThemedView>
      </QueryClientProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
});
