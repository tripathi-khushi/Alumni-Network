import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
      
      <div className="relative z-10 pt-32 pb-24 px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-block glass-card rounded-full px-6 py-2 mb-4">
              <span className="text-amber-400 text-sm font-semibold">Get In Touch</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Contact Us
            </h1>
            <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-6 glow-soft">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Email</h3>
                <p className="text-foreground/60 text-sm mb-2">Our friendly team is here to help.</p>
                <a href="mailto:contact@alumninetwork.com" className="text-amber-400 text-sm hover:underline">
                  contact@alumninetwork.com
                </a>
              </div>

              <div className="glass-card rounded-2xl p-6 glow-soft">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Phone</h3>
                <p className="text-foreground/60 text-sm mb-2">Mon-Fri from 9am to 6pm.</p>
                <a href="tel:+1234567890" className="text-amber-400 text-sm hover:underline">
                  +1 (234) 567-890
                </a>
              </div>

              <div className="glass-card rounded-2xl p-6 glow-soft">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Office</h3>
                <p className="text-foreground/60 text-sm mb-2">Come say hello at our office.</p>
                <p className="text-amber-400 text-sm">
                  123 Alumni Street<br />
                  Campus City, CC 12345
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="glass-card rounded-2xl p-8 glow-soft">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-foreground text-sm font-medium mb-2">
                        Your Name
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
                  </div>

                  <div>
                    <label className="block text-foreground text-sm font-medium mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full glass-dark rounded-lg px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label className="block text-foreground text-sm font-medium mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full glass-dark rounded-lg px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50 resize-none"
                      placeholder="Tell us what you need help with..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg px-6 py-4 text-base font-medium text-white hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
