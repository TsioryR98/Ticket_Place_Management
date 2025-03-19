/*
NOTE:
CSR only , if you have server components , redirect it into "@/app/Layout"
*/
"use client";
import { SessionProvider } from "next-auth/react";
import { LoginModalContext } from "@/context/ModalContext";
import NavBar from "@/components/navbar/navbar";
import SideNavbar from "@/components/navbar/SideNavbar";
import LoginModal from "@/components/login/LoginModal";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LoginModalContext>
      <SessionProvider>
        <NavBar />
        <SideNavbar />
        <LoginModal />
        {children}
      </SessionProvider>
    </LoginModalContext>
  );
}
