"use client"

import type React from "react"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import { useState } from "react"
import {
  Rocket,
  Users,
  KanbanIcon as LayoutKanban,
  Lock,
  MessageCircle,
  Store,
  CheckCircle,
  ArrowRight,
} from "lucide-react"

export default function ProjectsPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setSubmitted(true)
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="w-full min-h-screen bg-background text-foreground relative">
      <Navbar />
      <main className="flex flex-col gap-16 items-center pt-32 pb-20">
        {/* Hero Section */}
        <section className="px-6 py-0 mx-auto my-0 text-center max-w-[900px]">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-500/20 dark:bg-blue-500/10 rounded-full flex items-center justify-center">
              <Rocket className="w-8 h-8 text-blue-500 dark:text-blue-400" />
            </div>
          </div>
          <h1
            className="mb-6 text-6xl md:text-7xl font-semibold tracking-tighter text-center leading-tight"
            data-i18n="projectsComingSoon"
          >
            Projects Are Coming Soon.
          </h1>
          <h2
            className="mb-8 text-3xl md:text-4xl font-medium tracking-tight text-center"
            data-i18n="collaborateBuildLaunch"
          >
            Collaborate. Build. Launch — All in One Place.
          </h2>
          <p
            className="mb-10 text-xl leading-8 text-center max-w-[700px] mx-auto text-muted-foreground"
            data-i18n="projectsDescription"
          >
            We're building the ultimate space where creators, developers, and founders can team up, manage tasks, and
            launch together. No limits. No fees. 100% community powered.
          </p>
          <p className="text-xl leading-8 text-center max-w-[700px] mx-auto" data-i18n="beAmongFirst">
            Be among the first to start your next project — right here on DisPlan.
          </p>
        </section>

        {/* Features Coming Soon */}
        <section className="w-full max-w-5xl px-6 mx-auto">
          <h2 className="text-3xl font-semibold mb-10 text-center" data-i18n="whatsComingToProjects">
            Here's what's coming to Projects:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-card hover:bg-card/80 transition-colors bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-500/20 dark:bg-purple-500/10 rounded-xl flex items-center justify-center mr-4">
                  <Users className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold" data-i18n="teamCollaboration">
                  Team Collaboration
                </h3>
              </div>
              <p className="text-muted-foreground" data-i18n="teamCollaborationDesc">
                Work together with global creators and developers on shared projects.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card hover:bg-card/80 transition-colors bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-500/20 dark:bg-blue-500/10 rounded-xl flex items-center justify-center mr-4">
                  <LayoutKanban className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold" data-i18n="taskBoards">
                  Task Boards
                </h3>
              </div>
              <p className="text-muted-foreground" data-i18n="taskBoardsDesc">
                Organize your project with Kanban-style task management.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card hover:bg-card/80 transition-colors bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-500/20 dark:bg-green-500/10 rounded-xl flex items-center justify-center mr-4">
                  <Lock className="w-5 h-5 text-green-500 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold" data-i18n="milestonePayments">
                  Milestone Payments
                </h3>
              </div>
              <p className="text-muted-foreground" data-i18n="milestonePaymentsDesc">
                Get paid safely with escrow-backed milestones.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card hover:bg-card/80 transition-colors bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-orange-500/20 dark:bg-orange-500/10 rounded-xl flex items-center justify-center mr-4">
                  <CheckCircle className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold" data-i18n="privatePublicProjects">
                  Private & Public Projects
                </h3>
              </div>
              <p className="text-muted-foreground" data-i18n="privatePublicProjectsDesc">
                Keep it closed or open it to the world.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card hover:bg-card/80 transition-colors bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-pink-500/20 dark:bg-pink-500/10 rounded-xl flex items-center justify-center mr-4">
                  <MessageCircle className="w-5 h-5 text-pink-500 dark:text-pink-400" />
                </div>
                <h3 className="text-xl font-semibold" data-i18n="builtInMessaging">
                  Built-in Messaging
                </h3>
              </div>
              <p className="text-muted-foreground" data-i18n="builtInMessagingDesc">
                Chat directly with your team members.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card hover:bg-card/80 transition-colors bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-yellow-500/20 dark:bg-yellow-500/10 rounded-xl flex items-center justify-center mr-4">
                  <Store className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold" data-i18n="launchToStorefront">
                  Launch to Storefront
                </h3>
              </div>
              <p className="text-muted-foreground" data-i18n="launchToStorefrontDesc">
                Publish your completed project right into your store.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full max-w-3xl px-6 mx-auto">
          <div className="p-10 rounded-3xl bg-card text-card-foreground text-center">
            <h2 className="text-3xl font-semibold mb-6" data-i18n="wantEarlyAccess">
              Want Early Access?
            </h2>
            <p className="text-xl mb-8" data-i18n="signUpToday">
              Sign up today and we'll notify you when Projects go live!
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-full bg-input border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-primary hover:bg-primary/90 rounded-full font-medium flex items-center justify-center transition-colors text-primary-foreground"
                    disabled={loading}
                    data-i18n="joinWaitlist"
                  >
                    {loading ? (
                      <span className="animate-pulse" data-i18n="submitting">
                        Submitting...
                      </span>
                    ) : (
                      <>
                        <span data-i18n="joinWaitlist">Join Waitlist</span>
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div
                className="bg-green-500/20 text-green-500 dark:text-green-400 p-4 rounded-xl max-w-md mx-auto"
                data-i18n="thanksNotify"
              >
                Thanks! We'll notify you when Projects launches.
              </div>
            )}

            <div className="mt-8">
              <Link
                href="/features"
                className="px-6 py-3 border border-border hover:bg-accent rounded-full font-medium inline-flex items-center transition-colors"
                data-i18n="learnAboutOtherFeatures"
              >
                Learn About Other Features
              </Link>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="w-full max-w-4xl px-6 mx-auto">
          <h2 className="text-3xl font-semibold mb-10 text-center" data-i18n="developmentTimeline">
            Development Timeline
          </h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-border"></div>

            {/* Timeline items */}
            <div className="space-y-12">
              <div className="relative flex flex-col md:flex-row items-center md:items-start">
                <div className="order-1 md:w-1/2 md:pr-8 md:text-right mb-4 md:mb-0">
                  <div className="p-6 rounded-2xl bg-card">
                    <h3 className="text-xl font-semibold mb-2" data-i18n="planningPhase">
                      Planning Phase
                    </h3>
                    <p className="text-muted-foreground" data-i18n="planningPhaseDesc">
                      Designing the architecture and user experience
                    </p>
                  </div>
                </div>
                <div className="z-10 flex items-center order-0 md:order-1 bg-primary rounded-full w-8 h-8 md:mx-auto">
                  <CheckCircle className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="order-2 md:w-1/2 md:pl-8 hidden md:block"></div>
              </div>

              <div className="relative flex flex-col md:flex-row items-center md:items-start">
                <div className="order-1 md:order-2 md:w-1/2 md:pl-8 mb-4 md:mb-0">
                  <div className="p-6 rounded-2xl bg-card">
                    <h3 className="text-xl font-semibold mb-2" data-i18n="development">
                      Development
                    </h3>
                    <p className="text-muted-foreground" data-i18n="developmentDesc">
                      Building core functionality and features
                    </p>
                  </div>
                </div>
                <div className="z-10 flex items-center order-0 bg-primary rounded-full w-8 h-8 md:mx-auto">
                  <div className="w-4 h-4 bg-primary-foreground rounded-full mx-auto"></div>
                </div>
                <div className="order-2 md:order-1 md:w-1/2 md:pr-8 md:text-right hidden md:block"></div>
              </div>

              <div className="relative flex flex-col md:flex-row items-center md:items-start">
                <div className="order-1 md:w-1/2 md:pr-8 md:text-right mb-4 md:mb-0">
                  <div className="p-6 rounded-2xl bg-card">
                    <h3 className="text-xl font-semibold mb-2" data-i18n="betaTesting">
                      Beta Testing
                    </h3>
                    <p className="text-muted-foreground" data-i18n="betaTestingDesc">
                      Limited release to early access users
                    </p>
                  </div>
                </div>
                <div className="z-10 flex items-center order-0 md:order-1 border-2 border-border bg-transparent rounded-full w-8 h-8 md:mx-auto"></div>
                <div className="order-2 md:w-1/2 md:pl-8 hidden md:block"></div>
              </div>

              <div className="relative flex flex-col md:flex-row items-center md:items-start">
                <div className="order-1 md:order-2 md:w-1/2 md:pl-8 mb-4 md:mb-0">
                  <div className="p-6 rounded-2xl bg-card">
                    <h3 className="text-xl font-semibold mb-2" data-i18n="publicLaunch">
                      Public Launch
                    </h3>
                    <p className="text-muted-foreground" data-i18n="publicLaunchDesc">
                      Full release of Projects to all DisPlan users
                    </p>
                  </div>
                </div>
                <div className="z-10 flex items-center order-0 border-2 border-border bg-transparent rounded-full w-8 h-8 md:mx-auto"></div>
                <div className="order-2 md:order-1 md:w-1/2 md:pr-8 md:text-right hidden md:block"></div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
