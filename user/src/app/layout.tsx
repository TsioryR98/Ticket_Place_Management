/*
NOTE:
SSR only , if you have client components , redirect it into "@/components/ClientLayout"
*/

import type { Metadata } from "next";
import "../styles/globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "Tickify – Book Your Tickets for Unforgettable Events!",
  description:
    "Easily book tickets for concerts, festivals, shows, and more with Tickify. Secure your spot in just a few clicks and never miss out on amazing experiences!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-white">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
