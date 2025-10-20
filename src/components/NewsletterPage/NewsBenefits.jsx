"use client";

import { Gift, Bell, Users, Mail } from "lucide-react";

export default function NewsBenefits() {
  const benefits = [
    {
      icon: <Gift className="w-6 h-6 text-white" />,
      title: "Exclusive Offers",
      description:
        "Get access to subscriber-only discounts and early bird pricing on new products.",
    },
    {
      icon: <Bell className="w-6 h-6 text-white" />,
      title: "First to Know",
      description:
        "Be the first to hear about new snack launches and limited edition flavors.",
    },
    {
      icon: <Users className="w-6 h-6 text-white" />,
      title: "Community",
      description:
        "Connect with other Nigerians and share your love for authentic flavors.",
    },
    {
      icon: <Mail className="w-6 h-6 text-white" />,
      title: "Recipes & Tips",
      description:
        "Relive sweet memories with throwback treats, nostalgic stories, and snack spotlights.",
    },
  ];

  return (
    <section className="bg-[#FAF8F4] py-20 px-6 text-center">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Newsletter Benefits
        </h2>
        <p className="text-gray-700 font-medium text-sm md:text-base">
          Join over <span className="font-bold">10,000 Nigerians</span> who stay connected with their culture through our newsletter.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 text-center transform hover:-translate-y-2 hover:bg-[#FFF6F1]"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-[#A4511F] rounded-full p-3 flex items-center justify-center">
                {benefit.icon}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {benefit.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
