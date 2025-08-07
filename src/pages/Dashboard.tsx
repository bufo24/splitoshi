import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GroupCard } from "@/components/splitoshi/GroupCard";
import { 
  Plus, 
  Users, 
  Zap, 
  Bitcoin, 
  Search,
  TrendingUp 
} from "lucide-react";

const mockGroups = [
  {
    id: "btcpp",
    name: "BTC++ Conference 2024",
    memberCount: 12,
    totalBalance: 850000 // 850k sats
  },
  {
    id: "1",
    name: "Vegas Trip 2024",
    memberCount: 4,
    totalBalance: 250000 // 250k sats
  },
  {
    id: "2", 
    name: "Dinner Squad",
    memberCount: 6,
    totalBalance: 75000 // 75k sats
  },
  {
    id: "3",
    name: "Office Lunch",
    memberCount: 8,
    totalBalance: 150000 // 150k sats
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const handleJoinGroup = (groupId: string) => {
    console.log("Joining group:", groupId);
    navigate(`/group/${groupId}`);
  };

  const handleViewGroup = (groupId: string) => {
    console.log("Viewing group:", groupId);
    navigate(`/group/${groupId}`);
  };

  const filteredGroups = mockGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-bitcoin rounded-lg animate-glow">
                <Bitcoin className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-bitcoin bg-clip-text text-transparent">
                Splitoshi
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="px-3 py-1">
                <Zap className="h-3 w-3 mr-1 text-accent" />
                Lightning Ready
              </Badge>
              <Button 
                onClick={() => setShowCreateGroup(true)}
                className="bg-gradient-bitcoin hover:opacity-90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-bitcoin text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Balance</p>
                  <p className="text-2xl font-bold">1,325,000 sats</p>
                  <p className="text-xs opacity-75">≈ $662.50</p>
                </div>
                <TrendingUp className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Groups</p>
                  <p className="text-2xl font-bold">4</p>
                  <p className="text-xs text-muted-foreground">Groups joined</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-lightning text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Pending Settlements</p>
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-xs opacity-75">Waiting for payment</p>
                </div>
                <Zap className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Groups Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Groups</h2>
            <Badge variant="secondary">{filteredGroups.length} groups</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <GroupCard
                key={group.id}
                {...group}
                onJoin={handleJoinGroup}
                onView={handleViewGroup}
              />
            ))}
          </div>

          {filteredGroups.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No groups found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "Try adjusting your search terms" : "Create your first group to get started"}
                </p>
                <Button onClick={() => setShowCreateGroup(true)} className="bg-gradient-bitcoin hover:opacity-90">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;