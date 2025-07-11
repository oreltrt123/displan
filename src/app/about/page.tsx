'use client';

import { useState, useEffect } from 'react';
import { Component } from '@/components/ui/etheral-about';
import { SowhatIsdisplan }  from "@/components/ui/sodisplan"
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import "@/styles/about.css"
import { Feature1 } from "@/components/ui/feature-1";
import { BackgroundBeamsDemo } from "@/components/ui/backgroundbeamsdemo";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Input } from "@/components/ui/input";
import "@/styles/sidebar_settings_editor.css"

export default function DisPlanLanding() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      <Navbar />
      <div className="transition-colors duration-300 bg-black text-white">
        <main>
          {/* Hero Section with moving background */}
          <section className="relative overflow-hidden h-screen w-full">
            <Component
              color="rgba(128, 128, 128, 1)"
              animation={{ scale: 100, speed: 90 }}
              noise={{ opacity: 1, scale: 1.2 }}
              sizing="fill"
            />
          </section>

          {/* Next section - scrolls into view */}
          <section className="relative h-screen w-full bg-white text-black flex items-center justify-center dfdsfdsfesfsdffef">
            <SowhatIsdisplan />
          </section>
          <section className="relative h-screen w-full bg-[rgb(31,31,31)] text-black flex items-center justify-center">
             <Feature1   
      title="Build Smarter with DisPlan"
      description="DisPlan is a smart AI-powered website builder that lets you create any website or app simply by describing it in natural language. Unlike Wix, Webflow, or Framer, which are great for simple sites but limited for complex apps, DisPlan generates full front-end and back-end code instantly based on your instructions.

With a powerful drag-and-drop graphic canvas and ready-made templates for social networks, dashboards, SaaS, and more, you can design, view, export, or publish your project in seconds. DisPlan is not just a design tool—it’s a complete development platform that makes building sophisticated, fully functional web apps easy and fast.

Build smarter, build faster, and bring your ideas to life effortlessly with DisPlan.

"
      imageSrc="/logo_about.png"
      imageAlt="placeholder hero"
      buttonPrimary={{
        label: "Get Started",
        href: "https://shadcnblocks.com"
      }}
      buttonSecondary={{
        label: "Learn More",
        href: "https://shadcnblocks.com"
      }}
    />
          </section>
 <div className="h-[40rem] w-full rounded-md bg-background relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="relative z-10 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground text-center font-sans font-bold">
          Join the waitlist
        </h1>
        <p></p>
        <p className="text-muted-foreground max-w-lg mx-auto my-2 text-sm text-center relative z-10">
         Say hello to DisPlan — the all-in-one platform that makes website creation effortless and free.
        Our smart AI helps you bring your ideas to life with modern, responsive designs in just a few clicks.
        No subscriptions, no coding — just your vision, online.
        </p>
        <input
          type="email"
          placeholder="contact@displan.com"
          className="w-full mt-4 relative z-10 r2552esf25_252trewt3er"
        />
      </div>
      <BackgroundBeams />
    </div>
        </main>
        {/* <Footer /> */}
      </div>
    </div>
  );
}