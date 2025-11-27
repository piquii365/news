import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Users,
  FileText,
  Award,
} from "lucide-react";
import { getOverviewStats } from "../api";
import type { OverviewStatsResponse } from "../types";
const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
];

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [keyMetrics, setKeyMetrics] = useState<OverviewStatsResponse | null>(
    null
  );
  const [daysBack, setDaysBack] = useState(30);
  setLoading(true);
  useEffect(() => {
    const fetchOverviewStats = async () => {
      try {
        const stats = await getOverviewStats({ daysBack });
        setKeyMetrics(stats);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOverviewStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // derive safe locals from the API response shape
  const overview = keyMetrics?.overviewStats ?? {
    total_posts: 0,
    recent_posts: 0,
    total_views: 0,
    avg_views_per_post: null,
    total_likes: 0,
    total_comments: 0,
    avg_engagement_rate: null,
    most_popular_category: null,
  };

  const recentPerformance = keyMetrics?.timePeriods ?? [];
  const topPosts = keyMetrics?.topPosts ?? [];
  const categoryPerformance = keyMetrics?.categoryPerformance ?? [];
  const authorPerformance = keyMetrics?.authorPerformance ?? [];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Comprehensive overview of your content performance
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            icon={<FileText className="w-6 h-6" />}
            label="Total Posts"
            value={overview.total_posts}
            subtext={`${overview.recent_posts} recent`}
            color="bg-blue-500"
          />
          <MetricCard
            icon={<Eye className="w-6 h-6" />}
            label="Total Views"
            value={Number(overview.total_views).toLocaleString()}
            subtext={`${overview?.avg_views_per_post ?? "0.0"} avg/post`}
            color="bg-purple-500"
          />
          <MetricCard
            icon={<Heart className="w-6 h-6" />}
            label="Total Likes"
            value={Number(overview.total_likes).toLocaleString()}
            subtext={`${overview.avg_engagement_rate ?? 0}% engagement`}
            color="bg-pink-500"
          />
          <MetricCard
            icon={<MessageCircle className="w-6 h-6" />}
            label="Total Comments"
            value={Number(overview.total_comments).toLocaleString()}
            subtext={overview.most_popular_category || "N/A"}
            color="bg-green-500"
          />
        </div>

        {/* Recent Performance */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Recent Performance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentPerformance.map((period, idx) => (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4"
              >
                <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  {period.period}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <Stat label="Posts" value={period.post_count} />
                  <Stat
                    label="Views"
                    value={Number(period.total_views).toLocaleString()}
                  />
                  <Stat
                    label="Likes"
                    value={Number(period.total_likes).toLocaleString()}
                  />
                  <Stat label="Comments" value={period.total_comments} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Posts Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            Top Performing Posts
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
                    Title
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
                    Category
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
                    Views
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
                    Engagement
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {topPosts?.slice(0, 5).map((post, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {post.title}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        by {post.author_name}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                        {post.category_name}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-900 dark:text-white">
                      {Number(post.views).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        {post.engagement_rate}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${post.performance_score}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-slate-900 dark:text-white w-8">
                          {post.performance_score}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Performance */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Category Performance
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="category_name"
                  stroke="#64748b"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#64748b" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar
                  dataKey="total_views"
                  fill="#6366f1"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Engagement Distribution */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Engagement Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryPerformance}
                  dataKey="total_likes"
                  nameKey="category_name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {categoryPerformance.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Author Performance */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Top Authors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {authorPerformance.map((author, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-700/30 rounded-xl p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                    {author.author_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {author.author_name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {author.post_count} posts
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      Total Views
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {Number(author.total_views).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      Avg. Engagement
                    </span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {author.avg_engagement_rate ?? 0}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

type MetricCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  color?: string;
};

const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  label,
  value,
  subtext,
  color,
}) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-1">
          {label}
        </p>
        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
          {value}
        </p>
        <p className="text-slate-500 dark:text-slate-400 text-xs">{subtext}</p>
      </div>
      <div className={`${color} p-3 rounded-xl text-white`}>{icon}</div>
    </div>
  </div>
);

type StatProps = {
  label: string;
  value: string | number | null | undefined;
};

const Stat: React.FC<StatProps> = ({ label, value }) => (
  <div>
    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</p>
    <p className="text-lg font-semibold text-slate-900 dark:text-white">
      {value}
    </p>
  </div>
);

export default AdminDashboard;
