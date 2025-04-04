/*
NOTE:
SSR only , if you have client components , redirect it into "@/components/ClientLayout"
*/

import type { Metadata } from "next";
import "../styles/globals.css";
import ClientLayout from "@/components/ClientLayout";
import Footer from "@/components/navbar/Footer";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Toaster as HotToaster } from "react-hot-toast";

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
      <body className="antialiased bg-white flex flex-col min-h-screen">
        <ClientLayout>
          <main className="flex-grow">{children}</main>
        </ClientLayout>
        {/* Les deux toasters peuvent coexister */}
        <SonnerToaster />
        <HotToaster
          position="bottom-right"
          toastOptions={{
            className: "font-sans",
            duration: 5000,
            style: {
              background: "#ffffff",
              color: "#374151",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              borderRadius: "0.5rem",
              padding: "1rem",
            },
          }}
        />
        <Footer />
      </body>
    </html>
  );
}
