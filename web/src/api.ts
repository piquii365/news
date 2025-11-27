import axios from "axios";
import type { AxiosInstance } from "axios";
import type {
  LoginForm,
  RegisterForm,
  User,
  CommentPayload,
  PostPayload,
  FeaturedPost,
  PopularPost,
  Post,
  Category,
  Comment,
  OverviewStatsResponse,
} from "./types";
/**
 * Base url for the API
 */
const BASE_URL = "http://localhost:3500/api";
/**
 * Axios instance with base URL and JSON headers
 */
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
}) as AxiosInstance;

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Handle HTTP errors
      const customError = {
        status: error.response.status,
        message: error.response.data?.message || "Request failed",
        data: error.response.data,
      };
      return Promise.reject(customError);
    }
    return Promise.reject(error);
  }
);
/**
 * Checks if the user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    await apiClient.get("/auth/validate", { withCredentials: true });
    return true;
  } catch {
    return false;
  }
};

/**
 * Performs login
 */
export const login = async (credentials: LoginForm): Promise<void> => {
  try {
    await apiClient.post("/auth/login", credentials, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Performs logout
 */
export const logout = async () => {
  await apiClient.post(
    "/auth/logout",
    {},
    {
      withCredentials: true,
    }
  );
};
/**
 * Gets current user data
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const data = await apiClient.get("/auth/me", { withCredentials: true });
    return data as User;
  } catch {
    return null;
  }
};
/**
 * Registers a new user
 */
export const register = async (formData: RegisterForm): Promise<void> => {
  try {
    await apiClient.post("/auth/register", formData);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Get featured posts
 * @param count optional number of posts to return
 * @returns array of featured posts
 */
export const getFeatured = async (count?: number) => {
  const params = count ? { params: { count } } : undefined;
  const data = await apiClient.get("/featured", params);
  return data as unknown as FeaturedPost[];
};

/**
 * Get posts by category slug
 * @param categorySlug category slug
 * @param options optional query params: limit, offset
 */
export const getPostsByCategory = async (
  categorySlug: string,
  options?: { limit?: number; offset?: number }
) => {
  const data = await apiClient.get(
    `/featured/category/${encodeURIComponent(categorySlug)}`,
    { params: options }
  );
  return data as unknown as Post[];
};

/**
 * Boxed articles
 */
export const getBoxedArticles = async (options?: {
  limit?: number;
  offset?: number;
}) => {
  const data = await apiClient.get(`/boxed`, { params: options });
  return data as unknown as Post[];
};

export const getBoxedArticleById = async (id: string) => {
  const data = await apiClient.get(`/boxed/${encodeURIComponent(id)}`);
  return data as unknown as { article: Post | null; comments: Comment[] };
};

/**
 * Get popular posts
 * @param options optional params: limit, days
 */
export const getPopularPosts = async (options?: {
  limit?: number;
  days?: number;
}) => {
  const data = await apiClient.get("/featured/popular", { params: options });
  return data as unknown as PopularPost[];
};

/**
 * Get a single post by slug
 * @param slug post slug
 */
export const getPostBySlug = async (slug: string) => {
  const data = await apiClient.get(`/posts/${encodeURIComponent(slug)}`);
  return data as unknown as Post;
};

/**
 * Create a new post (requires authentication)
 * @param post Post payload matching server fields
 */
export const createPost = async (post: PostPayload) => {
  const data = await apiClient.post("/posts", post, { withCredentials: true });
  return data as unknown as Post;
};

/**
 * Search posts (optionally within a category)
 * @param query search string
 * @param categorySlug optional category slug
 * @param options optional pagination { limit, offset }
 */
export const searchPosts = async (
  query: string,
  categorySlug?: string,
  options?: { limit?: number; offset?: number }
) => {
  // server exposes search as: GET /search/post/:categorySlug
  const slug = categorySlug ? encodeURIComponent(categorySlug) : "all";
  const url = `/search/post/${slug}`;
  const data = await apiClient.get(url, { params: { query, ...options } });
  return data as unknown as { posts: Post[]; totalCount?: number };
};

/**
 * Get posts by type
 * @param type post type
 * @param options pagination { limit, offset }
 */
export const getPostsByType = async (
  type: string,
  options?: { limit?: number; offset?: number }
) => {
  // server exposes posts-by-type via /featured/type with query param `type`
  const data = await apiClient.get(`/featured/type`, {
    params: { type, ...options },
  });
  return data as unknown as { posts: Post[]; totalCount?: number };
};

/**
 * Memes
 */
export const getMemes = async (options?: {
  limit?: number;
  offset?: number;
}) => {
  const data = await apiClient.get(`/memes`, { params: options });
  return data as unknown as any[]; // memes may have different shape
};

export const getMemeById = async (id: string) => {
  const data = await apiClient.get(`/memes/${encodeURIComponent(id)}`);
  return data as unknown as any;
};

/**
 * Categories
 */
export const getAllCategories = async (): Promise<Category[]> => {
  return await apiClient.get("/categories");
};

/**
 * Get category by slug (query param `slug`)
 * @param slug category slug
 */
export const getCategoryBySlug = async (slug: string) => {
  const data = await apiClient.get("/categories/slug", { params: { slug } });
  return data as unknown as Category[];
};

/**
 * Comments
 */
export const getCommentsByPost = async (postId: string) => {
  const data = await apiClient.get(
    `/comments/post/${encodeURIComponent(postId)}`
  );
  return data as unknown as Comment[];
};

/**
 * Add a comment to a post (requires authentication)
 * @param postId id of the post
 * @param payload comment payload { content }
 * @param parentId optional parent comment id for replies
 */
export const addComment = async (
  postId: string,
  payload: CommentPayload,
  parentId?: string
) => {
  // server route is POST /comments (authenticated). Send postId in body and optional ParentId as query
  const url =
    `/comments` + (parentId ? `?ParentId=${encodeURIComponent(parentId)}` : "");
  const body = { postId, ...payload };
  const data = await apiClient.post(url, body, { withCredentials: true });
  return data as unknown as { message: string; commentId?: string };
};

/**
 * Get overview statistics
 * @param daysBack
 * @returns Promise<OverviewStatsResponse>
 */
export const getOverviewStats = async ({
  daysBack = 20,
}: {
  daysBack?: number;
}): Promise<OverviewStatsResponse> => {
  return await apiClient.get("/overview", {
    withCredentials: true,
    params: { daysBack },
  });
};
