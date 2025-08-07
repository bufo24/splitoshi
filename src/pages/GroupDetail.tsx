import qrcode from 'qrcode-generator'
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
  Bitcoin,
  QrCode
} from "lucide-react";
import { useParams } from "react-router-dom";

const getQr = (data: string) => {
  const qr = qrcode(0, 'L');
  qr.addData(data);
  qr.make();
  return qr.createSvgTag();
}

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

const btcppExpenses = [
  {
    id: "btc1",
    description: "Conference Registration Fees",
    amount: 400000, // 400k sats
    paidBy: "DevRel Alice",
    paidByInitials: "DA",
    createdAt: "2024-01-10",
    settled: false,
    yourShare: 33333 // 33.3k sats (1/12 split)
  },
  {
    id: "btc2", 
    description: "Group Dinner - Bitcoin Pizza Place",
    amount: 180000, // 180k sats
    paidBy: "Lightning Bob",
    paidByInitials: "LB",
    createdAt: "2024-01-09",
    settled: true,
    yourShare: 15000 // 15k sats
  },
  {
    id: "btc3",
    description: "Shared AirBnB - Bitcoin House",
    amount: 600000, // 600k sats
    paidBy: "Satoshi Charlie",
    paidByInitials: "SC",
    createdAt: "2024-01-08",
    settled: false,
    yourShare: 50000 // 50k sats
  },
  {
    id: "btc4",
    description: "Workshop Materials & Swag",
    amount: 120000, // 120k sats
    paidBy: "You",
    paidByInitials: "YU",
    createdAt: "2024-01-07",
    settled: false,
    yourShare: 10000 // 10k sats
  }
];

const mockMembers = [
  { id: "1", name: "Alice", initials: "AL", lightningAddress: "alice@getalby.com", balance: 37500 },
  { id: "2", name: "Bob", initials: "BO", lightningAddress: "bob@wallet.bitcoin.org", balance: -18750 },
  { id: "3", name: "Charlie", initials: "CH", lightningAddress: "charlie@lightning.com", balance: 62500 },
  { id: "4", name: "You", initials: "YU", lightningAddress: "you@strike.me", balance: -81250 }
];

const btcppMembers = [
  { id: "1", name: "DevRel Alice", initials: "DA", lightningAddress: "alice@bitcoin.org", balance: 25000 },
  { id: "2", name: "Lightning Bob", initials: "LB", lightningAddress: "bob@ln.dev", balance: -15000 },
  { id: "3", name: "Satoshi Charlie", initials: "SC", lightningAddress: "charlie@sats.com", balance: 45000 },
  { id: "4", name: "Hodler Dave", initials: "HD", lightningAddress: "dave@btc.holdings", balance: -12000 },
  { id: "5", name: "Miner Eve", initials: "ME", lightningAddress: "eve@mining.pool", balance: 8000 },
  { id: "6", name: "Dev Frank", initials: "DF", lightningAddress: "frank@core.dev", balance: -22000 },
  { id: "7", name: "Trader Grace", initials: "TG", lightningAddress: "grace@exchange.btc", balance: 18000 },
  { id: "8", name: "NodeRunner Henry", initials: "NH", lightningAddress: "henry@mynode.local", balance: -8500 },
  { id: "9", name: "Lightning Lisa", initials: "LL", lightningAddress: "lisa@lightning.network", balance: 12000 },
  { id: "10", name: "Stack Sam", initials: "SS", lightningAddress: "sam@stacksats.io", balance: -5000 },
  { id: "11", name: "Orange Maya", initials: "OM", lightningAddress: "maya@orange.pilled", balance: 15000 },
  { id: "12", name: "You", initials: "YU", lightningAddress: "you@strike.me", balance: -60500 }
];

