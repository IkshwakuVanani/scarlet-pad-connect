import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Header from "@/components/Header";
import { AppSidebar } from "@/components/AppSidebar";

const PaymentCanceled = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex w-full">
        <AppSidebar onCampusChange={() => {}} />
        
        <div className="flex-1 w-full">
          <main className="container py-12">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
                <h1 className="text-3xl font-bold text-red-700 mb-2">Payment Canceled</h1>
                <p className="text-muted-foreground">
                  Your payment was canceled and no charges were made.
                </p>
              </div>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>What happened?</CardTitle>
                  <CardDescription>
                    You canceled the payment process or closed the payment window.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Don't worry - no payment was processed and you haven't been charged anything. 
                    You can try again anytime or contact support if you need assistance.
                  </p>
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
                  <Link to="/help">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Get Help
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

export default PaymentCanceled;