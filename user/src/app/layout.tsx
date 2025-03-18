import type { Metadata } from "next";
import "../styles/globals.css";
import SideNavbar from "@/components/SideNavbar";
import NavBar from "@/components/navbar";

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
        <NavBar />
        <SideNavbar />
        {children}
      </body>
    </html>
  );
}
