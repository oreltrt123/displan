// src/app/not-found.tsx

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  useEffect(() => {
    // Disable scroll
    document.body.style.overflow = "hidden";
    return () => {
      // Re-enable scroll when leaving the page
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-white px-4 text-center space-y-6">
      <img
        src="/404.png"
        alt="404 Not Found"
        className="w-[50%] h-auto mx-auto fixed top-[-12%]"
      />
        <Link
  href="/"
  className="fixed top-[2%] left-[2%] inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
>
  <ArrowLeft className="mr-2" size={18} />
  Go back home
</Link>

    </div>
  );
}
