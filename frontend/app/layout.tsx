import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import AuthNav from "./AuthNav";
import Link from "next/link";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mini Travel - Itinerary App",
  description: "Create and manage your travel itineraries",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-3">
                <span className="text-3xl">✈️</span>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Mini Travel
                </span>
              </Link>
            </h1>
            <nav className="flex gap-8 text-sm font-medium items-center">
              <Link href="/create" className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
                <span>➕</span>
                Create trips
              </Link>
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
                <span>🏠</span>
                Trips
              </Link>
              <CreateTripIfAuthed />
              <AuthNav />
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-6 py-10 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}

function CreateTripIfAuthed() {
  if (typeof window !== 'undefined' && localStorage.getItem('token')) {
    return (
      <Link href="/create" className="btn-primary flex items-center gap-2">
        <span>➕</span>
        Create Trip
      </Link>
    );
  }
  return null;
}
