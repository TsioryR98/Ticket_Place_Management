"use client";
import "../styles/globals.css";
import SideNavbar from "@/components/navbar/SideNavbar";
import NavBar from "@/components/navbar/navbar";
import LoginModal from "@/components/login/LoginModal";
import { LoginModalContext } from "@/context/ModalContext";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased bg-white`}>
        <LoginModalContext>
          <SessionProvider>
            <NavBar />
            <SideNavbar />
            <LoginModal />
            {children}
          </SessionProvider>
        </LoginModalContext>
      </body>
    </html>
  );
}
