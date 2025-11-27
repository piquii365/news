import React, { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { getPostsByCategory } from "../api";
import type { Post } from "../types";

const Reviews: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPostsByCategory("reviews", { limit: 10 });
        setPosts(data ?? []);
      } catch (err) {
        console.error("Failed to load review posts:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <h1 className="bg-red-600 text-white px-4 py-2 font-bold text-xl">
            Reviews
          </h1>
          <div className="flex-1 h-px bg-gray-200 ml-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div>Loading...</div>
          ) : (
            posts.map((p) => (
              <article
                key={p.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <div className="relative h-56">
                  <img
                    src={p.featured_image ?? ""}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-black text-white px-2 py-1 text-xs font-bold uppercase">
                    Review
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">
                    {p.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar size={14} />
                      <span>
                        {new Date(
                          p.created_at ?? Date.now()
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-red-600">
                      {p.likes_count ?? 0}/10
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Reviews;
