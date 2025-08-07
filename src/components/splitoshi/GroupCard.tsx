import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Zap, DollarSign } from "lucide-react";

interface GroupCardProps {
  id: string;
  name: string;
  memberCount: number;
  totalBalance: number; // in satoshis
  onJoin: (groupId: string) => void;
  onView: (groupId: string) => void;
}

export function GroupCard({ id, name, memberCount, totalBalance, onJoin, onView }: GroupCardProps) {
  const balanceUSD = (totalBalance / 100000000 * 50000).toFixed(2); // Mock BTC price conversion

  return (
    <Card className="hover:shadow-bitcoin transition-all duration-300 hover:scale-105">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{name}</CardTitle>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {memberCount}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4 text-accent" />
            <span>Total Balance</span>
          </div>
          <div className="text-right">
            <div className="font-mono text-sm">{totalBalance.toLocaleString()} sats</div>
            <div className="text-xs text-muted-foreground">${balanceUSD}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onView(id)} className="flex-1">
            View Details
          </Button>
          <Button size="sm" onClick={() => onJoin(id)} className="flex-1 bg-gradient-bitcoin hover:opacity-90">
            Join Group
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}