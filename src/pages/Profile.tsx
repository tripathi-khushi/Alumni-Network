import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CreatePostModal from "../components/CreatePostModal";
import MentorshipChat from "../components/MentorshipChat";
import { User, Mail, Briefcase, Calendar, MapPin, Edit2, Check, X, MessageSquare, Users, Award, Clock, CheckCircle, XCircle, AlertCircle, Trash2, RefreshCw, ExternalLink, ArrowRight } from "lucide-react";
import api from "../lib/api";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  batch?: string;
  company?: string;
  position?: string;
  bio?: string;
  expertise?: string[];
  isMentorAvailable?: boolean;
  mentorCapacity?: number;
  activeMentees?: number;
}

interface UserStats {
  posts: number;
  events: number;
  mentorships: number;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  likes: string[];
  replies: unknown[];
}

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
}

interface Mentorship {
  _id: string;
  mentorId: {
    _id: string;
    name: string;
    email: string;
    company?: string;
    position?: string;
  };
  menteeId: {
    _id: string;
    name: string;
    email: string;
    company?: string;
    position?: string;
  };
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  goals: string;
  message: string;
  createdAt: string;
  acceptedAt?: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats>({ posts: 0, events: 0, mentorships: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [mentorships, setMentorships] = useState<Mentorship[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedMentorship, setSelectedMentorship] = useState<Mentorship | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    batch: "",
    company: "",
    position: "",
    bio: "",
    isMentorAvailable: false,
    mentorCapacity: 5,
  });

