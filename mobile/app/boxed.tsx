import React from "react";
import { ScrollView, StyleSheet, View, Pressable } from "react-native";
import { ThemedView } from "@/scripts/themed-view";
import { ThemedText } from "@/components/themed-text";
import PostCard from "@/components/ui/post-card";
import { useQuery } from "@tanstack/react-query";
import { getBoxedArticles } from "@/services/api";
import { useRouter } from "expo-router";

export default function BoxedScreen() {
  const router = useRouter();
  const { data, isLoading, error } = useQuery({
    queryKey: ["boxed"],
    queryFn: () => getBoxedArticles({ limit: 12 }),
  });
  const posts: any[] = Array.isArray(data) ? data : (data as any)?.data ?? [];

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <ThemedText type="title">Boxed</ThemedText>
        </View>
        {error ? (
          <ThemedText type="muted">Failed to load boxed articles</ThemedText>
        ) : null}
        {isLoading && <ThemedText type="muted">Loading...</ThemedText>}
        {posts.map((p: any) => (
          <Pressable
            key={p.id ?? p.new_article_id}
            onPress={() => router.push(`/article/${p.id ?? p.new_article_id}`)}
          >
            <PostCard
              post={{
                id: p.id ?? p.new_article_id,
                title: p.title,
                category: p.category_name ?? "Boxed",
                image: p.image_url ?? p.featured_image,
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
