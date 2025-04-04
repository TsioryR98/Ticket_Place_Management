"use client";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useLoginModal } from "@/context/ModalContext";
import {  useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function NavBar() {
  const { data: session } = useSession();
  const { loginOpenModal, openModal } = useLoginModal();

  const handleLoginClick = () => {
    loginOpenModal();
  };

  const user = session?.user as { name?: string; email?: string }
  const formatName = (name?: string) => {
    return name
      ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
      : "N/A";
  };

  return (
    <nav className="sticky top-0 z-[1000] bg-gradient-to-r from-sky-800 to-sky-900 shadow-md flex h-16 items-center px-6">
      <div className="flex items-center flex-1">
        <Link href="/" className="flex items-center">
          <h1 className="text-white text-2xl font-bold mr-2">Tapakila</h1>
          <span className="hidden sm:inline-block text-sky-200 text-xs font-light">
            Simplified ticketing
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-6 justify-end">
        <Link
          href="/"
          className="text-sky-100 hover:text-white font-medium transition-colors"
        >
          Home
        </Link>
        <Link
          href="/dashboard/reservations"
          className="text-sky-100 hover:text-white font-medium transition-colors"
        >
          My events
        </Link>

        {session ? (
          <div className="flex items-center gap-4">
            <button
              onClick={() => signOut()}
              className="hidden sm:block bg-white hover:bg-sky-50 text-sky-800 font-medium py-2 px-4 rounded-md transition-colors"
              aria-haspopup="dialog"
              aria-expanded={openModal}
              aria-controls="scroll-inside-modal"
              data-overlay="#scroll-inside-modal"
            >
              Sign out
            </button>

            <Menu as="div" className="relative inline-block text-left">
              <MenuButton>
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-sky-800 text-lg font-semibold text-center ring-2 ring-sky-100 hover:ring-white transition-all">
                  {formatName(user?.name)?.slice(0, 2)}
                </div>
              </MenuButton>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black/5 transition overflow-hidden"
              >
                <div className="py-1">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm text-gray-500">
                      Logged in as
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {formatName(user?.name)}
                    </p>
                  </div>
                  <MenuItem>
                    <Link
                      href="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-sky-50"
                    >
                      Account settings
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-sky-50"
                    >
                      Support
                    </a>
                  </MenuItem>
                  <form action="#" method="POST">
                    <MenuItem>
                      <button
                        type="submit"
                        className="cursor-pointer block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-sky-50"
                        onClick={() => signOut()}
                      >
                        Sign out
                      </button>
                    </MenuItem>
                  </form>
                </div>
              </MenuItems>
            </Menu>
          </div>
        ) : (
          <button
            onClick={handleLoginClick}
            className="bg-white hover:bg-sky-50 text-sky-800 font-medium py-2 px-6 rounded-md transition-colors"
            aria-haspopup="dialog"
            aria-expanded={openModal}
            aria-controls="scroll-inside-modal"
            data-overlay="#scroll-inside-modal"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
