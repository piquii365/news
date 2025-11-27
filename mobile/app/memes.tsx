import React from "react";
import { ScrollView, StyleSheet, View, Pressable } from "react-native";
import { ThemedView } from "@/scripts/themed-view";
import { ThemedText } from "@/components/themed-text";
import PostCard from "@/components/ui/post-card";
import { useQuery } from "@tanstack/react-query";
import { getMemes } from "@/services/api";
import { useRouter } from "expo-router";

export default function MemesScreen() {
  const router = useRouter();
  const { data, isLoading, error } = useQuery({
    queryKey: ["memes"],
    queryFn: () => getMemes({ limit: 24 }),
  });
  const memes: any[] = Array.isArray(data) ? data : (data as any)?.data ?? [];

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <ThemedText type="title">Memes</ThemedText>
        </View>
        {error ? (
          <ThemedText type="muted">Failed to load memes</ThemedText>
        ) : null}
        {isLoading && <ThemedText type="muted">Loading...</ThemedText>}
        {memes.map((p: any) => (
          <Pressable
            key={p.id ?? p._id}
            onPress={() => router.push(`/article/${p.id ?? p._id}`)}
          >
            <PostCard
              post={{
                id: p.id ?? p._id,
                title: p.title ?? p.name,
                category: "Memes",
                image: p.image_url ?? p.image,
              }}
            />
          </Pressable>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  headerRow: { marginBottom: 12 },
});
