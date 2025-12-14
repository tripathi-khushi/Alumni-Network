import { UserCheck, Target, TrendingUp, Award } from "lucide-react";

const MentorshipSection = () => {
  const mentorshipStats = [
    { icon: UserCheck, value: "150+", label: "Active Mentors" },
    { icon: Target, value: "200+", label: "Mentees Matched" },
    { icon: TrendingUp, value: "85%", label: "Success Rate" },
    { icon: Award, value: "50+", label: "Success Stories" },
  ];

  const mentorProfiles = [
    {
      name: "Sarah Johnson",
      role: "Senior Software Engineer",
      company: "Tech Corp",
      expertise: ["Career Growth", "Technical Skills", "Leadership"],
      batch: "Class of 2015",
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      company: "Innovation Labs",
      expertise: ["Product Strategy", "Entrepreneurship", "Networking"],
      batch: "Class of 2013",
    },
    {
      name: "Priya Sharma",
      role: "Data Scientist",
      company: "AI Solutions",
      expertise: ["Data Science", "Machine Learning", "Research"],
      batch: "Class of 2016",
    },
  ];

  return (
    <section className="relative z-10 py-24 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block glass-card rounded-full px-6 py-2 mb-4">
            <span className="text-amber-400 text-sm font-semibold">Mentorship Program</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Learn From The Best
          </h2>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
            Connect with experienced alumni mentors who can guide you through your career journey and help you achieve your professional goals.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {mentorshipStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="glass-card rounded-xl p-6 text-center hover:scale-105 transition-transform"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-foreground/60 text-sm">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Mentor Profiles */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">Featured Mentors</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mentorProfiles.map((mentor, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl p-6 hover:scale-105 transition-all duration-300 glow-soft"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-2xl font-bold mb-4">
                  {mentor.name.charAt(0)}
                </div>
                <h4 className="text-lg font-bold text-foreground mb-1">{mentor.name}</h4>
                <p className="text-foreground/80 text-sm mb-1">{mentor.role}</p>
                <p className="text-foreground/60 text-xs mb-2">{mentor.company}</p>
                <p className="text-amber-400/80 text-xs mb-4">{mentor.batch}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {mentor.expertise.map((skill, idx) => (
                    <span
                      key={idx}
                      className="glass-light rounded-full px-3 py-1 text-xs text-foreground/80"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <button className="w-full glass-light rounded-full py-2 text-sm font-medium text-foreground hover:bg-white/20 transition-all">
                  Request Mentorship
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="glass-card rounded-3xl p-12 glow-soft">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">How Mentorship Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Create Profile", desc: "Share your goals and interests" },
              { step: "02", title: "Get Matched", desc: "AI-powered mentor matching" },
              { step: "03", title: "Connect", desc: "Schedule your first meeting" },
              { step: "04", title: "Grow Together", desc: "Regular sessions and guidance" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-amber-400/30 mb-3">{item.step}</div>
                <h4 className="text-lg font-bold text-foreground mb-2">{item.title}</h4>
                <p className="text-foreground/60 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MentorshipSection;
