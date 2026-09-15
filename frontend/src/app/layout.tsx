import type { Metadata } from "next";
import "@/app/globals.css";
import { AuthProvider } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Haveli & Estates | Luxury Farmhouse & Bungalow Marketplace India",
  description: "Discover exceptional farmhouses, luxury bungalows, hilltop estates, and beachfront villas across India. Verified listings, 360° virtual tours, and private site visit bookings.",
  keywords: ["Farmhouse for sale", "Luxury Bungalow India", "Chhatarpur Farmhouse", "Alibaug Villa", "Goa Estate", "Haveli & Estates"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-luxury-dark text-white font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
