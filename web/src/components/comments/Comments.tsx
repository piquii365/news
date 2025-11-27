import React, { useEffect, useState } from "react";
import { getCommentsByPost, addComment } from "../../api";
import type { Comment as CommentType, CommentPayload } from "../../types";

const CommentItem: React.FC<{ comment: CommentType }> = ({ comment }) => {
  return (
    <div className="border-b py-3">
      <div className="text-sm font-semibold">
        {comment.author_name || "User"}
      </div>
      <div className="text-sm text-gray-700 dark:text-gray-300">
        {comment.body}
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="pl-4 mt-2">
          {comment.replies.map((r) => (
            <CommentItem key={r.id} comment={r} />
          ))}
        </div>
      )}
    </div>
  );
};

const Comments: React.FC<{ postId: string }> = ({ postId }) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getCommentsByPost(postId);
      setComments(data || []);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [postId]);

  const handleAdd = async () => {
    setError(null);
    if (!content.trim()) return;
    const payload: CommentPayload = { content };
    try {
      await addComment(postId, payload);
      setContent("");
      await load();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to add comment");
    }
  };

  return (
    <section className="mt-6">
      <h4 className="text-lg font-semibold mb-3">Comments</h4>
      {loading && <div>Loading comments...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="space-y-3">
        {comments.map((c) => (
          <CommentItem key={c.id} comment={c} />
        ))}
      </div>

      <div className="mt-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
          placeholder="Add a comment"
        />
        <div className="flex items-center justify-end mt-2">
          <button
            onClick={handleAdd}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Post Comment
          </button>
        </div>
      </div>
    </section>
  );
};

export default Comments;
