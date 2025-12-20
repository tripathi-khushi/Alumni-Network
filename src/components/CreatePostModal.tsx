import { X, FileText, Tag } from "lucide-react";
import { useState } from "react";
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

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: Post) => void;
}

const CreatePostModal = ({ isOpen, onClose, onPostCreated }: CreatePostModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "General",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    "General",
    "Career Opportunities",
    "Tech Talk",
    "Startup Ideas",
    "Alumni Stories",
    "Networking",
    "Events",
    "Mentorship",
  ];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      
      const response = await api.post('/posts', formData);
      onPostCreated(response.data);
      
      // Reset form
      setFormData({ title: "", content: "", category: "General" });
      onClose();
    } catch (err: unknown) {
      console.error('Error creating post:', err);
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || "Failed to create post");
      } else {
        setError("Failed to create post. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative glass-card rounded-2xl p-8 w-full max-w-2xl glow-soft animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full glass-dark flex items-center justify-center hover:bg-white/20 transition-all z-10"
        >
          <X className="w-5 h-5 text-foreground/70" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-2">Create New Post</h2>
          <p className="text-foreground/60">Share your thoughts with the alumni community</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 glass-dark rounded-lg border border-red-500/30">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category */}
          <div>
            <label className="block text-foreground text-sm font-medium mb-2">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-400" />
                <span>Category</span>
              </div>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full glass-dark rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-foreground text-sm font-medium mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Title</span>
              </div>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter an engaging title..."
              className="w-full glass-dark rounded-lg px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              maxLength={200}
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-foreground text-sm font-medium mb-2">
              Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Share your story, ask a question, or start a discussion..."
              rows={8}
              className="w-full glass-dark rounded-lg px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50 resize-none"
            />
            <p className="text-foreground/40 text-xs mt-2">
              {formData.content.length} characters
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="glass-dark rounded-lg px-6 py-3 text-foreground font-medium hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
              className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg px-6 py-3 text-white font-medium hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
