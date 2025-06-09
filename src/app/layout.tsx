import type { Metadata } from "next";
import { Inter, Fredoka, Pacifico } from "next/font/google";
import "./globals.css";
import { LayoutClientProvider } from "@/components/LayoutClientProvider";

const inter = Inter({ subsets: ["latin"] });
const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka" });
const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico",
});

export const metadata: Metadata = {
  title: "MemoraTeller - Capture Your Memories",
  description:
    "Turn your photos into beautiful memories with stories that last forever.",
  manifest: "/manifest.json",
  themeColor: "#9333ea",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MemoraTeller",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body
        className={`${fredoka.variable} ${pacifico.variable} font-sans flex flex-col min-h-screen`}
      >
        <LayoutClientProvider>{children}</LayoutClientProvider>
      </body>
    </html>
  );
}
