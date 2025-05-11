"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="w-full min-h-screen text-white bg-black relative">
      <Navbar />
      <main className="flex flex-col gap-16 items-center pt-32 pb-20">
        <section className="px-6 mx-auto max-w-[800px]">
          <h1 className="mb-10 text-6xl font-semibold tracking-tighter text-center leading-none" data-i18n="termsOfUse">
            Terms of Use
          </h1>

          <div className="space-y-8 text-lg">
            <div className="p-8 rounded-2xl bg-white/5 hover:bg-white/8 transition-colors">
              <h2 className="text-2xl font-semibold mb-3" data-i18n="introduction">
                1. Introduction
              </h2>
              <p className="text-white/80" data-i18n="introductionDesc">
                Welcome to our platform, where creators, developers, and entrepreneurs collaborate, sell, and grow
                together. By accessing or using our services, you agree to these Terms of Use. Please read them
                carefully.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 hover:bg-white/8 transition-colors">
              <h2 className="text-2xl font-semibold mb-3" data-i18n="eligibility">
                2. Eligibility
              </h2>
              <p className="text-white/80" data-i18n="eligibilityDesc">
                To use this platform, you must be at least 16 years old. By using our services, you confirm that you
                meet this requirement.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 hover:bg-white/8 transition-colors">
              <h2 className="text-2xl font-semibold mb-3" data-i18n="accountRegistration">
                3. Account Registration
              </h2>
              <p className="text-white/80" data-i18n="accountRegistrationDesc">
                You are responsible for keeping your account secure. Use a strong password and do not share your login
                details. Any activity under your account is your responsibility.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 hover:bg-white/8 transition-colors">
              <h2 className="text-2xl font-semibold mb-3" data-i18n="communityGuidelines">
                4. Community Guidelines
              </h2>
              <p className="text-white/80" data-i18n="communityGuidelinesDesc">
                All users are expected to respect one another. No harassment, hate speech, or fraudulent behavior will
                be tolerated. Violations may lead to account suspension.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 hover:bg-white/8 transition-colors">
              <h2 className="text-2xl font-semibold mb-3" data-i18n="digitalProductSales">
                5. Digital Product Sales
              </h2>
              <p className="text-white/80" data-i18n="digitalProductSalesDesc">
                You may list and sell digital products. No commissions are charged. However, it is your duty to ensure
                your products comply with intellectual property laws.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 hover:bg-white/8 transition-colors">
              <h2 className="text-2xl font-semibold mb-3" data-i18n="teamCollaborations">
                6. Team Collaborations
              </h2>
              <p className="text-white/80" data-i18n="teamCollaborationsDesc">
                When collaborating with others, users must clearly define terms such as payment, deadlines, and
                responsibilities. Our platform does not mediate disputes.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 hover:bg-white/8 transition-colors">
              <h2 className="text-2xl font-semibold mb-3" data-i18n="paymentsFees">
                7. Payments & Fees
              </h2>
              <p className="text-white/80" data-i18n="paymentsFeesDesc">
                Payments between users are protected through escrow and milestone systems. We do not charge transaction
                fees, but payment processors may apply their own fees.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 hover:bg-white/8 transition-colors">
              <h2 className="text-2xl font-semibold mb-3" data-i18n="qualityAssuranceTerms">
                8. Quality Assurance
              </h2>
              <p className="text-white/80" data-i18n="qualityAssuranceTermsDesc">
                Users must maintain a standard of quality. False claims or substandard work can result in penalties,
                including removal of listings.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 hover:bg-white/8 transition-colors">
              <h2 className="text-2xl font-semibold mb-3" data-i18n="platformUsage">
                9. Platform Usage
              </h2>
              <p className="text-white/80" data-i18n="platformUsageDesc">
                You may not misuse our services, attempt to hack, overload, or reverse engineer the platform. Respect
                the system and its users.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 hover:bg-white/8 transition-colors">
              <h2 className="text-2xl font-semibold mb-3" data-i18n="termination">
                10. Termination
              </h2>
              <p className="text-white/80" data-i18n="terminationDesc">
                We reserve the right to suspend or terminate accounts that violate our terms or put the community at
                risk.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 hover:bg-white/8 transition-colors">
              <h2 className="text-2xl font-semibold mb-3" data-i18n="changesToTerms">
                11. Changes to Terms
              </h2>
              <p className="text-white/80" data-i18n="changesToTermsDesc">
                We may update these terms as the platform evolves. We will notify users of significant changes.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 hover:bg-white/8 transition-colors">
              <h2 className="text-2xl font-semibold mb-3" data-i18n="limitationOfLiability">
                12. Limitation of Liability
              </h2>
              <p className="text-white/80" data-i18n="limitationOfLiabilityDesc">
                We are not liable for disputes between users or damages arising from the use of our services.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 hover:bg-white/8 transition-colors">
              <h2 className="text-2xl font-semibold mb-3" data-i18n="governingLaw">
                13. Governing Law
              </h2>
              <p className="text-white/80" data-i18n="governingLawDesc">
                These terms are governed by the laws of your local jurisdiction.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 hover:bg-white/8 transition-colors">
              <h2 className="text-2xl font-semibold mb-3" data-i18n="contactUs">
                14. Contact Us
              </h2>
              <p className="text-white/80" data-i18n="contactUsDesc">
                For questions about these terms, please contact our support team.
              </p>
            </div>
          </div>
        </section>

        <div className="flex gap-4 justify-center mt-8">
          <Link
            href="/privacy"
            className="px-5 py-3 text-base tracking-tight no-underline bg-white font-[560] rounded-[100px] text-black hover:bg-opacity-90 transition-opacity"
            data-i18n="viewPrivacyPolicy"
          >
            View Privacy Policy
          </Link>
          <Link
            href="/"
            className="px-5 py-3 text-base tracking-tight no-underline bg-white bg-opacity-10 font-[560] rounded-[100px] text-white hover:bg-opacity-20 transition-opacity"
            data-i18n="backToHome"
          >
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
