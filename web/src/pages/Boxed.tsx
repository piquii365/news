import React, { useEffect, useState } from "react";
import { Calendar, MessageCircle } from "lucide-react";
import { getBoxedArticles } from "../api";
import type { Post } from "../types";

const Boxed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getBoxedArticles({ limit: 12 });
        setPosts((data as Post[]) ?? []);
      } catch (err) {
        console.error("Failed to load boxed articles:", err);
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
            Boxed
          </h1>
          <div className="flex-1 h-px bg-gray-200 ml-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div>Loading...</div>
          ) : (
            posts.map((p) => (
              <article
                key={p.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <div className="relative h-48">
                  <img
                    src={(p as any).image_url ?? p.featured_image ?? ""}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-black text-white px-2 py-1 text-xs font-bold uppercase">
                    {p.category_name ?? "Boxed"}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-2 hover:text-red-600 transition">
                    {p.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>
                        {new Date(
                          p.created_at ?? Date.now()
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle size={14} />
                      <span>{(p as any).comments_count ?? 0}</span>
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

export default Boxed;
