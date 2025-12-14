import Navbar from "@/components/Navbar";
import EventsSection from "@/components/EventsSection";

const Events = () => {
  return (
    <div 
      className="relative min-h-screen overflow-hidden vignette"
      style={{
        background: `linear-gradient(135deg, 
          hsl(20 30% 8%) 0%, 
          hsl(25 25% 12%) 40%, 
          hsl(20 28% 10%) 100%
        )`,
      }}
    >
      {/* Ambient warm glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 50%, 
              hsl(30 60% 20% / 0.4) 0%, 
              transparent 60%
            ),
            radial-gradient(ellipse 60% 40% at 60% 40%, 
              hsl(35 70% 30% / 0.2) 0%, 
              transparent 50%
            )
          `,
        }}
      />
      
      <Navbar />
      
      <div className="pt-24">
        <EventsSection />
      </div>
    </div>
  );
};

export default Events;
