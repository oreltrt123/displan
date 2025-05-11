import Link from "next/link"
import { Twitter, Linkedin, Github, Instagram } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className=" border-t border-none text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Product Column */}
          <div>
            <h3 className="font-semibold text-white mb-4" data-i18n="product">
              Product
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/features" className="text-gray-400 hover:text-purple-400 link_button" data-i18n="features">
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-400 hover:text-purple-400 link_button"
                  data-i18n="dashboard"
                >
                  Dashboard
                </Link>
              </li>
              {/* <li>
                <Link href="#" className="text-gray-400 hover:text-purple-400 link_button" data-i18n="api">
                  API
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-semibold text-white mb-4" data-i18n="company">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-purple-400 link_button" data-i18n="about">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-purple-400 link_button" data-i18n="blog">
                  Blog
                </Link>
              </li>
              {/* <li>
                <Link href="#" className="text-gray-400 hover:text-purple-400 link_button" data-i18n="careers">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-purple-400 link_button" data-i18n="press">
                  Press
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="font-semibold text-white mb-4" data-i18n="resources">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/docs"
                  className="text-gray-400 hover:text-purple-400 link_button"
                  data-i18n="documentation"
                >
                  Documentation
                </Link>
              </li>
              {/* <li>
                <Link href="#" className="text-gray-400 hover:text-purple-400 link_button" data-i18n="community">
                  Community
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-purple-400 link_button" data-i18n="status">
                  Status
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="font-semibold text-white mb-4" data-i18n="legal">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-purple-400 link_button" data-i18n="privacy">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-purple-400 link_button" data-i18n="terms">
                  Terms
                </Link>
              </li>
              {/* <li>
                <Link href="#" className="text-gray-400 hover:text-purple-400 link_button" data-i18n="security">
                  Security
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-purple-400 link_button" data-i18n="cookies">
                  Cookies
                </Link>
              </li> */}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-none">
          <div className="text-gray-400 mb-4 md:mb-0" data-i18n="copyright">
            © {currentYear} DisPlan. All rights reserved.
          </div>

          <div className="flex space-x-6">
            <a href="https://x.com/WrRbybw84381" className="text-gray-400 hover:text-purple-400 link_button">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/orel-revivo-4a6262274/"
              className="text-gray-400 hover:text-purple-400 link_button"
            >
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-6 w-6" />
            </a>
            <a href="https://github.com/orelrevivo/" className="text-gray-400 hover:text-purple-400 link_button">
              <span className="sr-only">GitHub</span>
              <Github className="h-6 w-6" />
            </a>
            <a
              href="https://www.instagram.com/orelrevivo3999/"
              className="text-gray-400 hover:text-purple-400 link_button"
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
