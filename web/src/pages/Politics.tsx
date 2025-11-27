import React from "react";
import { Calendar, MessageCircle } from "lucide-react";

const Politics: React.FC = () => {
  const posts = [
    {
      category: "Politics",
      image:
        "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=800&h=500&fit=crop",
      title: "Election Coverage: Key Moments",
    },
    {
      category: "Politics",
      image:
        "https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&h=500&fit=crop",
      title: "Policy Changes and What They Mean",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <h1 className="bg-red-600 text-white px-4 py-2 font-bold text-xl">
            Politics
          </h1>
          <div className="flex-1 h-px bg-gray-200 ml-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((p, i) => (
            <article
              key={i}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <div className="relative h-56">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-black text-white px-2 py-1 text-xs font-bold uppercase">
                  {p.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-800 mb-2">
                  {p.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>2 days ago</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={14} />
                    <span>7</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Politics;
