import client from "./client";

// fetchPosts kept for backward compatibility with existing screens.
// It will call the server's `/featured` endpoint and honor a `limit` query param.
export async function fetchPosts(params = "") {
  const raw = params.replace(/^\?/, "");
  const sp = new URLSearchParams(raw);
  const limit = sp.get("limit") ?? undefined;

  const res = await client.get("/featured", {
    params: limit ? { count: Number(limit) } : undefined,
  });
  // client interceptor returns response.data; ensure array returned
  return Array.isArray(res) ? res : res?.posts ?? res?.data ?? res;
}

export async function fetchCategories() {
  return await client.get("/categories");
}

export async function getPostBySlug(slug: string) {
  return await client.get(`/posts/${encodeURIComponent(slug)}`);
}

export async function getPostsByCategory(
  categorySlug: string,
  opts?: { limit?: number; offset?: number }
) {
  return await client.get(
    `/featured/category/${encodeURIComponent(categorySlug)}`,
    { params: opts }
  );
}

export async function getCommentsByPost(postId: string) {
  return await client.get(`/comments/post/${encodeURIComponent(postId)}`);
}

export async function getBoxedArticles(opts?: {
  limit?: number;
  offset?: number;
}) {
  return await client.get(`/boxed`, { params: opts });
}

export async function getMemes(opts?: { limit?: number; offset?: number }) {
  return await client.get(`/memes`, { params: opts });
}

export default {
  fetchPosts,
  fetchCategories,
  getPostBySlug,
  getPostsByCategory,
  getCommentsByPost,
  getBoxedArticles,
  getMemes,
};
