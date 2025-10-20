import { Heart, Truck, ShieldCheck, Clock } from "lucide-react";

const features = [
  {
    icon: <Heart className="w-12 h-12 text-white" />,
    title: "Authentic Recipes",
    description:
      "Traditional recipes passed down through generations, made with authentic ingredients.",
  },
  {
    icon: <Truck className="w-12 h-12 text-white" />,
    title: "UK-Wide Delivery",
    description:
      "Fast and reliable delivery across the United Kingdom, bringing home to you.",
  },
  {
    icon: <ShieldCheck className="w-12 h-12 text-white" />,
    title: "Quality Guaranteed",
    description:
      "Fresh ingredients and rigorous quality control ensure every snack meets our standards.",
  },
  {
    icon: <Clock className="w-12 h-12 text-white" />,
    title: "Always Fresh",
    description:
      "Made to order and delivered fresh, ensuring you get the best taste every time.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#F7F4EF] py-16 px-4 text-center py-12">
      <div className="max-w-7xl mx-auto py-12">
        <h2 className="text-5xl sm:text-4xl font-bold text-gray-900 mb-4">
          Why Choose Buks Mart?
        </h2>
        <p className="text-gray-900 text-xl max-w-2xl mx-auto mb-12">
          We bring the authentic taste of Nigeria to your doorstep with quality, care,
          and the love that makes every bite feel like home.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center text-3xl">
              <div className="bg-[#A44A26] w-24 h-24 flex items-center justify-center rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-900 text-lg">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
