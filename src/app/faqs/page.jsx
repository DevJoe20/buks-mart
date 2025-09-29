import { supabase } from "../../../supabaseClient";
import FaqsClient from "./FaqsClient";

// SEO Metadata
export const metadata = {
  title: "FAQs | Buks Mart",
  description:
    "Find answers to common questions about Buks Mart, delivery, payments, orders, and more.",
  openGraph: {
    title: "FAQs | Buks Mart",
    description: "Frequently Asked Questions about shopping with Buks Mart.",
    url: "https://yourdomain.com/faqs",
    siteName: "Buks Mart",
    type: "website",
  },
};

export default async function FaqsPage() {
  // Get total count
  const { count } = await supabase
    .from("faqs")
    .select("id", { count: "exact", head: true });

  const totalCount = count || 0;

  // Fetch the first page (server-side default)
  const pageSize = 5;
  const { data: faqs, error } = await supabase
    .from("faqs")
    .select("id, question, answer")
    .order("created_at", { ascending: true })
    .range(0, pageSize - 1);

  if (error) {
    console.error("Error fetching FAQs:", error.message);
  }

  return (
    <FaqsClient initialFaqs={faqs || []} totalCount={totalCount} pageSize={pageSize} />
  );
}
