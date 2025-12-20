import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import EventRegistrationModal from "./EventRegistrationModal";
import { useAuth } from "../contexts/AuthContext";
import AuthModal from "./AuthModal";
import api from "../lib/api";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  attendees: Array<{ user: string; name: string; email: string }>;
}

const EventsSection = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        console.log('Fetched events:', response.data);
        setUpcomingEvents(response.data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const eventCategories = [
    { name: "Networking", count: 12 },
    { name: "Workshops", count: 8 },
    { name: "Reunions", count: 4 },
    { name: "Webinars", count: 15 },
  ];

  const [selectedEvent, setSelectedEvent] = useState<typeof upcomingEvents[0] | null>(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleRegisterClick = (event: typeof upcomingEvents[0]) => {
    console.log('Register clicked for event:', event);
    console.log('Is authenticated:', isAuthenticated);
    
    if (!isAuthenticated) {
      console.log('Opening auth modal...');
      setIsAuthModalOpen(true);
    } else {
      console.log('Opening registration modal...');
      setSelectedEvent(event);
      setIsRegistrationModalOpen(true);
    }
  };

  return (
    <section className="relative z-10 py-24 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block glass-card rounded-full px-6 py-2 mb-4">
            <span className="text-amber-400 text-sm font-semibold">Events & Activities</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Stay Connected Through Events
          </h2>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
            Participate in exclusive alumni events, workshops, and networking opportunities designed to keep you engaged and growing.
          </p>
        </div>

        {/* Event Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {eventCategories.map((category, index) => (
            <button
              key={index}
              className="glass-card rounded-full px-6 py-3 hover:scale-105 transition-all"
            >
              <span className="text-foreground font-medium">{category.name}</span>
              <span className="ml-2 text-amber-400 font-bold">({category.count})</span>
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {loading ? (
            <div className="col-span-2 text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
              <p className="text-foreground/60">Loading events...</p>
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <p className="text-foreground/60">No events available at the moment.</p>
            </div>
          ) : upcomingEvents.map((event, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-6 hover:scale-105 transition-all duration-300 glow-soft group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="glass-light rounded-lg px-3 py-1">
                  <span className="text-amber-400 text-xs font-semibold">{event.category}</span>
                </div>
                <div className="flex items-center gap-1 text-foreground/60 text-sm">
                  <Users className="w-4 h-4" />
                  <span>{event.attendees?.length || 0}</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-amber-400 transition-colors">
                {event.title}
              </h3>
              <p className="text-foreground/60 text-sm mb-4 leading-relaxed">
                {event.description}
              </p>

              <div className="space-y-2 mb-4">
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
              </div>

              <button 
                onClick={() => handleRegisterClick(event)}
                className="w-full glass-light rounded-full py-3 text-sm font-medium text-foreground hover:bg-white/20 transition-all group-hover:scale-105"
              >
                Register Now
              </button>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="glass-card rounded-3xl p-12 text-center glow-soft">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Don't Miss Out on Amazing Events
          </h3>
          <p className="text-foreground/60 mb-6 max-w-2xl mx-auto">
            Subscribe to our event calendar and get notified about upcoming events, workshops, and networking opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => !isAuthenticated && setIsAuthModalOpen(true)}
              className="glass-light rounded-full px-8 py-3 text-base font-medium text-foreground hover:bg-white/20 transition-all hover:scale-105"
            >
              View All Events
            </button>
            <button 
              onClick={() => !isAuthenticated && setIsAuthModalOpen(true)}
              className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-full px-8 py-3 text-base font-medium text-white hover:scale-105 transition-all shadow-lg"
            >
              Subscribe to Calendar
            </button>
          </div>
        </div>
      </div>

      <EventRegistrationModal 
        isOpen={isRegistrationModalOpen} 
        onClose={() => setIsRegistrationModalOpen(false)}
        event={selectedEvent}
      />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </section>
  );
};

export default EventsSection;
