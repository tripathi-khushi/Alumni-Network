import { X, MessageSquare, Heart, Send, User, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../lib/api";

interface Post {
  _id: string;
  author: {
    _id: string;
    name: string;
    batch?: string;
  };
  title: string;
  content: string;
  category: string;
  likes: string[];
  replies: Array<{
    _id: string;
    author: {
      _id: string;
      name: string;
      batch?: string;
    };
    content: string;
    createdAt: string;
  }>;
  createdAt: string;
}

interface PostDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  onPostUpdate?: (post: Post) => void;
  onPostDelete?: (postId: string) => void;
}

const PostDetailModal = ({ isOpen, onClose, post, onPostUpdate, onPostDelete }: PostDetailModalProps) => {
  const [replyText, setReplyText] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [localPost, setLocalPost] = useState<Post | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (post) {
      setLocalPost(post);
      setLikes(post.likes.length);
      setIsLiked(user ? post.likes.includes(user.id) : false);
    }
  }, [post, user]);

  if (!isOpen || !post || !localPost) return null;

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const handleLike = async () => {
    try {
      const response = await api.post(`/posts/${post._id}/like`);
      setIsLiked(response.data.liked);
      setLikes(response.data.likes);
      
      // Update parent component
      if (onPostUpdate) {
        const updatedPost = { ...localPost, likes: [...(response.data.liked ? [...localPost.likes, user!.id] : localPost.likes.filter((id: string) => id !== user!.id))] };
        setLocalPost(updatedPost);
        onPostUpdate(updatedPost);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const response = await api.post(`/posts/${post._id}/reply`, { content: replyText });
      
      // Update local state with new reply
      setLocalPost(response.data);
      setReplyText("");
      
      // Update parent component
      if (onPostUpdate) {
        onPostUpdate(response.data);
      }
    } catch (error) {
      console.error('Error posting reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      await api.delete(`/posts/${post._id}`);
      
      // Notify parent component
      if (onPostDelete) {
        onPostDelete(post._id);
      }
      
      // Close modal
      onClose();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Check if current user is the post author
  const isAuthor = user && localPost && localPost.author._id === user.id;

  // Debug logging - remove after testing
  if (localPost) {
    console.log('Auth check:', {
      hasUser: !!user,
      authorId: localPost.author._id,
      userId: user?.id,
      isAuthor
    });
  }

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

        {/* Delete Button (only for author) */}
        {isAuthor && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="absolute top-4 right-16 w-8 h-8 rounded-full glass-dark flex items-center justify-center hover:bg-red-500/20 transition-all z-10 group"
            title="Delete post"
          >
            <Trash2 className="w-4 h-4 text-foreground/70 group-hover:text-red-400" />
          </button>
        )}

        {/* Post Header */}
        <div className="mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold flex-shrink-0">
              {localPost.author.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="text-foreground font-bold">{localPost.author.name}</h3>
              <p className="text-foreground/60 text-sm">{localPost.author.batch || 'Alumni'}</p>
              <p className="text-foreground/40 text-xs">{getTimeAgo(localPost.createdAt)}</p>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-4">{localPost.title}</h2>
          <p className="text-foreground/70 leading-relaxed whitespace-pre-wrap">{localPost.content}</p>
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
            <span className="font-medium">{localPost.replies.length}</span>
          </div>
        </div>

        {/* Replies Section */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Replies ({localPost.replies.length})</h3>
          {localPost.replies.length === 0 ? (
            <p className="text-foreground/40 text-center py-8">No replies yet. Be the first to reply!</p>
          ) : (
            <div className="space-y-4 max-h-60 overflow-y-auto">
              {localPost.replies.map((reply) => (
                <div key={reply._id} className="glass-dark rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {reply.author.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-foreground font-semibold text-sm">{reply.author.name}</span>
                        <span className="text-foreground/40 text-xs">{getTimeAgo(reply.createdAt)}</span>
                      </div>
                      <p className="text-foreground/70 text-sm whitespace-pre-wrap">{reply.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
              disabled={!replyText.trim() || isSubmitting}
              className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg px-6 py-2 text-sm font-medium text-white hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Posting...' : 'Post Reply'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostDetailModal;
