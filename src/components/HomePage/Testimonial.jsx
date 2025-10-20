"use client";
import { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Quote } from "lucide-react";
import { supabase } from "../../../supabaseClient";

const Testimonial = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Fetch reviews only
        const { data: reviewsData, error: reviewsError } = await supabase
          .from("reviews")
          .select("id, comment, rating, customer_id, created_at")
          .order("created_at", { ascending: false });

        if (reviewsError) throw reviewsError;

        if (!reviewsData || reviewsData.length === 0) {
          setReviews([]);
          return;
        }

        // Fetch customers separately
        const customerIds = reviewsData.map((r) => r.customer_id).filter(Boolean);

        const { data: customersData, error: customersError } = await supabase
          .from("customers")
          .select("id, full_name, profile_url")
          .in("id", customerIds);

        if (customersError) throw customersError;

        // Merge reviews with customer details
        const merged = reviewsData.map((review) => ({
          ...review,
          customer: customersData.find((c) => c.id === review.customer_id) || null,
        }));

        setReviews(merged);
      } catch (err) {
        console.error("Error fetching reviews:", err.message);
      }
    };

    fetchReviews();
  }, []);

  // Desktop slider: 3 cards
  const desktopSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  // Mobile slider: 1 card
  const mobileSettings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="w-full bg-gray-100 py-12 px-4 md:px-6 lg:px-12">
      <h2 className="text-center text-2xl font-bold mb-8">Customer Reviews</h2>

      <div className="max-w-7xl mx-auto px-2">
        <div className="block lg:hidden">
          <Slider {...mobileSettings}>
            {reviews.map((item) => (
              <div key={item.id} className="px-2">
                <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col justify-between">
                  {/* Rating */}
                  <div className="mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < item.rating ? "text-yellow-500" : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-gray-700 mb-6 text-base leading-relaxed">
                    {item.comment}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          item.customer?.profile_url ||
                          "https://via.placeholder.com/50"
                        }
                        alt={item.customer?.full_name || "Anonymous"}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-sm">
                          {item.customer?.full_name || "Anonymous"}
                        </h4>
                      </div>
                    </div>
                    <Quote className="text-gray-300" />
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* ====== 🖥️ Desktop Slider (3 cards per slide) ====== */}
        <div className="hidden lg:block">
          <Slider {...desktopSettings}>
            {reviews.map((item) => (
              <div key={item.id} className="px-3">
                <div className="bg-white p-8 rounded-lg shadow-md h-full flex flex-col justify-between">
                  {/* Rating */}
                  <div className="mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < item.rating ? "text-yellow-500" : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                    {item.comment}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          item.customer?.profile_url ||
                          "https://via.placeholder.com/50"
                        }
                        alt={item.customer?.full_name || "Anonymous"}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold">
                          {item.customer?.full_name || "Anonymous"}
                        </h4>
                      </div>
                    </div>
                    <Quote className="text-gray-300 w-6 h-6" />
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
