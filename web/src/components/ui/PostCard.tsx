import React from "react";
import type { Post } from "../../types";

export const PostCard: React.FC<{
  post: Post;
  onOpen?: (slug: string) => void;
}> = ({ post, onOpen }) => {
  return (
    <article className="border rounded-lg p-4 bg-white dark:bg-slate-800">
      <img
        src={post.featured_image}
        alt={post.title}
        className="w-full h-40 object-cover rounded mb-3"
      />
      <h3 className="text-lg font-bold mb-1">{post.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
        {post.excerpt}
      </p>
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">{post.category_name}</div>
        <button
          onClick={() => onOpen?.(post.slug)}
          className="text-indigo-600 hover:underline text-sm"
        >
          Read more
        </button>
      </div>
    </article>
  );
};

export default PostCard;
