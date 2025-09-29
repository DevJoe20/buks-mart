"use client"; // 🔥 ensures this runs only on the client

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cartItems");
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });
  const [userId, setUserId] = useState(null);

  const cartCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  const saveCartToStorage = (items) => {
    setCartItems(items);
    if (typeof window !== "undefined") {
      localStorage.setItem("cartItems", JSON.stringify(items));
    }
  };

  const clearCart = async () => {
  saveCartToStorage([]); // clear local storage + state

  if (!userId) return;

  // remove all items from cart_items for this user in Supabase
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("customer_id", userId);

  if (error) {
    console.error("Error clearing cart:", error.message);
  }
};


  const fetchCart = async (uid = userId) => {
    if (!uid) {
      saveCartToStorage([]);
      return;
    }

    const { data, error } = await supabase
      .from("cart_items")
      .select(`
        id,
        quantity,
        product:product_id (
          id,
          name,
          price,
          image_url
        )
      `)
      .eq("customer_id", uid);

    if (error) {
      console.error(error);
      return;
    }

    saveCartToStorage(data);
  };

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        fetchCart(user.id);
      }
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUserId(session.user.id);
          fetchCart(session.user.id);
        } else {
          setUserId(null);
          saveCartToStorage([]);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("cart-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cart_items",
          filter: `customer_id=eq.${userId}`,
        },
        () => {
          fetchCart(userId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const addToCart = async (product, quantity = 1) => {
    if (!userId) {
      alert("Please sign in to add items to your cart.");
      return;
    }

    const existingIndex = cartItems.findIndex(
      (item) => item.product.id === product.id
    );
    let newCart;
    if (existingIndex >= 0) {
      newCart = [...cartItems];
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart = [...cartItems, { product, quantity }];
    }
    saveCartToStorage(newCart);

    const { data: existing } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("customer_id", userId)
      .eq("product_id", product.id)
      .maybeSingle();

    let error;
    if (existing) {
      const { error: updateError } = await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + quantity })
        .eq("id", existing.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("cart_items")
        .insert([{ customer_id: userId, product_id: product.id, quantity }]);
      error = insertError;
    }

    if (error) {
      console.error(error);
      fetchCart();
    }
  };

  const removeFromCart = async (productId, quantityToRemove = 1) => {
    if (!userId) return;

    const existingIndex = cartItems.findIndex(
      (item) => item.product.id === productId
    );
    if (existingIndex === -1) return;

    let newCart = [...cartItems];
    if (newCart[existingIndex].quantity > quantityToRemove) {
      newCart[existingIndex].quantity -= quantityToRemove;
    } else {
      newCart.splice(existingIndex, 1);
    }
    saveCartToStorage(newCart);

    const { data: existing, error: fetchError } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("customer_id", userId)
      .eq("product_id", productId)
      .maybeSingle();

    if (fetchError || !existing) {
      console.error(fetchError);
      return;
    }

    let error;
    if (existing.quantity > quantityToRemove) {
      const { error: updateError } = await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity - quantityToRemove })
        .eq("id", existing.id);
      error = updateError;
    } else {
      const { error: deleteError } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", existing.id);
      error = deleteError;
    }

    if (error) {
      console.error(error);
      fetchCart();
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        fetchCart,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
