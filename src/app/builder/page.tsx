'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Users, Star, Upload, Moon, Sun } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Component } from "@/components/ui/etheral-shadow";

export default function DisPlanLanding() {
  const [darkMode, setDarkMode] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])


  return (
    <div className="transition-colors duration-300 bg-background">
      <Navbar />
      
      <main className="">
        {/* Hero Section with Parallax Effect */}
        <section className="relative overflow-hidden rounded-2xl mb-16 h-[80vh] flex items-center">
          <div className="flex w-full h-screen justify-center items-center">
      <Component
      color="rgba(128, 128, 128, 1)"
        animation={{ scale: 100, speed: 90 }}
        noise={{ opacity: 1, scale: 1.2 }}
        sizing="fill"
         />
    </div>
        </section>
      </main>

      {/* <Footer /> */}
    </div>
  )
}