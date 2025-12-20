import { X, User, Mail, MessageSquare, Target } from "lucide-react";
import { useState } from "react";
import api from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

interface Mentor {
  _id: string;
  name: string;
  role?: string;
  company?: string;
  position?: string;
  expertise?: string[];
  batch?: string;
}

interface MentorshipRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentor: Mentor | null;
}

const MentorshipRequestModal = ({ isOpen, onClose, mentor }: MentorshipRequestModalProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    goals: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !mentor) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await api.post('/mentorship/request', {
        mentorId: mentor._id,
        name: formData.name,
        email: formData.email,
        goals: formData.goals,
        message: formData.message,
      });
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({ name: user?.name || "", email: user?.email || "", goals: "", message: "" });
      }, 2000);
    } catch (err: unknown) {
      console.error("Mentorship request failed:", err);
      
      // Extract error message from API response
      let errorMessage = "Failed to send request. Please try again.";
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as { response?: { data?: { message?: string } } };
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

        {success ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Request Sent!</h2>
            <p className="text-foreground/60">Your mentor will be notified and will reach out soon.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
                Request Mentorship
              </h2>
              <p className="text-foreground/60 text-sm text-center">
                Send a mentorship request to connect with {mentor.name}
              </p>
            </div>

            {/* Mentor Info */}
            <div className="glass-dark rounded-xl p-4 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  {mentor.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-1">{mentor.name}</h3>
                  <p className="text-foreground/70 text-sm mb-1">{mentor.role || mentor.position || 'Mentor'}</p>
                  <p className="text-foreground/60 text-xs mb-2">{mentor.company || 'Alumni'}</p>
                  {mentor.expertise && mentor.expertise.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {mentor.expertise.map((skill, idx) => (
                        <span
                          key={idx}
                          className="glass-light rounded-full px-2 py-1 text-xs text-foreground/80"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="glass-dark rounded-lg p-3 border border-red-500/20">
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
              )}
              
              <div>
                <label className="block text-foreground text-sm font-medium mb-2">
                  Your Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full glass-dark rounded-lg pl-11 pr-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-foreground text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full glass-dark rounded-lg pl-11 pr-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-foreground text-sm font-medium mb-2">
                  Your Goals
                </label>
                <div className="relative">
                  <Target className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
                  <input
                    type="text"
                    name="goals"
                    value={formData.goals}
                    onChange={handleChange}
                    required
                    className="w-full glass-dark rounded-lg pl-11 pr-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    placeholder="e.g., Career transition, Technical skills, Leadership"
                  />
                </div>
              </div>

              <div>
                <label className="block text-foreground text-sm font-medium mb-2">
                  Message to Mentor
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full glass-dark rounded-lg pl-11 pr-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50 resize-none"
                    placeholder="Tell the mentor why you'd like their guidance..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg px-6 py-3 text-base font-medium text-white hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Sending Request...</span>
                  </div>
                ) : (
                  <span>Send Mentorship Request</span>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default MentorshipRequestModal;
