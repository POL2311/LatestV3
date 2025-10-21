import { BadgeFilter } from "@/components/badges/BadgeFilter";
import { ProfileStats } from "@/components/user/ProfileStats";
import { BadgeDisplay } from "@/components/badges/BadgeDisplay";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";

// Mock data - in real implementation this would come from API
const mockBadges = [
  {
    id: "1",
    name: "First Claim",
    description: "Claimed your first NFT",
    icon: "🏆",
    earnedAt: new Date("2023-01-15"),
    rarity: "bronze",
    category: "activity"
  },
  {
    id: "2",
    name: "Community Hero",
    description: "Active community member",
    icon: "🌟",
    earnedAt: new Date("2023-02-20"),
    rarity: "silver",
    category: "community"
  },
  {
    id: "3",
    name: "Developer Pro",
    description: "Created a smart contract",
    icon: "💻",
    earnedAt: new Date("2023-03-10"),
    rarity: "gold",
    category: "development"
  }
];

export default function UserProfilePage() {
  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <GlassCard className="p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl">
                👤
              </div>
              <div>
                <h1 className="text-2xl font-bold">John Doe</h1>
                <p className="text-white/70">0x742d35Cc6634C0532925a3b844Bc454e4438f44e</p>
              </div>
            </div>
            <div className="ml-auto">
              <Button className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Edit Profile
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* Stats Section */}
        <ProfileStats />

        {/* Filter Section */}
        <BadgeFilter />

        {/* Badges Grid */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Badges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockBadges.map((badge) => (
              <BadgeDisplay key={badge.id} badge={badge} />
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold mb-4">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-white/20 rounded-lg">
              <h3 className="font-semibold mb-2">Milestone Badge</h3>
              <p className="text-sm text-white/70">Complete 100 interactions</p>
              <div className="mt-2 w-full bg-white/10 h-2 rounded-full">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full w-3/4"></div>
              </div>
            </div>
            <div className="p-4 border border-white/20 rounded-lg">
              <h3 className="font-semibold mb-2">Streak Badge</h3>
              <p className="text-sm text-white/70">7-day activity streak</p>
              <div className="mt-2 w-full bg-white/10 h-2 rounded-full">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full w-full"></div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}