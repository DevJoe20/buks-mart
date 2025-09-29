"use client"
import Link from "next/link";
import React from "react";

const Cancel = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-50 px-6">
      <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Payment Cancelled ❌
        </h1>
        <p className="text-gray-700 mb-6">
          Looks like you canceled the payment. No worries, you can try again anytime.
        </p>
        <Link
          href="/cart-item"
          className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700"
        >
          Back to Cart
        </Link>
      </div>
    </div>
  );
};

export default Cancel;
