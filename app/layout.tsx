import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteNav } from "@/components/SiteNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InNeedFeed — Restaurant Donation Marketplace",
  description:
    "Chicago pilot: charities post meal needs, restaurants claim them on a calendar, plaques follow fulfillment.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans text-[#2f4a3a]">
        <SiteNav />
        <main className="app-main flex flex-1 flex-col">{children}</main>
        <footer className="hidden border-t border-[#e7dcc8] bg-[#fffaf2]/80 px-6 py-6 text-center text-xs text-[#5c6b61] lg:block">
          InNeedFeed · Chicago Bread &amp; Table pilot · Photos courtesy Unsplash &amp; Pexels
          (free licenses) · Demo charity names are placeholders
        </footer>
      </body>
    </html>
  );
}
