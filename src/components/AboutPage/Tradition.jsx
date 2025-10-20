"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import { motion } from "framer-motion";

export default function Tradition() {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("image_url")
        .eq("id", "54596240-5f62-4155-9ab9-74ec258eec23")
        .single();

      if (error) {
        console.error("Error fetching image:", error.message);
      } else {
        setImageUrl(data?.image_url);
      }
    };

    fetchImage();
  }, []);

  return (
    <section className="bg-[#FAF7F2] py-12 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        {/* Left Image with Animation */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="w-full"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Tradition"
              className="rounded-lg shadow-md w-full object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 rounded-lg animate-pulse" />
          )}
        </motion.div>

        {/* Right Content with Animation */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#2C1B0F] mb-6">
            Preserving Tradition
          </h2>
          <p className="text-[#3D2B1F] leading-relaxed mb-4">
            At Buks Mart, we bring back the snacks that shaped our childhoods — 
            from the creamy taste of Milo to the sweet chew of Baba Dudu.
          </p>
          <p className="text-[#3D2B1F] leading-relaxed mb-4">
            Discover Nigeria’s most loved classics — Bobo, Hollandia, 
            Caprisun, Speedy Biscuit, and more — all in one place.
          </p>
          {/* <p className="text-[#3D2B1F] leading-relaxed mb-4">
            Our mission goes beyond indulgence. It’s about preserving the essence of 
            Nigerian snacking culture, reconnecting you with the memories that shaped you, 
            and sharing those flavors with the next generation — wherever you are in the world.
          </p> */}
          <p className="text-[#3D2B1F] font-semibold">
            Authentic. Nostalgic. Unmistakably Nigerian. <br />
            Welcome to the taste of home, reimagined.
          </p>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-8 grid grid-cols-2 gap-6"
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-[#2C1B0F]">5000+</p>
              <p className="text-sm text-gray-600">Happy Customers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#2C1B0F]">50+</p>
              <p className="text-sm text-gray-600">Cities Served</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
