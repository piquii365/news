import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  Calendar,
  Eye,
  MessageCircle,
  Heart,
  ChevronRight,
  Grid,
  List,
  Clock,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { getPopularPosts, getAllCategories } from "../api";
import type { PopularPost, Category } from "../types";

type ViewMode = "grid" | "list";
type SortBy = "latest" | "popular" | "trending" | "oldest";

const CategoryArticles: React.FC = () => {
  const { categoryId } = useParams<{ categoryId?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [articles, setArticles] = useState<PopularPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("latest");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 12;

  useEffect(() => {
    loadData();
  }, [categoryId, sortBy]);

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [searchParams]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allArticles, allCategories] = await Promise.all([
        getPopularPosts({ limit: 50 }),
        getAllCategories(),
      ]);

      setCategories(allCategories || []);

      let filtered = allArticles || [];

      // Filter by category if categoryId exists
      if (categoryId && categoryId !== "all") {
        const category = allCategories?.find(
          (cat) =>
            cat.id?.toString() === categoryId ||
            cat.name.toLowerCase() === categoryId.toLowerCase()
        );
        setCurrentCategory(category || null);
        filtered = filtered.filter(
          (article) =>
            article.category_id?.toString() === categoryId ||
            article.category_name?.toLowerCase() === categoryId.toLowerCase()
        );
      } else {
        setCurrentCategory(null);
      }

      // Sort articles
      filtered = sortArticles(filtered, sortBy);

      setArticles(filtered);
      setTotalResults(filtered.length);
    } catch (error) {
      console.error("Failed to load articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortArticles = (articles: PopularPost[], sort: SortBy) => {
    switch (sort) {
      case "latest":
        return [...articles].sort(
          (a, b) =>
            new Date(b.created_at || 0).getTime() -
            new Date(a.created_at || 0).getTime()
        );
      case "oldest":
        return [...articles].sort(
          (a, b) =>
            new Date(a.created_at || 0).getTime() -
            new Date(b.created_at || 0).getTime()
        );
      case "popular":
        return [...articles].sort((a, b) => (b.views || 0) - (a.views || 0));
      case "trending":
        return [...articles].sort(
          (a, b) =>
            (b.likes_count || 0) +
            (b.comments_count || 0) -
            ((a.likes_count || 0) + (a.comments_count || 0))
        );
      default:
        return articles;
    }
  };

  const performSearch = (query: string) => {
    if (!query.trim()) {
      loadData();
      return;
    }

    const searchResults = articles.filter(
      (article) =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.category_name?.toLowerCase().includes(query.toLowerCase()) ||
        article.author_name?.toLowerCase().includes(query.toLowerCase())
    );

    setArticles(searchResults);
    setTotalResults(searchResults.length);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
      performSearch(searchQuery);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchParams({});
    loadData();
  };

  const handleCategoryChange = (catId: string) => {
    navigate(`/category/${catId}`);
  };

  const handleSortChange = (sort: SortBy) => {
    setSortBy(sort);
  };

  // Pagination
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );
  const totalPages = Math.ceil(articles.length / articlesPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading articles...</p>
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
            {currentCategory ? (
              <>
                <button
                  onClick={() => navigate("/category/all")}
                  className="hover:text-red-600"
                >
                  Categories
                </button>
                <ChevronRight size={16} />
                <span className="text-gray-800 font-medium">
                  {currentCategory.name}
                </span>
              </>
            ) : (
              <span className="text-gray-800 font-medium">All Articles</span>
            )}
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {currentCategory ? currentCategory.name : "All Articles"}
          </h1>
          <p className="text-red-100 text-lg">
            {currentCategory?.description ||
              "Explore our latest articles and stories"}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, authors, categories..."
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
              />
              <Search
                className="absolute left-3 top-3.5 text-gray-400"
                size={20}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
            </form>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${
                  viewMode === "grid"
                    ? "bg-red-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${
                  viewMode === "list"
                    ? "bg-red-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <List size={20} />
              </button>
            </div>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <SlidersHorizontal size={20} />
              <span className="font-medium">Filters</span>
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sort By */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value as SortBy)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
                  >
                    <option value="latest">Latest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="popular">Most Viewed</option>
                    <option value="trending">Trending</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={categoryId || "all"}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold">{indexOfFirstArticle + 1}</span> to{" "}
            <span className="font-semibold">
              {Math.min(indexOfLastArticle, totalResults)}
            </span>{" "}
            of <span className="font-semibold">{totalResults}</span> results
            {searchQuery && (
              <span className="ml-2">
                for "<span className="font-semibold">{searchQuery}</span>"
              </span>
            )}
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={16} />
            <span>
              {sortBy === "latest" && "Latest First"}
              {sortBy === "oldest" && "Oldest First"}
              {sortBy === "popular" && "Most Viewed"}
              {sortBy === "trending" && "Trending"}
            </span>
          </div>
        </div>

        {/* Articles Grid/List */}
        {currentArticles.length === 0 ? (
          <div className="text-center py-16">
            <Search size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No Articles Found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
            <button
              onClick={handleClearSearch}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
            >
              Clear Search
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => navigate(`/article/${article.id}`)}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={
                      article.featured_image ||
                      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
                    }
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 text-xs font-bold uppercase rounded">
                    {article.category_name || "General"}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-red-600 transition line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {article.excerpt || "Read more about this article..."}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye size={14} />
                        {article.views?.toLocaleString() || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart size={14} />
                        {article.likes_count || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle size={14} />
                        {article.comments_count || 0}
                      </span>
                    </div>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(
                        article.created_at || Date.now()
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {currentArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => navigate(`/article/${article.id}`)}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer group"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative sm:w-80 h-48 sm:h-auto shrink-0 overflow-hidden">
                    <img
                      src={
                        article.featured_image ||
                        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
                      }
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 text-xs font-bold uppercase rounded">
                      {article.category_name || "General"}
                    </span>
                  </div>
                  <div className="p-5 flex-1">
                    <h3 className="font-bold text-2xl text-gray-800 mb-3 group-hover:text-red-600 transition">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {article.excerpt || "Read more about this article..."}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Eye size={16} />
                          {article.views?.toLocaleString() || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart size={16} />
                          {article.likes_count || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle size={16} />
                          {article.comments_count || 0}
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Calendar size={16} />
                        {new Date(
                          article.created_at || Date.now()
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, idx) => {
              const pageNum = idx + 1;
              // Show first page, last page, current page, and pages around current
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => paginate(pageNum)}
                    className={`px-4 py-2 border rounded-lg ${
                      currentPage === pageNum
                        ? "bg-red-600 text-white border-red-600"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (
                pageNum === currentPage - 2 ||
                pageNum === currentPage + 2
              ) {
                return (
                  <span key={pageNum} className="px-2">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryArticles;
