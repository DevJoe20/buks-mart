import { supabase } from "../../../supabaseClient";

// SEO Metadata
export const metadata = {
  title: "Cancellation & Return Policy | Buks Mart",
  description:
    "Read Buks Mart’s Cancellation & Return Policy. Understand how returns, refunds, and order cancellations are handled.",
  openGraph: {
    title: "Cancellation & Return Policy | Buks Mart",
    description:
      "Learn about how Buks Mart processes returns, cancellations, and refunds for orders.",
    url: "https://yourdomain.com/returns",
    siteName: "Buks Mart",
    type: "website",
  },
};

export default async function ReturnsPage() {
  // Fetch return policy from Supabase (server-side)
  const { data: policy, error } = await supabase
    .from("return_policy")
    .select("section, content, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching return policy:", error.message);
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Failed to load Cancellation & Return Policy.</p>
      </div>
    );
  }

  if (!policy || policy.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">No Cancellation & Return Policy found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
        Cancellation & Return Policy
      </h1>

      <div className="text-gray-700 space-y-8">
        {policy.map((item, index) => (
          <div key={index}>
            <h2 className="text-lg font-semibold mb-2">{item.section}</h2>
            <p className="mb-2 leading-relaxed">{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
