"use client"

import type React from "react"

import { useRef } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"

export default function PrivacyPage() {
  // References for each section
  const section1Ref = useRef<HTMLDivElement>(null)
  const section2Ref = useRef<HTMLDivElement>(null)
  const section3Ref = useRef<HTMLDivElement>(null)
  const section4Ref = useRef<HTMLDivElement>(null)
  const section5Ref = useRef<HTMLDivElement>(null)
  const section6Ref = useRef<HTMLDivElement>(null)
  const section7Ref = useRef<HTMLDivElement>(null)
  const section8Ref = useRef<HTMLDivElement>(null)
  const section9Ref = useRef<HTMLDivElement>(null)
  const section10Ref = useRef<HTMLDivElement>(null)
  const section11Ref = useRef<HTMLDivElement>(null)
  const section12Ref = useRef<HTMLDivElement>(null)

  // Function to scroll to a section
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop - 100, // Offset to account for navbar
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="w-full min-h-screen text-white bg-black relative">
      <Navbar />
      <main className="flex flex-col md:flex-row pt-32 pb-20">
        {/* Sidebar */}
        <aside className="w-full md:w-64 lg:w-72 px-6 md:fixed md:h-[calc(100vh-80px)] overflow-auto">
          <div className="sticky top-32">
            <h2 className="text-xl font-semibold mb-6" data-i18n="privacyPolicy">
              Privacy Policy
            </h2>
            <nav className="space-y-2">
              <button
                onClick={() => scrollToSection(section1Ref)}
                className="w-full text-left px-4 py-2 rounded-lg text-white/80 hover:bg-white/10 transition-colors text-sm"
                data-i18n="introduction"
              >
                1. Introduction
              </button>
              <button
                onClick={() => scrollToSection(section2Ref)}
                className="w-full text-left px-4 py-2 rounded-lg text-white/80 hover:bg-white/10 transition-colors text-sm"
                data-i18n="informationWeCollect"
              >
                2. Information We Collect
              </button>
              <button
                onClick={() => scrollToSection(section3Ref)}
                className="w-full text-left px-4 py-2 rounded-lg text-white/80 hover:bg-white/10 transition-colors text-sm"
                data-i18n="howWeUseYourInformation"
              >
                3. How We Use Your Information
              </button>
              <button
                onClick={() => scrollToSection(section4Ref)}
                className="w-full text-left px-4 py-2 rounded-lg text-white/80 hover:bg-white/10 transition-colors text-sm"
                data-i18n="cookiesAndTracking"
              >
                4. Cookies and Tracking
              </button>
              <button
                onClick={() => scrollToSection(section5Ref)}
                className="w-full text-left px-4 py-2 rounded-lg text-white/80 hover:bg-white/10 transition-colors text-sm"
                data-i18n="sharingYourData"
              >
                5. Sharing Your Data
              </button>
              <button
                onClick={() => scrollToSection(section6Ref)}
                className="w-full text-left px-4 py-2 rounded-lg text-white/80 hover:bg-white/10 transition-colors text-sm"
                data-i18n="dataRetention"
              >
                6. Data Retention
              </button>
              <button
                onClick={() => scrollToSection(section7Ref)}
                className="w-full text-left px-4 py-2 rounded-lg text-white/80 hover:bg-white/10 transition-colors text-sm"
                data-i18n="userRights"
              >
                7. User Rights
              </button>
              <button
                onClick={() => scrollToSection(section8Ref)}
                className="w-full text-left px-4 py-2 rounded-lg text-white/80 hover:bg-white/10 transition-colors text-sm"
                data-i18n="dataSecurity"
              >
                8. Data Security
              </button>
              <button
                onClick={() => scrollToSection(section9Ref)}
                className="w-full text-left px-4 py-2 rounded-lg text-white/80 hover:bg-white/10 transition-colors text-sm"
                data-i18n="thirdPartyServices"
              >
                9. Third-Party Services
              </button>
              <button
                onClick={() => scrollToSection(section10Ref)}
                className="w-full text-left px-4 py-2 rounded-lg text-white/80 hover:bg-white/10 transition-colors text-sm"
                data-i18n="childrensPrivacy"
              >
                10. Children's Privacy
              </button>
              <button
                onClick={() => scrollToSection(section11Ref)}
                className="w-full text-left px-4 py-2 rounded-lg text-white/80 hover:bg-white/10 transition-colors text-sm"
                data-i18n="changesToPolicy"
              >
                11. Changes to This Policy
              </button>
              <button
                onClick={() => scrollToSection(section12Ref)}
                className="w-full text-left px-4 py-2 rounded-lg text-white/80 hover:bg-white/10 transition-colors text-sm"
                data-i18n="contactUsPrivacy"
              >
                12. Contact Us
              </button>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <section className="w-full md:ml-64 lg:ml-72 px-6 md:px-10 max-w-[800px]">
          <h1 className="mb-10 text-5xl font-semibold tracking-tighter leading-none" data-i18n="privacyPolicy">
            Privacy Policy
          </h1>

          <div className="space-y-8 text-lg">
            <div ref={section1Ref} className="p-8 rounded-2xl bg-white/5 hover:bg-white/8 transition-colors">
              <h2 className="text-2xl font-semibold mb-3" data-i18n="introduction">
                1. Introduction
              </h2>
              <p className="text-white/80" data-i18n="introductionDesc">
                Your privacy is important to us. This policy explains what data we collect, how we use it, and your
                rights regarding your information.
              </p>
            </div>

            <div ref={section2Ref} className="p-8 rounded-2xl bg-white/5 hover:bg-white/8 transition-colors">
              <h2 className="text-2xl font-semibold mb-3" data-i18n="informationWeCollect">
                2. Information We Collect
              </h2>
              <p className="text-white/80" data-i18n="informationWeCollectDesc">
                We collect information when you register, such as your email address, username, and payment details
                (only processed, not stored). We also collect usage data for improving our services.
              </p>
            </div>

            <div ref={section3Ref} className="p-8 rounded-2xl bg-white/5 hover:bg-white/8 transition-colors">
              <h2 className="text-2xl font-semibold mb-3" data-i18n="howWeUseYourInformation">
                3. How We Use Your Information
              </h2>
              <p className="text-white/80" data-i18n="howWeUseYourInformationDesc">
                We use your data to:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-white/80">
                <li data-i18n="provideServices">Provide and improve our services</li>
                <li data-i18n="processTransactions">Process transactions</li>
                <li data-i18n="communicateWithYou">Communicate with you about updates and offers</li>
                <li data-i18n="preventFraud">Prevent fraud and maintain security</li>
              </ul>
            </div>

            <div ref={section4Ref} className="p-8 rounded-2xl bg-white/5 hover:bg-white/8 transition-colors">
              <h2 className="text-2xl font-semibold mb-3" data-i18n="cookiesAndTracking">
                4. Cookies and Tracking
              </h2>
              <p className="text-white/80" data-i18n="cookiesAndTrackingDesc">
                We use cookies to enhance user experience, remember preferences, and analyze site traffic. You can
                disable cookies in your browser settings.
              </p>
            </div>

            <div ref={section5Ref} className="p-8 rounded-2xl bg-white/5 hover:bg-white/8 transition-colors">
              <h2 className="text-2xl font-semibold mb-3" data-i18n="sharingYourData">
                5. Sharing Your Data
              </h2>
              <p className="text-white/80" data-i18n="sharingYourDataDesc">
                We do not sell your personal data. We only share information with payment processors and analytics
                services necessary to operate the platform.
              </p>
            </div>

            <div ref={section6Ref} className="p-8 rounded-2xl bg-white/5 hover:bg-white/8 transition-colors">
              <h2 className="text-2xl font-semibold mb-3" data-i18n="dataRetention">
                6. Data Retention
              </h2>
              <p className="text-white/80" data-i18n="dataRetentionDesc">
                We keep your information as long as your account is active. You can request deletion of your account and
                data at any time.
              </p>
            </div>

            <div ref={section7Ref} className="p-8 rounded-2xl bg-white/5 hover:bg-white/8 transition-colors">
              <h2 className="text-2xl font-semibold mb-3" data-i18n="userRights">
                7. User Rights
              </h2>
              <p className="text-white/80" data-i18n="userRightsDesc">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-white/80">
                <li data-i18n="accessData">Access the data we hold about you</li>
                <li data-i18n="correctInaccuracies">Correct inaccuracies</li>
                <li data-i18n="requestDeletion">Request deletion</li>
                <li data-i18n="objectToProcessing">Object to processing</li>
              </ul>
            </div>

            <div ref={section8Ref} className="p-8 rounded-2xl bg-white/5 hover:bg-white/8 transition-colors">
              <h2 className="text-2xl font-semibold mb-3" data-i18n="dataSecurity">
                8. Data Security
              </h2>
              <p className="text-white/80" data-i18n="dataSecurityDesc">
                We implement security measures to protect your information, including encryption and secure servers.
              </p>
            </div>

            <div ref={section9Ref} className="p-8 rounded-2xl bg-white/5 hover:bg-white/8 transition-colors">
              <h2 className="text-2xl font-semibold mb-3" data-i18n="thirdPartyServices">
                9. Third-Party Services
              </h2>
              <p className="text-white/80" data-i18n="thirdPartyServicesDesc">
                We may link to or use third-party services (e.g., payment gateways). Please review their privacy
                policies separately.
              </p>
            </div>

            <div ref={section10Ref} className="p-8 rounded-2xl bg-white/5 hover:bg-white/8 transition-colors">
              <h2 className="text-2xl font-semibold mb-3" data-i18n="childrensPrivacy">
                10. Children's Privacy
              </h2>
              <p className="text-white/80" data-i18n="childrensPrivacyDesc">
                Our services are not intended for children under 16. We do not knowingly collect information from
                minors.
              </p>
            </div>

            <div ref={section11Ref} className="p-8 rounded-2xl bg-white/5 hover:bg-white/8 transition-colors">
              <h2 className="text-2xl font-semibold mb-3" data-i18n="changesToPolicy">
                11. Changes to This Policy
              </h2>
              <p className="text-white/80" data-i18n="changesToPolicyDesc">
                We may update this policy. If significant changes occur, we will notify you through the platform.
              </p>
            </div>

            <div ref={section12Ref} className="p-8 rounded-2xl bg-white/5 hover:bg-white/8 transition-colors">
              <h2 className="text-2xl font-semibold mb-3" data-i18n="contactUsPrivacy">
                12. Contact Us
              </h2>
              <p className="text-white/80" data-i18n="contactUsPrivacyDesc">
                If you have questions about this privacy policy, please contact our support team.
              </p>
            </div>
          </div>

          <div className="flex gap-4 justify-center mt-12">
            <Link
              href="/terms"
              className="px-5 py-3 text-base tracking-tight no-underline bg-white font-[560] rounded-[100px] text-black hover:bg-opacity-90 transition-opacity"
              data-i18n="viewTermsOfUse"
            >
              View Terms of Use
            </Link>
            <Link
              href="/"
              className="px-5 py-3 text-base tracking-tight no-underline bg-white bg-opacity-10 font-[560] rounded-[100px] text-white hover:bg-opacity-20 transition-opacity"
              data-i18n="backToHome"
            >
              Back to Home
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
