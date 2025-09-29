// app/api/checkout/route.js
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ADMIN_USER_ID = process.env.ADMIN_USER_ID || "b05ec885-ed5f-4fb3-a013-849f9b6dc3e5";

export async function POST(req) {
  try {
    const { customer_id, items, delivery_fee, total_weight } = await req.json();

    console.log("Checkout request received:", { 
      customer_id, 
      items_count: items?.length,
      delivery_fee,
      total_weight 
    });

    if (!items?.length) {
      return new Response(JSON.stringify({ error: "No items provided" }), { status: 400 });
    }

    // Validate items
    const validItems = items.filter(item => 
      item.id && item.price > 0 && item.quantity > 0
    );
    
    if (validItems.length === 0) {
      return new Response(JSON.stringify({ error: "No valid items provided" }), { status: 400 });
    }

    const totalAmount = validItems.reduce(
      (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
      0
    );

    console.log("Calculated totals:", { totalAmount, delivery_fee, total_weight });

    // Get customer email
    let customerName = "Guest";
    let customerEmail = "guest@example.com";
    if (customer_id) {
      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .select("full_name, email")
        .eq("id", customer_id)
        .single();
      
      if (!customerError && customer?.email) {
        customerEmail = customer.email;
      }
    }

    // Build line items for Stripe
    const line_items = validItems.map((item) => ({
      price_data: {
        currency: "gbp",
        product_data: {
          name: item.name || "Product",
          description: item.description?.substring(0, 300) || "",
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round((item.price || 0) * 100),
      },
      quantity: item.quantity || 1,
    }));

    if (delivery_fee > 0) {
      line_items.push({
        price_data: {
          currency: "gbp",
          product_data: {
            name: "Delivery Fee",
            description: `Shipping for ${total_weight?.toFixed(2) || 0}kg package`,
          },
          unit_amount: Math.round(delivery_fee * 100),
        },
        quantity: 1,
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "klarna", "afterpay_clearpay"],
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      customer_email: customerEmail,
      automatic_tax: { enabled: true },
    });

    console.log("Stripe session created:", session.id);

    // Insert order into DB - calculate total manually to avoid trigger issues
    const orderTotal = totalAmount + (delivery_fee || 0);
    
    const orderData = {
      customer_id: customer_id || null,
      status: "pending",
      total_amount: orderTotal,
      delivery_fee: delivery_fee || 0,
      total_weight: total_weight || 0,
      currency: "GBP",
      payment_provider: "stripe",
      provider_session_id: session.id,
      subtotal: totalAmount,
    };

    console.log("Inserting order:", orderData);

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([orderData])
      .select("id")
      .single();

    if (orderError) {
      console.error("Order insertion error:", orderError);
      throw new Error(`Order insertion failed: ${orderError.message}`);
    }

    console.log("Order created:", order.id);

    // Insert order items - temporarily disable trigger if needed
    const orderItems = validItems.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity || 1,
      unit_price: item.price || 0,
      total_price: (item.price || 0) * (item.quantity || 1),
    }));

    console.log("Inserting order items:", orderItems);

    // Option 1: Try without disabling trigger first
    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Order items insertion error:", itemsError);
      
      // If trigger is causing issues, you might need to disable it temporarily
      // This requires additional permissions - use with caution
      throw new Error(`Order items insertion failed: ${itemsError.message}`);
    }

    console.log("Order items inserted successfully");

    // ✅ Insert notifications
    const notifications = [
      {
        user_id: customer_id,
        message: `You placed an order (#${order.id}). We'll notify you when it ships.`,
        type: "order_placed",
      },
      {
        user_id: ADMIN_USER_ID,
        message: `New order (#${order.id}) placed by customer.`,
        type: "order_placed",
        customer_name: customerName,
        customer_email: customerEmail,
      },
      {
        user_id: ADMIN_USER_ID,
        message: `New order (#${order.id}) placed by ${customerName}.`,
        type: "order_placed",
        customer_name: customerName,
        customer_email: customerEmail,
      },
    ];

    await supabase.from("notifications").insert(notifications);

    return new Response(
      JSON.stringify({
        url: session.url,
        sessionId: session.id,
        orderId: order.id,
        success: true,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating checkout:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500 }
    );
  }
}