import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Zap, DollarSign, Clock, CheckCircle } from "lucide-react";

interface ExpenseCardProps {
  id: string;
  description: string;
  amount: number; // in satoshis
  paidBy: string;
  paidByInitials: string;
  createdAt: string;
  settled: boolean;
  yourShare: number; // in satoshis
  onSettle?: (expenseId: string) => void;
}

export function ExpenseCard({ 
  id, 
  description, 
  amount, 
  paidBy, 
  paidByInitials, 
  createdAt, 
  settled,
  yourShare,
  onSettle 
}: ExpenseCardProps) {
  const amountUSD = (amount / 100000000 * 50000).toFixed(2);
  const yourShareUSD = (yourShare / 100000000 * 50000).toFixed(2);

  return (
    <Card className="transition-all duration-300 hover:shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs bg-gradient-bitcoin text-white">
                {paidByInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-sm">{description}</h3>
              <p className="text-xs text-muted-foreground">Paid by {paidBy}</p>
            </div>
          </div>
          <Badge variant={settled ? "default" : "secondary"} className="text-xs">
            {settled ? (
              <><CheckCircle className="h-3 w-3 mr-1" />Settled</>
            ) : (
              <><Clock className="h-3 w-3 mr-1" />Pending</>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm">
              <Zap className="h-4 w-4 text-accent" />
              <span className="font-mono">{amount.toLocaleString()} sats</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <DollarSign className="h-3 w-3" />
              <span>${amountUSD}</span>
            </div>
          </div>
          <div className="text-right space-y-1">
            <div className="text-sm font-medium">Your share:</div>
            <div className="font-mono text-sm">{yourShare.toLocaleString()} sats</div>
            <div className="text-xs text-muted-foreground">${yourShareUSD}</div>
          </div>
        </div>
        {!settled && onSettle && (
          <Button 
            size="sm" 
            onClick={() => onSettle(id)}
            className="w-full bg-gradient-lightning hover:opacity-90"
          >
            <Zap className="h-4 w-4 mr-2" />
            Update Expense
          </Button>
        )}
        <div className="text-xs text-muted-foreground">
          {new Date(createdAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}