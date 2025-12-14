const Footer = () => {
  return (
    <footer className="absolute bottom-8 left-8 right-8 z-10">
      <div className="glass-dark rounded-2xl p-6">
        <div className="flex justify-between items-start">
          {/* Institution */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500" />
              </div>
              <span className="text-foreground font-semibold">Institution</span>
            </div>
            <p className="text-xs text-foreground/40 leading-relaxed">
              Lorem ipsum de atris et amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore dolore magna aliqua.
            </p>
          </div>
          
          {/* Platforms */}
          <div>
            <div className="text-sm font-semibold text-foreground/70 mb-3">Platforms</div>
            <div className="space-y-2 text-sm text-foreground/40">
              <div className="hover:text-foreground/70 cursor-pointer transition-colors">Home</div>
              <div className="hover:text-foreground/70 cursor-pointer transition-colors">Events</div>
              <div className="hover:text-foreground/70 cursor-pointer transition-colors">Mentorship</div>
              <div className="hover:text-foreground/70 cursor-pointer transition-colors">Members</div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <div className="text-sm font-semibold text-foreground/70 mb-3">Quick Links</div>
            <div className="space-y-2 text-sm text-foreground/40">
              <div className="hover:text-foreground/70 cursor-pointer transition-colors">About Us</div>
              <div className="hover:text-foreground/70 cursor-pointer transition-colors">Free resources</div>
              <div className="hover:text-foreground/70 cursor-pointer transition-colors">Contact Us</div>
              <div className="hover:text-foreground/70 cursor-pointer transition-colors">Reward Creator</div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
          <span className="text-xs text-foreground/30">© 2023 Institution</span>
          <span className="text-xs text-foreground/30">Privacy</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
