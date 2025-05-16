import Link from "next/link"
import { Twitter, Linkedin, Github, Instagram } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 dark:border-none text-gray-700 dark:text-gray-300">
      <div className="container mx-auto px-4 py-12">
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
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 link_button" 
                  data-i18n="features"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 link_button"
                  data-i18n="dashboard"
                >
                  Dashboard
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
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 link_button" 
                  data-i18n="about"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 link_button" 
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
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 link_button"
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
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 link_button" 
                  data-i18n="privacy"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 link_button" 
                  data-i18n="terms"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="text-gray-600 dark:text-gray-400 mb-4 md:mb-0" data-i18n="copyright">
            © {currentYear} DisPlan. All rights reserved.
          </div>

          <div className="flex space-x-6">
            <a href="https://x.com/WrRbybw84381" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 link_button">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/orel-revivo-4a6262274/"
              className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 link_button"
            >
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-6 w-6" />
            </a>
            <a href="https://github.com/orelrevivo/" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 link_button">
              <span className="sr-only">GitHub</span>
              <Github className="h-6 w-6" />
            </a>
            <a
              href="https://www.instagram.com/orelrevivo3999/"
              className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 link_button"
            >
              <span className="sr-only">Instagram</span>
              <Instagram className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#0099ff" fill-opacity="1" d="M0,96L16,101.3C32,107,64,117,96,133.3C128,149,160,171,192,165.3C224,160,256,128,288,128C320,128,352,160,384,197.3C416,235,448,277,480,282.7C512,288,544,256,576,208C608,160,640,96,672,106.7C704,117,736,203,768,202.7C800,203,832,117,864,101.3C896,85,928,139,960,186.7C992,235,1024,277,1056,282.7C1088,288,1120,256,1152,240C1184,224,1216,224,1248,186.7C1280,149,1312,75,1344,48C1376,21,1408,43,1424,53.3L1440,64L1440,320L1424,320C1408,320,1376,320,1344,320C1312,320,1280,320,1248,320C1216,320,1184,320,1152,320C1120,320,1088,320,1056,320C1024,320,992,320,960,320C928,320,896,320,864,320C832,320,800,320,768,320C736,320,704,320,672,320C640,320,608,320,576,320C544,320,512,320,480,320C448,320,416,320,384,320C352,320,320,320,288,320C256,320,224,320,192,320C160,320,128,320,96,320C64,320,32,320,16,320L0,320Z"></path></svg>
    </footer>
  )
}
