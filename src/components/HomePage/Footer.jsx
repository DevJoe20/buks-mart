"use client"
import {
  FaWhatsapp,
  FaPhoneAlt,
  FaInstagram,
  FaTiktok,
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaCreditCard,
  FaCcStripe,
  FaCcDiscover,
  FaPaypal,
} from "react-icons/fa";
import { AiFillApple } from "react-icons/ai";
import { FaGooglePlay } from "react-icons/fa";
import Link from "next/link";
// import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#111C44] text-white py-8 px-6 sm:px-6 md:px-10 lg:px-12 xl:px-12">
      <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Logo + Contact */}
        <div>
          <h2 className="text-2xl font-bold mb-4">BUKS MART</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <FaWhatsapp size={20} />
              <span>+447895010343</span>
            </div>
            <div className="flex items-center gap-3">
              <FaPhoneAlt size={20} />
              <span>+447895010343</span>
            </div>
          </div>
        </div>

        {/* Middle: Categories */}
        <div>
          <h3 className="text-2xl font-bold mb-4">Categories</h3>
          <ul className="space-y-2 text-lg">
            <li>Chocolates & Chocolate Pastes</li>
            <li>Sweets, Candies & Chews</li>
            <li>Nuts & Coated Nuts</li>
            <li>Dairy Drinks & Beverages</li>
            <li>Biscuits & Cookies</li>
          </ul>
        </div>

        {/* Right: Customer Services */}
        <div>
          <h3 className="text-2xl font-bold mb-4">Customer Services</h3>
          <ul className="space-y-2 text-lg">
            <Link href="/about-us">
              <li>About Us</li>
            </Link>
            <Link href="/terms">
              <li>Terms & Conditions</li>
            </Link>
            <Link href="/faqs">
              <li>FAQs</li>
            </Link>
            {/* <li>Privacy Policy</li> */}
            {/* <Link href="/feedback">
              <li>Feedback</li>
            </Link> */}
            <Link href="/return">
              <li>Cancellation & Return Policy</li>
            </Link>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-8 border-t border-white/30 pt-4 flex flex-col md:flex-row items-center justify-between text-sm gap-6">
        {/* Left: Socials */}
        <div className="flex gap-4 text-lg">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="hover:text-pink-500 transition-colors" />
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
            <FaTiktok className="hover:text-gray-300 transition-colors" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebookF className="hover:text-blue-500 transition-colors" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="hover:text-sky-400 transition-colors" />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
            <FaYoutube className="hover:text-red-500 transition-colors" />
          </a>
        </div>

        {/* Middle: Copyright */}
        <p className="text-center">
          © 2025 All rights reserved. Buks Mart.
        </p>

        {/* Right: Payment Methods */}
        <div className="flex gap-4 text-2xl">
          <FaCreditCard className="hover:text-yellow-400 transition-colors" title="Card" />
          <FaCcStripe className="hover:text-purple-400 transition-colors" title="Klarna" />
          <FaCcDiscover className="hover:text-green-400 transition-colors" title="Afterpay / Clearpay" />
          <FaPaypal className="hover:text-blue-400 transition-colors" title="PayPal" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
