import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");
    
    const { subscription_type, listing_id, monthly_amount, recipient_user_id, payment_method } = await req.json();
    
    // Get authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated");
    
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }
    logStep("Customer lookup", { customerId: customerId || 'new customer' });

    // Determine price_id based on subscription type
    let priceId;
    let sessionData: any = {
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/payment-canceled`,
      metadata: {
        subscription_type,
        listing_id: listing_id || '',
        user_id: user.id,
        recipient_user_id: recipient_user_id || '',
        payment_method: payment_method || 'platform',
      },
    };

    switch (subscription_type) {
      case 'premium_listing':
        priceId = "price_1S7lBYGaYaMyiF9vSWpWq1XK"; // $29.99/month
        sessionData.line_items = [
          {
            price: priceId,
            quantity: 1,
          }
        ];
        break;
      case 'rent_payment':
        // For rent payments, create custom recurring price
        if (!monthly_amount) {
          throw new Error("Monthly amount required for rent payments");
        }
        
        sessionData.line_items = [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Monthly Rent Payment',
                description: `Monthly rent for listing`,
              },
              unit_amount: monthly_amount,
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          }
        ];
        break;
      default:
        throw new Error(`Unsupported subscription type: ${subscription_type}`);
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create(sessionData);

    logStep("Subscription session created", { sessionId: session.id, priceId });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});