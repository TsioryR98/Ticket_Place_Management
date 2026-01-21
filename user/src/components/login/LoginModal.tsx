'use client';

import { signIn } from 'next-auth/react';
import React, { useState } from 'react';
import { useLoginModal } from '@/context/ModalContext';
import { useForm, SubmitHandler } from 'react-hook-form';
import Link from 'next/link';

type Inputs = {
  email: string;
  password: string;
};

const LoginModal = () => {
  const { closeModal, openModal } = useLoginModal();
  const [showPassword, setShowPassword] = useState(false);

  //REACT HOOK FORM
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const result = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      alert('Email ou mot de passe incorrect.');
    } else {
      alert('Connexion réussie');
      closeModal();
    }
  };

  if (!openModal) return null;

  return (
    <div className="fixed inset-0 bg-indigo-900/30 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
      {/* Motifs décoratifs élégants pour le fond du modal */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div
          className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute top-2/3 left-1/4 w-56 h-56 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      <div className="modal-content bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md mx-4 animate-slideUp relative overflow-hidden">
        <div className="absolute -z-10 inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl opacity-70"></div>

        <div className="modal-header flex justify-between items-center pb-6 relative">
          <h1 className="text-2xl font-bold text-blue-700">Welcome Back</h1>
          <button
            onClick={closeModal}
            className="w-8 h-8 flex items-center justify-center rounded-full text-blue-500 hover:bg-blue-100 hover:text-blue-700 transition-colors"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="py-4 modal-body">
          {/*REACT HOOK FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="group">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-blue-700 transition group-focus-within:text-blue-600"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-400 group-focus-within:text-blue-500 transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  id="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className="pl-10 w-full border border-blue-200 p-3 rounded-xl bg-white/70 backdrop-blur-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="name@company.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.email.message}</p>
              )}
            </div>

            <div className="group">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-blue-700 transition group-focus-within:text-blue-600"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-400 group-focus-within:text-blue-500 transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  {...register('password', {
                    required: 'Password is required',
                  })}
                  className="pl-10 w-full border border-blue-200 p-3 rounded-xl bg-white/70 backdrop-blur-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="••••••••"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-blue-400 hover:text-blue-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clipRule="evenodd"
                      />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </div>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-blue-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-700 hover:underline transition"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-base font-medium text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 transform hover:-translate-y-0.5 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>

            <p className="text-sm text-blue-600 text-center">
              Don&apos;t have an account yet?{' '}
              <Link
                href="/auth/signup"
                className="font-medium text-blue-700 hover:text-blue-800 hover:underline transition"
                onClick={closeModal}
              >
                Sign up
              </Link>
            </p>

            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
              <span className="px-4 text-blue-500 text-sm font-medium">or continue with</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              className="w-full flex justify-center items-center border border-gray-300 rounded-lg px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition transform hover:-translate-y-0.5"
              onClick={() => signIn('google')}
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 48 48">
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
