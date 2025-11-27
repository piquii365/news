import React, { useEffect, useState } from "react";
import {
  Calendar,
  MessageCircle,
  Facebook,
  Youtube,
  Twitter,
  Instagram,
  Send,
} from "lucide-react";
import { getFeatured, getPopularPosts, getAllCategories } from "../api";
import type { FeaturedPost, PopularPost, Category } from "../types";

const Home: React.FC = () => {
  const [featured, setFeatured] = useState<FeaturedPost[]>([]);
  const [popular, setPopular] = useState<PopularPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [f, p, c] = await Promise.all([
          getFeatured(6),
          getPopularPosts({ limit: 6 }),
          getAllCategories(),
        ]);
        setFeatured(f ?? []);
        setPopular(p ?? []);
        setCategories(c ?? []);
      } catch (err) {
        console.error("Failed to load home data:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Featured Posts */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Large Featured Post */}
          <div className="relative h-96 rounded-lg overflow-hidden group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1522556189639-b150ed9c4330?w=800&h=600&fit=crop"
              alt="Featured"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <span className="bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase rounded">
                Featured
              </span>
              <h2 className="text-3xl font-bold mt-3 mb-2">
                Google To Post Android Security In Four Days
              </h2>
              <div className="flex items-center gap-4 text-sm opacity-90">
                <span>by Rian</span>
                <span>12 Mar - 2022</span>
              </div>
            </div>
          </div>

          {/* Smaller Featured Posts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Sport Post */}
            <div className="relative h-44 rounded-lg overflow-hidden group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=300&fit=crop"
                alt="Sport"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <span className="bg-green-600 text-white px-2 py-1 text-xs font-bold uppercase rounded">
                  Sport
                </span>
                <h3 className="text-sm font-bold mt-2">
                  More Messi pics on football fans attend Brazil world cup
                </h3>
                <p className="text-xs opacity-90 mt-1">by Alex</p>
              </div>
            </div>

            {/* Fashion Post */}
            <div className="relative h-44 rounded-lg overflow-hidden group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop"
                alt="Fashion"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <span className="bg-purple-600 text-white px-2 py-1 text-xs font-bold uppercase rounded">
                  Fashion
                </span>
                <h3 className="text-sm font-bold mt-2">
                  No escaping Axel Next High-Speed cameras
                </h3>
                <p className="text-xs opacity-90 mt-1">
                  by Irina | 22 Mar - 2022
                </p>
              </div>
            </div>

            {/* Technology Post */}
            <div className="relative h-44 rounded-lg overflow-hidden group cursor-pointer sm:col-span-2">
              <img
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=300&fit=crop"
                alt="Technology"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <span className="bg-orange-600 text-white px-2 py-1 text-xs font-bold uppercase rounded">
                  Technology
                </span>
                <h3 className="text-lg font-bold mt-2">
                  Emma Watson stands up for Turkish women
                </h3>
                <p className="text-xs opacity-90 mt-1">
                  by Sunil | 08 Dec 2022
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Popular Posts Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <h2 className="bg-red-600 text-white px-4 py-2 font-bold">
                Popular
              </h2>
              <div className="flex-1 h-px bg-gray-200 ml-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {popular.map((post, idx) => (
                <div
                  key={post.id ?? idx}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
                >
                  <div className="relative h-48">
                    <img
                      src={
                        post.featured_image ??
                        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
                      }
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-black text-white px-2 py-1 text-xs font-bold uppercase">
                      {post.category_name ?? "General"}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 mb-2 hover:text-red-600 transition">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>
                          {new Date(
                            post.created_at ?? Date.now()
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle size={14} />
                        <span>{post.comments_count ?? 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Popular Posts Large Cards */}
            <div className="mt-8">
              <div className="flex items-center mb-6">
                <h2 className="bg-red-600 text-white px-4 py-2 font-bold">
                  Popular Posts
                </h2>
                <div className="flex-1 h-px bg-gray-200 ml-4"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer">
                  <div className="relative h-56">
                    <img
                      src="https://images.unsplash.com/photo-1551524164-687a55dd1126?w=600&h=400&fit=crop"
                      alt="Cave"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-black text-white px-2 py-1 text-xs font-bold uppercase">
                      World
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-800 mb-3">
                      We Went Deep Underground For This Amazin...
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>19. February 2022</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer">
                  <div className="relative h-56">
                    <img
                      src="https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&h=400&fit=crop"
                      alt="Breakfast"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-black text-white px-2 py-1 text-xs font-bold uppercase">
                      Health
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-800 mb-3">
                      6 Reasons Why You Shouldn't Skip Breakfa...
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>19. February 2022</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Life Style Section */}
            <div className="mt-8">
              <div className="flex items-center mb-6">
                <h2 className="bg-red-600 text-white px-4 py-2 font-bold">
                  Life Style
                </h2>
                <div className="flex-1 h-px bg-gray-200 ml-4"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    category: "World",
                    image:
                      "https://images.unsplash.com/photo-1553688738-a278b9f063e0?w=400&h=300&fit=crop",
                    title: "Mustang Teases With A New Promo...",
                  },
                  {
                    category: "Sport",
                    image:
                      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=300&fit=crop",
                    title: "Surfs Up – Places For Killer Waves...",
                  },
                  {
                    category: "Fashion",
                    image:
                      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
                    title: "Learn How To Nail Your Favorite Look...",
                  },
                ].map((post, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
                  >
                    <div className="relative h-40">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 bg-black text-white px-2 py-1 text-xs font-bold uppercase">
                        {post.category}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-sm text-gray-800 mb-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar size={12} />
                        <span>19. February 2022</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Music News Section */}
            <div className="mt-8">
              <div className="flex items-center mb-6">
                <h2 className="bg-red-600 text-white px-4 py-2 font-bold">
                  Music News
                </h2>
                <div className="flex-1 h-px bg-gray-200 ml-4"></div>
              </div>

              <div className="space-y-6">
                {[
                  {
                    category: "Fun",
                    image:
                      "https://images.unsplash.com/photo-1502139214982-d0ad755818d8?w=400&h=300&fit=crop",
                    title: "Natural Sunlight Boosts Your Immunity...",
                    excerpt:
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis theme natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aliquam lorem ante, eleifend in, viverra quis, feugiat...",
                  },
                  {
                    category: "Fun",
                    image:
                      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
                    title: "Vote For The Top Tracks Of The Month...",
                    excerpt:
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis theme natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aliquam lorem ante, eleifend in, viverra quis, feugiat...",
                  },
                ].map((post, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative sm:w-64 h-48 sm:h-auto shrink-0">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 left-3 bg-black text-white px-2 py-1 text-xs font-bold uppercase">
                          {post.category}
                        </span>
                      </div>
                      <div className="p-5 flex-1">
                        <h3 className="font-bold text-xl text-gray-800 mb-3">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>19. February 2022</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed mb-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <button className="flex items-center gap-1 hover:text-red-600 transition">
                            <MessageCircle size={14} />
                            <span>Share</span>
                          </button>
                          <button className="flex items-center gap-1 hover:text-red-600 transition">
                            <MessageCircle size={14} />
                            <span>0</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <h2 className="bg-black text-white px-4 py-2 font-bold">
                Stay Connected
              </h2>
              <div className="flex-1 h-px bg-gray-200 ml-4"></div>
            </div>

            {/* Social Media Stats */}
            <div className="space-y-3 mb-8">
              <div className="bg-blue-700 text-white p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-blue-800 transition">
                <div className="flex items-center gap-3">
                  <Facebook size={24} />
                  <span className="font-bold">12,740 Likes</span>
                </div>
              </div>
              <div className="bg-red-600 text-white p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-red-700 transition">
                <div className="flex items-center gap-3">
                  <Youtube size={24} />
                  <span className="font-bold">5,600 Fans</span>
                </div>
              </div>
              <div className="bg-blue-400 text-white p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-blue-500 transition">
                <div className="flex items-center gap-3">
                  <Twitter size={24} />
                  <span className="font-bold">8,700 Followers</span>
                </div>
              </div>
              <div className="bg-purple-600 text-white p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-purple-700 transition">
                <div className="flex items-center gap-3">
                  <Instagram size={24} />
                  <span className="font-bold">22,700 Followers</span>
                </div>
              </div>
              <div className="bg-red-600 text-white p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-red-700 transition">
                <div className="flex items-center gap-3">
                  <Youtube size={24} />
                  <span className="font-bold">2,700 Subscriber</span>
                </div>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <div className="flex items-center mb-4">
                <h2 className="bg-black text-white px-4 py-2 font-bold text-sm">
                  Subscribe
                </h2>
              </div>
              <h3 className="font-bold text-lg mb-4">
                Subscribe to our New Stories
              </h3>
              <input
                type="email"
                placeholder="Email Address..."
                className="w-full px-4 py-3 border border-gray-300 rounded mb-3 focus:outline-none focus:border-red-600"
              />
              <button className="w-full bg-red-600 text-white py-3 rounded font-bold hover:bg-red-700 transition flex items-center justify-center gap-2">
                <Send size={18} />
                SUBMIT
              </button>
            </div>

            {/* Discussion Ad Banner */}
            <div className="bg-black text-white rounded-lg overflow-hidden mb-8">
              <img
                src="https://images.unsplash.com/photo-1529245856630-f4853233d2ea?w=400&h=300&fit=crop"
                alt="Discussion"
                className="w-full h-48 object-cover"
              />
              <div className="p-6 text-center">
                <h3 className="text-3xl font-bold mb-2">DISCUSSION</h3>
                <p className="text-sm text-gray-400">Advertise here</p>
              </div>
            </div>

            {/* Tiktok Posts */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <h2 className="bg-black text-white px-4 py-2 font-bold text-sm">
                  Tiktok post
                </h2>
              </div>
              <div className="space-y-4">
                {[
                  {
                    title: "US Promises to give Intel aid to lo...",
                    time: "a year ago",
                  },
                  {
                    title: "Renewable energy dead as industry w...",
                    time: "a year ago",
                  },
                  {
                    title: "Mount Etna erupts fashion in nice I...",
                    time: "a year ago",
                  },
                ].map((post, idx) => (
                  <div key={idx} className="flex gap-3 cursor-pointer group">
                    <img
                      src={`https://images.unsplash.com/photo-${
                        1500000000000 + idx
                      }?w=80&h=60&fit=crop`}
                      alt={post.title}
                      className="w-16 h-16 object-cover rounded shrink-0"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-gray-800 group-hover:text-red-600 transition mb-1">
                        {post.title}
                      </h4>
                      <p className="text-xs text-gray-500">{post.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <div className="flex items-center mb-4">
                <h2 className="bg-black text-white px-4 py-2 font-bold text-sm">
                  Categories
                </h2>
              </div>
              <div className="space-y-2">
                {(categories || []).map((cat) => (
                  <button
                    key={cat.id}
                    className="w-full bg-black text-white py-3 px-4 text-left hover:bg-red-600 transition rounded"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Gallery */}
            <div className="mt-8">
              <div className="flex items-center mb-4">
                <h2 className="bg-black text-white px-4 py-2 font-bold text-sm">
                  Gallery
                </h2>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1554080353-a576cf803bda?w=400&h=300&fit=crop"
                  alt="Gallery"
                  className="w-full h-48 object-cover rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Discover Section */}
      <section className="bg-white py-8 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <h2 className="bg-red-600 text-white px-4 py-2 font-bold">
              Discover
            </h2>
            <div className="flex-1 h-px bg-gray-200 ml-4"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {
                name: "GAMES",
                image:
                  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=200&fit=crop",
              },
              {
                name: "SPORTS",
                image:
                  "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&h=200&fit=crop",
              },
              {
                name: "HUMOUR",
                image:
                  "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=200&fit=crop",
              },
              {
                name: "GADGETS",
                image:
                  "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=300&h=200&fit=crop",
              },
              {
                name: "MOVIES",
                image:
                  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=200&fit=crop",
              },
              {
                name: "NINTENDO",
                image:
                  "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=200&fit=crop",
              },
            ].map((item) => (
              <div
                key={item.name}
                className="relative h-32 rounded-lg overflow-hidden cursor-pointer group"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {item.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
