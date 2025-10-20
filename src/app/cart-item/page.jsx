"use client";
import React, { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { supabase } from "../../../supabaseClient";

const CartItems = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [deliveryRules, setDeliveryRules] = useState([]);
  const [deliveryFee, setDeliveryFee] = useState(0);

  // Fetch current user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user || null);
    };
    getUser();
  }, []);

  // Fetch cart items
  useEffect(() => {
    if (!user) return;

    const fetchCartItems = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("cart_items")
        .select(`
          id,
          quantity,
          product:products (
            id,
            name,
            price,
            description,
            image_url,
            weight
          )
        `)
        .eq("customer_id", user.id);

      if (error) {
        console.error("Error fetching cart items:", error);
      } else {
        setCartItems(data || []);
        setSelectedItems(data.map((item) => item.id));
      }
      setLoading(false);
    };

    fetchCartItems();
  }, [user]);

  // Fetch delivery fee rules
  useEffect(() => {
    const fetchDeliveryFees = async () => {
      const { data, error } = await supabase
        .from("delivery_fees")
        .select("*")
        .order("min_weight", { ascending: true });

      if (error) {
        console.error("Error fetching delivery fees:", error);
      } else {
        setDeliveryRules(data || []);
      }
    };

    fetchDeliveryFees();
  }, []);

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
    }
  };

  // Toggle single select
  const toggleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // Update quantity
  const handleQuantityChange = async (cartId, qty) => {
    await supabase.from("cart_items").update({ quantity: qty }).eq("id", cartId);
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === cartId ? { ...item, quantity: qty } : item
      )
    );
  };

  // Delete item
  const handleDelete = async (cartId) => {
    await supabase.from("cart_items").delete().eq("id", cartId);
    setCartItems((prev) => prev.filter((item) => item.id !== cartId));
    setSelectedItems((prev) => prev.filter((id) => id !== cartId));
  };

  // Selected products & totals
  const selectedProducts = cartItems.filter((item) =>
    selectedItems.includes(item.id)
  );

  const totalAmount = selectedProducts.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalWeight = selectedProducts.reduce(
    (sum, item) => sum + (parseFloat(item.product.weight) || 0) * item.quantity,
    0
  );

  // Determine delivery fee
  useEffect(() => {
    if (deliveryRules.length === 0) return;

    const rule = deliveryRules.find(
      (r) =>
        totalWeight >= parseFloat(r.min_weight) &&
        (r.max_weight === null || totalWeight <= parseFloat(r.max_weight))
    );

    setDeliveryFee(rule ? parseFloat(rule.fee) : 0);
  }, [totalWeight, deliveryRules]);


  const handleCheckout = async () => {
    try {
      const items = selectedProducts.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        description: item.product.description || "No description",
        image: item.product.image_url || "",
        weight: item.product.weight || "0",
      }));

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: user?.id,
          items,
          delivery_fee: deliveryFee,
          total_weight: totalWeight,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error starting checkout:", data.error);
        return;
      }

      if (data?.url) {
        window.location.href = data.url; // redirect to Stripe Checkout
      }
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="w-full mx-auto px-8 sm:px-6 lg:px-10 py-8">
      {/* Shipping banner */}
<div className="bg-[#A4511F] text-white px-4 py-3 rounded flex flex-col sm:flex-row sm:justify-between sm:items-center text-center sm:text-left gap-2">
  <span className="font-medium">
    Fresh snacks, straight to your door
  </span>
  <span className="text-sm">
    Order today & taste the difference
  </span>
</div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        {/* Left side */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between border-b py-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedItems.length === cartItems.length}
                onChange={toggleSelectAll}
                className="w-5 h-5"
              />
              <span className="font-medium">
                Select all ({cartItems.length})
              </span>
            </label>
          </div>

          <div className="mt-4 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4"
              >
                <div className="flex items-start gap-4 w-full sm:w-2/3">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleSelectItem(item.id)}
                    className="w-5 h-5 mt-2"
                  />
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-medium text-gray-800 line-clamp-2">
                      {item.product.name}
                    </h3>
                    <div className="mt-2">
                      <span className="text-lg font-bold text-gray-800">
                        £{item.product.price.toLocaleString()}
                      </span>
                      {item.product.weight && (
                        <p className="text-sm text-gray-500">
                          {item.product.weight}kg
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-4 sm:mt-0">
                  <select
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.id, parseInt(e.target.value))
                    }
                    className="border px-2 py-1 rounded"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Qty {i + 1}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Order Summary */}
        {selectedItems.length > 0 && (
          <div className="border p-4 rounded-lg bg-[#FAF8F4] shadow-sm h-fit">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="flex justify-between text-sm text-gray-700">
              <span>Item(s) total:</span>
              <span>£{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700 mt-2">
              <span>Total Weight:</span>
              <span>{totalWeight.toFixed(2)} kg</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700 mt-2">
              <span>Delivery Fee:</span>
              <span>£{deliveryFee.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-xl font-bold mt-4">
              <span>Total:</span>
              <span>£{(totalAmount + deliveryFee).toFixed(2)}</span>
            </div>

            {/* Delivery Fee Breakdown */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">
                Delivery Fee Rates
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {deliveryRules.map((rule, i) => {
                  const isActive =
                    totalWeight >= parseFloat(rule.min_weight) &&
                    (rule.max_weight === null ||
                      totalWeight <= parseFloat(rule.max_weight));
                  return (
                    <li
                      key={i}
                      className={`flex justify-between ${
                        isActive ? "font-bold text-gray-900" : ""
                      }`}
                    >
                      <span>
                        {parseFloat(rule.min_weight)}kg –{" "}
                        {rule.max_weight ? `${parseFloat(rule.max_weight)}kg` : "above"}
                      </span>
                      <span>£{parseFloat(rule.fee).toFixed(2)}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3 rounded-lg mt-4 font-medium bg-[#A4511F] hover:bg-[#B85F3A] text-white"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartItems;
