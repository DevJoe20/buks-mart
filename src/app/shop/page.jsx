"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Filter, X } from "lucide-react";
import { supabase } from "../../../supabaseClient";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

export default function OurShop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [sortOrder, setSortOrder] = useState("asc");
  const [priceRange, setPriceRange] = useState([0, 20]);
  const [availability, setAvailability] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  // === FETCH PRODUCTS + IMAGES + CATEGORIES ===
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: productsData, error: productError } = await supabase
        .from("products")
        .select(`
          *,
          categories(category_name),
          product_images(image_url, is_main)
        `);

      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("*");

      if (!productError && !categoryError) {
        setProducts(productsData);
        setCategories(categoryData);
      } else {
        console.error("Error fetching data:", productError || categoryError);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  // === FILTER & SORT ===
  useEffect(() => {
    let filtered = [...products];

    if (selectedCategory !== "All Products") {
      filtered = filtered.filter(
        (p) =>
          p.categories?.category_name?.toLowerCase() ===
          selectedCategory.toLowerCase()
      );
    }

    filtered = filtered.filter((p) => {
      const price = parseFloat(p.price);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    if (availability) {
      if (availability === "In Stock") {
        filtered = filtered.filter((p) => p.is_available === true);
      } else if (availability === "Out of Stock") {
        filtered = filtered.filter((p) => p.is_available === false);
      } else if (availability === "Limited Stock") {
        filtered = filtered.filter(
          (p) =>
            parseInt(p.stock_quantity) > 0 &&
            parseInt(p.stock_quantity) < 10
        );
      }
    }

    filtered.sort((a, b) =>
      sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

    setFilteredProducts(filtered);
  }, [products, selectedCategory, sortOrder, priceRange, availability]);

  const handleResetFilters = () => {
    setSelectedCategory("All Products");
    setPriceRange([0, 20]);
    setAvailability("");
  };

  const SkeletonCard = () => (
    <div className="border rounded-lg overflow-hidden shadow-sm animate-pulse">
      <div className="w-full h-48 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="flex gap-2 mt-3">
          <div className="h-8 bg-gray-200 rounded w-1/2" />
          <div className="h-8 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 py-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Snacks</h2>

      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div className="flex flex-wrap gap-3">
          <div>
            <p className="uppercase text-xs font-semibold text-gray-500 mb-1">
              Shop by Category
            </p>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option>All Products</option>
              {categories.map((cat) => (
                <option key={cat.id}>{cat.category_name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <p className="uppercase text-xs font-semibold text-gray-500 mb-1">
            Sort By
          </p>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm bg-[#FAF8F4]"
          >
            <option value="asc">Name (A–Z)</option>
            <option value="desc">Name (Z–A)</option>
          </select>
        </div>
      </div>

      {/* === MAIN CONTAINER === */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 border rounded-md p-4 bg-[#FAF8F4] h-auto lg:h-[300px] overflow-y-auto lg:sticky lg:top-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <Filter size={16} /> Filters
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear All
            </button>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Price Range
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([parseFloat(e.target.value), priceRange[1]])
                }
                className="border rounded-md px-2 py-1 w-16 text-sm"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                min="0"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], parseFloat(e.target.value)])
                }
                className="border rounded-md px-2 py-1 w-16 text-sm"
              />
            </div>
          </div>

          {/* Availability */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Availability
            </p>
            <div className="flex flex-col gap-2">
              {["In Stock", "Out of Stock", "Limited Stock"].map((option) => (
                <button
                  key={option}
                  onClick={() => setAvailability(option)}
                  className={`border text-sm rounded-md px-3 py-1 ${
                    availability === option
                      ? "bg-orange-500 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product List */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              Showing {filteredProducts.length} products
            </p>
            {(availability || selectedCategory !== "All Products") && (
              <button
                onClick={handleResetFilters}
                className="flex items-center text-sm text-orange-500 hover:underline"
              >
                <X size={14} className="mr-1" /> Clear Filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <p className="text-center py-10 text-gray-500">
              No products found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const mainImage =
                  product.product_images?.find((img) => img.is_main)?.image_url ||
                  product.product_images?.[0]?.image_url ||
                  product.image_url ||
                  "/placeholder.png";

                return (
                  <div
                    key={product.id}
                    className="bg-[#FAF8F4] border border-[#f4e3d4] rounded-xl transform hover:scale-105 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
                  >
                    <img
                      src={mainImage}
                      alt={product.name}
                      className="w-full h-56 object-cover px-4 py-4 rounded"
                    />
                    <div className="flex-1 flex flex-col justify-between px-4 py-3">
                      <h4 className="text-[15px] font-semibold text-[#7a3e00] mb-1">
                        {product.name}
                      </h4>
                      <p className="text-[#3a2100] text-[15px] font-semibold mb-1">
                        £{parseFloat(product.price).toLocaleString()}
                      </p>
                      <p className="text-xs text-[#a87552] mb-3">
                        {product.is_available ? "In Stock" : "Out of Stock"}
                      </p>

                      <div className="flex flex-col gap-2 mt-auto">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="bg-[#A44A26] hover:bg-[#8c4100] text-white text-sm py-2 rounded-md transition cursor-pointer"
                        >
                          Add to Cart
                        </button>

                        <Link
                          href={`/product/${product.id}`}
                          className="text-center border border-[#a04b00] text-[#a04b00] text-sm py-2 rounded-md hover:bg-[#fff3e9] transition"
                        >
                          View Product
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
