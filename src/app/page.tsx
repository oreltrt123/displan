"use client"

import { useState, useEffect, useRef } from "react"
import Navbar from "@/components/navbar"
import Footer  from "@/components/footer"
import "../styles/navbar.css"
import { LearnMore } from "@/components/learn-more"
import { CARDS } from "@/components/content/cards"
import { LandingHero } from "@/components/content/landing-hero"
import Hero from "@/components/hero-home"
import Features from "@/components/features"
import { Quote } from "@/components/demo"
import { CookieConsent } from "@/components/cookie-consent"

export default function HomePage() {
  const [showInfo, setShowInfo] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [volume, setVolume] = useState(1)
  const [showQualityMenu, setShowQualityMenu] = useState(false)
  const [selectedQuality, setSelectedQuality] = useState("1080p")

  const infoRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

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

  const handleVolumeChange = () => {
    const newVolume = volume === 1 ? 0 : 1
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
  }

  const handleQualityChange = (quality: string) => {
    setSelectedQuality(quality)
    setShowQualityMenu(false)
    // In a real app, you'd switch video source here
  }

  const handleCookieAccept = () => {
    // Optional: Add any additional logic when user accepts cookies
    console.log("User accepted cookies")
    // You could initialize analytics, ads, etc. here
  }

  return (
    <div className="w-full min-h-screen bg-white dark:bg-background text-black dark:text-white relative"
              // className={clsx(
          //   "w-full mx-auto max-w-[60%] flex flex-col justify-center items-center bg-gray-1/85 pb-0 overflow-hidden rounded-2xl",
          //   "shadow-[0px_170px_48px_0px_rgba(18,_18,_19,_0.00),_0px_109px_44px_0px_rgba(18,_18,_19,_0.01),_0px_61px_37px_0px_rgba(18,_18,_19,_0.05),_0px_27px_27px_0px_rgba(18,_18,_19,_0.09),_0px_7px_15px_0px_rgba(18,_18,_19,_0.10)]"
          // )}
    >
      <Navbar />

      <main className="flex flex-col gap-20 items-center pt-32">
        <LandingHero />
      </main>

      <LearnMore cards={CARDS} />
      {/* <ModernProductTeams /> */}
      <Hero />
      <Features />
      <Quote />
      <Footer />

      {/* Cookie Consent Banner */}
      <CookieConsent onAccept={handleCookieAccept} />
    </div>
  )
}
