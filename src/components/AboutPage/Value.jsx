"use client";
import { Award, Users, Globe, Clock } from "lucide-react";

const values = [
  {
    icon: <Award size={28} className="text-white" />,
    title: "Authenticity",
    description:
      "We never compromise on authentic flavors and unforgettable memories.",
  },
  {
    icon: <Users size={28} className="text-white" />,
    title: "Community",
    description:
      "Building connections and bringing Nigerians together through food.",
  },
  {
    icon: <Globe size={28} className="text-white" />,
    title: "Accessibility",
    description:
      "Making Nigerian snacks accessible to everyone across the UK.",
  },
  {
    icon: <Clock size={28} className="text-white" />,
    title: "Freshness",
    description:
      "Every order is prepared fresh and delivered at peak quality.",
  },
];

export default function Value() {
  return (
    <section className="py-16 bg-[#FAF8F4]">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Values</h2>
        <p className="text-gray-700 font-semibold mb-10">
          Everything we do is guided by our commitment to authenticity, quality,
          and community.
        </p>

        {/* Desktop layout */}
        <div className="hidden md:grid md:grid-cols-4 gap-6">
          {values.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-8 text-center hover:shadow-md transition-shadow"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-[#A4511F] w-12 h-12 rounded-full flex items-center justify-center">
                  {item.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:hidden">
          {values.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-[#A4511F] w-10 h-10 rounded-full flex items-center justify-center">
                  {item.icon}
                </div>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
