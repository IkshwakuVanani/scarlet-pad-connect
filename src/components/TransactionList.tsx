import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Receipt, CreditCard, Shield, DollarSign, Repeat, Calendar } from "lucide-react";

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  created_at: string;
  due_date?: string;
  listing_id?: string;
  metadata?: any;
}

const transactionIcons = {
  application_fee: <CreditCard className="h-4 w-4" />,
  security_deposit: <Shield className="h-4 w-4" />,
  premium_listing: <DollarSign className="h-4 w-4" />,
  rent_payment: <Repeat className="h-4 w-4" />,
};

const transactionLabels = {
  application_fee: "Application Fee",
  security_deposit: "Security Deposit",
  premium_listing: "Premium Listing",
  rent_payment: "Rent Payment",
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
};

export const TransactionList = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmount = (cents: number, currency: string = 'usd') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(cents / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Recent Transactions
        </CardTitle>
        <CardDescription>
          View your payment history and transaction details
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No transactions found</p>
            <p className="text-sm">Your payment history will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div 
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {transactionIcons[transaction.transaction_type as keyof typeof transactionIcons] || 
                     <Receipt className="h-4 w-4" />}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {transactionLabels[transaction.transaction_type as keyof typeof transactionLabels] || 
                         transaction.transaction_type}
                      </p>
                      <Badge 
                        className={statusColors[transaction.status as keyof typeof statusColors]}
                        variant="secondary"
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(transaction.created_at)}
                      </span>
                      
                      {transaction.due_date && (
                        <span>Due: {formatDate(transaction.due_date)}</span>
                      )}
                      
                      <Badge variant="outline" className="text-xs">
                        {transaction.payment_method === 'platform' ? 'RU Housing' : 'Direct'}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold">
                    {formatAmount(transaction.amount, transaction.currency)}
                  </p>
                  {transaction.payment_method === 'platform' && (
                    <p className="text-xs text-muted-foreground">
                      + ${(transaction.amount * 0.035 / 100).toFixed(2)} fee
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {transactions.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <Button variant="outline" size="sm" onClick={fetchTransactions}>
              Refresh Transactions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};