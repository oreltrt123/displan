"use client"

import { useState, useEffect, useRef } from "react"
import { AiOutlineExclamationCircle } from "react-icons/ai" // White exclamation icon
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"

export default function HomePage() {
  const [showInfo, setShowInfo] = useState(false)
  const infoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (infoRef.current && !infoRef.current.contains(event.target as Node)) {
        setShowInfo(false)
      }
    }
    if (showInfo) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showInfo])

  return (
    <div className="w-full min-h-screen text-white bg-background relative">
      <Navbar />
      <main className="flex flex-col gap-20 items-center pt-32">
        <section className="px-6 py-0 mx-auto my-0 text-center max-w-[800px]">
          <h1
            className="mb-6 text-8xl font-semibold tracking-tighter text-center leading-[87.4px] max-md:text-6xl max-md:leading-none"
            data-i18n="heroTitle"
          >
            Build, Sell, and Collaborate — All in One Free Platform.
          </h1>

          <p
            className="mb-6 text-2xl leading-8 text-center max-w-[536px] mx-auto text-white text-opacity-60 max-md:text-xl max-md:leading-normal"
            data-i18n="heroSubtitle"
          >
            Sell your digital products, find partners for startups, and grow together — with no commissions, no premium
            walls. 100% open, powered by community support.
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="inline-flex items-center ml-2 text-white hover:text-opacity-100 transition text-lg"
              aria-label="More info"
            >
              <AiOutlineExclamationCircle className="w-5 h-5" />
            </button>
          </p>

          {/* Info Box */}
          {showInfo && (
            <div
              ref={infoRef}
              className="absolute top-[280px] left-1/2 transform -translate-x-1/2 bg-white text-black p-4 rounded-lg max-w-xs text-sm z-50 shadow-lg"
              data-i18n="infoBoxText"
            >
              No hidden fees, no commissions, no extra charges. Our platform stays free thanks to community support and
              optional donations. Help us keep it growing — for everyone.
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 justify-center mt-8">
            <Link
              href="/projects"
              className="px-3.5 py-2.5 text-base tracking-tight no-underline bg-white font-[560] rounded-[100px] text-black hover:bg-opacity-90 transition-opacity"
              data-i18n="startBrowsing"
            >
              Start browsing
            </Link>
            <Link
              href="/demo"
              className="px-3.5 py-2.5 text-base tracking-tight no-underline bg-white bg-opacity-10 font-[560] rounded-[100px] text-white hover:bg-opacity-20 transition-opacity"
              data-i18n="watchDemo"
            >
              Watch demo
            </Link>
          </div>
        </section>

        {/* IMAGE */}
        <div className="w-full max-w-[1200px] px-6">
          <img
            src="https://images.pexels.com/photos/6424583/pexels-photo-6424583.jpeg"
            alt="Project collaboration visualization"
            className="object-cover overflow-hidden mx-auto my-0 w-full rounded-3xl aspect-square"
          />
        </div>

        {/* FEATURES */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
            {/* Secure Payments */}
            <div className="p-8 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4" data-i18n="securePayments">
                Secure Payments
              </h3>
              <p className="text-white/60" data-i18n="securePaymentsDesc">
                Protected transactions with escrow and milestone-based releases.
              </p>
            </div>

            {/* Team Collaboration */}
            <div className="p-8 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4" data-i18n="teamCollaboration">
                Team Collaboration
              </h3>
              <p className="text-white/60" data-i18n="teamCollaborationDesc">
                Work seamlessly with developers and creators worldwide.
              </p>
            </div>

            {/* Quality Assurance */}
            <div className="p-8 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4" data-i18n="qualityAssurance">
                Quality Assurance
              </h3>
              <p className="text-white/60" data-i18n="qualityAssuranceDesc">
                Built-in review processes and quality checks for all projects.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
