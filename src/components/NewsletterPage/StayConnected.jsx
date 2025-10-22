"use client";

import Image from "next/image";
import { Mail } from "lucide-react";

export default function StayConnected() {
  return (
    <section className="bg-[#A4511F] text-white py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left Text Section */}
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Connected</h2>

          <p className="text-sm md:text-base font-semibold leading-relaxed mb-6">
            Subscribe for early access to new Nigerian snack drops, 
            exclusive discounts, and stories that bring you closer to home.
          </p>

          <div className="flex items-center justify-center md:justify-start gap-2 text-sm">
            <Mail className="w-4 h-4" />
            <span>Weekly updates delivered to your inbox</span>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="md:w-1/2 bg-[#F3F3F3] rounded-md flex items-center justify-center h-64 md:h-72">
          <Image
            src="/news.png"
            alt="Stay Connected - Nigerian snacks"
            width={450}
            height={400}
            className="rounded-md object-cover w-full h-full"
          />
        </div>
      </div>
    </section>
  );
}
