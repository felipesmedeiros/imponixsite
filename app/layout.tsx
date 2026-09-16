import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AnalyticsTracker } from "./components/AnalyticsTracker";
import { LanguageProvider } from "./components/LanguageProvider";
import { createPageMetadata, SITE_URL, TIKTOK_URL, X_URL, YOUTUBE_URL } from "./lib/seo";
import "./globals.css";

const googleAnalyticsId = "G-VQD0DJQWLH";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  ...createPageMetadata({
    path: "/",
    title: "Imponix Game Studio | Independent Games",
    description:
      "Independent games made by two friends in Montréal and Fortaleza. Creators of Game Store Chronicle, NOEMA, and Veil of Shadows.",
  }),
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/brand/imponix-favicon.png", type: "image/png", sizes: "256x256" },
    ],
    shortcut: "/favicon.ico",
    apple: "/brand/imponix-favicon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="me" href={YOUTUBE_URL} />
        <link rel="me" href={TIKTOK_URL} />
        <link rel="me" href={X_URL} />
        <link
          rel="alternate"
          type="application/atom+xml"
          title="Imponix Game Studio YouTube uploads"
          href="https://www.youtube.com/feeds/videos.xml?channel_id=UC172-GTwAfeTVIzeHFANxcg"
        />
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsId}');
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <LanguageProvider>
          {children}
          <AnalyticsTracker />
        </LanguageProvider>
      </body>
    </html>
  );
}
