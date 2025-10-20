"use client";
import Link from "next/link";

export default function Community() {
  return (
    <section className="bg-[#A44A26] py-20 text-center text-white">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Join Our Community
        </h2>
        <p className="font-semibold text-sm md:text-base leading-relaxed mb-8">
          Become part of a growing community of Nigerians who choose authenticity,
          quality, and the taste of home.
        </p>

        {/* Buttons - Desktop and Mobile */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/shop"
            className="border border-white text-white px-6 py-2 rounded-md hover:bg-white hover:text-[#A4511F] transition-colors duration-300 text-sm md:text-base"
          >
            Shop Now
          </Link>
          <Link
            href="/contact"
            className="border border-white text-white px-6 py-2 rounded-md hover:bg-white hover:text-[#A4511F] transition-colors duration-300 text-sm md:text-base"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