  useEffect(() => {
    console.log('Profile: Loading data...');
    
    // Fetch profile
    const loadProfile = async () => {
      try {
        const response = await api.get('/users/me/profile');
        console.log('Profile response:', response.data);
        setProfile(response.data);
        setEditForm({
          name: response.data.name || "",
          email: response.data.email || "",
          batch: response.data.batch || "",
          company: response.data.company || "",
          position: response.data.position || "",
          bio: response.data.bio || "",
          isMentorAvailable: response.data.isMentorAvailable || false,
          mentorCapacity: response.data.mentorCapacity || 5,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch stats
    const loadStats = async () => {
      try {
        const response = await api.get('/users/me/stats');
        console.log('Stats response:', response.data);
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    // Fetch recent activity
    const loadActivity = async () => {
      try {
        console.log('Fetching recent activity...');
        const [postsRes, eventsRes, mentorshipsRes] = await Promise.all([
          api.get('/users/me/posts'),
          api.get('/users/me/events'),
          api.get('/users/me/mentorships'),
        ]);
        
        console.log('Posts:', postsRes.data);
        console.log('Events:', eventsRes.data);
        console.log('Mentorships:', mentorshipsRes.data);
        
        setRecentPosts(postsRes.data.slice(0, 5));
        setRegisteredEvents(eventsRes.data.filter((event: Event) => new Date(event.date) >= new Date()).slice(0, 5));
        setMentorships(mentorshipsRes.data.filter((m: Mentorship) => m.status === 'pending' || m.status === 'accepted'));
      } catch (error) {
        console.error('Error fetching recent activity:', error);
      } finally {
        setActivityLoading(false);
      }
    };

    loadProfile();
    loadStats();
    loadActivity();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/me/profile');
      console.log('Profile response:', response.data);
      setProfile(response.data);
      setEditForm({
        name: response.data.name || "",
        email: response.data.email || "",
        batch: response.data.batch || "",
        company: response.data.company || "",
        position: response.data.position || "",
        bio: response.data.bio || "",
        isMentorAvailable: response.data.isMentorAvailable || false,
        mentorCapacity: response.data.mentorCapacity || 5,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/users/me/stats');
      console.log('Stats response:', response.data);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      console.log('Fetching recent activity...');
      const [postsRes, eventsRes, mentorshipsRes] = await Promise.all([
        api.get('/users/me/posts'),
        api.get('/users/me/events'),
        api.get('/users/me/mentorships'),
      ]);
      
      console.log('Posts:', postsRes.data);
      console.log('Events:', eventsRes.data);
      console.log('Mentorships:', mentorshipsRes.data);
      
      setRecentPosts(postsRes.data.slice(0, 5));
      setRegisteredEvents(eventsRes.data.filter((event: Event) => new Date(event.date) >= new Date()).slice(0, 5));
      setMentorships(mentorshipsRes.data.filter((m: Mentorship) => m.status === 'pending' || m.status === 'accepted'));
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await api.put('/users/me/profile', editForm);
      setProfile(response.data);
      setIsEditing(false);
      // Refresh activity in case mentor status changed
      fetchRecentActivity();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditForm({
        name: profile.name || "",
        email: profile.email || "",
        batch: profile.batch || "",
        company: profile.company || "",
        position: profile.position || "",
        bio: profile.bio || "",
        isMentorAvailable: profile.isMentorAvailable || false,
        mentorCapacity: profile.mentorCapacity || 5,
      });
    }
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { icon: Clock, color: 'text-yellow-400 bg-yellow-500/20', label: 'Pending' },
      accepted: { icon: CheckCircle, color: 'text-green-400 bg-green-500/20', label: 'Active' },
      rejected: { icon: XCircle, color: 'text-red-400 bg-red-500/20', label: 'Rejected' },
      completed: { icon: CheckCircle, color: 'text-blue-400 bg-blue-500/20', label: 'Completed' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const handleRefreshAll = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchProfile(),
      fetchStats(),
      fetchRecentActivity()
    ]);
    setRefreshing(false);
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    setDeletingPostId(postId);
    try {
      await api.delete(`/posts/${postId}`);
      await fetchRecentActivity();
      await fetchStats();
      alert('Post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    } finally {
      setDeletingPostId(null);
    }
  };

  const handleAcceptMentorship = async (mentorshipId: string) => {
    try {
      await api.put(`/mentorship/${mentorshipId}/status`, { status: 'accepted' });
      await fetchRecentActivity();
      await fetchStats();
      alert('Mentorship request accepted! 🎉');
    } catch (error) {
      console.error('Error accepting mentorship:', error);
      alert('Failed to accept mentorship request');
    }
  };

  const handleRejectMentorship = async (mentorshipId: string) => {
    const reason = prompt('Please provide a reason for rejection (optional):');
    try {
      await api.put(`/mentorship/${mentorshipId}/status`, { 
        status: 'rejected',
        rejectionReason: reason || 'No reason provided'
      });
      await fetchRecentActivity();
      await fetchStats();
      alert('Mentorship request rejected');
    } catch (error) {
      console.error('Error rejecting mentorship:', error);
      alert('Failed to reject mentorship request');
    }
  };

  const handlePostCreated = () => {
    setShowCreatePost(false);
    fetchRecentActivity();
    fetchStats();
  };

  const handleOpenChat = (mentorship: Mentorship) => {
    setSelectedMentorship(mentorship);
    setChatOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mb-4"></div>
        <p className="text-foreground/60">Loading profile...</p>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden vignette"
      style={{
        background: `linear-gradient(135deg, hsl(20 30% 8%) 0%, hsl(25 25% 12%) 40%, hsl(20 28% 10%) 100%)`,
      }}
    >
      <Navbar />

      <div className="pt-24 pb-12 px-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="glass-card rounded-3xl p-8 mb-8 glow-soft">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-3xl font-bold">
                  {profile?.name.charAt(0)}
                </div>
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="text-3xl font-bold text-foreground bg-transparent border-b-2 border-amber-400 focus:outline-none mb-2"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-foreground mb-2">{profile?.name}</h1>
                  )}
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="text-foreground/60 bg-transparent border-b border-amber-400/50 focus:outline-none"
                    />
                  ) : (
                    <p className="text-foreground/60 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {profile?.email}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="glass-light rounded-lg px-4 py-2 text-green-400 hover:bg-green-500/20 transition-all flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="glass-light rounded-lg px-4 py-2 text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="glass-light rounded-lg px-4 py-2 text-amber-400 hover:bg-white/20 transition-all flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 text-foreground/70">
                <Briefcase className="w-5 h-5 text-amber-400" />
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.company}
                    onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                    placeholder="Company"
                    className="bg-transparent border-b border-amber-400/50 focus:outline-none flex-1"
                  />
                ) : (
                  <span>{profile?.company || "No company"}</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-foreground/70">
                <User className="w-5 h-5 text-amber-400" />
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.position}
                    onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                    placeholder="Position"
                    className="bg-transparent border-b border-amber-400/50 focus:outline-none flex-1"
                  />
                ) : (
                  <span>{profile?.position || "No position"}</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-foreground/70">
                <Calendar className="w-5 h-5 text-amber-400" />
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.batch}
                    onChange={(e) => setEditForm({ ...editForm, batch: e.target.value })}
                    placeholder="Batch (e.g., Class of 2020)"
                    className="bg-transparent border-b border-amber-400/50 focus:outline-none flex-1"
                  />
                ) : (
                  <span>{profile?.batch || "No batch"}</span>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="mb-6">
              <h3 className="text-foreground font-semibold mb-2">Bio</h3>
              {isEditing ? (
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  className="w-full glass-dark rounded-lg p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                />
              ) : (
                <p className="text-foreground/60">{profile?.bio || "No bio yet"}</p>
              )}
            </div>

            {/* Mentor Toggle */}
            <div className="glass-dark rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-foreground font-semibold mb-1">Mentor Availability</h4>
                  <p className="text-foreground/60 text-sm">Allow others to request mentorship from you</p>
                </div>
                {isEditing ? (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.isMentorAvailable}
                      onChange={(e) => setEditForm({ ...editForm, isMentorAvailable: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-amber-400 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                ) : (
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${profile?.isMentorAvailable ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                    {profile?.isMentorAvailable ? 'Available' : 'Not Available'}
                  </span>
                )}
              </div>
              {isEditing && editForm.isMentorAvailable && (
                <div className="mt-4">
                  <label className="text-foreground/60 text-sm">Mentee Capacity</label>
                  <input
                    type="number"
                    value={editForm.mentorCapacity}
                    onChange={(e) => setEditForm({ ...editForm, mentorCapacity: parseInt(e.target.value) })}
                    min="1"
                    max="20"
                    className="w-full mt-1 glass-dark rounded-lg p-2 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards with Refresh */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">Your Activity</h2>
            <button
              onClick={handleRefreshAll}
              disabled={refreshing}
              className="glass-light rounded-lg px-4 py-2 text-amber-400 hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card rounded-2xl p-6 hover:scale-105 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-foreground">{stats.posts}</div>
                  <div className="text-foreground/60 text-sm">Posts</div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 hover:scale-105 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-foreground">{stats.events}</div>
                  <div className="text-foreground/60 text-sm">Events</div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 hover:scale-105 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-foreground">{stats.mentorships}</div>
                  <div className="text-foreground/60 text-sm">Mentorships</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => setShowCreatePost(true)}
                className="glass-light rounded-lg p-4 hover:scale-105 transition-all group"
              >
                <MessageSquare className="w-8 h-8 text-amber-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-foreground text-sm block">Create Post</span>
              </button>
              
              <button
                onClick={() => navigate('/events')}
                className="glass-light rounded-lg p-4 hover:scale-105 transition-all group"
              >
                <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-foreground text-sm block">Browse Events</span>
              </button>
              
              <button
                onClick={() => navigate('/mentorship')}
                className="glass-light rounded-lg p-4 hover:scale-105 transition-all group"
              >
                <Users className="w-8 h-8 text-green-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-foreground text-sm block">Find Mentor</span>
              </button>
              
              <button
                onClick={() => navigate('/members')}
                className="glass-light rounded-lg p-4 hover:scale-105 transition-all group"
              >
                <User className="w-8 h-8 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-foreground text-sm block">View Alumni</span>
              </button>
            </div>
          </div>

          {/* Recent Activity Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Posts */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-400" />
                Recent Posts
              </h2>
              {activityLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
                </div>
              ) : recentPosts.length > 0 ? (
                <div className="space-y-3">
                  {recentPosts.map((post) => (
                    <div key={post._id} className="glass-dark rounded-lg p-4 hover:bg-white/10 transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-foreground font-semibold line-clamp-1 flex-1">{post.title}</h3>
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          disabled={deletingPostId === post._id}
                          className="text-red-400 hover:text-red-300 transition-colors ml-2"
                          title="Delete post"
                        >
                          {deletingPostId === post._id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-foreground/60 text-sm mb-2 line-clamp-2">{post.content}</p>
                      <div className="flex items-center justify-between text-xs text-foreground/50">
                        <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded">{post.category}</span>
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-foreground/50">
                        <span>❤️ {post.likes.length} likes</span>
                        <span>💬 {post.replies.length} replies</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-foreground/40">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>No posts yet</p>
                  <p className="text-sm mt-1">Share your thoughts with the community!</p>
                </div>
              )}
              {recentPosts.length > 0 && (
                <button
                  onClick={() => navigate('/')}
                  className="w-full mt-4 text-center text-amber-400 hover:text-amber-300 text-sm py-2 glass-light rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  View All Posts
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Upcoming Events */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Upcoming Events
              </h2>
              {activityLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                </div>
              ) : registeredEvents.length > 0 ? (
                <div className="space-y-3">
                  {registeredEvents.map((event) => (
                    <div key={event._id} className="glass-dark rounded-lg p-4 hover:bg-white/10 transition-all">
                      <h3 className="text-foreground font-semibold mb-1">{event.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-foreground/60 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(event.date)}</span>
                        <span>•</span>
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-foreground/60">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                      <span className="inline-block mt-2 px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                        {event.category}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-foreground/40">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>No upcoming events</p>
                  <p className="text-sm mt-1">Register for events to stay connected!</p>
                </div>
              )}
              <button
                onClick={() => navigate('/events')}
                className="w-full mt-4 text-center text-blue-400 hover:text-blue-300 text-sm py-2 glass-light rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {registeredEvents.length > 0 ? 'View All Events' : 'Browse Events'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mentorship Section */}
          <div className="glass-card rounded-2xl p-6 mt-6">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-green-400" />
              {profile?.isMentorAvailable ? 'Mentorship Sessions' : 'My Mentorship Requests'}
            </h2>
            {activityLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
              </div>
            ) : mentorships.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mentorships.map((mentorship) => {
                  // Check if mentorship data is valid
                  if (!mentorship.mentorId || !mentorship.menteeId) {
                    return null;
                  }
                  
                  const isMentor = mentorship.mentorId._id === authUser?.id;
                  const otherPerson = isMentor ? mentorship.menteeId : mentorship.mentorId;
                  
                  // Additional safety check
                  if (!otherPerson || !otherPerson.name) {
                    return null;
                  }
                  
                  return (
                    <div key={mentorship._id} className="glass-dark rounded-lg p-4 hover:bg-white/10 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">
                            {otherPerson.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-foreground font-semibold">{otherPerson.name}</h3>
                            <p className="text-foreground/50 text-xs">
                              {isMentor ? 'Mentee' : 'Mentor'}
                              {!isMentor && otherPerson.company && ` at ${otherPerson.company}`}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(mentorship.status)}
                      </div>
                      <div className="text-sm text-foreground/70 mb-2">
                        <p className="font-medium text-foreground/90 mb-1">Goals:</p>
                        <p className="line-clamp-2">{mentorship.goals}</p>
                      </div>
                      <div className="text-xs text-foreground/50 flex items-center justify-between mb-2">
                        <span>Requested: {formatDate(mentorship.createdAt)}</span>
                        {mentorship.acceptedAt && (
                          <span>Started: {formatDate(mentorship.acceptedAt)}</span>
                        )}
                      </div>
                      {mentorship.status === 'accepted' && (
                        <button
                          onClick={() => handleOpenChat(mentorship)}
                          className="w-full mt-3 bg-blue-500/20 text-blue-400 rounded-lg px-3 py-2 text-sm hover:bg-blue-500/30 transition-all flex items-center justify-center gap-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Send Message
                        </button>
                      )}
                      {isMentor && mentorship.status === 'pending' && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleAcceptMentorship(mentorship._id)}
                            className="flex-1 bg-green-500/20 text-green-400 rounded-lg px-3 py-2 text-sm hover:bg-green-500/30 transition-all flex items-center justify-center gap-1"
                          >
                            <Check className="w-4 h-4" />
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectMentorship(mentorship._id)}
                            className="flex-1 bg-red-500/20 text-red-400 rounded-lg px-3 py-2 text-sm hover:bg-red-500/30 transition-all flex items-center justify-center gap-1"
                          >
                            <X className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-foreground/40">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-30" />
                {profile?.isMentorAvailable ? (
                  <>
                    <p>No active mentorship sessions</p>
                    <p className="text-sm mt-1">You'll see mentee requests here</p>
                  </>
                ) : (
                  <>
                    <p>No mentorship requests yet</p>
                    <p className="text-sm mt-1">Find a mentor to guide your journey!</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      
      {/* Create Post Modal */}
      {showCreatePost && (
        <CreatePostModal
          isOpen={showCreatePost}
          onClose={() => setShowCreatePost(false)}
          onPostCreated={handlePostCreated}
        />
      )}

      {/* Mentorship Chat Modal */}
      {chatOpen && selectedMentorship && (
        <MentorshipChat
          isOpen={chatOpen}
          onClose={() => {
            setChatOpen(false);
            setSelectedMentorship(null);
          }}
          mentorshipId={selectedMentorship._id}
          otherPerson={
            selectedMentorship.mentorId._id === authUser?.id
              ? selectedMentorship.menteeId
              : selectedMentorship.mentorId
          }
        />
      )}
    </div>
  );
};

export default Profile;
