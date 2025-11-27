import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/scripts/themed-view";

export default function Footer() {
  return (
    <ThemedView style={styles.footer}>
      <View style={styles.inner}>
        <ThemedText type="muted">
          © {new Date().getFullYear()} Mike App
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  inner: {
    alignItems: "center",
    justifyContent: "center",
  },
});
