import Link from "next/link";
import { CiFacebook } from "react-icons/ci";
import { FaInstagram, FaWhatsapp, FaTelegramPlane } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white mt-auto">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Social Networks Section */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-amber-400 text-2xl font-bold mb-4">
              Social Networks
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <Link
                href={"#"}
                className="flex items-center gap-2 text-white hover:text-amber-400 transition-colors"
              >
                <CiFacebook className="text-3xl" />
                <span className="hidden md:inline">Facebook</span>
              </Link>
              <Link
                href={"#"}
                className="flex items-center gap-2 text-white hover:text-amber-400 transition-colors"
              >
                <FaInstagram className="text-3xl" />
                <span className="hidden md:inline">Instagram</span>
              </Link>
              <Link
                href={"#"}
                className="flex items-center gap-2 text-white hover:text-amber-400 transition-colors"
              >
                <FaTelegramPlane className="text-3xl" />
                <span className="hidden md:inline">Telegram</span>
              </Link>
              <Link
                href={"#"}
                className="flex items-center gap-2 text-white hover:text-amber-400 transition-colors"
              >
                <FaWhatsapp className="text-3xl" />
                <span className="hidden md:inline">WhatsApp</span>
              </Link>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-amber-400 text-2xl font-bold mb-4">
              Quick Links
            </h2>
            <nav className="flex flex-col space-y-2">
              <Link
                href={"/"}
                className="text-white hover:text-amber-400 transition-colors"
              >
                Home
              </Link>
              <Link
                href={"/"}
                className="text-white hover:text-amber-400 transition-colors"
              >
                All Events
              </Link>
              <Link
                href={"/auth/login"}
                className="text-white hover:text-amber-400 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href={"/auth/signup"}
                className="text-white hover:text-amber-400 transition-colors"
              >
                Sign Up
              </Link>
            </nav>
          </div>

          {/* About Section */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-amber-400 text-2xl font-bold mb-4">Tickify</h2>
            <p className="text-center md:text-left">
              Concerts, sports, theater. Get your tickets and create memories
              that last a lifetime!
            </p>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-4 border-t border-blue-800 text-center">
          <p className="text-sm text-blue-200">
            © {new Date().getFullYear()} Tickify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
