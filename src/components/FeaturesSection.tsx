import { Users, Calendar, GraduationCap, MessageCircle } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Users,
      title: "Alumni Network",
      description: "Connect with thousands of alumni from your institution and build lasting professional relationships.",
    },
    {
      icon: Calendar,
      title: "Exclusive Events",
      description: "Attend networking events, workshops, and reunions designed to keep you engaged with your alma mater.",
    },
    {
      icon: GraduationCap,
      title: "Mentorship Programs",
      description: "Get guidance from experienced professionals or become a mentor to help shape the next generation.",
    },
    {
      icon: MessageCircle,
      title: "Community Forums",
      description: "Participate in discussions, share opportunities, and stay updated with community news and achievements.",
    },
  ];

  return (
    <section className="relative z-10 py-24 px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Why Join Our Alumni Network?
          </h2>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
            Discover the benefits of staying connected with your alumni community and unlock new opportunities for growth.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="glass-card rounded-2xl p-8 hover:scale-105 transition-all duration-300 glow-soft group"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-foreground/60 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <button className="glass-light rounded-full px-8 py-4 text-base font-medium text-foreground hover:bg-white/20 transition-all hover:scale-105">
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
