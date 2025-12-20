import { MessageSquare, TrendingUp, Lightbulb, Briefcase, Heart, Code } from "lucide-react";
import { useState } from "react";
import PostDetailModal from "./PostDetailModal";
import { useAuth } from "../contexts/AuthContext";
import AuthModal from "./AuthModal";

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

  const recentPosts = [
    {
      author: "Alex Kumar",
      batch: "Class of 2018",
      title: "Looking for Senior Frontend Developers",
      excerpt: "We're hiring at my company! Looking for experienced React developers...",
      replies: 24,
      likes: 45,
      timeAgo: "2h ago",
    },
    {
      author: "Maya Patel",
      batch: "Class of 2016",
      title: "Transition from Engineering to Product Management?",
      excerpt: "Has anyone made this switch? Would love to hear your experiences...",
      replies: 18,
      likes: 32,
      timeAgo: "5h ago",
    },
    {
      author: "Raj Mehta",
      batch: "Class of 2020",
      title: "Successfully launched my AI startup!",
      excerpt: "After 2 years of hard work, we just launched our product. Thanks to all...",
      replies: 56,
      likes: 128,
      timeAgo: "1d ago",
    },
  ];

  const communityStats = [
    { value: "2.5K+", label: "Active Members" },
    { value: "500+", label: "Discussions" },
    { value: "1.2K+", label: "Posts This Month" },
    { value: "95%", label: "Response Rate" },
  ];

  const [selectedPost, setSelectedPost] = useState<typeof recentPosts[0] | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const handlePostClick = (post: typeof recentPosts[0]) => {
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
    }
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
          <h3 className="text-2xl font-bold text-foreground mb-8">Recent Posts</h3>
          <div className="space-y-4">
            {recentPosts.map((post, index) => (
              <div
                key={index}
                onClick={() => handlePostClick(post)}
                className="glass-card rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                    {post.author.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-lg font-bold text-foreground">{post.author}</h4>
                        <p className="text-amber-400/80 text-xs">{post.batch}</p>
                      </div>
                      <span className="text-foreground/50 text-xs">{post.timeAgo}</span>
                    </div>
                    <h5 className="text-foreground font-semibold mb-2">{post.title}</h5>
                    <p className="text-foreground/60 text-sm mb-4">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-foreground/60 text-sm">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.replies} replies</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{post.likes} likes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
            Start Exploring
          </button>
        </div>
      </div>

      <PostDetailModal 
        isOpen={isPostModalOpen} 
        onClose={() => setIsPostModalOpen(false)}
        post={selectedPost}
      />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </section>
  );
};

export default CommunitySection;
