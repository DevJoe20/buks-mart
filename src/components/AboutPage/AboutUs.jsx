"use client";

import Image from "next/image";
import Link from "next/link";

export default function AboutUs() {
  return (
    <section className="bg-[#A44A26] text-white px-6 md:px-16 py-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Left Content */}
        <div>
          <h2 className="text-4xl font-bold mb-6">Our Story</h2>
          <p className="text-lg leading-relaxed mb-6">
            Born from nostalgia and a deep love for Nigerian cuisine, <span className="font-semibold">Naija Bites</span> 
            was created to bridge the gap between home and the diaspora, one authentic snack at a time.
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-2 border border-white rounded hover:bg-white hover:text-[#9A4D2E] transition"
          >
            Shop Our Snacks
          </Link>
        </div>

        {/* Right Image */}
        <div className="flex justify-center">
          <Image
            src="/About-img.jpeg"
            alt="About Us"
            width={600}
            height={400}
            className="rounded-lg shadow-lg object-cover"
          />
        </div>
      </div>
    </section>
  );
}
