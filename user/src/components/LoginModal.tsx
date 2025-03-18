"use client";

import { signIn } from "next-auth/react";
import React from "react";
import { useLoginModal } from "@/context/ModalContext";

const LoginModal: React.FC = () => {
  const { closeModal, openModal, loginOpenModal } = useLoginModal();

  if (!openModal) {
    return null;
  }

  return (
    <>
      <div
        id="scroll-inside-modal"
        className="overlay modal fixed inset-0 bg-white/10 backdrop-blur-[5px] flex justify-center items-center"
        role="dialog"
        tabIndex={-1}
      >
        <div className="modal-dialog bg-white p-6 rounded-lg shadow-lg">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header flex justify-between items-center border-b pb-3">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
                Sign in to your account
              </h1>
            </div>

            {/* Body px-6 py-8  */}

              <div className="modal-body flex flex-col items-center justify-center px-6 py-8 mx-auto">
                <form className="w-full space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="name@company.com"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Sign in
                  </button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Don’t have an account yet?{" "}
                    <a
                      href="#"
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    >
                      Sign up
                    </a>
                  </p>
                </form>
              </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
