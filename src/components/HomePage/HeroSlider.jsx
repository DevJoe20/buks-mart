"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import Link from "next/link";

export default function HeroSection() {
  const [productImage, setProductImage] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("image_url")
        .eq("id", "1d9ffdf7-819a-444b-a4c9-d330e5ab8cef")
        .single();

      if (error) {
        console.error("Error fetching product image:", error);
      } else {
        setProductImage(data.image_url);
      }
    };

    fetchImage();
  }, []);

  return (
    <section
      className="relative w-full h-[80vh] flex items-center justify-center text-center text-white"
      style={{
        backgroundImage: `url(${productImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6">
        <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-4">
          <span className="block text-white">Taste of Home</span>
          <span className="block text-[#A04C1A] font-extrabold">Delivered</span>
        </h1>

        <p className="text-lg sm:text-xl font-medium mb-8 text-white leading-relaxed">
          Authentic Nigerian snacks crafted with love and delivered fresh to
          your door across the UK. Reconnect with the flavors that remind you of
          home.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/shop">
            <button className="bg-[#A04C1A] hover:bg-[#8B3F14] text-white font-semibold px-8 py-3 rounded-md transition-all duration-300">
              Shop Now
            </button>
          </Link>
          <Link href="/about">
            <button className="border border-white text-white font-semibold px-8 py-3 rounded-md hover:bg-white hover:text-[#111C44] transition-all duration-300">
              Our Story
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
