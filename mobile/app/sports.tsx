import React from "react";
import { ScrollView, StyleSheet, View, Pressable } from "react-native";
import { ThemedView } from "@/scripts/themed-view";
import { ThemedText } from "@/components/themed-text";
import PostCard from "@/components/ui/post-card";
import { useQuery } from "@tanstack/react-query";
import { getPostsByCategory } from "@/services/api";
import { useRouter } from "expo-router";

export default function SportsScreen() {
  const router = useRouter();
  const { data, isLoading, error } = useQuery({
    queryKey: ["category", "sport"],
    queryFn: () => getPostsByCategory("sport", { limit: 12 }),
  });
  const posts: any[] = Array.isArray(data)
    ? data
    : (data as any)?.posts ?? (data as any)?.data ?? [];

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <ThemedText type="title">Sports</ThemedText>
        </View>
        {error ? (
          <ThemedText type="muted">Failed to load posts</ThemedText>
        ) : null}
        {isLoading && <ThemedText type="muted">Loading...</ThemedText>}
        {posts.map((p: any) => (
          <Pressable key={p.id} onPress={() => router.push(`/article/${p.id}`)}>
            <PostCard
              post={{
                id: p.id,
                title: p.title,
                category: p.category_name ?? "Sports",
                image: p.featured_image,
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
