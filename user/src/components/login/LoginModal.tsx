"use client";

import { signIn } from "next-auth/react";
import React from "react";
import { useLoginModal } from "@/context/ModalContext";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  email: string;
  password: string;
};

const LoginModal = () => {
  const { closeModal, openModal } = useLoginModal();
  //REACT HOOK FORM
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      alert("Email ou mot de passe incorrect.");
    } else {
      alert("Connexion réussie");
      closeModal();
    }
  };

  if (!openModal) return null;

  return (
    <div className="fixed inset-0 bg-gray/10 backdrop-blur-[3px] flex justify-center items-center z-50">
      <div className="modal-content bg-gray-100 p-8 rounded-lg shadow-md w-96">
        <div className="modal-header justify-between flex border-b pb-3">
          <h1 className="text-xl text-center font-bold text-gray-900">
            Sign in
          </h1>
          <button
            onClick={closeModal}
            className="btn btn-text btn-circle btn-sm"
            aria-label="Close"
          >
            <span>X</span>
          </button>
        </div>
        <div className="py-6 modal-body">
          {/*REACT HOOK FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Your email
              </label>
              <input
                id="email"
                {...register("email", { required: "Email is required" })}
                className="w-full border border-gray-300 p-2.5 rounded-lg"
                placeholder="name@company.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register("password", { required: "Password is required" })}
                className="w-full border border-gray-300 p-2.5 rounded-lg"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-sky-950 hover:bg-sky-900 text-white font-bold py-2.5 rounded-lg"
            >
              Sign in
            </button>
            <p className="text-sm text-gray-500">
              Don’t have an account yet?{" "}
              <a
                href="#"
                className="font-medium text-primary-600 hover:underline"
              >
                Sign up
              </a>
            </p>
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
            {/* Google Login Button */}
            <button
              type="button"
              className="cursor-pointer w-full flex justify-center text-center items-center border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500"
              onClick={() => signIn("google")}
            >
              <svg className="h-6 w-6 mr-2" viewBox="0 0 48 48">
                <path
                  fill="#FBBC05"
                  d="M9.8,24c0-1.5,0.3-2.9,0.7-4.4L2.6,13.6c-1.5,3.1-2.4,6.6-2.4,10.4s0.9,7.3,2.4,10.4l7.9-6C10.1,26.9,9.8,25.5,9.8,24z"
                ></path>
                <path
                  fill="#EB4335"
                  d="M23.7,10.1c3.3,0,6.3,1.2,8.7,3.1l6.8-6.8C35,2.8,29.7,0.5,23.7,0.5C14.4,0.5,6.4,5.8,2.6,13.6l7.9,6C12.4,14.1,17.5,10.1,23.7,10.1z"
                ></path>
                <path
                  fill="#34A853"
                  d="M23.7,37.9c-6.2,0-11.3-4-13.2-9.5l-7.9,6c3.8,7.8,11.8,13.1,21.1,13.1c5.7,0,11.2-2,15.3-5.9l-7.5-6C29.4,37.1,26.7,37.9,23.7,37.9z"
                ></path>
                <path
                  fill="#4285F4"
                  d="M46.1,24c0-1.4-0.2-2.9-0.5-4.3H23.7v8.8h12.6c-0.6,2.9-2.4,5.3-4.9,6.8l7.5,6c4.3-4,6.9-10,6.9-16.3z"
                ></path>
              </svg>
              Continue with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
