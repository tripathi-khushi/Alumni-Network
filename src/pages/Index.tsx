import Navbar from "@/components/Navbar";
import DesktopMockup from "@/components/DesktopMockup";
import MobileMockup from "@/components/MobileMockup";
import FeaturesSection from "@/components/FeaturesSection";

const Index = () => {
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
      
      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-screen pt-24 pb-32">
        <div className="flex items-center gap-[-40px]">
          {/* Desktop Mockup */}
          <div className="relative z-10">
            <DesktopMockup />
          </div>
          
          {/* Mobile Mockup - positioned to overlap */}
          <div className="relative -ml-16 z-20 mt-16">
            <MobileMockup />
          </div>
        </div>
      </main>
      
      {/* Decorative elements */}
      <div 
        className="absolute bottom-20 right-32 opacity-50 pointer-events-none"
        style={{
          filter: "blur(0.5px)",
        }}
      >
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path 
            d="M40 0L45 35L80 40L45 45L40 80L35 45L0 40L35 35L40 0Z" 
            fill="url(#big-star-gradient)"
            opacity="0.6"
          />
          <defs>
            <linearGradient id="big-star-gradient" x1="40" y1="0" x2="40" y2="80">
              <stop offset="0%" stopColor="hsl(40 80% 75%)" />
              <stop offset="100%" stopColor="hsl(35 70% 55%)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Features Section */}
      <FeaturesSection />
    </div>
  );
};

export default Index;
