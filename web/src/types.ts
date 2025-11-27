export type LoginForm = {
  user: string;
  password: string;
};

export type RegisterForm = {
  email: string;
  password: string;
  fullName: string;
  username: string;
  confirmPassword: string;
};

export type User = {
  user_id: string;
  full_name: string;
  email: string;
  role: string;
  auth_account_id: number;
  provider_name: string;
  username: string;
  session_id: string;
  ip_address: string;
  user_agent: string;
  session_created_at: string;
  last_activity: string;
  session_is_active: number;
};

export interface AuthContextType {
  user: User | null;
  isAuthenticated: () => Promise<boolean>;
  isLoading: boolean;
  isGuest: boolean;
  login: (credentials: LoginForm) => Promise<void>;
  register: (userData: RegisterForm) => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
  clearGuestMode: () => void;
}
/**
 * Types for posts and comments used by the client API
 */
export type PostPayload = {
  author_id: string;
  category_id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  status?: string;
};

export type CommentPayload = {
  content: string;
};

// Base interfaces
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// Post interfaces
export interface Post extends BaseEntity {
  author_id: string;
  category_id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  featured_image?: string;
  status: "draft" | "published" | "archived";
  views: number;
  author_name?: string;
  author_email?: string;
  category_slug?: string;
  category_name?: string;
  likes_count?: number;
  comments_count?: number;
}

export interface PostWithStats extends Post {
  likes_count: number;
  comments_count: number;
  author_name: string;
  category_name: string;
  category_slug: string;
}

export interface FeaturedPost extends PostWithStats {
  is_featured?: boolean;
}

export interface PopularPost extends PostWithStats {
  relevance?: number;
}

// Comment interfaces
export interface Comment extends BaseEntity {
  post_id: string;
  author_id: string;
  parent_id: string | null;
  body: string;
  author_name?: string;
  level?: number;
  path?: string;
  replies?: Comment[];
}

export interface CommentTree extends Comment {
  level: number;
  path: string;
  replies: Comment[];
}

// Like interfaces
export interface PostLike extends BaseEntity {
  post_id: string;
  user_id: string;
}

export interface LikeStatus {
  is_liked: boolean;
}

// Search interfaces
export interface SearchResult extends PostWithStats {
  relevance: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total_count: number;
  has_more: boolean;
}

// API Response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface LikeResponse {
  message: string;
}

export interface KeyMetricsSummary {
  total_posts: number;
  recent_posts: number;
  total_views: number;
  avg_views_per_post: number | null; // AVG() can return null
  total_likes: number;
  total_comments: number;
  avg_engagement_rate: number | null;
  most_popular_category: string | null;
}

export interface RecentPerformance {
  period: string; // "Last 7 Days", "Last 30 Days", "Last X Days"
  post_count: number;
  total_views: number;
  total_likes: number;
  total_comments: number;
}

export interface TopPostOverview {
  title: string;
  category_name: string;
  author_name: string;
  views: number;
  likes_count: number;
  comments_count: number;
  engagement_rate: number;
  performance_score: number;
  created_at: string; // or Date, depending on your driver
}

export interface CategoryPerformance {
  category_name: string;
  post_count: number;
  total_views: number;
  total_likes: number;
  total_comments: number;
  avg_views_per_post: number | null;
  overall_engagement_rate: number;
}

export interface AuthorPerformance {
  author_name: string;
  post_count: number;
  total_views: number;
  total_likes: number;
  total_comments: number;
  avg_views_per_post: number | null;
  avg_engagement_rate: number | null;
}

export interface OverviewStatsResponse {
  overviewStats: KeyMetricsSummary;
  timePeriods: RecentPerformance[];
  topPosts: TopPostOverview[];
  categoryPerformance: CategoryPerformance[];
  authorPerformance: AuthorPerformance[];
}
export interface Category {
  id: number;
  slug: string;
  name: string;
  description?: string;
}
