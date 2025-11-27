import React from "react";
import { ScrollView, StyleSheet, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ThemedView } from "@/scripts/themed-view";
import { ThemedText } from "@/components/themed-text";
import PostCard from "@/components/ui/post-card";
import { useQuery } from "@tanstack/react-query";
import { getPostsByCategory } from "@/services/api";

export default function CategoryScreen() {
  const router = useRouter();

  // Prefer router-provided params (native) then fall back to window search (web).
  const categoryIdFromRouter =
    (router as any)?.params?.categoryId ?? (router as any)?.query?.categoryId;
  const categoryId =
    categoryIdFromRouter ??
    (typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("categoryId") ??
        undefined
      : undefined);

  const { data, isLoading, error } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => getPostsByCategory(categoryId as string, { limit: 24 }),
    enabled: !!categoryId,
  });

  const posts: any[] = Array.isArray(data)
    ? data
    : (data as any)?.posts ?? (data as any)?.data ?? [];

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <ThemedText type="title">{categoryId}</ThemedText>
        </View>
        {error ? (
          <ThemedText type="muted">Failed to load articles</ThemedText>
        ) : null}
        {isLoading && <ThemedText type="muted">Loading...</ThemedText>}
        {posts.map((p: any) => (
          <Pressable key={p.id} onPress={() => router.push(`/article/${p.id}`)}>
            <PostCard
              post={{
                id: p.id,
                title: p.title,
                category: p.category_name ?? categoryId,
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
