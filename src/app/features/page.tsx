"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import {
  ShieldCheck,
  Users,
  Lock,
  MessageCircle,
  BarChart,
  DollarSign,
  Store,
  CheckCircle,
  Heart,
  Palette,
  FileIcon as FileVersion,
  Key,
  Send,
  Clock,
  Search,
  ListChecks,
  MessageSquare,
  UserCheck,
  AlertTriangle,
  CreditCard,
  Eye,
  Database,
  ArrowUpRight,
  Globe2,
  HeadphonesIcon,
} from "lucide-react"
import { useState, useRef, useEffect } from "react"

export default function FeaturesPage() {
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
    <div className="w-full min-h-screen bg-background text-foreground relative">
      <Navbar />
      <main className="flex flex-col gap-20 items-center pt-32 pb-20">
        {/* Hero Section */}
        <section className="px-6 py-0 mx-auto my-0 text-center max-w-[900px]">
          <h1
            className="mb-6 text-6xl md:text-7xl font-semibold tracking-tighter text-center leading-tight"
            data-i18n="featuresHeroTitle"
          >
            Everything You Need to Build, Sell, and Collaborate — In One Platform.
          </h1>
          <p
            className="mb-10 text-xl md:text-2xl leading-8 text-center max-w-[700px] mx-auto text-muted-foreground relative"
            data-i18n="featuresHeroSubtitle"
          >
            No limits. No fees. Powered by community
            {showInfo && (
              <div
                ref={infoRef}
                className="absolute left-1/2 transform -translate-x-1/2 mt-4 bg-popover text-popover-foreground p-4 rounded-lg max-w-md mx-auto text-sm z-50 shadow-lg"
                data-i18n="infoBoxText"
              >
                No hidden fees, no commissions, no extra charges. Our platform stays free thanks to community support
                and optional donations. Help us keep it growing — for everyone.
              </div>
            )}
          </p>
        </section>

        {/* Main Features Grid */}
        <section className="w-full max-w-7xl px-6 mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold mb-10 text-center" data-i18n="coreFeatures">
            Core Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-8 rounded-2xl bg-card hover:bg-card/80 transition-colors bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10">
              <div className="w-12 h-12 bg-purple-500/20 dark:bg-purple-500/10 rounded-xl flex items-center justify-center mb-6">
                <DollarSign className="w-6 h-6 text-purple-500 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4" data-i18n="zeroCommissions">
                Zero Commissions, Forever
              </h3>
              <p className="text-muted-foreground" data-i18n="zeroCommissionsDesc">
                Sell your digital products with 0% platform fees. Keep 100% of your earnings.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card hover:bg-card/80 transition-colors bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10">
              <div className="w-12 h-12 bg-blue-500/20 dark:bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                <Lock className="w-6 h-6 text-blue-500 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4" data-i18n="builtInEscrow">
                Built-in Escrow Payments
              </h3>
              <p className="text-muted-foreground" data-i18n="builtInEscrowDesc">
                Secure payments protected with milestone-based releases.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card hover:bg-card/80 transition-colors bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10">
              <div className="w-12 h-12 bg-green-500/20 dark:bg-green-500/10 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-green-500 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4" data-i18n="globalTeamCollaboration">
                Global Team Collaboration
              </h3>
              <p className="text-muted-foreground" data-i18n="globalTeamCollaborationDesc">
                Find developers, designers, and creators worldwide to build projects together.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card hover:bg-card/80 transition-colors bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10">
              <div className="w-12 h-12 bg-orange-500/20 dark:bg-orange-500/10 rounded-xl flex items-center justify-center mb-6">
                <Store className="w-6 h-6 text-orange-500 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4" data-i18n="instantDigitalStorefront">
                Instant Digital Storefront
              </h3>
              <p className="text-muted-foreground" data-i18n="instantDigitalStorefrontDesc">
                Launch your product page in minutes, no coding or setup needed.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card hover:bg-card/80 transition-colors bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10">
              <div className="w-12 h-12 bg-pink-500/20 dark:bg-pink-500/10 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle className="w-6 h-6 text-pink-500 dark:text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4" data-i18n="qualityAssuranceTools">
                Quality Assurance Tools
              </h3>
              <p className="text-muted-foreground" data-i18n="qualityAssuranceToolsDesc">
                Built-in reviews, ratings, and versioning to ensure quality on every project.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card hover:bg-card/80 transition-colors bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10">
              <div className="w-12 h-12 bg-yellow-500/20 dark:bg-yellow-500/10 rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4" data-i18n="communitySupportDonations">
                Community Support & Donations
              </h3>
              <p className="text-muted-foreground" data-i18n="communitySupportDonationsDesc">
                Stay independent with optional donations, not premium walls or ads.
              </p>
            </div>
          </div>
        </section>

        {/* Creator Tools Grid */}
        <section className="w-full max-w-7xl px-6 mx-auto bg-accent/30 py-20 rounded-3xl">
          <h2 className="text-3xl md:text-4xl font-semibold mb-10 text-center" data-i18n="creatorTools">
            Creator Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-2xl bg-card hover:bg-card/80 transition-colors bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10">
              <div className="w-12 h-12 bg-purple-500/20 dark:bg-purple-500/10 rounded-xl flex items-center justify-center mb-6">
                <Palette className="w-6 h-6 text-purple-500 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4" data-i18n="customBranding">
                Custom Branding
              </h3>
              <p className="text-muted-foreground" data-i18n="customBrandingDesc">
                Add your logo, colors, and style — your store, your way.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card hover:bg-card/80 transition-colors bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10">
              <div className="w-12 h-12 bg-blue-500/20 dark:bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                <BarChart className="w-6 h-6 text-blue-500 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4" data-i18n="analyticsDashboard">
                Analytics Dashboard
              </h3>
              <p className="text-muted-foreground" data-i18n="analyticsDashboardDesc">
                Track sales, visits, and conversions with simple charts and reports.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card hover:bg-card/80 transition-colors bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10">
              <div className="w-12 h-12 bg-green-500/20 dark:bg-green-500/10 rounded-xl flex items-center justify-center mb-6">
                <Key className="w-6 h-6 text-green-500 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4" data-i18n="licensingRights">
                Licensing & Rights Management
              </h3>
              <p className="text-muted-foreground" data-i18n="licensingRightsDesc">
                Set clear rules for buyers — personal, commercial, or extended use.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card hover:bg-card/80 transition-colors bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10">
              <div className="w-12 h-12 bg-orange-500/20 dark:bg-orange-500/10 rounded-xl flex items-center justify-center mb-6">
                <Send className="w-6 h-6 text-orange-500 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4" data-i18n="fileDelivery">
                File Delivery Automation
              </h3>
              <p className="text-muted-foreground" data-i18n="fileDeliveryDesc">
                Files are sent instantly upon purchase, no manual work.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card hover:bg-card/80 transition-colors bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10">
              <div className="w-12 h-12 bg-pink-500/20 dark:bg-pink-500/10 rounded-xl flex items-center justify-center mb-6">
                <FileVersion className="w-6 h-6 text-pink-500 dark:text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4" data-i18n="versionUpdates">
                Version Updates
              </h3>
              <p className="text-muted-foreground" data-i18n="versionUpdatesDesc">
                Release new versions of your product and notify all buyers automatically.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card hover:bg-card/80 transition-colors bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10">
              <div className="w-12 h-12 bg-yellow-500/20 dark:bg-yellow-500/10 rounded-xl flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4" data-i18n="privateBeta">
                Private Beta Access
              </h3>
              <p className="text-muted-foreground" data-i18n="privateBetaDesc">
                Share early versions of your product with selected testers.
              </p>
            </div>
          </div>
        </section>

        {/* Community & Collaboration Features */}
        <section className="w-full max-w-7xl px-6 mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold mb-10 text-center" data-i18n="communityCollaboration">
            Community & Collaboration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-8 rounded-2xl bg-card hover:bg-card/80 transition-colors bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10">
              <div className="w-12 h-12 bg-purple-500/20 dark:bg-purple-500/10 rounded-xl flex items-center justify-center mb-6">
                <Search className="w-6 h-6 text-purple-500 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4" data-i18n="partnerFinder">
                Partner Finder
              </h3>
              <p className="text-muted-foreground" data-i18n="partnerFinderDesc">
                Connect with startup founders, indie hackers, and collaborators.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card hover:bg-card/80 transition-colors bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10">
              <div className="w-12 h-12 bg-blue-500/20 dark:bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                <ListChecks className="w-6 h-6 text-blue-500 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4" data-i18n="projectMilestones">
                Project Milestones
              </h3>
              <p className="text-muted-foreground" data-i18n="projectMilestonesDesc">
                Break big projects into smaller tasks and track progress.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card hover:bg-card/80 transition-colors bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10">
              <div className="w-12 h-12 bg-green-500/20 dark:bg-green-500/10 rounded-xl flex items-center justify-center mb-6">
                <MessageSquare className="w-6 h-6 text-green-500 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4" data-i18n="feedbackBoards">
                Feedback Boards
              </h3>
              <p className="text-muted-foreground" data-i18n="feedbackBoardsDesc">
                Get ideas, suggestions, and bug reports from your users.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card hover:bg-card/80 transition-colors bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10">
              <div className="w-12 h-12 bg-orange-500/20 dark:bg-orange-500/10 rounded-xl flex items-center justify-center mb-6">
                <MessageCircle className="w-6 h-6 text-orange-500 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4" data-i18n="builtInMessaging">
                Built-in Messaging
              </h3>
              <p className="text-muted-foreground" data-i18n="builtInMessagingDesc">
                Chat directly with collaborators and partners — without leaving the platform.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card hover:bg-card/80 transition-colors bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10">
              <div className="w-12 h-12 bg-pink-500/20 dark:bg-pink-500/10 rounded-xl flex items-center justify-center mb-6">
                <UserCheck className="w-6 h-6 text-pink-500 dark:text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4" data-i18n="taskAssignments">
                Task Assignments
              </h3>
              <p className="text-muted-foreground" data-i18n="taskAssignmentsDesc">
                Assign roles and responsibilities inside your team workspace.
              </p>
            </div>
          </div>
        </section>

        {/* Trust & Security Features */}
        <section className="w-full max-w-7xl px-6 mx-auto py-20 rounded-3xl">
          <h2 className="text-3xl md:text-4xl font-semibold mb-10 text-center" data-i18n="trustSecurity">
            Trust & Security
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-8 rounded-2xl bg-card hover:bg-card/80 transition-colors bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10">
              <div className="w-12 h-12 bg-purple-500/20 dark:bg-purple-500/10 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-purple-500 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4" data-i18n="escrowProtection">
                Escrow Protection
              </h3>
              <p className="text-muted-foreground" data-i18n="escrowProtectionDesc">
                Funds are released only when milestones are completed and approved.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card hover:bg-card/80 transition-colors bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10">
              <div className="w-12 h-12 bg-blue-500/20 dark:bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                <AlertTriangle className="w-6 h-6 text-blue-500 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4" data-i18n="disputeResolution">
                Dispute Resolution
              </h3>
              <p className="text-muted-foreground" data-i18n="disputeResolutionDesc">
                Fair conflict management by neutral moderators when needed.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card hover:bg-card/80 transition-colors bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10">
              <div className="w-12 h-12 bg-green-500/20 dark:bg-green-500/10 rounded-xl flex items-center justify-center mb-6">
                <CreditCard className="w-6 h-6 text-green-500 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4" data-i18n="secureCheckout">
                Secure Checkout
              </h3>
              <p className="text-muted-foreground" data-i18n="secureCheckoutDesc">
                Encrypted payments with Stripe & PayPal integrations.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card hover:bg-card/80 transition-colors bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10">
              <div className="w-12 h-12 bg-orange-500/20 dark:bg-orange-500/10 rounded-xl flex items-center justify-center mb-6">
                <Eye className="w-6 h-6 text-orange-500 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4" data-i18n="gdprPrivacy">
                GDPR & Privacy Focused
              </h3>
              <p className="text-muted-foreground" data-i18n="gdprPrivacyDesc">
                We don't sell user data. Your privacy is protected by default.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card hover:bg-card/80 transition-colors bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10">
              <div className="w-12 h-12 bg-pink-500/20 dark:bg-pink-500/10 rounded-xl flex items-center justify-center mb-6">
                <Database className="w-6 h-6 text-pink-500 dark:text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4" data-i18n="openSource">
                Open Source Foundation
              </h3>
              <p className="text-muted-foreground" data-i18n="openSourceDesc">
                100% transparent codebase with community contributions.
              </p>
            </div>
          </div>
        </section>

        {/* Optional Paid Upgrades */}
        <section className="w-full max-w-7xl px-6 mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-center" data-i18n="optionalPaidUpgrades">
            Optional Paid Upgrades
          </h2>
          <p
            className="text-xl text-muted-foreground text-center mb-10 max-w-[700px] mx-auto"
            data-i18n="stayFreeForever"
          >
            Stay Free Forever, or Upgrade When You Want
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-card hover:bg-card/80 transition-colors border border-yellow-500/20">
              <div className="w-10 h-10 bg-yellow-500/20 dark:bg-yellow-500/10 rounded-xl flex items-center justify-center mb-4">
                <ArrowUpRight className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2" data-i18n="boostedListings">
                Boosted Listings
              </h3>
              <p className="text-muted-foreground text-sm" data-i18n="boostedListingsDesc">
                Get more visibility on search results (Optional, no required fees).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card hover:bg-card/80 transition-colors border border-yellow-500/20">
              <div className="w-10 h-10 bg-yellow-500/20 dark:bg-yellow-500/10 rounded-xl flex items-center justify-center mb-4">
                <Globe2 className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2" data-i18n="customDomains">
                Custom Domains
              </h3>
              <p className="text-muted-foreground text-sm" data-i18n="customDomainsDesc">
                Use your own .com for your store (Optional addon).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card hover:bg-card/80 transition-colors border border-yellow-500/20">
              <div className="w-10 h-10 bg-yellow-500/20 dark:bg-yellow-500/10 rounded-xl flex items-center justify-center mb-4">
                <HeadphonesIcon className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2" data-i18n="prioritySupport">
                Priority Support
              </h3>
              <p className="text-muted-foreground text-sm" data-i18n="prioritySupportDesc">
                Get faster responses from our team.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full max-w-4xl px-6 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6" data-i18n="readyToGetStarted">
            Ready to get started?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-[700px] mx-auto" data-i18n="joinThousands">
            Join thousands of creators, developers, and entrepreneurs building on DisPlan.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/projects"
              className="px-5 py-3 text-base tracking-tight no-underline bg-primary font-[560] rounded-[100px] text-primary-foreground hover:bg-primary/90 transition-opacity"
              data-i18n="exploreProjects"
            >
              Explore Projects
            </Link>
            <Link
              href="/demo"
              className="px-5 py-3 text-base tracking-tight no-underline bg-secondary font-[560] rounded-[100px] text-secondary-foreground hover:bg-secondary/80 transition-opacity"
              data-i18n="watchDemo"
            >
              Watch Demo
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
