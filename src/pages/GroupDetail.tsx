import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ExpenseCard } from "@/components/splitoshi/ExpenseCard";
import { 
  ArrowLeft, 
  Plus, 
  Users, 
  Zap, 
  Share,
  DollarSign,
  Bitcoin
} from "lucide-react";

const mockExpenses = [
  {
    id: "1",
    description: "Dinner at Bitcoin Steakhouse",
    amount: 150000, // 150k sats
    paidBy: "Alice",
    paidByInitials: "AL",
    createdAt: "2024-01-07",
    settled: false,
    yourShare: 37500 // 37.5k sats (1/4 split)
  },
  {
    id: "2", 
    description: "Uber to conference",
    amount: 25000, // 25k sats
    paidBy: "Bob",
    paidByInitials: "BO",
    createdAt: "2024-01-06",
    settled: true,
    yourShare: 6250 // 6.25k sats
  },
  {
    id: "3",
    description: "Hotel Lightning Suite",
    amount: 500000, // 500k sats
    paidBy: "You",
    paidByInitials: "YU",
    createdAt: "2024-01-05",
    settled: false,
    yourShare: 125000 // 125k sats
  }
];

const mockMembers = [
  { id: "1", name: "Alice", initials: "AL", lightningAddress: "alice@getalby.com", balance: 37500 },
  { id: "2", name: "Bob", initials: "BO", lightningAddress: "bob@wallet.bitcoin.org", balance: -18750 },
  { id: "3", name: "Charlie", initials: "CH", lightningAddress: "charlie@lightning.com", balance: 62500 },
  { id: "4", name: "You", initials: "YU", lightningAddress: "you@strike.me", balance: -81250 }
];

const GroupDetail = () => {
  const navigate = useNavigate();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [settlingExpenseId, setSettlingExpenseId] = useState<string | null>(null);
  const [newExpense, setNewExpense] = useState({ description: "", amount: "" });

  const handleSettle = (expenseId: string) => {
    console.log("Settling expense:", expenseId);
    setSettlingExpenseId(expenseId);
    setShowSettleModal(true);
  };

  const handleAddExpense = () => {
    console.log("Adding expense:", newExpense);
    setShowAddExpense(false);
    setNewExpense({ description: "", amount: "" });
  };

  const totalGroupBalance = mockExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pendingSettlements = mockExpenses.filter(e => !e.settled).length;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Vegas Trip 2024</h1>
                <p className="text-sm text-muted-foreground">4 members</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Invite
              </Button>
              <Button 
                onClick={() => setShowAddExpense(true)}
                className="bg-gradient-bitcoin hover:opacity-90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Group Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-bitcoin text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Expenses</p>
                  <p className="text-2xl font-bold">{totalGroupBalance.toLocaleString()} sats</p>
                  <p className="text-xs opacity-75">≈ ${(totalGroupBalance / 100000000 * 50000).toFixed(2)}</p>
                </div>
                <Bitcoin className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Group Members</p>
                  <p className="text-2xl font-bold">{mockMembers.length}</p>
                  <p className="text-xs text-muted-foreground">Active participants</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-lightning text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Pending</p>
                  <p className="text-2xl font-bold">{pendingSettlements}</p>
                  <p className="text-xs opacity-75">Settlements needed</p>
                </div>
                <Zap className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Expenses */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Expenses</h2>
              <Badge variant="secondary">{mockExpenses.length} expenses</Badge>
            </div>
            
            <div className="space-y-4">
              {mockExpenses.map((expense) => (
                <ExpenseCard
                  key={expense.id}
                  {...expense}
                  onSettle={handleSettle}
                />
              ))}
            </div>
          </div>

          {/* Members Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Group Members</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-gradient-bitcoin text-white">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {member.lightningAddress}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-mono ${member.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {member.balance >= 0 ? '+' : ''}{member.balance.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">sats</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Expense Modal */}
        {showAddExpense && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Add New Expense</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    placeholder="What was this expense for?"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Amount (satoshis)</label>
                  <Input
                    type="number"
                    placeholder="50000"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                  />
                  {newExpense.amount && (
                    <p className="text-xs text-muted-foreground mt-1">
                      ≈ ${(parseInt(newExpense.amount) / 100000000 * 50000).toFixed(2)} USD
                    </p>
                  )}
                </div>
                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddExpense(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddExpense}
                    disabled={!newExpense.description || !newExpense.amount}
                    className="flex-1 bg-gradient-bitcoin hover:opacity-90"
                  >
                    Add Expense
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Lightning Settlement Modal */}
        {showSettleModal && settlingExpenseId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-accent" />
                  Lightning Settlement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-3">
                  <div className="p-4 bg-gradient-lightning/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">Amount to pay</p>
                    <p className="text-2xl font-bold font-mono">37,500 sats</p>
                    <p className="text-xs text-muted-foreground">≈ $18.75 USD</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Lightning Invoice:</p>
                    <div className="p-3 bg-muted rounded font-mono text-xs break-all">
                      lnbc375000n1p3xnhl2pp5qvnjh4k7r8k8k7r8k8k7r8k8k7r8k8k7r8k8k7r8k8k7r8k8k7r8k8...
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Scan with your Lightning wallet or copy the invoice
                    </p>
                  </div>

                  <div className="w-32 h-32 mx-auto bg-white border-2 border-border rounded-lg flex items-center justify-center">
                    <div className="text-xs text-muted-foreground text-center">
                      QR Code<br/>Would appear here
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowSettleModal(false);
                      setSettlingExpenseId(null);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      console.log("Payment confirmed for expense:", settlingExpenseId);
                      setShowSettleModal(false);
                      setSettlingExpenseId(null);
                    }}
                    className="flex-1 bg-gradient-lightning hover:opacity-90"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Paid
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default GroupDetail;