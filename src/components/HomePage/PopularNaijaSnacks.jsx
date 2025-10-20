"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "../../../supabaseClient";

export default function PopularNaijaSnacks() {
  const [snacks, setSnacks] = useState([]);

  useEffect(() => {
    const fetchSnacks = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, texture, image_url")
        .limit(4);

      if (error) {
        console.error("Error fetching snacks:", error);
      } else {
        setSnacks(data);
      }
    };

    fetchSnacks();
  }, []);

  return (
    <section className="bg-[#F7F4EF] py-16 px-4 sm:px-6 lg:px-14 text-center">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Popular Nigerian Snacks
        </h2>
        <p className="text-gray-900 text-lg max-w-2xl mx-auto mb-10">
          From crispy plantain chips to sweet chin chin, discover the flavors that bring
          back memories of home.
        </p>

        {/* Snack Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {snacks.map((snack) => (
            <div
              key={snack.id}
              className="bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col cursor-pointer"
            >
              <div className="relative w-full h-36 sm:h-40 lg:h-48">
                <Image
                  src={snack.image_url || "/placeholder.png"}
                  alt={snack.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="p-3 flex-1 flex flex-col text-left">
                <h3 className="font-bold text-gray-900 text-2xl sm:text-base mb-1">
                  {snack.name}
                </h3>
                <p className="text-gray-700 font-semibold sm:text-sm line-clamp-2">
                  {snack.texture}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="mt-10">
          <Link href="/shop">
            <button className="bg-[#A44A26] text-white px-6 py-2 rounded-md font-medium hover:bg-[#8d3e1f] transition">
              View All Snacks
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
