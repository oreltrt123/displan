import Link from "next/link"
import { Twitter, Linkedin, Github, Instagram } from 'lucide-react'
import "@/styles/footer.css"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="">
      <div className="container afasfasfawffwf mx-auto px-4 py-12 bg-[#8888881A]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Product Column */}
          <div>
            <h3 className="font-semibold text-black dark:text-white mb-4" data-i18n="product">
              Product
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/features" 
                  className="text-black dark:text-white/70 hover:text-[rgb(0,153,255)] dark:hover:text-[rgb(0,153,255)] link_button" 
                  data-i18n="features"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-black dark:text-white/70 hover:text-[rgb(0,153,255)] dark:hover:text-[rgb(0,153,255)] link_button"
                  data-i18n="dashboard"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/builder"
                  className="text-black dark:text-white/70 hover:text-[rgb(0,153,255)] dark:hover:text-[rgb(0,153,255)] link_button"
                  data-i18n="displan editor"
                >
                  DisPlan Editor
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-semibold text-black dark:text-white mb-4" data-i18n="company">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/about" 
                  className="text-black dark:text-white/70 hover:text-[rgb(0,153,255)] dark:hover:text-[rgb(0,153,255)] link_button" 
                  data-i18n="about"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className="text-black dark:text-white/70 hover:text-[rgb(0,153,255)] dark:hover:text-[rgb(0,153,255)] link_button" 
                  data-i18n="blog"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="font-semibold text-black dark:text-white mb-4" data-i18n="resources">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/docs"
                  className="text-black dark:text-white/70 hover:text-[rgb(0,153,255)] dark:hover:text-[rgb(0,153,255)] link_button"
                  data-i18n="documentation"
                >
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="font-semibold text-black dark:text-white mb-4" data-i18n="legal">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/privacy" 
                  className="text-black dark:text-white/70 hover:text-[rgb(0,153,255)] dark:hover:text-[rgb(0,153,255)] link_button" 
                  data-i18n="privacy"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-black dark:text-white/70 hover:text-[rgb(0,153,255)] dark:hover:text-[rgb(0,153,255)] link_button" 
                  data-i18n="terms"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#8888881A]">
          <div className="text-black dark:text-white/70 mb-4 md:mb-0" data-i18n="copyright">
            © 2025 DisPlan. All rights reserved.
          </div>{/* {currentYear} */}

          <div className="flex space-x-6">
            <a href="https://x.com/WrRbybw84381" className="text-black dark:text-white/70 hover:text-[rgb(0,153,255)] dark:hover:text-[rgb(0,153,255)] link_button">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/orel-revivo-4a6262274/"
              className="text-black dark:text-white/70 hover:text-[rgb(0,153,255)] link_button"
            >
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-6 w-6" />
            </a>
            <a href="https://github.com/orelrevivo/" className="text-black dark:text-white/70 hover:text-[rgb(0,153,255)] dark:hover:text-[rgb(0,153,255)] link_button">
              <span className="sr-only">GitHub</span>
              <Github className="h-6 w-6" />
            </a>
            <a
              href="https://www.instagram.com/orelrevivo3999/"
              className="text-black dark:text-white/70 hover:text-[rgb(0,153,255)] dark:hover:text-[rgb(0,153,255)] link_button"
            >
              <span className="sr-only">Instagram</span>
              <Instagram className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
</footer>
  )
}
