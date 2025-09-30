"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import Link from "next/link";

export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) return;
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .ilike("name", `%${query}%`);

      if (error) {
        console.error(error);
      } else {
        setResults(data);
      }
    };

    fetchProducts();
  }, [query]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        Search Results for: <span className="text-orange-500">{query}</span>
      </h1>

      {results.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <>
          {/* 🔹 Desktop Cards (grid view) */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map((product) => (
              <div
                key={product.id}
                className="p-4 rounded shadow hover:shadow-lg transition"
              >
                <Link href={`/product/${product.id}`}>
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded"
                  />
                  <h2 className="font-semibold pt-3">{product.name}</h2>
                  <p className="text-sm text-gray-500">{product.brand}</p>
                  <p className="text-lg font-bold text-orange-500">
                    £{product.price}
                  </p>
                </Link>
              </div>
            ))}
          </div>

          {/* 🔹 Mobile Cards (stacked full width) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {results.map((product) => (
              <div
                key={product.id}
                className="p-3 rounded shadow hover:shadow-md transition"
              >
                <Link href={`/product/${product.id}`}>
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded"
                  />
                  <h2 className="font-semibold pt-3 text-base">{product.name}</h2>
                  <p className="text-sm text-gray-500">{product.brand}</p>
                  <p className="text-base font-bold text-orange-500">
                    £{product.price}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
