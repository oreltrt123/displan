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
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#273036" fill-opacity="1" d="M0,0L18.5,16C36.9,32,74,64,111,90.7C147.7,117,185,139,222,144C258.5,149,295,139,332,165.3C369.2,192,406,256,443,277.3C480,299,517,277,554,245.3C590.8,213,628,171,665,160C701.5,149,738,171,775,186.7C812.3,203,849,213,886,208C923.1,203,960,181,997,197.3C1033.8,213,1071,267,1108,288C1144.6,309,1182,299,1218,282.7C1255.4,267,1292,245,1329,208C1366.2,171,1403,117,1422,90.7L1440,64L1440,320L1421.5,320C1403.1,320,1366,320,1329,320C1292.3,320,1255,320,1218,320C1181.5,320,1145,320,1108,320C1070.8,320,1034,320,997,320C960,320,923,320,886,320C849.2,320,812,320,775,320C738.5,320,702,320,665,320C627.7,320,591,320,554,320C516.9,320,480,320,443,320C406.2,320,369,320,332,320C295.4,320,258,320,222,320C184.6,320,148,320,111,320C73.8,320,37,320,18,320L0,320Z"></path></svg>    </footer>
  )
}
