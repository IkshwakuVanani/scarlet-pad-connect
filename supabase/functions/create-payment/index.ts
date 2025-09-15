import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");
    
    const { transaction_type, listing_id, amount, recipient_user_id, payment_method } = await req.json();
    
    // Validate required fields
    if (!transaction_type || !amount) {
      throw new Error("Missing required fields: transaction_type and amount");
    }

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

    // Determine price_id based on transaction type
    let priceId;
    switch (transaction_type) {
      case 'application_fee':
        priceId = "price_1S7lBJGaYaMyiF9vtQNMAS90"; // $25.00
        break;
      case 'premium_listing':
        priceId = "price_1S7lBlGaYaMyiF9vQpdn0L07"; // $99.99
        break;
      case 'security_deposit':
        // For security deposits, we'll create a custom amount
        const depositSession = await stripe.checkout.sessions.create({
          customer: customerId,
          customer_email: customerId ? undefined : user.email,
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: 'Security Deposit',
                  description: `Security deposit for listing`,
                },
                unit_amount: amount,
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${req.headers.get("origin")}/payment-canceled`,
          metadata: {
            transaction_type,
            listing_id: listing_id || '',
            user_id: user.id,
            recipient_user_id: recipient_user_id || '',
            payment_method: payment_method || 'platform',
          },
        });

        logStep("Deposit session created", { sessionId: depositSession.id });
        return new Response(JSON.stringify({ url: depositSession.url }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      default:
        throw new Error(`Unsupported transaction type: ${transaction_type}`);
    }

    // Create checkout session for predefined prices
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/payment-canceled`,
      metadata: {
        transaction_type,
        listing_id: listing_id || '',
        user_id: user.id,
        recipient_user_id: recipient_user_id || '',
        payment_method: payment_method || 'platform',
      },
    });

    logStep("Checkout session created", { sessionId: session.id, priceId });

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