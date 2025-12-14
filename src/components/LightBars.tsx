const LightBars = () => {
  const bars = [
    { height: "280px", delay: "0s", opacity: 0.5 },
    { height: "350px", delay: "0.2s", opacity: 0.7 },
    { height: "420px", delay: "0.4s", opacity: 0.9 },
    { height: "380px", delay: "0.6s", opacity: 0.8 },
    { height: "320px", delay: "0.3s", opacity: 0.6 },
    { height: "290px", delay: "0.5s", opacity: 0.5 },
  ];

  return (
    <div className="flex items-end gap-3 h-[450px]">
      {bars.map((bar, index) => (
        <div
          key={index}
          className="w-8 rounded-full animate-light-bar"
          style={{
            height: bar.height,
            animationDelay: bar.delay,
            opacity: bar.opacity,
            background: `linear-gradient(180deg, 
              hsl(35 90% 70% / 0.9) 0%, 
              hsl(30 85% 55% / 0.7) 30%,
              hsl(25 80% 45% / 0.5) 60%,
              hsl(20 70% 35% / 0.2) 100%
            )`,
            boxShadow: `
              0 0 20px hsl(35 90% 60% / 0.4),
              0 0 40px hsl(35 85% 55% / 0.3),
              0 0 60px hsl(30 80% 50% / 0.2)
            `,
            filter: "blur(1px)",
          }}
        />
      ))}
    </div>
  );
};

export default LightBars;
