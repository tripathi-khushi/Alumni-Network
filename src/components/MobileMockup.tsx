const MobileMockup = () => {
  return (
    <div className="relative">
      {/* Phone Frame */}
      <div 
        className="relative rounded-[2.5rem] p-2 shadow-2xl"
        style={{
          background: `linear-gradient(135deg, 
            hsl(0 0% 20%) 0%, 
            hsl(0 0% 10%) 100%
          )`,
          width: "280px",
          height: "580px",
        }}
      >
        {/* Screen */}
        <div 
          className="relative w-full h-full rounded-[2rem] overflow-hidden"
          style={{
            background: `linear-gradient(180deg, 
              hsl(20 30% 10%) 0%, 
              hsl(25 25% 14%) 50%, 
              hsl(20 28% 11%) 100%
            )`,
          }}
        >
          {/* Ambient glow */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(ellipse at 50% 30%, 
                hsl(35 80% 50% / 0.3) 0%, 
                transparent 60%
              )`,
            }}
          />
          
          {/* Mobile Navbar */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
            <div className="glass rounded-full px-3 py-1.5 flex items-center gap-2 text-[8px]">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-white/10 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500" />
                </div>
                <span className="text-foreground/90 font-medium">AN</span>
              </div>
              <div className="flex items-center gap-1.5 text-foreground/50">
                <span className="text-foreground/80">Home</span>
                <span>Events</span>
                <span>Mentorship</span>
                <span>Members</span>
              </div>
              <button className="glass-light rounded-full px-2 py-0.5 text-foreground/80">
                Join Network
              </button>
            </div>
          </div>
          
          {/* Hero */}
          <div className="absolute left-3 right-3 top-14 z-10">
            <div className="glass-card rounded-xl p-4 glow-soft">
              <h2 className="text-sm font-bold text-foreground leading-tight mb-1.5">
                Reconnect With Your Alumni Community
              </h2>
              <p className="text-foreground/50 text-[9px] mb-3 leading-relaxed">
                Subhestline and every hoen: Alumni Interaction & networking and learn more.
              </p>
              <div className="flex gap-2">
                <button className="glass-light rounded-full px-2.5 py-1 text-[8px] font-medium text-foreground">
                  Join the Network
                </button>
                <button className="glass-dark rounded-full px-2.5 py-1 text-[8px] font-medium text-foreground/60">
                  Explore Events
                </button>
              </div>
            </div>
          </div>
          
          {/* Stats Row */}
          <div className="absolute left-3 right-3 top-44 flex gap-2 z-10">
            <div className="glass-card rounded-lg px-3 py-2 text-center flex-1">
              <div className="text-sm font-bold text-foreground">20+</div>
              <div className="text-[7px] text-foreground/50">Active Alumni</div>
            </div>
            <div className="glass-card rounded-lg px-3 py-2 text-center flex-1">
              <div className="text-sm font-bold text-foreground">8+</div>
              <div className="text-[7px] text-foreground/50">Mentors Available</div>
            </div>
            <div className="glass-card rounded-lg px-3 py-2 text-center flex-1">
              <div className="text-sm font-bold text-foreground">12+</div>
              <div className="text-[7px] text-foreground/50">Events Hosted</div>
            </div>
          </div>
          
          {/* Features Section */}
          <div className="absolute left-3 right-3 top-60 z-10">
            <div className="text-xs font-semibold text-foreground mb-2">Features</div>
            <div className="space-y-2">
              {[
                { title: "Meaningful Networking", desc: "Lorem ipsum dolor sit, amet consectetur adipiscing elit, sed do eiusmod." },
                { title: "Mentorship Culture", desc: "Lorem ipsum dolor sit amet, praesentum consectur at voluptatignioreship cultura." },
                { title: "Alumni Events", desc: "Lorem ipsum dolorsitancellarius, vitae amet vulp. Iaculis poetry and calendar." },
              ].map((feature, i) => (
                <div key={i} className="glass-card rounded-lg p-2.5 flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-400/80 to-orange-500/80" />
                  </div>
                  <div>
                    <div className="text-[9px] font-semibold text-foreground">{feature.title}</div>
                    <div className="text-[7px] text-foreground/40 leading-relaxed">{feature.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <div className="absolute left-3 right-3 bottom-3 z-10">
            <div className="glass-dark rounded-lg p-2.5">
              <div className="flex justify-between text-[6px] text-foreground/40">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <div className="w-3 h-3 rounded-full bg-white/10 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500" />
                    </div>
                    <span className="text-foreground/70 font-medium">Institution</span>
                  </div>
                  <p className="max-w-[80px] leading-relaxed">
                    Lorem ipsum de atris et amet, consectetur adipiscing elit, sed do eiusmod tempor.
                  </p>
                </div>
                <div>
                  <div className="font-semibold text-foreground/60 mb-1">Platforms</div>
                  <div className="space-y-0.5 text-foreground/40">
                    <div>Home</div>
                    <div>Events</div>
                    <div>Mentorship</div>
                    <div>Members</div>
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-foreground/60 mb-1">Quick Links</div>
                  <div className="space-y-0.5 text-foreground/40">
                    <div>About Us</div>
                    <div>Free resources</div>
                    <div>Contact Us</div>
                    <div>Reward Creator</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-white/5">
                <span className="text-[5px] text-foreground/30">© 2023 Institution</span>
                <span className="text-[5px] text-foreground/30">Privacy</span>
              </div>
            </div>
          </div>
          
          {/* Decorative star */}
          <div className="absolute bottom-6 right-4 opacity-60">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path 
                d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5L12 2Z" 
                fill="url(#star-gradient)"
              />
              <defs>
                <linearGradient id="star-gradient" x1="12" y1="2" x2="12" y2="22">
                  <stop offset="0%" stopColor="hsl(35 90% 70%)" />
                  <stop offset="100%" stopColor="hsl(30 80% 50%)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Shadow */}
      <div 
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-40 h-6 rounded-full opacity-40"
        style={{
          background: `radial-gradient(ellipse, hsl(0 0% 0% / 0.6) 0%, transparent 70%)`,
        }}
      />
    </div>
  );
};

export default MobileMockup;
