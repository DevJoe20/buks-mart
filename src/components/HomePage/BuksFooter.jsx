// src/components/BuksFooter.jsx
"use client"
import React, { useEffect, useState } from "react";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { supabase } from "../../../supabaseClient";
import Link from "next/link";

const BuksFooter = () => {
  const [storeInfo, setStoreInfo] = useState(null);

  useEffect(() => {
    const fetchStoreInfo = async () => {
      const { data, error } = await supabase
        .from("store_info")
        .select("business_name, business_phone, business_logo, about_us")
        .single();

      if (error) {
        console.error("Error fetching store info:", error);
      } else {
        setStoreInfo(data);
      }
    };

    fetchStoreInfo();
  }, []);

  return (
    <footer className="bg-[#111] text-gray-300 py-10 px-4 md:px-16 lg:px-12 border-t border-gray-700">
      <div className="max-w-6xl max-auto grid md:grid-cols-4 gap-8 mb-8">
        {/* Business Info */}
        <div>
          <div className="flex items-center space-x-3 mb-4">
            {storeInfo?.business_logo ? (
              <img
                src={storeInfo.business_logo}
                alt={storeInfo.business_name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#d97706] text-white font-semibold">
                N
              </div>
            )}
            <h2 className="text-lg font-semibold text-white">
              {storeInfo?.business_name || "Naija Bites"}
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
              Bringing authentic Nigerian snacks to Nigerians across the UK. 
              Taste the flavors of home, delivered fresh to your door.
          </p>

          <div className="flex space-x-4 mt-4">
            <a href="#" aria-label="Facebook" className="hover:text-white">
              <Facebook size={18} />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-white">
              <Instagram size={18} />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-white">
              <Twitter size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <div className="space-y-2 text-sm grid">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/shop" className="hover:text-white">Shop</Link>
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/newsletter" className="hover:text-white">Newsletter</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>

        {/* Popular Snacks */}
        <div>
          <h3 className="text-white font-semibold mb-4">Popular Snacks</h3>
          <div className="space-y-2 text-sm">
            <Link href="/shop" className="space-y-2 hover:text-white grid">
            <div>Bobo Drink</div>
            <div>Splash Strawberry Candy</div>
            <div>Lemon-X</div>
            <div>Sweetco Milkose Candy</div>
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact</h3>
          {/* <p className="text-sm leading-relaxed text-gray-400">
            123 Nigerian Food Street<br />
            London, E1 6AN
          </p> */}
          <p className="text-sm mt-3 text-gray-400">
            {storeInfo?.business_phone || "+44 20 7XXX XXXX"}
          </p>
          <p className="text-sm mt-1 text-gray-400">
            martbuks@gmail.com
          </p>
        </div>
      </div>

      <hr className="border-gray-700 my-6" />

<div className="flex flex-col md:flex-row justify-center items-center text-sm text-gray-500 space-y-3 md:space-y-0 text-center">
  <p>
    © {new Date().getFullYear()} {storeInfo?.business_name || "Naija Bites"}. All rights reserved.
  </p>
  {/* <div className="flex space-x-4 md:ml-4">
    <a href="#" className="hover:text-white">Privacy Policy</a>
    <a href="#" className="hover:text-white">Terms of Service</a>
  </div> */}
</div>

    </footer>
  );
};

export default BuksFooter;
