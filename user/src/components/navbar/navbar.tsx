"use client";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useLoginModal } from "@/context/ModalContext";
//import session if authenticate with useSession
import { signIn, useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function NavBar() {
  const { data: session } = useSession();
  //call modalcontext of login inside nav
  const { loginOpenModal, openModal, closeModal } = useLoginModal();

  const handleLoginClick = () => {
    loginOpenModal();
  };

    const user = session?.user;
    const formatName  = (name ?: string) => {
        return name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : "N/A";
    }

  return (
    <nav className="sticky top-0 z-[1000] border-gray-300 flex h-[8vh] bg-gray-100 items-center px-4">
      <div className="flex items-center gap-4 flex-1 justify-end">
        {/** Button et user menu 
        <button className="btn btn-sm btn-text btn-circle size-[2.125rem] md:hidden">
          <span className="icon-[tabler--search] size-[1.375rem]">testte</span>
        </button>
        */}
        {/*call for loginopenModal to open modal on click */}
        {session ? (
          <>
            {" "}
            <button
              onClick={() => signOut()}
              className="cursor-pointer bg-sky-950 hover:bg-sky-900 text-white font-medium py-2 px-4 rounded-full"
              aria-haspopup="dialog"
              aria-expanded={openModal}
              aria-controls="scroll-inside-modal"
              data-overlay="#scroll-inside-modal"
            >
              Sign out
            </button>
            <Menu as="div" className="relative inline-block text-left">
              <MenuButton>
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-500 text-white text-lg  font-semibold text-center">
                    {formatName(user?.name)?.slice(0, 2)}
                </div>
              </MenuButton>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition"
              >
                <div className="py-1">
                  <MenuItem>
                    <Link
                      href="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-gray-700"
                    >
                      Account settings
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700"
                    >
                      Support
                    </a>
                  </MenuItem>
                  <form action="#" method="POST">
                    <MenuItem>
                      <button
                        type="submit"
                        className="cursor-pointer block w-full px-4 py-2 text-left text-sm text-gray-700"
                      >
                        Sign out
                      </button>
                    </MenuItem>
                  </form>
                </div>
              </MenuItems>
            </Menu>
          </>
        ) : (
          <>
            <button
              onClick={handleLoginClick}
              className="cursor-pointer bg-sky-950 hover:bg-sky-900 text-white font-medium py-2 px-4 rounded-full"
              aria-haspopup="dialog"
              aria-expanded={openModal}
              aria-controls="scroll-inside-modal"
              data-overlay="#scroll-inside-modal"
            >
              Login
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
