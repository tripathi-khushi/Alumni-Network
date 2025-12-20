import { X, Calendar, MapPin, Clock, Users } from "lucide-react";
import { useState } from "react";
import api from "../lib/api";

interface Event {
  _id?: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: Array<{ user: string; name: string; email: string }>;
  category: string;
  description: string;
}

interface EventRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

const EventRegistrationModal = ({ isOpen, onClose, event }: EventRegistrationModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    attendeeCount: "1",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !event) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const eventId = event._id || event.title; // Fallback to title if no _id
      const response = await api.post(`/events/${eventId}/register`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        attendeeCount: formData.attendeeCount,
      });
      
      console.log("Registration successful:", response.data);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({ name: "", email: "", phone: "", attendeeCount: "1" });
      }, 2000);
    } catch (error: unknown) {
      const err = error as { message?: string; response?: { data?: { message?: string }; status?: number } };
      console.error("Registration failed:", error);
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        eventId: event._id || event.title
      });
      const errorMessage = err.response?.data?.message || err.message || "Registration failed. Please try again.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            <h2 className="text-2xl font-bold text-foreground mb-2">Registration Successful!</h2>
            <p className="text-foreground/60">You'll receive a confirmation email shortly.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
                Register for Event
              </h2>
              <p className="text-foreground/60 text-sm text-center">
                Complete the form below to register for this event
              </p>
            </div>

            {/* Event Details */}
            <div className="glass-dark rounded-xl p-4 mb-6">
              <h3 className="text-lg font-bold text-foreground mb-3">{event.title}</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-foreground/70 text-sm">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/70 text-sm">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/70 text-sm">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/70 text-sm">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>{event.attendees?.length || 0} attendees registered</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-foreground text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full glass-dark rounded-lg px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-foreground text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full glass-dark rounded-lg px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-foreground text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full glass-dark rounded-lg px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-foreground text-sm font-medium mb-2">
                  Number of Attendees
                </label>
                <select
                  name="attendeeCount"
                  value={formData.attendeeCount}
                  onChange={handleChange}
                  required
                  className="w-full glass-dark rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                >
                  <option value="1">1 Person</option>
                  <option value="2">2 People</option>
                  <option value="3">3 People</option>
                  <option value="4">4 People</option>
                  <option value="5">5+ People</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg px-6 py-3 text-base font-medium text-white hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Registering...</span>
                  </div>
                ) : (
                  <span>Complete Registration</span>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default EventRegistrationModal;
