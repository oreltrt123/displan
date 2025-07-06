// Revised FeaturesPage component focused solely on AI Website Builder functionality

"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import {
  Palette,
  Layout,
  Code2,
  MonitorSmartphone,
  UserCheck,
  Settings2,
  UploadCloud,
  ShieldCheck,
  Sparkles,
  Globe2,
  HeadphonesIcon,
} from "lucide-react"
import { useState, useRef, useEffect } from "react"

export default function FeaturesPage() {
  const [showInfo, setShowInfo] = useState(false)
  const infoRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (infoRef.current && !infoRef.current.contains(event.target)) {
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
        {/* Hero */}
        <section className="px-6 text-center max-w-[900px]">
          <h1 className="mb-6 text-6xl md:text-7xl font-semibold tracking-tighter leading-tight">
            Build Websites Visually with AI — No Code Needed.
          </h1>
          <p className="mb-10 text-xl md:text-2xl leading-8 text-muted-foreground max-w-[700px] mx-auto relative">
            Design and launch your next idea with DisPlan — your all-in-one AI website builder.
          </p>
        </section>

        {/* Core Features */}
        <section className="w-full max-w-7xl px-6 mx-auto">
          <h2 className="text-4xl font-semibold mb-10 text-center">Core Builder Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[{
              icon: <Sparkles className="w-6 h-6 text-purple-500" />, title: "AI-Assisted Building",
              desc: "Type your idea, and DisPlan will generate layouts and content automatically."
            }, {
              icon: <Layout className="w-6 h-6 text-blue-500" />, title: "Drag-and-Drop Editor",
              desc: "Place elements anywhere on the canvas — instantly responsive and editable."
            }, {
              icon: <Code2 className="w-6 h-6 text-green-500" />, title: "Clean Exportable Code",
              desc: "Download or deploy production-ready HTML, CSS, and React components."
            }, {
              icon: <MonitorSmartphone className="w-6 h-6 text-orange-500" />, title: "Responsive by Default",
              desc: "Everything you build looks great on desktop, tablet, and mobile screens."
            }, {
              icon: <UserCheck className="w-6 h-6 text-pink-500" />, title: "Real-Time Collaboration",
              desc: "Invite others to design or edit your project live with comments and roles."
            }, {
              icon: <UploadCloud className="w-6 h-6 text-yellow-500" />, title: "1-Click Deployment",
              desc: "Go live with your website instantly — no servers, no setup."
            }].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl transition-colors bg-[#8888881A]">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-muted">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Add-on Features */}
        <section className="w-full max-w-7xl px-6 mx-auto py-20">
          <h2 className="text-4xl font-semibold mb-10 text-center">Add-on Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[{
              icon: <Palette className="w-6 h-6 text-purple-500" />, title: "Custom Theming",
              desc: "Change colors, fonts, and layouts to match your brand."
            }, {
              icon: <Settings2 className="w-6 h-6 text-blue-500" />, title: "Advanced Settings",
              desc: "Control meta tags, SEO, integrations, and more from a central dashboard."
            }, {
              icon: <ShieldCheck className="w-6 h-6 text-green-500" />, title: "Secure & Private",
              desc: "Built with user privacy and data protection in mind from the start."
            }].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl bg-[#8888881A] transition-colors">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-muted">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="w-full max-w-4xl px-6 mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-6">Ready to build with AI?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-[700px] mx-auto">
            Start building your site with DisPlan — no credit card or setup needed.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/builder"
              className="px-5 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90"
            >
              Start Building
            </Link>
            <Link
              href="/demo"
              className="px-5 py-3 bg-secondary text-secondary-foreground font-semibold rounded-full hover:bg-secondary/80"
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
