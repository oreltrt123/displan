import { TempoInit } from "@/components/tempo-init";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "../globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Documentation - DisPlan",
  description: "Comprehensive guides and resources for the DisPlan platform",
};

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script src="https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" />
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-gray-950 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="mb-12 text-center">
              <h1 className="text-4xl font-bold mb-4">Documentation</h1>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Everything you need to know about using the DisPlan platform
              </p>
            </div>
            {children}
          </div>
        </main>
        <Footer />
        <TempoInit />
      </body>
    </html>
  );
}
