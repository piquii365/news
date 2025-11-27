import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { COLORS, SIZES } from "@/constants/theme";

type Post = {
  id: string;
  title: string;
  category?: string;
  image?: string;
};

export default function PostCard({ post }: { post: Post }) {
  return (
    <View style={styles.card}>
      {post.image ? (
        <Image source={{ uri: post.image }} style={styles.image} />
      ) : null}
      <View style={styles.body}>
        <Text style={styles.category}>{post.category}</Text>
        <ThemedText type="heading" style={styles.title}>
          {post.title}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    overflow: "hidden",
    marginBottom: SIZES.spacing / 1.25,
    elevation: 1,
  },
  image: { width: "100%", height: 180 },
  body: { padding: 12 },
  category: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: COLORS.text,
    color: COLORS.card,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  title: { marginTop: 8, color: COLORS.text },
});
