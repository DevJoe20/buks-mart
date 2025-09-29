"use client";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart,
  Settings,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  FileText,
  Info,
  MessageSquare,
  Bell,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false); 
  const pathname = usePathname();

  const toggleSidebar = () => setCollapsed(!collapsed);
  const toggleMobile = () => setMobileOpen(!mobileOpen);

  const menuItems = [
    { name: "Overview", path: "/admin/dashboard/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Products", path: "/admin/dashboard/products", icon: <Package size={20} /> },
    { name: "Add Product", path: "/admin/dashboard/upload", icon: <PlusCircle size={20} /> },
    { name: "Orders", path: "/admin/dashboard/orders", icon: <ShoppingCart size={20} /> },
    { name: "Customers", path: "/admin/dashboard/customers", icon: <Users size={20} /> },
    { name: "Notifications", path: "/admin/dashboard/notifications", icon: <Bell size={20} /> },
    { name: "Messages", path: "/admin/dashboard/messages", icon: <MessageSquare size={20} /> },
    { name: "Reports", path: "/admin/dashboard/reports", icon: <BarChart size={20} /> },
    { name: "FAQs", path: "/admin/dashboard/faqs", icon: <HelpCircle size={20} /> },
    { name: "Policy", path: "/admin/dashboard/policy", icon: <FileText size={20} /> },
    { name: "Terms", path: "/admin/dashboard/terms", icon: <FileText size={20} /> },
    { name: "About Us", path: "/admin/dashboard/info", icon: <Info size={20} /> },
    { name: "Settings", path: "/admin/dashboard/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Mobile hamburger button */}
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
          bg-gray-900 text-white transition-all duration-300 flex flex-col min-h-screen
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
              onClick={() => setMobileOpen(false)}
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

      {/* Overlay (mobile only) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleMobile}
        />
      )}

      {/* Main content */}
      {/* <div className="flex-1 bg-gray-100 p-6"></div> */}
    </div>
  );
};

export default AdminSidebar;
