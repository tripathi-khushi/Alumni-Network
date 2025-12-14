import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="glass rounded-full px-6 py-3 flex items-center gap-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500" />
          </div>
          <span className="text-foreground font-semibold text-sm">AN</span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-6">
          <Link 
            to="/" 
            className={`text-sm font-medium hover:text-foreground transition-colors ${
              location.pathname === '/' ? 'text-foreground/90' : 'text-foreground/70'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/events" 
            className={`text-sm font-medium hover:text-foreground transition-colors ${
              location.pathname === '/events' ? 'text-foreground/90' : 'text-foreground/70'
            }`}
          >
            Events
          </Link>
          <Link 
            to="/mentorship" 
            className={`text-sm font-medium hover:text-foreground transition-colors ${
              location.pathname === '/mentorship' ? 'text-foreground/90' : 'text-foreground/70'
            }`}
          >
            Mentorship
          </Link>
          <Link 
            to="/members" 
            className={`text-sm font-medium hover:text-foreground transition-colors ${
              location.pathname === '/members' ? 'text-foreground/90' : 'text-foreground/70'
            }`}
          >
            Members
          </Link>
        </div>

        {/* CTA Button */}
        <button className="glass-light rounded-full px-5 py-2 text-sm font-medium text-foreground hover:bg-white/20 transition-all">
          Join Network
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
