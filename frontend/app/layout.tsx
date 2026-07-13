import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/dist/client/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Repository Explainer",
  description: "Explains AI repositories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="bg-gray-800 text-white p-4 sticky top-0 z-50">
          <nav className="flex items-center justify-between">
            <h1>AI Repository Explainer</h1>
            <ul className="flex space-x-4">
              <li><Link href="/" className="hover:text-gray-500">
                Home
              </Link></li>
              <li><Link href="/dashboard" className="hover:text-gray-500">
                Dashboard
              </Link></li>
              <li><Link href="/about" className="hover:text-gray-500">
                About
              </Link></li>
            </ul>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
