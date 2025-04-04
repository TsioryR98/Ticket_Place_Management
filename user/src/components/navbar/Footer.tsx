import Link from "next/link";
import { CiFacebook } from "react-icons/ci";
import { FaInstagram, FaWhatsapp, FaTelegramPlane } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-sky-800 to-sky-900 text-white mt-auto shadow-inner">
      <div className="container mx-auto py-10 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Social Networks Section */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-white text-xl font-bold mb-4 border-b-2 border-sky-400 pb-2 inline-block">
              Social Networks
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <Link
                href={"#"}
                className="flex items-center gap-2 text-sky-100 hover:text-white transition-colors"
              >
                <div className="bg-sky-700 p-2 rounded-full hover:bg-sky-600 transition-colors">
                  <CiFacebook className="text-2xl" />
                </div>
                <span className="hidden md:inline text-sm">Facebook</span>
              </Link>
              <Link
                href={"#"}
                className="flex items-center gap-2 text-sky-100 hover:text-white transition-colors"
              >
                <div className="bg-sky-700 p-2 rounded-full hover:bg-sky-600 transition-colors">
                  <FaInstagram className="text-2xl" />
                </div>
                <span className="hidden md:inline text-sm">Instagram</span>
              </Link>
              <Link
                href={"#"}
                className="flex items-center gap-2 text-sky-100 hover:text-white transition-colors"
              >
                <div className="bg-sky-700 p-2 rounded-full hover:bg-sky-600 transition-colors">
                  <FaTelegramPlane className="text-2xl" />
                </div>
                <span className="hidden md:inline text-sm">Telegram</span>
              </Link>
              <Link
                href={"#"}
                className="flex items-center gap-2 text-sky-100 hover:text-white transition-colors"
              >
                <div className="bg-sky-700 p-2 rounded-full hover:bg-sky-600 transition-colors">
                  <FaWhatsapp className="text-2xl" />
                </div>
                <span className="hidden md:inline text-sm">WhatsApp</span>
              </Link>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-white text-xl font-bold mb-4 border-b-2 border-sky-400 pb-2 inline-block">
              Quick Links
            </h2>
            <nav className="flex flex-col space-y-3">
              <Link
                href={"/"}
                className="text-sky-100 hover:text-white transition-colors flex items-center gap-1"
              >
                <span className="text-sky-400">›</span> Home
              </Link>
              <Link
                href={"/"}
                className="text-sky-100 hover:text-white transition-colors flex items-center gap-1"
              >
                <span className="text-sky-400">›</span> All Events
              </Link>
              <Link
                href={"/auth/login"}
                className="text-sky-100 hover:text-white transition-colors flex items-center gap-1"
              >
                <span className="text-sky-400">›</span> Sign In
              </Link>
              <Link
                href={"/auth/signup"}
                className="text-sky-100 hover:text-white transition-colors flex items-center gap-1"
              >
                <span className="text-sky-400">›</span> Sign Up
              </Link>
            </nav>
          </div>

          {/* About Section */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-white text-xl font-bold mb-4 border-b-2 border-sky-400 pb-2 inline-block">
              Tapakila
            </h2>
            <p className="text-center md:text-left text-sky-100">
              Concerts, sports, theater. Get your tickets and create memories
              that last a lifetime!
            </p>
            <div className="mt-4 p-4 bg-sky-700 rounded-lg shadow-md bg-opacity-50">
              <p className="text-sm font-medium">Need Help?</p>
              <p className="text-sm text-sky-200">support@tapakila.com</p>
              <p className="text-sm text-sky-200">+123 456 7890</p>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-4 border-t border-sky-700 text-center">
          <p className="text-sm text-sky-200">
            © {new Date().getFullYear()} Tapakila. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
