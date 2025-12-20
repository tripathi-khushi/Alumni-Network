import { Quote, Star } from "lucide-react";
import { useState } from "react";
import AuthModal from "./AuthModal";
import { useAuth } from "../contexts/AuthContext";

const TestimonialsSection = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const testimonials = [
    {
      name: "Rahul Verma",
      role: "Software Engineer at Google",
      batch: "Class of 2018",
      image: "RV",
      rating: 5,
      text: "The mentorship program connected me with an industry expert who helped me navigate my career transition. Within 6 months, I landed my dream job at Google!",
    },
    {
      name: "Ananya Singh",
      role: "Startup Founder",
      batch: "Class of 2016",
      image: "AS",
      rating: 5,
      text: "Through the alumni network, I found my co-founder and our first investors. The connections I made here were invaluable for launching my startup.",
    },
    {
      name: "Vikram Patel",
      role: "Product Manager at Microsoft",
      batch: "Class of 2019",
      image: "VP",
      rating: 5,
      text: "The events and workshops helped me transition from engineering to product management. The community support was incredible throughout my journey.",
    },
    {
      name: "Priya Kapoor",
      role: "Data Scientist at Amazon",
      batch: "Class of 2020",
      image: "PK",
      rating: 5,
      text: "Being part of this network opened doors I never knew existed. The career opportunities shared here helped me land multiple interviews at top companies.",
    },
    {
      name: "Amit Sharma",
      role: "Tech Lead at Meta",
      batch: "Class of 2015",
      image: "AS",
      rating: 5,
      text: "As a mentor, giving back to the community has been incredibly rewarding. Watching mentees grow and succeed makes me proud to be part of this network.",
    },
    {
      name: "Neha Gupta",
      role: "UX Designer at Adobe",
      batch: "Class of 2017",
      image: "NG",
      rating: 5,
      text: "The alumni forums helped me get honest feedback on my portfolio. The collaborative spirit here is amazing - everyone genuinely wants to help each other succeed.",
    },
  ];

  return (
    <section className="relative z-10 py-24 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block glass-card rounded-full px-6 py-2 mb-4">
            <span className="text-amber-400 text-sm font-semibold">Success Stories</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Hear From Our Alumni
          </h2>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
            Real stories from alumni who transformed their careers and built lasting connections through our platform.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-6 hover:scale-105 transition-all duration-300 glow-soft relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-20">
                <Quote className="w-12 h-12 text-amber-400" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-foreground/70 text-sm leading-relaxed mb-6 relative z-10">
                "{testimonial.text}"
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {testimonial.image}
                </div>
                <div>
                  <h4 className="text-foreground font-bold text-sm">{testimonial.name}</h4>
                  <p className="text-foreground/60 text-xs">{testimonial.role}</p>
                  <p className="text-amber-400/80 text-xs">{testimonial.batch}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Banner */}
        <div className="glass-card rounded-3xl p-12 glow-soft">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-amber-400 mb-2">95%</div>
              <div className="text-foreground/60 text-sm">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-400 mb-2">500+</div>
              <div className="text-foreground/60 text-sm">Success Stories</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-400 mb-2">1000+</div>
              <div className="text-foreground/60 text-sm">Career Transitions</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-400 mb-2">4.8/5</div>
              <div className="text-foreground/60 text-sm">Average Rating</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Ready to Write Your Success Story?
          </h3>
          <button 
            onClick={() => !isAuthenticated && setIsAuthModalOpen(true)}
            className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-full px-8 py-4 text-base font-medium text-white hover:scale-105 transition-all shadow-lg"
          >
            Join the Network Today
          </button>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </section>
  );
};

export default TestimonialsSection;
