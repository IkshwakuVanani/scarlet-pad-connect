import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowLeft, Receipt } from "lucide-react";
import Header from "@/components/Header";
import { AppSidebar } from "@/components/AppSidebar";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    // Here you could fetch payment details from your backend if needed
    // For now, we'll show a generic success message
    if (sessionId) {
      setPaymentDetails({
        sessionId,
        status: 'completed'
      });
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex w-full">
        <AppSidebar onCampusChange={() => {}} />
        
        <div className="flex-1 w-full">
          <main className="container py-12">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-green-700 mb-2">Payment Successful!</h1>
                <p className="text-muted-foreground">
                  Your payment has been processed successfully.
                </p>
              </div>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    Payment Details
                  </CardTitle>
                  <CardDescription>
                    Transaction completed successfully
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sessionId && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Session ID:</span>
                      <Badge variant="outline" className="font-mono text-xs">
                        {sessionId.substring(0, 20)}...
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge variant="default" className="bg-green-600">
                      Completed
                    </Badge>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      You will receive an email confirmation shortly. If you have any questions about 
                      your payment, please contact our support team.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4 justify-center">
                <Button asChild variant="outline">
                  <Link to="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/profile">
                    View My Transactions
                  </Link>
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;