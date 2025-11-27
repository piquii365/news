import React, { useEffect, useState } from "react";
import { MessageCircle, Calendar } from "lucide-react";
import { getMemes } from "../api";

const Memes: React.FC = () => {
  const [memes, setMemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMemes({ limit: 24 });
        setMemes(data ?? []);
      } catch (err) {
        console.error("Failed to load memes:", err);
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
            Memes
          </h1>
          <div className="flex-1 h-px bg-gray-200 ml-4"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {loading ? (
            <div>Loading...</div>
          ) : (
            memes.map((m: any, idx: number) => (
              <div
                key={m.id ?? idx}
                className="bg-white rounded overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <img
                  src={m.image_url ?? m.image ?? ""}
                  alt={m.title ?? "meme"}
                  className="w-full h-40 object-cover"
                />
                <div className="p-3">
                  <h4 className="font-bold text-sm text-gray-800 mb-2">
                    {m.title ?? "Meme"}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar size={12} />
                    <span>
                      {new Date(
                        m.created_at ?? Date.now()
                      ).toLocaleDateString()}
                    </span>
                    <MessageCircle size={12} />
                    <span>{m.comments_count ?? 0}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Memes;
