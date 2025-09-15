import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Shield, DollarSign, Repeat } from "lucide-react";

interface PaymentModalProps {
  children: React.ReactNode;
  transactionType: 'application_fee' | 'security_deposit' | 'premium_listing' | 'rent_payment';
  listingId?: string;
  recipientUserId?: string;
  defaultAmount?: number;
  isSubscription?: boolean;
}

const transactionDetails = {
  application_fee: {
    title: "Application Fee",
    description: "Pay the application fee to apply for this listing",
    amount: 2500, // $25.00
    icon: <CreditCard className="h-5 w-5" />,
    type: "one-time"
  },
  security_deposit: {
    title: "Security Deposit",
    description: "Security deposit payment for the rental property",
    amount: null, // Variable amount
    icon: <Shield className="h-5 w-5" />,
    type: "one-time"
  },
  premium_listing: {
    title: "Premium Listing",
    description: "Feature your listing to get more visibility",
    amount: 9999, // $99.99 one-time or $29.99/month
    icon: <DollarSign className="h-5 w-5" />,
    type: "flexible"
  },
  rent_payment: {
    title: "Monthly Rent",
    description: "Set up recurring monthly rent payments",
    amount: null, // Variable amount
    icon: <Repeat className="h-5 w-5" />,
    type: "subscription"
  }
};

export const PaymentModal = ({ 
  children, 
  transactionType, 
  listingId, 
  recipientUserId, 
  defaultAmount,
  isSubscription = false 
}: PaymentModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'platform' | 'direct'>('platform');
  const [customAmount, setCustomAmount] = useState(defaultAmount ? (defaultAmount / 100).toString() : '');
  const [subscriptionType, setSubscriptionType] = useState<'monthly' | 'one-time'>('one-time');
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  const details = transactionDetails[transactionType];
  
  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to make a payment",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // For rent payments or if explicitly subscription
      const shouldUseSubscription = transactionType === 'rent_payment' || 
        (transactionType === 'premium_listing' && subscriptionType === 'monthly');
      
      let paymentData: any = {
        payment_method: paymentMethod,
        listing_id: listingId,
        recipient_user_id: recipientUserId,
      };

      if (shouldUseSubscription) {
        paymentData.subscription_type = transactionType === 'rent_payment' ? 'rent_payment' : 'premium_listing';
        if (customAmount) {
          paymentData.monthly_amount = Math.round(parseFloat(customAmount) * 100);
        }
        
        const { data, error } = await supabase.functions.invoke('create-subscription', {
          body: paymentData
        });
        
        if (error) throw error;
        
        // Open Stripe Checkout in new tab
        window.open(data.url, '_blank');
      } else {
        paymentData.transaction_type = transactionType;
        if (customAmount) {
          paymentData.amount = Math.round(parseFloat(customAmount) * 100);
        }
        
        const { data, error } = await supabase.functions.invoke('create-payment', {
          body: paymentData
        });
        
        if (error) throw error;
        
        // Open Stripe Checkout in new tab
        window.open(data.url, '_blank');
      }
      
      setIsOpen(false);
      toast({
        title: "Payment Initiated",
        description: "You've been redirected to Stripe to complete your payment",
      });
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initiate payment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmount = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const getDisplayAmount = () => {
    if (customAmount) {
      return formatAmount(Math.round(parseFloat(customAmount) * 100));
    }
    if (details.amount) {
      if (transactionType === 'premium_listing' && subscriptionType === 'monthly') {
        return "$29.99/month";
      }
      return formatAmount(details.amount);
    }
    return "Variable";
  };

  const platformFeeAmount = () => {
    const amount = customAmount ? parseFloat(customAmount) : (details.amount || 0) / 100;
    if (paymentMethod === 'platform') {
      return (amount * 0.035).toFixed(2);
    }
    return "0.00";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {details.icon}
            {details.title}
          </DialogTitle>
          <DialogDescription>
            {details.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Method Selection */}
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select value={paymentMethod} onValueChange={(value: 'platform' | 'direct') => setPaymentMethod(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="platform">
                  Through RU Housing (3.5% fee)
                </SelectItem>
                <SelectItem value="direct">
                  Direct Payment (No platform fee)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Subscription Type for Premium Listings */}
          {transactionType === 'premium_listing' && (
            <div className="space-y-2">
              <Label>Billing Type</Label>
              <Select value={subscriptionType} onValueChange={(value: 'monthly' | 'one-time') => setSubscriptionType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one-time">One-time Payment ($99.99)</SelectItem>
                  <SelectItem value="monthly">Monthly Subscription ($29.99/month)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Custom Amount Input */}
          {(transactionType === 'security_deposit' || transactionType === 'rent_payment') && (
            <div className="space-y-2">
              <Label>
                {transactionType === 'security_deposit' ? 'Deposit Amount' : 'Monthly Rent Amount'}
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="0.00"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="pl-10"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          )}

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{details.title}</span>
                <span className="font-semibold">{getDisplayAmount()}</span>
              </div>
              
              {paymentMethod === 'platform' && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Platform Fee (3.5%)</span>
                  <span>${platformFeeAmount()}</span>
                </div>
              )}
              
              <div className="pt-2 border-t">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{getDisplayAmount()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Badge */}
          <div className="flex justify-center">
            <Badge variant={paymentMethod === 'platform' ? 'default' : 'secondary'}>
              {paymentMethod === 'platform' ? 'Secure Platform Payment' : 'Direct Payment'}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePayment}
              disabled={isLoading || (!customAmount && !details.amount)}
              className="flex-1"
            >
              {isLoading ? "Processing..." : `Pay ${getDisplayAmount()}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};