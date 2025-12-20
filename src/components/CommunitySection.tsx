import { MessageSquare, TrendingUp, Lightbulb, Briefcase, Heart, Code, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import PostDetailModal from "./PostDetailModal";
import CreatePostModal from "./CreatePostModal";
import { useAuth } from "../contexts/AuthContext";
import AuthModal from "./AuthModal";
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

const CommunitySection = () => {
  const discussions = [
    {
      icon: Briefcase,
      title: "Career Opportunities",
      posts: 156,
      members: 450,
      lastActive: "2 hours ago",
      trending: true,
    },
    {
      icon: Code,
      title: "Tech Talk",
      posts: 243,
      members: 380,
      lastActive: "30 mins ago",
      trending: true,
    },
    {
      icon: Lightbulb,
      title: "Startup Ideas",
      posts: 89,
      members: 220,
      lastActive: "1 hour ago",
      trending: false,
    },
    {
      icon: Heart,
      title: "Alumni Stories",
      posts: 124,
      members: 560,
      lastActive: "4 hours ago",
      trending: false,
    },
  ];

  const communityStats = [
    { value: "2.5K+", label: "Active Members" },
    { value: "500+", label: "Discussions" },
    { value: "1.2K+", label: "Posts This Month" },
    { value: "95%", label: "Response Rate" },
  ];

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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

  const handlePostClick = (post: Post) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    } else {
      setSelectedPost(post);
      setIsPostModalOpen(true);
    }
  };

  const handleExploreClick = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    } else {
      setIsCreateModalOpen(true);
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
    setIsCreateModalOpen(false);
  };

  const handlePostUpdated = (updatedPost: Post) => {
    setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
    setSelectedPost(updatedPost);
  };

  const handlePostDeleted = (postId: string) => {
    setPosts(posts.filter(p => p._id !== postId));
    setIsPostModalOpen(false);
  };

  return (
    <section className="relative z-10 py-24 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block glass-card rounded-full px-6 py-2 mb-4">
            <span className="text-amber-400 text-sm font-semibold">Community Hub</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Connect. Share. Grow Together.
          </h2>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
            Join vibrant discussions, share opportunities, and engage with a community of alumni who support each other's growth.
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {communityStats.map((stat, index) => (
            <div
              key={index}
              className="glass-card rounded-xl p-6 text-center hover:scale-105 transition-transform"
            >
              <div className="text-3xl font-bold text-amber-400 mb-1">{stat.value}</div>
              <div className="text-foreground/60 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Discussion Forums */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-8">Popular Forums</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {discussions.map((forum, index) => {
              const Icon = forum.icon;
              return (
                <div
                  key={index}
                  className="glass-card rounded-2xl p-6 hover:scale-105 transition-all duration-300 glow-soft group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    {forum.trending && (
                      <div className="flex items-center gap-1 glass-light rounded-full px-3 py-1">
                        <TrendingUp className="w-3 h-3 text-amber-400" />
                        <span className="text-amber-400 text-xs font-semibold">Trending</span>
                      </div>
                    )}
                  </div>
                  <h4 className="text-xl font-bold text-foreground mb-2 group-hover:text-amber-400 transition-colors">
                    {forum.title}
                  </h4>
                  <div className="flex items-center gap-4 text-foreground/60 text-sm mb-3">
                    <span>{forum.posts} posts</span>
                    <span>•</span>
                    <span>{forum.members} members</span>
                  </div>
                  <p className="text-foreground/50 text-xs">Last active: {forum.lastActive}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Posts */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-foreground">Recent Posts</h3>
            {isAuthenticated && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full px-6 py-2 text-sm font-medium text-white hover:scale-105 transition-all shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Create Post</span>
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-foreground/60">No posts yet. Be the first to share!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.slice(0, 6).map((post) => (
                <div
                  key={post._id}
                  onClick={() => handlePostClick(post)}
                  className="glass-card rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                      {post.author.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-lg font-bold text-foreground">{post.author.name}</h4>
                          <p className="text-amber-400/80 text-xs">{post.author.batch || 'Alumni'}</p>
                        </div>
                        <span className="text-foreground/50 text-xs">{getTimeAgo(post.createdAt)}</span>
                      </div>
                      <h5 className="text-foreground font-semibold mb-2">{post.title}</h5>
                      <p className="text-foreground/60 text-sm mb-4 line-clamp-2">{post.content}</p>
                      <div className="flex items-center gap-4 text-foreground/60 text-sm">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{post.replies.length} replies</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{post.likes.length} likes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="glass-card rounded-3xl p-12 text-center glow-soft">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Join the Conversation
          </h3>
          <p className="text-foreground/60 mb-6 max-w-2xl mx-auto">
            Share your experiences, ask questions, and connect with alumni who share your interests and goals.
          </p>
          <button 
            onClick={handleExploreClick}
            className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-full px-8 py-4 text-base font-medium text-white hover:scale-105 transition-all shadow-lg"
          >
            {isAuthenticated ? 'Create Your First Post' : 'Start Exploring'}
          </button>
        </div>
      </div>

      <PostDetailModal 
        isOpen={isPostModalOpen} 
        onClose={() => setIsPostModalOpen(false)}
        post={selectedPost}
        onPostUpdate={handlePostUpdated}
        onPostDelete={handlePostDeleted}
      />
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </section>
  );
};

export default CommunitySection;
