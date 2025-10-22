"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { supabase } from "../../../../supabaseClient";
import { useCart } from "@/app/context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const { addToCart } = useCart();

  // Fetch product by ID
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) setProduct(data);
      setLoading(false);
    };

    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    setAdding(true);
    try {
      await addToCart(product, 1);
      toast.success("Added to cart 🛒");
    } catch (err) {
      toast.error("Failed to add to cart ❌");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!product) return <div className="p-6 text-center">Product not found</div>;

  return (
    <div className="bg-[#FAF8F4] py-8 px-6 lg:px-12">
      {/* Mobile Card */}
      <div className="block md:hidden space-y-6">
        {/* Image */}
        <div className="flex justify-center">
          <img
            src={product.image_url}
            alt={product.name}
            className="max-h-[350px] object-contain rounded"
          />
        </div>

        {/* Info */}
        <div>
          <nav className="text-gray-500 mb-4">
            <Link href="/" className="hover:text-blue-600">Home</Link> / 
            <span className="text-gray-900 ml-1">{product.name}</span>
          </nav>

          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <p className="mt-3 text-base">{product.description}</p>
          <div className="text-xl text-[#A4511F] font-bold mt-4">
            £{product.price}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="mt-4 w-full px-6 py-3 bg-[#A4511F] text-white rounded hover:bg-[#B85F3A] disabled:opacity-50"
          >
            {adding ? "Adding..." : "Add to Cart"}
          </button>

          {/* Extra Meta Fields (Mobile, stacked) */}
          <div className="mt-6 space-y-2 text-sm text-gray-700">
            {product.tags && (
              <div>
                <span className="font-medium">Tags:</span>{" "}
                {product.tags.split(",").map((tag, i) => (
                  <span
                    key={i}
                    className="inline-block bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs mr-2 mb-2"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
            {product.type && <p><span className="font-medium">Type:</span> {product.type}</p>}
            {product.weight && <p><span className="font-medium">Weight:</span> {product.weight}</p>}
            {product.texture && <p><span className="font-medium">Texture:</span> {product.texture}</p>}
            {product.flavor && <p><span className="font-medium">Flavor:</span> {product.flavor}</p>}
            {product.shape && <p><span className="font-medium">Shape:</span> {product.shape}</p>}
          </div>
        </div>
      </div>

      {/* 🖥️ Desktop Card */}
      <div className="hidden md:flex flex-wrap">
        {/* Left: Info */}
        <div className="w-1/2 pr-8">
          <nav className="text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">Home</Link> / 
            <span className="text-gray-900 ml-1">{product.name}</span>
          </nav>

          <h1 className="text-3xl font-semibold">{product.name}</h1>
          <p className="mt-4 text-lg">{product.description}</p>
          <div className="text-2xl text-[#A4511F] font-bold mt-6">
            £{product.price}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="mt-6 px-6 py-3 bg-[#A4511F] text-white rounded hover:bg-[#B85F3A] disabled:opacity-50"
          >
            {adding ? "Adding..." : "Add to Cart"}
          </button>

          {/* Extra Meta Fields (Desktop, cleaner layout) */}
          <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-gray-700">
            {product.tags && (
              <div className="col-span-2">
                <h3 className="font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.split(",").map((tag, i) => (
                    <span
                      key={i}
                      className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {product.type && <p><span className="font-medium">Type:</span> {product.type}</p>}
            {product.weight && <p><span className="font-medium">Weight:</span> {product.weight}</p>}
            {product.texture && <p><span className="font-medium">Texture:</span> {product.texture}</p>}
            {product.flavor && <p><span className="font-medium">Flavor:</span> {product.flavor}</p>}
            {product.shape && <p><span className="font-medium">Shape:</span> {product.shape}</p>}
          </div>
        </div>

        {/* Right: Image */}
        <div className="w-1/2 flex justify-center">
          <img
            src={product.image_url}
            alt={product.name}
            className="max-h-[500px] object-contain rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
