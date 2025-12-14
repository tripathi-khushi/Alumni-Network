const HeroCard = () => {
  return (
    <div className="glass-card rounded-3xl p-8 max-w-md glow-soft">
      <h1 className="text-4xl font-bold text-foreground leading-tight mb-4">
        Reconnect With Your Alumni Community
      </h1>
      <p className="text-foreground/70 text-base mb-8 leading-relaxed">
        Subscribe and enjoy new features & networking and learn more.
      </p>
      
      <div className="flex gap-3">
        <button className="glass-light rounded-full px-6 py-3 text-sm font-semibold text-foreground hover:bg-white/20 transition-all">
          Join the Network
        </button>
        <button className="glass-dark rounded-full px-6 py-3 text-sm font-semibold text-foreground/80 hover:bg-white/10 transition-all">
          Explore Events
        </button>
      </div>
    </div>
  );
};

export default HeroCard;
