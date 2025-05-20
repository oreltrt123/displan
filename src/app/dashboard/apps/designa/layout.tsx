import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../../globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Designa - Streamlined Design Platform",
  description:
    "A simplified design platform with essential capabilities and a clean interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script src="https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" />
      <body className={inter.className}>
          {children}
      </body>
    </html>
  );
}
