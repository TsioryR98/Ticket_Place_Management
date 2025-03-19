"use client";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useLoginModal } from "@/context/ModalContext";
//import session if authenticate with useSession
import { signIn, useSession, signOut } from "next-auth/react";

export default function NavBar() {
  const { data: session } = useSession();
  //call modalcontext of login inside nav
  const { loginOpenModal, openModal, closeModal } = useLoginModal();

  const handleLoginClick = () => {
    loginOpenModal();
  };

  return (
    <nav className="sticky top-0 z-2 border-gray-300 flex h-[8vh] bg-gray-100 items-center px-4">
      <div className="flex-1"></div>
      {/** Search bar */}
      <div className="hidden md:flex justify-center items-center flex-1 max-w-lg">
        <div className="flex items-center w-full bg-white rounded-full">
          <span className="p-2">
            <span className="icon-[tabler--search] text-gray-500 size-5"></span>
          </span>
          <input
            type="search"
            id="searchInput"
            className="w-full p-2 focus:outline-none"
            placeholder="Search"
          />
          <button
            type="submit"
            className="p-2 text-white bg-sky-950 rounded-e-full hover:bg-sky-900"
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </button>
        </div>
      </div>

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
              className="bg-sky-950 hover:bg-sky-900 text-white font-medium py-2 px-4 rounded-full"
              aria-haspopup="dialog"
              aria-expanded={openModal}
              aria-controls="scroll-inside-modal"
              data-overlay="#scroll-inside-modal"
            >
              Sign out
            </button>
            <Menu as="div" className="relative inline-block text-left">
              <MenuButton>
                <img
                  className="avatar size-9.5 rounded-full"
                  src="https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png"
                  alt="avatar 1"
                />
              </MenuButton>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition"
              >
                <div className="py-1">
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700"
                    >
                      Account settings
                    </a>
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
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700"
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
              className="bg-sky-950 hover:bg-sky-900 text-white font-medium py-2 px-4 rounded-full"
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
