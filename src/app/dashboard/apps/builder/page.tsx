"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Globe, Check, X } from "lucide-react"
import DashboardNavbar from "@/components/dashboard-navbar"
import "../styles/apps.css"

export default function WebsiteBuilderPage() {
  const [showLanguages, setShowLanguages] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  const appData = {
    name: "Website Builder",
    description:
      "The quick and easy website creation app. Free. Build standout websites, landing pages, and more. Included in Creative Cloud memberships at no extra cost.",
    features: [
      "Bring your website to life faster.",
      "Quickly make variations of your website designs with Bulk Create, and use Resize to fit all your needs.",
      "Add animations to impress.",
      "Import designs to jump-start your content.",
      "Publish high-quality websites.",
    ],
    mainImages: [
      "/apps/builder/mainImages.png",
      "/apps/builder/mainImages1.png",
      "/apps/builder/ai.png",
    ],
    thumbnails: [
      "/apps/builder/mainImages.png",
      "/apps/builder/mainImages1.png",
      "/apps/builder/mainImagesai.png",
    ],
    url: "/dashboard/apps/website-builder",
    languages: [
      "English",
      "Dansk",
      "Nederlands",
      "Suomi",
      "Français",
      "Deutsch",
      "Italiano",
      "日本語",
      "한국어",
      "Norsk",
      "Português (Brasil)",
      "繁體中文",
      "简体中文",
      "Español",
      "Svenska",
    ],
  }

  return (
    <div className="w-full min-h-screen text-white bg-black relative">
      <DashboardNavbar hasProfile={true} />
      <main className="w-full">
        <div className="container mx-auto px-4 py-8">
          {/* Back button */}
          <Link href="/dashboard/apps" className="inline-flex items-center text-white/70 hover:text-white mb-6">
            <ArrowLeft size={16} className="mr-2" /> Back to Apps
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left sidebar */}
            <div className="app-detail-sidebar">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="24" rx="4" fill="#066CE7" />
                    <path d="M7 8H17M7 12H17M7 16H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <h1 className="app-detail-title">{appData.name}</h1>
              </div>

              <div className="flex gap-8 mb-6">
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                   <Globe size={14} className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-white/70">Web</span>
                </div>
              </div>

              <p className="app-detail-description">{appData.description}</p>

              <div className="app-detail-features">
                <button
                  onClick={() => setShowLanguages(true)}
                  className="app-detail-feature cursor-pointer hover:text-white transition-colors"
                >
                  <Globe size={16} className="text-blue-400" />
                  <span>English and {appData.languages.length - 1} other languages</span>
                </button>
                <div className="app-detail-feature">
                  <Check size={16} className="text-green-500" />
                  <span>Works on this device</span>
                </div>
              </div>

              <a href={appData.url} target="_blank" rel="noopener noreferrer" className="app-detail-open-button">
                Open
              </a>
            </div>

            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Main image */}
              <div className="app-detail-main-image-container">
                <div className="app-detail-main-image">
                  <Image
                    src={appData.mainImages[selectedImage] || "/placeholder.svg"}
                    alt={appData.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Thumbnails */}
                <div className="app-detail-thumbnails">
                  {appData.thumbnails.map((thumb, index) => (
                    <div
                      key={index}
                      className={`app-detail-thumbnail ${selectedImage === index ? "border-blue-500" : ""}`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <Image
                        src={thumb || "/placeholder.svg"}
                        alt={`${appData.name} thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Main uses */}
              <div className="app-detail-main-uses">
                <h2 className="app-detail-section-title">Main uses</h2>
                <ul className="app-detail-features-list">
                  {appData.features.map((feature, index) => (
                    <li key={index} className="app-detail-feature-item">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Languages Modal */}
      {showLanguages && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="languages-modal">
            <div className="languages-header">
              <h2>Languages</h2>
              <button onClick={() => setShowLanguages(false)} className="text-white/70 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="languages-content">
              <div className="languages-sidebar">
                <div className="languages-sidebar-item active">Languages</div>
              </div>
              <div className="languages-list">
                <div className="languages-grid">
                  {appData.languages.map((language, index) => (
                    <div key={index} className="languages-item">
                      {language}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="languages-footer">
              <button onClick={() => setShowLanguages(false)} className="languages-done-button">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
