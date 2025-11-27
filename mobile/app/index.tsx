import React from "react";
import { ScrollView, View, StyleSheet, Image, Pressable } from "react-native";
import { ThemedView } from "@/scripts/themed-view";
import { ThemedText } from "@/components/themed-text";
import PostCard from "@/components/ui/post-card";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts, fetchCategories } from "@/services/api";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  const { data: featuredData } = useQuery({
    queryKey: ["featured", 8],
    queryFn: () => fetchPosts("?limit=8"),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
  });

  const featured = Array.isArray(featuredData)
    ? featuredData
    : (featuredData as any)?.posts ?? (featuredData as any)?.data ?? [];

  const hero = featured[0];
  const small = featured.slice(1, 5);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {hero ? (
          <Pressable
            onPress={() => router.push(`/article/${hero.id}`)}
            style={styles.hero}
          >
            {hero.featured_image ? (
              <Image
                source={{ uri: hero.featured_image }}
                style={styles.heroImage}
              />
            ) : null}
            <View style={styles.heroOverlay} />
            <View style={styles.heroBody}>
              <ThemedText type="subtitle">Featured</ThemedText>
              <ThemedText type="title">{hero.title}</ThemedText>
            </View>
          </Pressable>
        ) : null}

        <View style={styles.gridRow}>
          {small.map((s: any) => (
            <Pressable
              key={s.id}
              onPress={() => router.push(`/article/${s.id}`)}
              style={styles.smallCard}
            >
              {s.featured_image ? (
                <Image
                  source={{ uri: s.featured_image }}
                  style={styles.smallImage}
                />
              ) : null}
              <View style={styles.smallBody}>
                <ThemedText type="defaultSemiBold">
                  {s.category_name ?? ""}
                </ThemedText>
                <ThemedText>{s.title}</ThemedText>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Popular</ThemedText>
        </View>

        <View>
          {(featured || []).map((p: any) => (
            <Pressable
              key={p.id}
              onPress={() => router.push(`/article/${p.id}`)}
            >
              <PostCard
                post={{
                  id: p.id,
                  title: p.title,
                  category: p.category_name ?? p.category,
                  image: p.featured_image,
                }}
              />
            </Pressable>
          ))}
        </View>

        {categories && Array.isArray(categories) ? (
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle">Categories</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoryRow}>
                {categories.map((c: any) => (
                  <Pressable
                    key={c.slug ?? c.id}
                    onPress={() => router.push(`/category/${c.slug ?? c.id}`)}
                    style={styles.categoryPill}
                  >
                    <ThemedText>{c.name}</ThemedText>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        ) : null}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 12, paddingBottom: 60 },
  hero: { height: 260, borderRadius: 12, overflow: "hidden", marginBottom: 12 },
  heroImage: { width: "100%", height: "100%", position: "absolute" },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  heroBody: { position: "absolute", bottom: 16, left: 12, right: 12 },
  gridRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  smallCard: {
    width: "48%",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 8,
  },
  smallImage: { width: "100%", height: 100 },
  smallBody: { padding: 8 },
  sectionHeader: { marginTop: 8, marginBottom: 8 },
  categoryRow: { flexDirection: "row", gap: 8, paddingVertical: 8 },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
});
