import Navbar from "@/components/Navbar";
import "./globals.css";
import Providers from "./Providers";
import Footer from "@/components/HomePage/Footer";
// import Providers from "./Providers";
// import { CartProvider } from "./context/CartContext";
// import Footer from "@/components/Footer";

export const metadata = {
  metadataBase: new URL('https://buks-mart-tpjv.vercel.app'),
  title: "Buks Mart",
  description: "Your online snack store 🍪",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}   {/* <- every page will render here */}
          {/* <Footer /> */}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
