import React from "react";
import { ScrollView, StyleSheet, View, Image } from "react-native";
import { useRouter } from "expo-router";
import { ThemedView } from "@/scripts/themed-view";
import { ThemedText } from "@/components/themed-text";
import { useQuery } from "@tanstack/react-query";
import { getPostBySlug, getCommentsByPost } from "@/services/api";

export default function ArticleScreen() {
  const router = useRouter();

  // Try a few places for the `id` param: router params (native) or the
  // window location (web). This avoids calling `useSearchParams` which can
  // be missing in non-expo environments and would throw.
  const idFromRouter =
    (router as any)?.params?.id ?? (router as any)?.query?.id;
  const id =
    idFromRouter ??
    (typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("id") ?? undefined
      : undefined);

  const { data: article, isLoading: loadingArticle } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPostBySlug(id as string),
    enabled: !!id,
  });

  const { data: comments, isLoading: loadingComments } = useQuery({
    queryKey: ["comments", id],
    queryFn: () => getCommentsByPost(id as string),
    enabled: !!id,
  });

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {loadingArticle ? (
          <ThemedText>Loading article...</ThemedText>
        ) : !article ? (
          <ThemedText>Article not found</ThemedText>
        ) : (
          <View>
            {(() => {
              const a: any = article as any;
              return (
                <>
                  <ThemedText type="title">{a.title}</ThemedText>
                  {a.featured_image ? (
                    <Image
                      source={{ uri: a.featured_image }}
                      style={styles.image}
                    />
                  ) : null}
                  <ThemedText type="muted">By {a.author_name}</ThemedText>
                  <ThemedText style={{ marginTop: 12 }}>
                    {a.excerpt ?? a.content ?? ""}
                  </ThemedText>

                  <View style={{ marginTop: 20 }}>
                    <ThemedText type="subtitle">Comments</ThemedText>
                    {loadingComments ? (
                      <ThemedText>Loading comments...</ThemedText>
                    ) : (
                      ((comments as any) || []).map((c: any) => (
                        <View key={c.id} style={{ marginTop: 12 }}>
                          <ThemedText style={{ fontWeight: "600" }}>
                            {c.author_name ?? c.author ?? "User"}
                          </ThemedText>
                          <ThemedText type="muted">
                            {c.content ?? c.body}
                          </ThemedText>
                        </View>
                      ))
                    )}
                  </View>
                </>
              );
            })()}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  image: { width: "100%", height: 200, borderRadius: 8, marginTop: 12 },
});
