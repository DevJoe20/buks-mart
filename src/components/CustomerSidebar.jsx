"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Clock,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Lock,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { FiCheckCircle } from "react-icons/fi";

const CustomerSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false); 
  const pathname = usePathname();

  const toggleSidebar = () => setCollapsed(!collapsed);
  const toggleMobile = () => setMobileOpen(!mobileOpen);

  const menuItems = [
    { name: "Recent Activity", path: "/customer/dashboard/activity", icon: <Clock size={20} /> },
    { name: "Profile", path: "/customer/dashboard/profile", icon: <User size={20} /> },
    { name: "Change Password", path: "/customer/dashboard/password", icon: <Lock size={20} /> },
    { name: "Settings", path: "/customer/dashboard/settings", icon: <Settings size={20} /> },
    { name: "Orders", path: "/customer/dashboard/allorders", icon: <FiCheckCircle size={20} /> },
    { name: "Notifications", path: "/customer/dashboard/notifications", icon: <Bell size={20} /> },
  ];

  return (
    <>
      {/* Mobile hamburger button (no background) */}
      <button
        onClick={toggleMobile}
        className="md:hidden p-3 text-gray-800 z-50 fixed top-3 left-3 bg-white rounded-full shadow"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`
          ${collapsed ? "w-16" : "w-64"}
          bg-[#A44A26] text-white transition-all duration-300 flex flex-col min-h-screen
          fixed top-0 left-0 z-40
          md:relative md:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} 
        `}
      >
        {/* Toggle button (desktop only) */}
        <button
          onClick={toggleSidebar}
          className="p-3 hover:bg-gray-700 flex justify-center md:block hidden"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        {/* Menu items */}
        <nav className="flex-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setMobileOpen(false)} // close menu on click (mobile)
              className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors ${
                pathname === item.path ? "bg-gray-800" : ""
              }`}
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleMobile}
        />
      )}
    </>
  );
};

export default CustomerSidebar;
