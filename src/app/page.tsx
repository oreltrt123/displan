"use client"

import { useState, useEffect, useRef } from "react"
import { AiOutlineExclamationCircle } from "react-icons/ai"
import { FaVolumeUp } from "react-icons/fa"
import { FiSettings } from "react-icons/fi"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import "../styles/navbar.css"
import { LearnMore } from "@/components/learn-more";
import { CARDS } from "@/components/content/cards";
import { LandingHero } from "@/components/content/landing-hero"
import Hero from "@/components/hero-home";
import Features from "@/components/features";
import ModernProductTeams from '@/components/sections/modern-product-teams'
import { Quote } from "@/components/demo"


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

  return (
    <div className="w-full min-h-screen bg-white dark:bg-background text-black dark:text-white relative">
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
    </div>
  )
}