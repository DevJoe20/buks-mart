// app/success/page.jsx
"use client";

import { Suspense } from "react";
import SuccessContent from "./SuccessContent"

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg">Loading checkout details...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
