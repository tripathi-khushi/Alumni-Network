import LightBars from "./LightBars";

const DesktopMockup = () => {
  return (
    <div className="relative">
      {/* Monitor Frame */}
      <div className="relative">
        {/* Screen Bezel */}
        <div className="bg-black rounded-2xl p-3 shadow-2xl">
          {/* Screen */}
          <div 
            className="relative rounded-lg overflow-hidden"
            style={{
              width: "800px",
              height: "500px",
              background: `linear-gradient(135deg, 
                hsl(20 30% 10%) 0%, 
                hsl(25 25% 14%) 50%, 
                hsl(20 28% 11%) 100%
              )`,
            }}
          >
            {/* Ambient glow */}
            <div 
              className="absolute inset-0 opacity-40"
              style={{
                background: `radial-gradient(ellipse at 60% 50%, 
                  hsl(35 80% 50% / 0.3) 0%, 
                  transparent 60%
                )`,
              }}
            />
            
            {/* Inner Navbar */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
              <div className="glass rounded-full px-4 py-2 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500" />
                  </div>
                  <span className="text-foreground/90 font-medium">AN</span>
                </div>
                <div className="flex items-center gap-3 text-foreground/60">
                  <span className="text-foreground/90">Home</span>
                  <span>Events</span>
                  <span>Mentorship</span>
                  <span>Members</span>
                </div>
                <button className="glass-light rounded-full px-3 py-1 text-foreground/90">
                  Join Network
                </button>
              </div>
            </div>
            
            {/* Hero Content */}
            <div className="absolute left-8 top-20 z-10">
              <div className="glass-card rounded-2xl p-6 max-w-xs glow-soft">
                <h2 className="text-xl font-bold text-foreground leading-tight mb-2">
                  Reconnect With Your Alumni Community
                </h2>
                <p className="text-foreground/60 text-xs mb-4">
                  Subhestline and every hoen: Alumni Interaction & networking and learn more.
                </p>
                <div className="flex gap-2">
                  <button className="glass-light rounded-full px-3 py-1.5 text-xs font-medium text-foreground">
                    Join the Network
                  </button>
                  <button className="glass-dark rounded-full px-3 py-1.5 text-xs font-medium text-foreground/70">
                    Explore Events
                  </button>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="absolute left-8 bottom-8 flex gap-3 z-10">
              <div className="glass-card rounded-xl px-4 py-3 text-center">
                <div className="text-lg font-bold text-foreground">20+</div>
                <div className="text-xs text-foreground/50">Active Alumni</div>
              </div>
              <div className="glass-card rounded-xl px-4 py-3 text-center">
                <div className="text-lg font-bold text-foreground">8+</div>
                <div className="text-xs text-foreground/50">Mentors Available</div>
              </div>
              <div className="glass-card rounded-xl px-4 py-3 text-center">
                <div className="text-lg font-bold text-foreground">12+</div>
                <div className="text-xs text-foreground/50">Events Hosted</div>
              </div>
            </div>
            
            {/* Light Bars */}
            <div className="absolute right-16 bottom-0 z-0">
              <LightBars />
            </div>
          </div>
        </div>
        
        {/* Stand */}
        <div className="flex flex-col items-center">
          <div 
            className="w-32 h-20"
            style={{
              background: `linear-gradient(180deg, 
                hsl(0 0% 75%) 0%, 
                hsl(0 0% 65%) 50%,
                hsl(0 0% 55%) 100%
              )`,
              clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
            }}
          />
          <div 
            className="w-48 h-2 rounded-sm"
            style={{
              background: `linear-gradient(90deg, 
                hsl(0 0% 50%) 0%, 
                hsl(0 0% 70%) 50%,
                hsl(0 0% 50%) 100%
              )`,
            }}
          />
        </div>
      </div>
      
      {/* Shadow beneath */}
      <div 
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-64 h-8 rounded-full opacity-50"
        style={{
          background: `radial-gradient(ellipse, hsl(0 0% 0% / 0.5) 0%, transparent 70%)`,
        }}
      />
    </div>
  );
};

export default DesktopMockup;
