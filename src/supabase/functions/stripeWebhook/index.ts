import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.5.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return new Response('No signature', { status: 400 });
  }

  try {
    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret
    );

    console.log(`Processing webhook event: ${event.type}`);

    // Initialize Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Update purchase status
        const { error } = await supabaseAdmin
          .from('purchases')
          .update({ 
            status: 'completed',
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        if (error) {
          console.error('Error updating purchase:', error);
        } else {
          console.log(`Purchase completed for payment intent: ${paymentIntent.id}`);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Update purchase status
        await supabaseAdmin
          .from('purchases')
          .update({ 
            status: 'failed',
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        console.log(`Payment failed for payment intent: ${paymentIntent.id}`);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        
        // Find purchase by payment intent and update
        await supabaseAdmin
          .from('purchases')
          .update({ 
            status: 'refunded',
            refunded_at: new Date().toISOString(),
          })
          .eq('stripe_payment_intent_id', charge.payment_intent as string);

        console.log(`Charge refunded: ${charge.id}`);
        break;
      }

      case 'account.updated': {
        const account = event.data.object as Stripe.Account;
        
        // Update creator's Stripe account status
        const { error } = await supabaseAdmin
          .from('profiles')
          .update({
            stripe_account_verified: account.charges_enabled && account.payouts_enabled,
          })
          .eq('stripe_account_id', account.id);

        if (error) {
          console.error('Error updating creator account:', error);
        } else {
          console.log(`Creator account updated: ${account.id}`);
        }
        break;
      }

      case 'transfer.created': {
        const transfer = event.data.object as Stripe.Transfer;
        
        // Update purchase with transfer ID
        if (transfer.metadata?.purchase_id) {
          await supabaseAdmin
            .from('purchases')
            .update({ 
              stripe_transfer_id: transfer.id,
            })
            .eq('id', transfer.metadata.purchase_id);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
