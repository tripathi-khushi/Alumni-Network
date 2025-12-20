import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { User, Mail, Briefcase, Calendar, MapPin, Edit2, Check, X, MessageSquare, Users, Award } from "lucide-react";
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

const Profile = () => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats>({ posts: 0, events: 0, mentorships: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
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
    fetchProfile();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/me/profile');
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

  const fetchStats = async () => {
    try {
      const response = await api.get('/users/me/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await api.put('/users/me/profile', editForm);
      setProfile(response.data);
      setIsEditing(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
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

          {/* Stats Cards */}
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
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
