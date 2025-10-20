"use client";

export default function DontMiss() {
  const handleScroll = () => {
    const section = document.getElementById("join-community");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-[#A4511F] text-white py-20 text-center px-6">
      <div className="max-w-2xl mx-auto">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Don't Miss Out!</h2>

        {/* Description */}
        <p className="text-sm md:text-base font-semibold mb-8 leading-relaxed">
          Join thousands of Nigerians who stay connected with their culture through our weekly newsletter.
        </p>

        {/* Button */}
        <button
          onClick={handleScroll}
          className="border border-white text-white px-6 py-2 rounded-md font-medium text-sm hover:bg-white hover:text-[#A4511F] transition duration-300"
        >
          Subscribe Now
        </button>
      </div>
    </section>
  );
}
