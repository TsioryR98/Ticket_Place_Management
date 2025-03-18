import type { Metadata } from "next";
import "../styles/globals.css";
import SideNavbar from "@/components/SideNavbar";
import NavBar from "@/components/navbar";
import LoginModal from "@/components/LoginModal";
import { LoginModalContext } from "@/context/ModalContext";

export const metadata: Metadata = {
  title: "Tickify – Book Your Tickets for Unforgettable Events!",
  description:
    "Easily book tickets for concerts, festivals, shows, and more with Tickify. Secure your spot in just a few clicks and never miss out on amazing experiences!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased bg-white`}>
        <LoginModalContext>
        <NavBar />
        <SideNavbar />
        <LoginModal/>
        {children}
        </LoginModalContext>
      </body>
    </html>
  );
}
