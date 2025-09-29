import { supabase } from "../../../supabaseClient";

// SEO Metadata
export const metadata = {
  title: "Terms & Conditions | Buks Mart",
  description:
    "Read the Terms & Conditions of Buks Mart. Learn about our policies, rules, and legal agreements for using our services.",
  openGraph: {
    title: "Terms & Conditions | Buks Mart",
    description:
      "Understand the policies and rules of using Buks Mart's services.",
    url: "https://yourdomain.com/terms",
    siteName: "Buks Mart",
    type: "website",
  },
};

export default async function TermsPage() {
  const { data: terms, error } = await supabase
    .from("terms")
    .select("section, content, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching terms:", error.message);
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Failed to load Terms & Conditions.</p>
      </div>
    );
  }

  if (!terms || terms.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">No Terms & Conditions found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
        Terms & Conditions
      </h1>

      <div className="text-gray-700 space-y-8">
        {terms.map((term, index) => (
          <div key={index}>
            <h2 className="text-lg font-semibold mb-2">{term.section}</h2>
            <p className="mb-2 leading-relaxed">{term.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
