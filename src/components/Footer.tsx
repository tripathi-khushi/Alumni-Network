import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-white/10 mt-24">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500" />
              </div>
              <span className="text-foreground font-bold text-lg">AN</span>
            </div>
            <p className="text-foreground/60 text-sm leading-relaxed mb-4">
              Connecting alumni, fostering mentorship, and creating opportunities for lifelong growth and collaboration.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-full glass-card flex items-center justify-center hover:bg-white/20 transition-all"
              >
                <Linkedin className="w-4 h-4 text-foreground/70" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full glass-card flex items-center justify-center hover:bg-white/20 transition-all"
              >
                <Twitter className="w-4 h-4 text-foreground/70" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full glass-card flex items-center justify-center hover:bg-white/20 transition-all"
              >
                <Instagram className="w-4 h-4 text-foreground/70" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full glass-card flex items-center justify-center hover:bg-white/20 transition-all"
              >
                <Facebook className="w-4 h-4 text-foreground/70" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-foreground font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-foreground/60 text-sm hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-foreground/60 text-sm hover:text-foreground transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/mentorship" className="text-foreground/60 text-sm hover:text-foreground transition-colors">
                  Mentorship
                </Link>
              </li>
              <li>
                <Link to="/members" className="text-foreground/60 text-sm hover:text-foreground transition-colors">
                  Members
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-foreground font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-foreground/60 text-sm hover:text-foreground transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/60 text-sm hover:text-foreground transition-colors">
                  Success Stories
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/60 text-sm hover:text-foreground transition-colors">
                  Career Resources
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/60 text-sm hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/60 text-sm hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-foreground font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:contact@alumninetwork.com"
                  className="text-foreground/60 text-sm hover:text-foreground transition-colors"
                >
                  contact@alumninetwork.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <a
                  href="tel:+1234567890"
                  className="text-foreground/60 text-sm hover:text-foreground transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <span className="text-foreground/60 text-sm">
                  123 Alumni Street,<br />
                  Campus City, CC 12345
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-foreground/50 text-sm text-center md:text-left">
            © 2025 Alumni Network. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-foreground/50 text-sm hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="text-foreground/50 text-sm hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="text-foreground/50 text-sm hover:text-foreground transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
