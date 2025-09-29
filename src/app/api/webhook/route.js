import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ADMIN_USER_ID =
  process.env.ADMIN_USER_ID || "b05ec885-ed5f-4fb3-a013-849f9b6dc3e5";

async function fetchCustomerInfo(customer_id) {
  let customerName = "Guest";
  let customerEmail = "guest@example.com";

  if (customer_id) {
    const { data: customer } = await supabase
      .from("customers")
      .select("full_name, email")
      .eq("id", customer_id)
      .single();

    if (customer) {
      customerName = customer.full_name || customerName;
      customerEmail = customer.email || customerEmail;
    }
  }
  return { customerName, customerEmail };
}

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    // ✅ Payment successful
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("💰 Checkout completed:", session.id);

      const { data: order } = await supabase
        .from("orders")
        .select("id, customer_id")
        .eq("provider_session_id", session.id)
        .single();

      if (order) {
        await supabase
          .from("orders")
          .update({
            status: "paid",
            updated_at: new Date().toISOString(),
          })
          .eq("id", order.id);

        await supabase
          .from("order_items")
          .update({ status: "fulfilled" })
          .eq("order_id", order.id);

        // 🧹 Clear cart
        await supabase.from("cart_items").delete().eq("customer_id", order.customer_id);

        const { customerName, customerEmail } = await fetchCustomerInfo(
          order.customer_id
        );

        await supabase.from("notifications").insert([
          {
            user_id: order.customer_id,
            message: `Your order (#${order.id}) has been paid successfully.`,
            type: "order_paid",
            customer_name: customerName,
            customer_email: customerEmail,
          },
          {
            user_id: ADMIN_USER_ID,
            message: `Order (#${order.id}) is now paid by ${customerName}.`,
            type: "order_paid",
            customer_name: customerName,
            customer_email: customerEmail,
          },
        ]);

        console.log("✅ Order marked paid, cart cleared + notifications sent:", order.id);
      }
    }

    // ❌ Payment failed
    if (
      event.type === "payment_intent.payment_failed" ||
      event.type === "checkout.session.async_payment_failed"
    ) {
      const intent = event.data.object;
      console.log("💔 Payment failed:", intent.id);

      const { data: order } = await supabase
        .from("orders")
        .select("id, customer_id")
        .eq("provider_payment_intent_id", intent.id)
        .single();

      if (order) {
        await supabase
          .from("orders")
          .update({
            status: "failed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", order.id);

        await supabase
          .from("order_items")
          .update({ status: "failed" })
          .eq("order_id", order.id);

        const { customerName, customerEmail } = await fetchCustomerInfo(
          order.customer_id
        );

        await supabase.from("notifications").insert([
          {
            user_id: order.customer_id,
            message: `Payment for order (#${order.id}) failed. Please try again.`,
            type: "order_failed",
            customer_name: customerName,
            customer_email: customerEmail,
          },
          {
            user_id: ADMIN_USER_ID,
            message: `Payment failed for order (#${order.id}) by ${customerName}.`,
            type: "order_failed",
            customer_name: customerName,
            customer_email: customerEmail,
          },
        ]);

        console.log("✅ Order marked failed + notifications sent:", order.id);
      }
    }

    // 🚫 Checkout expired → canceled
    if (event.type === "checkout.session.expired") {
      const session = event.data.object;
      console.log("🛑 Checkout expired (canceled):", session.id);

      const { data: order } = await supabase
        .from("orders")
        .select("id, customer_id")
        .eq("provider_session_id", session.id)
        .single();

      if (order) {
        await supabase
          .from("orders")
          .update({
            status: "canceled",
            updated_at: new Date().toISOString(),
          })
          .eq("id", order.id);

        await supabase
          .from("order_items")
          .update({ status: "canceled" })
          .eq("order_id", order.id);

        const { customerName, customerEmail } = await fetchCustomerInfo(
          order.customer_id
        );

        await supabase.from("notifications").insert([
          {
            user_id: order.customer_id,
            message: `Your order (#${order.id}) was canceled (checkout expired).`,
            type: "order_canceled",
            customer_name: customerName,
            customer_email: customerEmail,
          },
          {
            user_id: ADMIN_USER_ID,
            message: `Order (#${order.id}) by ${customerName} was canceled (checkout expired).`,
            type: "order_canceled",
            customer_name: customerName,
            customer_email: customerEmail,
          },
        ]);

        console.log("✅ Order canceled + notifications sent:", order.id);
      }
    }
  } catch (err) {
    console.error("❌ Unexpected webhook error:", err.message);
  }

  return NextResponse.json({ received: true });
}

// Needed for Stripe signature validation
export const config = {
  api: {
    bodyParser: false,
  },
};
