"use client";

import Link from "next/link";

export default function ReadyToShop() {
  return (
    <section className="bg-[#A44A26] py-16 px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Ready to Taste Home?
        </h2>
        <p className="text-white font-medium mb-8">
          Join thousands of Nigerians across the UK who trust us to deliver the
          authentic flavors they grew up with.
        </p>

        <Link href="/shop">
          <button
            className="border border-white text-white px-6 py-2 rounded-md font-medium 
                       hover:bg-white hover:text-[#A44A26] 
                       transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Start Shopping
          </button>
        </Link>
      </div>
    </section>
  );
}
