Deno.serve(() => new Response(JSON.stringify({ error: "Payments have been retired from Scarlet Pad." }), { status: 410, headers: { "Content-Type": "application/json" } }));
