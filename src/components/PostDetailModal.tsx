import { X, MessageSquare, Heart, Send, User } from "lucide-react";
import { useState } from "react";

interface Post {
  author: string;
  batch: string;
  title: string;
  excerpt: string;
  replies: number;
  likes: number;
  timeAgo: string;
}

interface PostDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
}

const PostDetailModal = ({ isOpen, onClose, post }: PostDetailModalProps) => {
  const [replyText, setReplyText] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post?.likes || 0);
  const [replies, setReplies] = useState<Array<{ author: string; content: string; time: string }>>([
    { author: "John Doe", content: "Great post! Very helpful.", time: "1h ago" },
    { author: "Jane Smith", content: "I have similar experience. Would love to connect!", time: "2h ago" },
  ]);

  if (!isOpen || !post) return null;

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setReplies([
      ...replies,
      { author: "You", content: replyText, time: "Just now" }
    ]);
    setReplyText("");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative glass-card rounded-2xl p-8 w-full max-w-3xl glow-soft animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full glass-dark flex items-center justify-center hover:bg-white/20 transition-all z-10"
        >
          <X className="w-5 h-5 text-foreground/70" />
        </button>

        {/* Post Header */}
        <div className="mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold flex-shrink-0">
              {post.author.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="text-foreground font-bold">{post.author}</h3>
              <p className="text-foreground/60 text-sm">{post.batch}</p>
              <p className="text-foreground/40 text-xs">{post.timeAgo}</p>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-4">{post.title}</h2>
          <p className="text-foreground/70 leading-relaxed">{post.excerpt}</p>
        </div>

        {/* Engagement Stats */}
        <div className="flex items-center gap-6 py-4 border-y border-white/10 mb-6">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 transition-colors ${
              isLiked ? 'text-red-400' : 'text-foreground/60 hover:text-red-400'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-400' : ''}`} />
            <span className="font-medium">{likes}</span>
          </button>
          <div className="flex items-center gap-2 text-foreground/60">
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">{replies.length}</span>
          </div>
        </div>

        {/* Replies Section */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Replies ({replies.length})</h3>
          <div className="space-y-4 max-h-60 overflow-y-auto">
            {replies.map((reply, index) => (
              <div key={index} className="glass-dark rounded-lg p-4">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {reply.author.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-foreground font-semibold text-sm">{reply.author}</span>
                      <span className="text-foreground/40 text-xs">{reply.time}</span>
                    </div>
                    <p className="text-foreground/70 text-sm">{reply.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reply Form */}
        <form onSubmit={handleReply} className="glass-dark rounded-xl p-4">
          <label className="block text-foreground text-sm font-medium mb-2">
            Add a Reply
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <User className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Share your thoughts..."
                rows={3}
                className="w-full glass-dark rounded-lg pl-11 pr-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50 resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg px-6 py-2 text-sm font-medium text-white hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Post Reply</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostDetailModal;
