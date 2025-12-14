interface StatsCardProps {
  value: string;
  label: string;
}

const StatsCard = ({ value, label }: StatsCardProps) => {
  return (
    <div className="glass-card rounded-2xl p-6 text-center min-w-[140px] glow-soft">
      <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
      <div className="text-sm text-foreground/60">{label}</div>
    </div>
  );
};

export default StatsCard;
