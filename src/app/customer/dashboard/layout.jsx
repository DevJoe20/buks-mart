"use client";

import CustomerSidebar from "@/components/CustomerSidebar";


export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <CustomerSidebar />
      <main className="w-full flex-1 bg-gray-100 p-6">{children}</main>
    </div>
  );
}
