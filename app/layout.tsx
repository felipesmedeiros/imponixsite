import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { AnalyticsTracker } from "./components/AnalyticsTracker";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "imponix.com";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.includes("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);
  const socialImage = new URL("/og.png", metadataBase).toString();

  return {
    metadataBase,
    title: {
      default: "Imponix Game Studio",
      template: "%s",
    },
    description:
      "Independent games made by two friends working between Montréal, Québec, Canada, and Fortaleza, Ceará, Brazil. Creators of Game Store Chronicle and Veil of Shadows.",
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
        { url: "/brand/imponix-favicon.png", type: "image/png", sizes: "256x256" },
      ],
      shortcut: "/favicon.ico",
      apple: "/brand/imponix-favicon.png",
    },
    openGraph: {
      type: "website",
      siteName: "Imponix Game Studio",
      title: "Imponix Game Studio",
      description: "Two friends. Worlds worth remembering.",
      images: [
        {
          url: socialImage,
          width: 1536,
          height: 1024,
          alt: "Imponix Game Studio — two friends, worlds worth remembering",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Imponix Game Studio",
      description: "Two friends. Worlds worth remembering.",
      images: [socialImage],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <AnalyticsTracker />
      </body>
    </html>
  );
}
