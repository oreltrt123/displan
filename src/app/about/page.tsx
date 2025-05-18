"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground relative">
      <Navbar />
      <main className="flex flex-col gap-16 items-center pt-32 pb-20">
        <section className="px-6 mx-auto max-w-[800px]">
          <h1 className="mb-10 text-6xl font-semibold tracking-tighter text-center leading-none" data-i18n="aboutUs">
            About Us
          </h1>

          <div className="space-y-6 text-lg">
            <p className="text-muted-foreground" data-i18n="aboutDesc1">
              DisPlan was born out of a simple yet powerful observation: every developer, every team, and every company
              faces common problems. We saw that platforms like GitHub are incredible, but they focus mainly on hosting
              code. What about everything else? What about making project management, collaboration, and deployment
              easier, more streamlined, and accessible to everyone — without walls of payments or confusing
              subscriptions?
            </p>

            <p className="text-muted-foreground" data-i18n="aboutDesc2">
              That's where DisPlan comes in. We're not here to replace existing platforms — we're here to upgrade the
              experience. Our mission is to provide an open, powerful, and entirely free platform where developers and
              teams can collaborate, manage, and grow their projects without barriers. Every feature on DisPlan is
              unlocked from day one. No paywalls. No hidden "premium" tiers. Whether you're a solo developer or a global
              company, you get the same powerful tools — completely free.
            </p>

            <p className="text-muted-foreground" data-i18n="aboutDesc3">
              Inspired by models like Blender, we believe that technology should be open to all. Our platform runs on
              modern infrastructure, powered by Supabase for our backend server layers, offering scalable, real-time
              data handling for our users. Additionally, we leverage AI technologies to help maintain, clean, and
              organize data across the platform, ensuring performance and reliability at every step.
            </p>

            <div className="p-8 rounded-2xl bg-card hover:bg-card/80 transition-colors my-10">
              <p className="text-card-foreground" data-i18n="founderInfo">
                At the heart of DisPlan is our founder,{" "}
                <Link
                  href="https://www.instagram.com/orelrevivo3999/"
                  className="text-primary underline hover:text-primary/80 transition-colors"
                >
                  Oral Revivo
                </Link>
                , whose vision drives everything we do. Oral started DisPlan after experiencing first-hand the
                fragmented tools and expensive ecosystems that developers face daily. His idea was simple: build a place
                where the best features are open to everyone, forever — without limits. That idea quickly grew, bringing
                together a community of like-minded developers and supporters who believe in a freer, better ecosystem.
              </p>
            </div>

            <p className="text-muted-foreground" data-i18n="aboutDesc4">
              We got here because we listened. We listened to developers frustrated with half-solutions. We listened to
              companies tired of paying more for features that should be standard. And we acted. Today, DisPlan offers a
              seamless suite of features for code hosting, project management, collaboration, and more — all while being
              100% free for every user.
            </p>

            <p className="text-muted-foreground" data-i18n="aboutDesc5">
              Of course, running an open platform like this requires resources. That's why we offer an optional donation
              system. Donations help sustain our servers, pay our team, and ensure we can keep building new features
              while keeping everything free for everyone. Supporting us is optional, but it directly strengthens our
              mission and keeps DisPlan alive and growing.
            </p>

            <div className="p-8 rounded-2xl bg-card hover:bg-card/80 transition-colors my-8">
              <h3 className="text-2xl font-semibold mb-6" data-i18n="ourPromise">
                At DisPlan, our promise is clear:
              </h3>
              <ul className="space-y-3 text-card-foreground">
                <li className="flex items-start">
                  <span className="text-green-500 dark:text-green-400 mr-2">✔️</span>{" "}
                  <span data-i18n="promise1">No monthly subscriptions.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 dark:text-green-400 mr-2">✔️</span>{" "}
                  <span data-i18n="promise2">No premium paywalls.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 dark:text-green-400 mr-2">✔️</span>{" "}
                  <span data-i18n="promise3">Every company, every developer, gets the same access.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 dark:text-green-400 mr-2">✔️</span>{" "}
                  <span data-i18n="promise4">Donations are welcome, but never required.</span>
                </li>
              </ul>
            </div>

            <p className="text-center text-xl mt-10" data-i18n="aboutDesc6">
              We're proud to stand for a future where development tools are open, powerful, and accessible to all. And
              we invite you to be part of this journey.
            </p>
          </div>
        </section>

        <div className="w-full max-w-[1000px] px-6">
          <img
            src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg"
            alt="Team collaboration"
            width={1000}
            height={600}
            className="object-cover overflow-hidden mx-auto my-0 w-full rounded-3xl aspect-video"
          />
        </div>

        <section className="w-full max-w-[1200px] px-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 rounded-2xl bg-card hover:bg-card/80 transition-colors bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10">
              <div className="w-12 h-12 bg-purple-500/20 dark:bg-purple-500/10 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-purple-500 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4" data-i18n="openPlatform">
                Open Platform
              </h3>
              <p className="text-muted-foreground" data-i18n="openPlatformDesc">
                All features available to everyone, with no premium tiers or paywalls.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card hover:bg-card/80 transition-colors bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10">
              <div className="w-12 h-12 bg-blue-500/20 dark:bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-blue-500 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4" data-i18n="communityDriven">
                Community Driven
              </h3>
              <p className="text-muted-foreground" data-i18n="communityDrivenDesc">
                Built by developers, for developers, with community support at its core.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card hover:bg-card/80 transition-colors bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10">
              <div className="w-12 h-12 bg-green-500/20 dark:bg-green-500/10 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-green-500 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4" data-i18n="modernInfrastructure">
                Modern Infrastructure
              </h3>
              <p className="text-muted-foreground" data-i18n="modernInfrastructureDesc">
                Powered by Supabase and AI technologies for reliable, scalable performance.
              </p>
            </div>
          </div>
        </section>

        <div className="flex gap-4 justify-center mt-8">
          <Link
            href="/projects"
            className="px-5 py-3 text-base tracking-tight no-underline bg-primary font-[560] rounded-[100px] text-primary-foreground hover:bg-primary/90 transition-opacity"
            data-i18n="explorePlan"
          >
            Explore DisPlan
          </Link>
          <Link
            href="/donate"
            className="px-5 py-3 text-base tracking-tight no-underline bg-secondary font-[560] rounded-[100px] text-secondary-foreground hover:bg-secondary/80 transition-opacity"
            data-i18n="supportMission"
          >
            Support Our Mission
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
