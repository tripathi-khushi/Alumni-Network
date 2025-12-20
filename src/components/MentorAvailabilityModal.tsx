import { X, Calendar, Clock, Video, Users } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

interface MentorAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MentorAvailabilityModal = ({ isOpen, onClose }: MentorAvailabilityModalProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    isMentorAvailable: false,
    mentorCapacity: 5,
    availability: {
      days: [] as string[],
      timeSlots: [""],
      preferredMeetingType: "video" as "video" | "audio" | "chat" | "in-person",
    },
    mentorshipPreferences: {
      topics: [""],
      experienceLevel: [] as string[],
      sessionDuration: 60,
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const experienceLevels = ["beginner", "intermediate", "advanced"];

  useEffect(() => {
    if (isOpen && user) {
      // Load current availability settings
      setFormData({
        isMentorAvailable: user.isMentorAvailable || false,
        mentorCapacity: user.mentorCapacity || 5,
        availability: user.availability || {
          days: [],
          timeSlots: [""],
          preferredMeetingType: "video" as "video" | "audio" | "chat" | "in-person",
        },
        mentorshipPreferences: user.mentorshipPreferences || {
          topics: [""],
          experienceLevel: [],
          sessionDuration: 60,
        },
      });
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Filter out empty topics and timeSlots
      const cleanedData = {
        ...formData,
        availability: {
          ...formData.availability,
          timeSlots: formData.availability.timeSlots.filter(slot => slot.trim() !== ""),
        },
        mentorshipPreferences: {
          ...formData.mentorshipPreferences,
          topics: formData.mentorshipPreferences.topics.filter(topic => topic.trim() !== ""),
        },
      };

      await api.put('/mentorship/availability', cleanedData);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err: unknown) {
      console.error("Update availability failed:", err);
      setError(err instanceof Error ? err.message : "Failed to update availability");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDay = (day: string) => {
    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        days: formData.availability.days.includes(day)
          ? formData.availability.days.filter(d => d !== day)
          : [...formData.availability.days, day],
      },
    });
  };

  const toggleExperienceLevel = (level: string) => {
    setFormData({
      ...formData,
      mentorshipPreferences: {
        ...formData.mentorshipPreferences,
        experienceLevel: formData.mentorshipPreferences.experienceLevel.includes(level)
          ? formData.mentorshipPreferences.experienceLevel.filter(l => l !== level)
          : [...formData.mentorshipPreferences.experienceLevel, level],
      },
    });
  };

  const addTimeSlot = () => {
    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        timeSlots: [...formData.availability.timeSlots, ""],
      },
    });
  };

  const updateTimeSlot = (index: number, value: string) => {
    const newTimeSlots = [...formData.availability.timeSlots];
    newTimeSlots[index] = value;
    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        timeSlots: newTimeSlots,
      },
    });
  };

  const removeTimeSlot = (index: number) => {
    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        timeSlots: formData.availability.timeSlots.filter((_, i) => i !== index),
      },
    });
  };

  const addTopic = () => {
    setFormData({
      ...formData,
      mentorshipPreferences: {
        ...formData.mentorshipPreferences,
        topics: [...formData.mentorshipPreferences.topics, ""],
      },
    });
  };

  const updateTopic = (index: number, value: string) => {
    const newTopics = [...formData.mentorshipPreferences.topics];
    newTopics[index] = value;
    setFormData({
      ...formData,
      mentorshipPreferences: {
        ...formData.mentorshipPreferences,
        topics: newTopics,
      },
    });
  };

  const removeTopic = (index: number) => {
    setFormData({
      ...formData,
      mentorshipPreferences: {
        ...formData.mentorshipPreferences,
        topics: formData.mentorshipPreferences.topics.filter((_, i) => i !== index),
      },
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative glass-card rounded-2xl p-8 w-full max-w-3xl glow-soft animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
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
            <h2 className="text-2xl font-bold text-foreground mb-2">Availability Updated!</h2>
            <p className="text-foreground/60">Your mentorship settings have been saved.</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
                Mentor Availability Settings
              </h2>
              <p className="text-foreground/60 text-sm text-center">
                Configure your availability and mentorship preferences
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="glass-dark rounded-lg p-3 border border-red-500/20">
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
              )}

              {/* Availability Toggle */}
              <div className="flex items-center justify-between glass-dark rounded-lg p-4">
                <div>
                  <h3 className="text-foreground font-medium">Accept New Mentees</h3>
                  <p className="text-foreground/60 text-sm">Toggle your mentorship availability</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isMentorAvailable: !formData.isMentorAvailable })}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    formData.isMentorAvailable ? "bg-amber-500" : "bg-white/20"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      formData.isMentorAvailable ? "translate-x-7" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Mentee Capacity */}
              <div>
                <label className="block text-foreground text-sm font-medium mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Maximum Number of Mentees
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.mentorCapacity}
                  onChange={(e) => setFormData({ ...formData, mentorCapacity: parseInt(e.target.value) })}
                  className="w-full glass-dark rounded-lg px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                />
              </div>

              {/* Available Days */}
              <div>
                <label className="block text-foreground text-sm font-medium mb-2">Available Days</label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        formData.availability.days.includes(day)
                          ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white"
                          : "glass-dark text-foreground/70 hover:bg-white/20"
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-foreground text-sm font-medium mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Available Time Slots
                </label>
                {formData.availability.timeSlots.map((slot, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={slot}
                      onChange={(e) => updateTimeSlot(index, e.target.value)}
                      placeholder="e.g., 9:00 AM - 11:00 AM"
                      className="flex-1 glass-dark rounded-lg px-4 py-2 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    />
                    {formData.availability.timeSlots.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTimeSlot(index)}
                        className="glass-dark rounded-lg px-3 py-2 text-foreground/70 hover:bg-red-500/20 hover:text-red-400 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTimeSlot}
                  className="text-amber-400 text-sm font-medium hover:text-amber-300 transition-colors"
                >
                  + Add Time Slot
                </button>
              </div>

              {/* Preferred Meeting Type */}
              <div>
                <label className="block text-foreground text-sm font-medium mb-2 flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Preferred Meeting Type
                </label>
                <select
                  value={formData.availability.preferredMeetingType}
                  onChange={(e) => setFormData({
                    ...formData,
                    availability: {
                      ...formData.availability,
                      preferredMeetingType: e.target.value as "video" | "audio" | "chat" | "in-person",
                    },
                  })}
                  className="w-full glass-dark rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                >
                  <option value="video">Video Call</option>
                  <option value="audio">Audio Call</option>
                  <option value="chat">Chat</option>
                  <option value="in-person">In-Person</option>
                </select>
              </div>

              {/* Mentorship Topics */}
              <div>
                <label className="block text-foreground text-sm font-medium mb-2">Mentorship Topics</label>
                {formData.mentorshipPreferences.topics.map((topic, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => updateTopic(index, e.target.value)}
                      placeholder="e.g., Career Development, Technical Skills"
                      className="flex-1 glass-dark rounded-lg px-4 py-2 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    />
                    {formData.mentorshipPreferences.topics.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTopic(index)}
                        className="glass-dark rounded-lg px-3 py-2 text-foreground/70 hover:bg-red-500/20 hover:text-red-400 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTopic}
                  className="text-amber-400 text-sm font-medium hover:text-amber-300 transition-colors"
                >
                  + Add Topic
                </button>
              </div>

              {/* Experience Levels */}
              <div>
                <label className="block text-foreground text-sm font-medium mb-2">Target Experience Levels</label>
                <div className="flex flex-wrap gap-2">
                  {experienceLevels.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => toggleExperienceLevel(level)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                        formData.mentorshipPreferences.experienceLevel.includes(level)
                          ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white"
                          : "glass-dark text-foreground/70 hover:bg-white/20"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Session Duration */}
              <div>
                <label className="block text-foreground text-sm font-medium mb-2">Default Session Duration (minutes)</label>
                <input
                  type="number"
                  min="15"
                  max="180"
                  step="15"
                  value={formData.mentorshipPreferences.sessionDuration}
                  onChange={(e) => setFormData({
                    ...formData,
                    mentorshipPreferences: {
                      ...formData.mentorshipPreferences,
                      sessionDuration: parseInt(e.target.value),
                    },
                  })}
                  className="w-full glass-dark rounded-lg px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg px-6 py-3 text-base font-medium text-white hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <span>Save Availability Settings</span>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default MentorAvailabilityModal;
