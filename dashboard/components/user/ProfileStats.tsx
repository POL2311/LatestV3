import { GlassCard } from "@/components/ui/glass-card";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
}

const StatCard = ({ title, value, description }: StatCardProps) => (
  <GlassCard className="p-4">
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-white/70 text-sm mb-1">{title}</div>
    <div className="text-white/50 text-xs">{description}</div>
  </GlassCard>
);

export function ProfileStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <StatCard 
        title="Badges" 
        value="24" 
        description="Earned this month" 
      />
      <StatCard 
        title="Activity" 
        value="156" 
        description="Total interactions" 
      />
      <StatCard 
        title="Rank" 
        value="#124" 
        description="Global leaderboard" 
      />
    </div>
  );
}