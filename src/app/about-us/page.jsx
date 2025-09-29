import { FiPhone } from "react-icons/fi";
import { supabase } from "../../../supabaseClient";

// SEO Metadata
export const metadata = {
  title: "About Us | Buks Mart",
  description:
    "Learn more about Buks Mart – who we are, our promise, delivery services, and how to contact us for all your shopping needs.",
  keywords: [
    "Buks Mart",
    "About Buks Mart",
    "Online Store",
    "Fast Delivery",
    "Affordable Shopping",
  ],
  openGraph: {
    title: "About Us | Buks Mart",
    description:
      "Discover who we are at Buks Mart. Learn about our promise, delivery services, and contact information.",
    url: "https://yourdomain.com/about-us",
    siteName: "Buks Mart",
    images: [
      {
        url: "/Buks_Mart.jpeg",
        width: 800,
        height: 600,
        alt: "Buks Mart",
      },
    ],
    type: "website",
  },
};

export default async function AboutUsPage() {
  // Fetch store info
  const { data: store, error: storeError } = await supabase
    .from("store_info")
    .select("*")
    .limit(1)
    .single();

  if (storeError) {
    console.error("Error fetching store info:", storeError);
  }

  // Fetch delivery fees
  const { data: fees, error: feeError } = await supabase
    .from("delivery_fees")
    .select("*")
    .order("fee", { ascending: true });

  if (feeError) {
    console.error("Error fetching delivery fees:", feeError);
  }

  if (!store) {
    return (
      <div className="p-6 text-center text-red-600">
        Store information not available.
      </div>
    );
  }

  return (
    <div className="w-full px-6 md:px-12 lg:px-20 py-12">
      <div className="">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
          About Us
        </h1>
        <p className="text-gray-600 text-base md:text-lg text-center mb-12">
          Welcome to{" "}
          <span className="font-semibold">{store.business_name}</span> –{" "}
          {store.slogan}
        </p>

        {/* Business Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          <div className="bg-gray-50 rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Who We Are
            </h2>
            <p className="text-gray-600 leading-relaxed">{store.about_us}</p>
          </div>

          <div className="bg-gray-50 rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Our Promise
            </h2>
            <ul className="text-gray-600 space-y-2">
              <li>{store.delivery_locations} delivery</li>
              <li>{store.delivery_options}</li>
              <li>Fast delivery – {store.estimated_delivery}</li>
              <li>Courier: {store.courier_service}</li>
              <li>Payments: {store.payment_methods?.join(", ")}</li>
            </ul>
          </div>
        </div>

        {/* Delivery Fees */}
        <div className="bg-white border rounded-2xl shadow p-6 mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Delivery Fees
          </h2>
          {fees?.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {fees.map((fee) => (
                <li
                  key={fee.id}
                  className="flex justify-between py-2 text-gray-700"
                >
                  {fee.min_weight}kg - {fee.max_weight ? `${fee.max_weight}kg` : "and above"}
                  <span className="font-medium">
                    {store.currency} {fee.fee}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No delivery fees available.</p>
          )}
        </div>

        {/* Contact Info */}
        <div className="bg-blue-50 rounded-2xl shadow p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Contact Us
          </h2>
          <p className="text-gray-700">{store.business_address}</p>
          <p className="text-gray-700 flex items-center justify-center gap-2">
            <FiPhone className="text-blue-600" />
            {store.business_phone}
          </p>
        </div>
      </div>
    </div>
  );
}
