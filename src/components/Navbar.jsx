"use client";

import { useEffect, useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../app/context/CartContext";
import { supabase } from "../../supabaseClient";
import Image from "next/image";
import NotificationBell from "./NotificationBell";
import { useNotifications } from "../app/hooks/useNotifications";

const Navbar = () => {
  const { cartCount } = useCart();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { unreadCount } = useNotifications(user?.id);

  // Store info
  const [businessLogo, setBusinessLogo] = useState(null);
  const [businessName, setBusinessName] = useState("Buks Mart");

  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    // 🔹 Fetch store logo + name
    const fetchStoreInfo = async () => {
      try {
        const { data, error } = await supabase
          .from("store_info")
          .select("business_logo, business_name")
          .limit(1)
          .single();

        if (error) throw error;
        if (data) {
          setBusinessLogo(data.business_logo);
          setBusinessName(data.business_name);
        }
      } catch (err) {
        console.error("Error fetching store info:", err.message);
      }
    };

    fetchStoreInfo();

    // 🔹 Fetch user + role
    const getUserAndRole = async () => {
      const { data } = await supabase.auth.getUser();
      const currentUser = data.user || null;
      setUser(currentUser);

      if (currentUser) {
        const { data: adminData } = await supabase
          .from("admins")
          .select("id, profile_picture")
          .eq("id", currentUser.id)
          .maybeSingle();

        if (adminData) {
          setRole("admin");
          setProfilePic(adminData.profile_picture);
          return;
        }

        const { data: customerData } = await supabase
          .from("customers")
          .select("id, profile_url")
          .eq("id", currentUser.id)
          .maybeSingle();

        if (customerData) {
          setRole("customer");
          setProfilePic(customerData.profile_url);
          return;
        }

        setRole(null);
        setProfilePic(null);
      }
    };

    getUserAndRole();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);

        if (session?.user) {
          (async () => {
            const { data: adminData } = await supabase
              .from("admins")
              .select("id, profile_picture")
              .eq("id", session.user.id)
              .maybeSingle();

            if (adminData) {
              setRole("admin");
              setProfilePic(adminData.profile_picture);
              return;
            }

            const { data: customerData } = await supabase
              .from("customers")
              .select("id, profile_url")
              .eq("id", session.user.id)
              .maybeSingle();

            if (customerData) {
              setRole("customer");
              setProfilePic(customerData.profile_url);
              return;
            }

            setRole(null);
            setProfilePic(null);
          })();
        } else {
          setRole(null);
          setProfilePic(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="w-full bg-[#FAF8F4] py-4 px-6 md:px-10 flex items-center justify-between shadow-sm border-b border-gray-200 relative">
      {/* Left: Logo and brand */}
      <div className="flex items-center gap-3">
        <Image
          src={businessLogo || "/placeholder-logo.png"}
          alt={businessName}
          width={48}
          height={48}
          className="h-10 w-10 rounded-full object-cover bg-[#A04C1A]"
        />
        <div className="text-xl font-bold text-gray-900 hover:text-[#A04C1A] transition">
         {mounted ? businessName : "Buks Mart"}
        </div>
      </div>

      {/* Middle Section - Navigation Links */}
      <div className="hidden md:flex items-center gap-8 text-lg font-semibold">
        <Link href="/" className="text-[#A04C1A]">
          Home
        </Link>
        <Link href="/shop" className="hover:text-[#A04C1A] transition">
          Shop
        </Link>
        <Link href="/about" className="hover:text-[#A04C1A] transition">
          About
        </Link>
        <Link href="/newsletter" className="hover:text-[#A04C1A] transition">
          Newsletter
        </Link>
        <Link href="/contact" className="hover:text-[#A04C1A] transition">
          Contact
        </Link>

        {user && role && (
          <Link
            href={role === "admin" ? "/admin/dashboard" : "/customer/dashboard"}
            className="hover:text-[#A04C1A] transition"
          >
            Dashboard
          </Link>
        )}
      </div>

      {/* Right (desktop) */}
      <div className="hidden md:flex items-center gap-4 relative">
        {user && (
          <Link
            href={
              role === "admin"
                ? "/admin/dashboard/notifications"
                : "/customer/dashboard/notifications"
            }
            className="relative"
          >
            {mounted && user && (
              <NotificationBell />
            )}
          </Link>
        )}

        {user && profilePic && (
          <Link
            href={role === "admin" ? "/admin/dashboard" : "/customer/dashboard"}
          >
            <Image
              src={profilePic || "/default-avatar.png"}
              alt="profile"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover border"
            />
          </Link>
        )}

        {!user && (
          <div className="flex gap-1">
            <Link href="/sign-in" className="hover:text-[#A04C1A]">
              Sign-In
            </Link>
            /
            <Link href="/sign-up" className="hover:text-[#A04C1A]">
              Sign-Up
            </Link>
          </div>
        )}

        <Link href="/cart-item" className="relative">
          <FiShoppingCart size={20} className="text-[#A04C1A]" />
          {mounted && cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden text-2xl text-[#A04C1A]"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <HiX /> : <HiOutlineMenu />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#FAF8F4] shadow-lg flex flex-col gap-4 p-6 md:hidden z-50">
          <Link href="/" className="font-semibold text-[#A04C1A]">
            Home
          </Link>
          <Link href="/shop" className="hover:text-[#A04C1A] transition">
            Shop
          </Link>
          <Link href="/about" className="hover:text-[#A04C1A] transition">
            About
          </Link>
          <Link href="/newsletter" className="hover:text-[#A04C1A] transition">
            Newsletter
          </Link>
          <Link href="/contact" className="hover:text-[#A04C1A] transition">
            Contact
          </Link>

          {user && role && (
            <Link
              href={
                role === "admin" ? "/admin/dashboard" : "/customer/dashboard"
              }
              className="hover:text-[#A04C1A] transition"
            >
              Dashboard
            </Link>
          )}

          <div className="border-t border-gray-200 my-2" />

          {user && (
            <Link
              href={
                role === "admin"
                  ? "/admin/dashboard/notifications"
                  : "/customer/dashboard/notifications"
              }
              className="relative flex items-center gap-2"
            >
              <span>🔔 Notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -top-2 left-28 bg-red-500 text-white text-xs px-2 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
          )}

          {user && profilePic && (
            <Link
              href={role === "admin" ? "/admin/dashboard" : "/customer/dashboard"}
              className="flex items-center gap-2"
            >
              <Image
                src={profilePic || "/default-avatar.png"}
                alt="profile"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover border"
              />
              <span>Account</span>
            </Link>
          )}

          {!user && (
            <div className="flex gap-2">
              <Link href="/sign-in" className="hover:text-[#A04C1A]">
                Sign-In
              </Link>
              /
              <Link href="/sign-up" className="hover:text-[#A04C1A]">
                Sign-Up
              </Link>
            </div>
          )}

          <Link href="/cart-item" className="relative flex items-center gap-2">
            <FiShoppingCart className="text-[#A04C1A]" size={20} />
            <span>Cart</span>
            {mounted && cartCount > 0 && (
              <span className="absolute -top-2 left-6 bg-red-500 text-white text-xs px-2 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
