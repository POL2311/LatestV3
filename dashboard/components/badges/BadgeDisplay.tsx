import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum';
  category: string;
}

interface BadgeDisplayProps {
  badge: BadgeData;
}

export function BadgeDisplay({ badge }: BadgeDisplayProps) {
  const rarityColors = {
    bronze: 'bg-amber-800/30 text-amber-200 border-amber-400/30',
    silver: 'bg-gray-500/30 text-gray-200 border-gray-400/30',
    gold: 'bg-yellow-500/30 text-yellow-200 border-yellow-400/30',
    platinum: 'bg-gray-300/30 text-gray-200 border-gray-400/30',
  };

  return (
    <GlassCard className="p-4 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center">
            <span className="text-lg">🏆</span>
          </div>
          <div>
            <h3 className="font-semibold text-white">{badge.name}</h3>
            <Badge className={`text-xs ${rarityColors[badge.rarity]}`}>
              {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
            </Badge>
          </div>
        </div>
      </div>
      <p className="text-sm text-white/70 mb-3">{badge.description}</p>
      <div className="flex justify-between items-center text-xs text-white/50">
        <span>Earned: {badge.earnedAt.toLocaleDateString()}</span>
        <span className="bg-white/10 px-2 py-1 rounded-full">
          {badge.category}
        </span>
      </div>
    </GlassCard>
  );
}