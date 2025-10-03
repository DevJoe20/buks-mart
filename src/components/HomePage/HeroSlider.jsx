"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./HeroSlider.css";
import Link from "next/link";
import Slider from "react-slick";

const HeroSlider = () => {
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .limit(10);

      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data);
      }
    };

    fetchProducts();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: true,
    beforeChange: (current, next) => setCurrentSlide(next),
  };

  return (
    <div className="w-full h-3/4 relative overflow-hidden">
      {/* Background images */}
      {products.map((product, index) => (
        <div
          key={product.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${product.image_url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
      ))}

      {/* Slider */}
      <Slider {...settings} className="relative z-10 h-full">
        {products.map((product) => (
          <div key={product.id} className="h-full flex items-center">
            <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-12 text-white py-12">
              
              {/* ===== 📱 Mobile Card (only Left Section) ===== */}
              <div className="block lg:hidden">
                <div className="space-y-4 bg-black/30 p-6 rounded-lg backdrop-blur-sm">
                  <h1 className="text-3xl sm:text-4xl font-bold">{product.name}</h1>
                  <div className="text-xl font-semibold">
                    £{product.price}
                    {product.is_available ? (
                      <span className="ml-4 text-sm bg-green-500 px-2 py-1 rounded">
                        In Stock
                      </span>
                    ) : (
                      <span className="ml-4 text-sm bg-red-500 px-2 py-1 rounded">
                        Out of Stock
                      </span>
                    )}
                  </div>
                  <p className="text-lg">
                    <span className="font-medium">Brand:</span> {product.brand}
                  </p>
                  {product.rating && (
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Rating:</span>
                      <div className="flex text-yellow-400">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <span key={i}>
                              {i < Math.floor(Number(product.rating)) ? "★" : "☆"}
                            </span>
                          ))}
                        <span className="ml-2 text-white">({product.rating})</span>
                      </div>
                    </div>
                  )}
                  <Link href={`/product/${product.id}`}>
                    <button className="mt-6 w-full bg-white text-[#111C44] px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105">
                      Buy Now
                    </button>
                  </Link>
                </div>
              </div>

              {/* ===== 🖥️ Desktop Card (Left + Right Section) ===== */}
              <div className="hidden lg:grid grid-cols-2 gap-16">
                {/* Left Section */}
                <div className="space-y-4 bg-black/30 p-6 rounded-lg backdrop-blur-sm">
                  <h1 className="text-5xl font-bold">{product.name}</h1>
                  <div className="text-2xl font-semibold">
                    £{product.price}
                    {product.is_available ? (
                      <span className="ml-4 text-sm bg-green-500 px-2 py-1 rounded">
                        In Stock
                      </span>
                    ) : (
                      <span className="ml-4 text-sm bg-red-500 px-2 py-1 rounded">
                        Out of Stock
                      </span>
                    )}
                  </div>
                  <p className="text-xl">
                    <span className="font-medium">Brand:</span> {product.brand}
                  </p>
                  {product.rating && (
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Rating:</span>
                      <div className="flex text-yellow-400">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <span key={i}>
                              {i < Math.floor(Number(product.rating)) ? "★" : "☆"}
                            </span>
                          ))}
                        <span className="ml-2 text-white">({product.rating})</span>
                      </div>
                    </div>
                  )}
                  <Link href={`/product/${product.id}`}>
                    <button className="mt-6 bg-white text-[#111C44] px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105">
                      Buy Now
                    </button>
                  </Link>
                </div>

                {/* Right Section */}
                {/* <div className="space-y-4 bg-black/30 p-6 rounded-lg backdrop-blur-sm">
                  {product.tags && (
                    <div>
                      <h3 className="font-medium text-lg mb-1">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.split(",").map((tag, index) => (
                          <span
                            key={index}
                            className="bg-white/20 px-3 py-1 rounded-full text-sm"
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
                </div> */}
                {/* Right Section */}
<div className="space-y-4 bg-black/30 p-6 rounded-lg backdrop-blur-sm">
  {product.tags && (
    <div>
      <h3 className="font-medium text-lg mb-1">Tags</h3>
      <div className="flex flex-wrap gap-2">
        {product.tags.split(",").map((tag, index) => (
          <span
            key={index}
            className="bg-white/20 px-3 py-1 rounded-full text-sm"
          >
            {tag.trim()}
          </span>
        ))}
      </div>
    </div>
  )}

  <div className="flex flex-wrap gap-2">
    {product.type && (
      <span className="bg-white/20 px-3 py-1 rounded text-sm">
        <span className="font-medium">Type:</span> {product.type}
      </span>
    )}
    {product.weight && (
      <span className="bg-white/20 px-3 py-1 rounded text-sm">
        <span className="font-medium">Weight:</span> {product.weight}kg
      </span>
    )}
    {product.texture && (
      <span className="bg-white/20 px-3 py-1 rounded text-sm">
        <span className="font-medium">Texture:</span> {product.texture}
      </span>
    )}
    {product.flavor && (
      <span className="bg-white/20 px-3 py-1 rounded text-sm">
        <span className="font-medium">Flavor:</span> {product.flavor}
      </span>
    )}
    {product.shape && (
      <span className="bg-white/20 px-3 py-1 rounded text-sm">
        <span className="font-medium">Shape:</span> {product.shape}
      </span>
    )}
  </div>
</div>

              </div>

            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSlider;
