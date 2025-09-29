// app/api/order/route.js
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 🔑 Replace with your actual admin user ID or load from env
const ADMIN_USER_ID = process.env.ADMIN_USER_ID || "b05ec885-ed5f-4fb3-a013-849f9b6dc3e5";

// ================== GET ORDER ==================
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: "Session ID is required" }),
        { status: 400 }
      );
    }

    console.log("Fetching order for session:", sessionId);

    // Fetch order from database
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(`
        id,
        status,
        total_amount,
        subtotal,
        delivery_fee,
        currency,
        created_at,
        order_items (
          id,
          quantity,
          unit_price,
          total_price,
          products (
            id,
            name,
            description,
            image_url
          )
        )
      `)
      .eq("provider_session_id", sessionId)
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404 }
      );
    }

    // If order is pending, check Stripe directly
    if (order.status === "pending") {
      try {
        const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

        if (stripeSession.payment_status === "paid") {
          // Update order status in database
          await supabase
            .from("orders")
            .update({ status: "paid", updated_at: new Date().toISOString() })
            .eq("id", order.id);

          // Update the order status for response
          order.status = "paid";
        }
      } catch (stripeError) {
        console.error("Error checking Stripe session:", stripeError);
        // Continue with current order status
      }
    }

    // Format response
    const formattedOrder = {
      id: order.id,
      status: order.status,
      total_amount: order.total_amount,
      subtotal: order.subtotal,
      delivery_fee: order.delivery_fee,
      currency: order.currency,
      created_at: order.created_at,
      items: order.order_items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        product_id: item.products?.id,
        product_name: item.products?.name || "Unknown Product",
        product_description: item.products?.description,
        product_image: item.products?.image_url,
      })),
    };

    return new Response(JSON.stringify(formattedOrder), { status: 200 });
  } catch (error) {
    console.error("Error in order API:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}

// ================== PATCH ORDER STATUS ==================
export async function PATCH(request) {
  try {
    const { order_id, status, customer_id } = await request.json();

    if (!order_id || !status) {
      return new Response(
        JSON.stringify({ error: "Order ID and status required" }),
        { status: 400 }
      );
    }

    const { data: order, error: updateError } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", order_id)
      .select("id")
      .single();

    if (updateError) throw updateError;

    // Insert notification depending on status
    let notification = null;

    if (status === "dispatched") {
      notification = {
        user_id: customer_id,
        message: `Your order (#${order_id}) has been dispatched.`,
        type: "order_dispatched",
      };
    } else if (status === "delivered") {
      notification = {
        user_id: ADMIN_USER_ID,
        message: `Customer confirmed delivery for order (#${order_id}).`,
        type: "order_delivered",
      };
    }

    if (notification) {
      await supabase.from("notifications").insert([notification]);
    }

    return new Response(
      JSON.stringify({ success: true, orderId: order_id }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating order:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500 }
    );
  }
}
