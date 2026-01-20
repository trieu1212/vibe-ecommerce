import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Header } from "@/src/components/layout/Header";
import { Footer } from "@/src/components/layout/Footer";
import { QueryProvider } from "@/src/providers/query-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vibe E-commerce - Premium Online Shopping",
  description: "Modern e-commerce platform with stunning design and seamless shopping experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <QueryProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster position="top-right" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
