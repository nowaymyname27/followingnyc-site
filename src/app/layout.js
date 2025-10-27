// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import { getNavbarMenus } from "@/lib/nav.server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Revalidate layout every hour (optional incremental cache)
export const revalidate = 3600;

export const metadata = {
  title: "FollowingNYC",
  description: "Welcome to New York",
  icons: {
    icon: "/favicon.svg",
  },
};

export default async function RootLayout({ children }) {
  const menus = await getNavbarMenus();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavBar menus={menus} />
        {children}
      </body>
    </html>
  );
}
