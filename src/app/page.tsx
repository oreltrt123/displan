"use client"

import { useState, useEffect, useRef } from "react"
import { AiOutlineExclamationCircle } from "react-icons/ai"
import { FaVolumeUp } from "react-icons/fa"
import { FiSettings } from "react-icons/fi"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import "../styles/navbar.css"

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
        <section className="px-6 py-0 mx-auto my-0 text-center max-w-[800px]">
          <h1 className="mb-6 text-8xl font-semibold tracking-tighter text-center leading-[87.4px] max-md:text-6xl max-md:leading-none" data-i18n="heroTitle">
            Build, Sell, and Collaborate — All in One Free Platform.
          </h1>

          <p className="mb-6 text-2xl leading-8 text-center max-w-[536px] mx-auto text-black/60 dark:text-white/60 max-md:text-xl max-md:leading-normal" data-i18n="heroSubtitle">
            Sell your digital products, find partners for startups, and grow together — with no commissions, no premium walls.
            <button onClick={() => setShowInfo(!showInfo)} className="inline-flex items-center ml-2 text-black dark:text-white hover:text-opacity-100 transition text-lg" aria-label="More info">
              <AiOutlineExclamationCircle className="w-5 h-5" />
            </button>
          </p>

          {showInfo && (
            <div ref={infoRef} className="absolute top-[280px] left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 text-black dark:text-white p-4 rounded-lg max-w-xs text-sm z-50 shadow-lg" data-i18n="infoBoxText">
              No hidden fees, no commissions, no extra charges. Our platform stays free thanks to community support and optional donations. Help us keep it growing — for everyone.
            </div>
          )}

          <div className="flex gap-4 justify-center mt-8">
            <Link
              href="/projects"
              className="Start_browsing_23"
              data-i18n="startBrowsing"
            >
              <span className="Start_browsing_23_text12">Start browsing</span>
            </Link>
            <button
              onClick={() => setShowVideo(true)}
              className="Start_browsing_231"
              data-i18n="watchDemo"
            >
              <span className="Start_browsing_23_text122">Watch demo</span>
            </button>
            {/* <div className="Thingsdsaffaw"><span className="dfgwsgesgsdgdseg">*</span> Things may have changed since the video was uploaded.</div> */}
          </div>
        </section>

        <div className="w-full max-w-[1200px] px-6">
          <img
            src="https://images.pexels.com/photos/6424583/pexels-photo-6424583.jpeg"
            alt="Project collaboration visualization"
            className="object-cover overflow-hidden mx-auto my-0 w-full rounded-3xl aspect-square"
          />
        </div>

        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
            {/* Features here... unchanged */}
          </div>
        </section>
      </main>
      <Footer />

      {/* VIDEO MODAL */}
      {showVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative w-[90vw] max-w-[600px] aspect-square bg-black rounded-2xl shadow-xl overflow-hidden">
            <video
              ref={videoRef}
              src="/welcome_to_displan .mp4"
              controls
              autoPlay
              className="w-full h-full object-cover"
              style={{ outline: "none" }}
            />
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-2 right-2 bg-white text-black rounded-full px-3 py-1 text-sm font-bold hover:bg-gray-100"
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  )
}