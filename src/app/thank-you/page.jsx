"use client";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSearchParams, useRouter } from "next/navigation"; // 👈 import router
import { supabase } from "../../../supabaseClient";

const ThankYouPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId"); // 👈 from URL
  const router = useRouter(); // 👈 initialize router

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  useEffect(() => {
    const checkExistingReview = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) throw userError;

        if (!orderId || !user) return;

        // ✅ Check if review already exists
        const { data, error } = await supabase
          .from("reviews")
          .select("id")
          .eq("order_id", orderId)
          .eq("customer_id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setAlreadyReviewed(true);
          setSubmitted(true); // skip form
        }
      } catch (err) {
        console.error("Error checking review:", err.message);
      }
    };

    checkExistingReview();
  }, [orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { error } = await supabase.from("reviews").insert([
        {
          order_id: orderId,
          customer_id: user.id,
          rating,
          comment,
        },
      ]);

      if (error) throw error;

      setSubmitted(true);
    } catch (err) {
      console.error("Error saving review:", err.message);
      alert("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {!submitted ? (
        <>
          <h1 className="text-2xl font-bold text-center mb-4">
            🎉 Thank you for confirming your delivery!
          </h1>
          <p className="text-center text-gray-600 mb-6">
            We’d love to hear your feedback about this order.
          </p>

          {/* Review Form Slider */}
          <Slider {...sliderSettings}>
            <div>
              <form
                onSubmit={handleSubmit}
                className="p-6 border rounded-lg shadow bg-white"
              >
                {/* Rating */}
                <div className="mb-4">
                  <label className="block font-medium mb-2">Rating</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        onClick={() => setRating(star)}
                        className={`cursor-pointer text-2xl ${
                          star <= rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div className="mb-4">
                  <label className="block font-medium mb-2">
                    Leave a Comment
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your feedback here..."
                    className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                    rows={4}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          </Slider>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">✅ Review submitted!</h2>
          {alreadyReviewed ? (
            <p className="text-gray-600">
              You’ve already left a review for this order. Thank you 🙏
            </p>
          ) : (
            <p className="text-gray-600">Thank you for your feedback 🙏</p>
          )}

          {/* Back to Home button */}
          <button
            onClick={() => router.push("/")}
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            ⬅ Back to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default ThankYouPage;
