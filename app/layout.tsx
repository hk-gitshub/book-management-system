import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LibraryProvider } from "../context/LibraryContext";
import Navbar from "../components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Book Management System",
  description: "Book management dashboard for issue, return, and analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-slate-50`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col text-slate-900">
        <LibraryProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
        </LibraryProvider>
      </body>
    </html>
  );
}
