import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  User,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  ChevronRight,
  Tag,
} from "lucide-react";
import type { PopularPost } from "../types";
import { getPopularPosts, getPostBySlug, getCommentsByPost } from "../api";

interface Article {
  id: string;
  title: string;
  content?: string;
  excerpt?: string;
  featured_image?: string;
  category_name?: string;
  category_id?: string;
  author_name?: string;
  author_avatar?: string;
  created_at?: string;
  views?: number;
  likes_count?: number;
  comments_count?: number;
  tags?: string[];
}

interface Comment {
  id?: string;
  author?: string;
  avatar?: string;
  content?: string;
  body?: string;
  created_at?: string;
  replies?: Comment[];
}

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<PopularPost[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      setLoading(true);
      try {
        // Load real article from API (server exposes /posts/:slug)
        if (id) {
          try {
            const fetched = await getPostBySlug(id);
            setArticle(fetched ?? null);

            // Load related posts
            const related = await getPopularPosts({ limit: 3 });
            setRelatedPosts(related || []);

            // Load comments for this post (server: GET /comments/post/:postId)
            try {
              const fetchedComments = await getCommentsByPost(id);
              setComments(fetchedComments || []);
            } catch (cErr) {
              console.warn("Failed to load comments:", cErr);
              setComments([]);
            }
          } catch (err) {
            console.error("Failed to fetch post:", err);
            setArticle(null);
          }
        }
      } catch (error) {
        console.error("Failed to load article:", error);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [id]);

  const handleLike = () => {
    setLiked(!liked);
    // Add API call to like/unlike
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: "Current User",
      content: newComment,
      created_at: new Date().toISOString(),
    };

    setComments([comment, ...comments]);
    setNewComment("");
  };

  const shareArticle = (platform: "facebook" | "twitter" | "linkedin") => {
    const url = window.location.href;
    const title = article?.title || "";

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
    };

    window.open(shareUrls[platform], "_blank", "width=600,height=400");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Article Not Found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="text-red-600 hover:text-red-700 font-semibold"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button
              onClick={() => navigate("/")}
              className="hover:text-red-600"
            >
              Home
            </button>
            <ChevronRight size={16} />
            <button
              onClick={() => navigate(`/category/${article.category_id}`)}
              className="hover:text-red-600"
            >
              {article.category_name}
            </button>
            <ChevronRight size={16} />
            <span className="text-gray-800 font-medium truncate">
              {article.title}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Article Header */}
              <div className="p-8">
                <span className="inline-block bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase rounded mb-4">
                  {article.category_name}
                </span>
                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {article.title}
                </h1>

                {/* Author & Meta */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        article.author_avatar ||
                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                      }
                      alt={article.author_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {article.author_name}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(article.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={14} />
                          {article.views.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Social Share */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => shareArticle("facebook")}
                      className="p-2 hover:bg-blue-50 rounded-full transition"
                      title="Share on Facebook"
                    >
                      <Facebook size={20} className="text-blue-600" />
                    </button>
                    <button
                      onClick={() => shareArticle("twitter")}
                      className="p-2 hover:bg-blue-50 rounded-full transition"
                      title="Share on Twitter"
                    >
                      <Twitter size={20} className="text-blue-400" />
                    </button>
                    <button
                      onClick={() => shareArticle("linkedin")}
                      className="p-2 hover:bg-blue-50 rounded-full transition"
                      title="Share on LinkedIn"
                    >
                      <Linkedin size={20} className="text-blue-700" />
                    </button>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(window.location.href)
                      }
                      className="p-2 hover:bg-gray-100 rounded-full transition"
                      title="Copy link"
                    >
                      <LinkIcon size={20} className="text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Featured Image */}
                <img
                  src={article.featured_image}
                  alt={article.title}
                  className="w-full h-96 object-cover rounded-lg mb-8"
                />

                {/* Article Content */}
                <div
                  className="prose prose-lg max-w-none article-content"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag size={18} className="text-gray-500" />
                      {article.tags.map((tag, idx) => (
                        <button
                          key={idx}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Like & Comment Stats */}
                <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
                        liked
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <Heart size={20} fill={liked ? "currentColor" : "none"} />
                      <span className="font-semibold">
                        {article.likes_count}
                      </span>
                    </button>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MessageCircle size={20} />
                      <span className="font-semibold">
                        {article.comments_count} Comments
                      </span>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition">
                    <Share2 size={18} />
                    <span className="font-semibold">Share</span>
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              <div className="bg-gray-50 p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Comments ({comments.length})
                </h3>

                {/* Comment Form */}
                <form onSubmit={handleSubmitComment} className="mb-8">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write your comment..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600 resize-none"
                    rows={4}
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                    >
                      Post Comment
                    </button>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id}>
                      <div className="flex gap-4">
                        <img
                          src={
                            comment.avatar ||
                            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
                          }
                          alt={comment.author}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="bg-white rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-semibold text-gray-900">
                                {comment.author}
                              </p>
                              <span className="text-xs text-gray-500">
                                {new Date(
                                  comment.created_at
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-700">{comment.content}</p>
                          </div>
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="ml-8 mt-4 space-y-4">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="flex gap-4">
                                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                                  <div className="flex-1 bg-white rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <p className="font-semibold text-gray-900">
                                        {reply.author}
                                      </p>
                                      <span className="text-xs text-gray-500">
                                        {new Date(
                                          reply.created_at
                                        ).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <p className="text-gray-700">
                                      {reply.content}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Related Posts */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Related Articles
              </h3>
              <div className="space-y-4">
                {relatedPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => navigate(`/article/${post.id}`)}
                    className="flex gap-3 cursor-pointer group"
                  >
                    <img
                      src={
                        post.featured_image ||
                        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=80&fit=crop"
                      }
                      alt={post.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-gray-800 group-hover:text-red-600 transition line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ad Space */}
            <div className="bg-gray-200 rounded-lg p-8 text-center mb-6">
              <p className="text-gray-600 font-semibold">Advertisement</p>
              <p className="text-sm text-gray-500 mt-2">300 x 250</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .article-content h2 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #1f2937;
        }
        .article-content p {
          margin-bottom: 1.25rem;
          line-height: 1.8;
          color: #374151;
        }
        .article-content ul, .article-content ol {
          margin-bottom: 1.25rem;
          padding-left: 1.5rem;
        }
        .article-content li {
          margin-bottom: 0.5rem;
          line-height: 1.8;
        }
        .article-content blockquote {
          border-left: 4px solid #dc2626;
          padding-left: 1.5rem;
          margin: 2rem 0;
          font-style: italic;
          color: #4b5563;
          background: #f9fafb;
          padding: 1.5rem;
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default ArticleDetail;
