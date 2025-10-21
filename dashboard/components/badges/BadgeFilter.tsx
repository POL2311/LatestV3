import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function BadgeFilter() {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input placeholder="Search badges..." className="bg-white/10 border-white/20 text-white placeholder-white/50" />
      </div>
      <div className="flex gap-2">
        <Select>
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-white/20">
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="activity">Activity</SelectItem>
            <SelectItem value="community">Community</SelectItem>
            <SelectItem value="development">Development</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Rarity" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-white/20">
            <SelectItem value="all">All Rarities</SelectItem>
            <SelectItem value="bronze">Bronze</SelectItem>
            <SelectItem value="silver">Silver</SelectItem>
            <SelectItem value="gold">Gold</SelectItem>
            <SelectItem value="platinum">Platinum</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
          Clear
        </Button>
      </div>
    </div>
  );
}