const GroupDetail = () => {
  const navigate = useNavigate();
  const { id: groupId } = useParams();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [showSettleAllModal, setShowSettleAllModal] = useState(false);
  const [settlingExpenseId, setSettlingExpenseId] = useState<string | null>(null);
  const [invoice, setInvoice] = useState<string | null>(null);
  const [newExpense, setNewExpense] = useState({ description: "", amount: "" });

  // Use different data based on group ID
  const isBtcppGroup = groupId === "btcpp";
  const expenses = isBtcppGroup ? btcppExpenses : mockExpenses;
  const members = isBtcppGroup ? btcppMembers : mockMembers;
  const groupName = isBtcppGroup ? "BTC++ Conference 2024" : "Vegas Trip 2024";
  const memberCount = members.length;

  const handleSettle = (expenseId: string) => {
    console.log("Settling expense:", expenseId);
    setSettlingExpenseId(expenseId);
    setShowSettleModal(true);
  };

  const handleSettleAll = async () => {
    console.log("Settling all expenses");
    const sats = 93_333;


    setShowSettleAllModal(true);

    const lnAddress = 'lavenderopossum38@bancolibre.com';
    const [username, domain] = lnAddress.split('@');
    const res = await fetch(`https://${domain}/.well-known/lnurlp/${username}`);
    const callback = (await res.json()).callback;
    const res2 = await fetch(`${callback}?amount=${sats*1000}`);
    const pr = (await res2.json()).pr;
    setInvoice(pr);

  };

  const handleAddExpense = () => {
    console.log("Adding expense:", newExpense);
    setShowAddExpense(false);
    setNewExpense({ description: "", amount: "" });
  };

  const closeModal = () => {
    setShowSettleAllModal(false)
    // setInvoice(null)
  }

  const totalGroupBalance = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pendingSettlements = expenses.filter(e => !e.settled).length;
  
  // Calculate total amount you owe across all unsettled expenses
  const unsettledExpenses = expenses.filter(e => !e.settled);
  const totalOwed = unsettledExpenses.reduce((sum, expense) => sum + expense.yourShare, 0);

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
                <h1 className="text-xl font-bold">{groupName}</h1>
                <p className="text-sm text-muted-foreground">{memberCount} members</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-3 bg-gradient-lightning p-4 rounded-lg">
<p>lavenderopossum38@bancolibre.com</p> <Zap></Zap>
              </div>
              
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
                  <p className="text-2xl font-bold">{memberCount}</p>
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
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{expenses.length} expenses</Badge>
                {totalOwed > 0 && (
                  <Button 
                    size="sm"
                    onClick={handleSettleAll}
                    className="bg-gradient-lightning hover:opacity-90"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Settle All ({totalOwed.toLocaleString()} sats)
                  </Button>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              {expenses.map((expense) => (
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
                {members.map((member) => (
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
                      {}
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

        {/* Settle All Modal */}
        {showSettleAllModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-accent" />
                  Settle All Expenses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-3">
                  <div className="p-4 bg-gradient-lightning/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total amount to pay</p>
                    <p className="text-2xl font-bold font-mono">{totalOwed.toLocaleString()} sats</p>
                    <p className="text-xs text-muted-foreground">≈ ${(totalOwed / 100000000 * 50000).toFixed(2)} USD</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Settling {unsettledExpenses.length} expenses:</p>
                    <div className="max-h-24 overflow-y-auto space-y-1 text-xs text-muted-foreground">
                      {unsettledExpenses.map((expense) => (
                        <div key={expense.id} className="flex justify-between">
                          <span>{expense.description}</span>
                          <span>{expense.yourShare.toLocaleString()} sats</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Lightning Invoice:</p>
                    <div className="p-3 bg-muted rounded font-mono text-xs break-all">
                      {!invoice ? 'Generating invoice...' : invoice}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Combined invoice for all your outstanding expenses
                      </p>
                  </div>

                  <div className="w-56 h-56 mx-auto bg-white border-2 border-border rounded-lg flex items-center justify-center">
                    <div className="text-xs text-muted-foreground text-center">
                      {invoice ? (<div dangerouslySetInnerHTML={{ __html: getQr(`lightning:${invoice}`) }} />) : ''}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => closeModal()}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      console.log("Payment confirmed for all expenses, total:", totalOwed);
                      setShowSettleAllModal(false);
                    }}
                    className="flex-1 bg-gradient-lightning hover:opacity-90"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Marked as Paid
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