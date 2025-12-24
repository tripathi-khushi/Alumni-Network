import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";
import AuthModal from "./AuthModal";
import NotificationBell from "./NotificationBell";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-6xl">
        <div className="glass rounded-full px-6 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500" />
            </div>
            <span className="text-foreground font-semibold text-sm">AN</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
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

          {/* Desktop CTA Button */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-3">
              <NotificationBell />
              <Link 
                to="/profile"
                className="flex items-center gap-2 glass-dark rounded-full px-4 py-2 hover:bg-white/10 transition-all"
              >
                <User className="w-4 h-4 text-amber-400" />
                <span className="text-foreground text-sm">{user?.name}</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="glass-light rounded-full px-5 py-2 text-sm font-medium text-foreground hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="hidden md:block glass-light rounded-full px-5 py-2 text-sm font-medium text-foreground hover:bg-white/20 transition-all"
            >
              Join Network
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-8 h-8 flex items-center justify-center text-foreground"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 glass rounded-2xl p-4 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-3">
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm font-medium hover:text-foreground transition-colors px-4 py-2 rounded-lg ${
                  location.pathname === '/' ? 'text-foreground/90 bg-white/10' : 'text-foreground/70'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/events"
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm font-medium hover:text-foreground transition-colors px-4 py-2 rounded-lg ${
                  location.pathname === '/events' ? 'text-foreground/90 bg-white/10' : 'text-foreground/70'
                }`}
              >
                Events
              </Link>
              <Link 
                to="/mentorship"
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm font-medium hover:text-foreground transition-colors px-4 py-2 rounded-lg ${
                  location.pathname === '/mentorship' ? 'text-foreground/90 bg-white/10' : 'text-foreground/70'
                }`}
              >
                Mentorship
              </Link>
              <Link 
                to="/members"
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm font-medium hover:text-foreground transition-colors px-4 py-2 rounded-lg ${
                  location.pathname === '/members' ? 'text-foreground/90 bg-white/10' : 'text-foreground/70'
                }`}
              >
                Members
              </Link>
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 glass-dark rounded-lg px-4 py-2 mt-2 hover:bg-white/10 transition-all"
                  >
                    <User className="w-4 h-4 text-amber-400" />
                    <span className="text-foreground text-sm">{user?.name}</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="glass-light rounded-full px-5 py-2 text-sm font-medium text-foreground hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="glass-light rounded-full px-5 py-2 text-sm font-medium text-foreground hover:bg-white/20 transition-all mt-2"
                >
                  Join Network
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Navbar;
