"use client";

import Link from "next/link";
import {
  ArrowRight,
  Code,
  GitBranch,
  GitPullRequest,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="grid"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 10 0 L 0 0 0 10"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <div className="relative pt-20 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
                  Collaborate on projects
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 block">
                    without the scams
                  </span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl text-gray-300 mb-8 leading-relaxed"
              >
                DisPlan helps you create and manage collaborative projects with
                secure payment handling, transparent workflows, and powerful
                tools for both developers and content creators.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href="/sign-up"
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium text-white hover:opacity-90 transition-all flex items-center justify-center"
                >
                  Start Collaborating
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="#features"
                  className="px-8 py-4 bg-gray-800 border border-gray-700 rounded-lg font-medium text-white hover:bg-gray-700 transition-all flex items-center justify-center"
                >
                  Explore Features
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-10 flex items-center gap-2 text-sm text-gray-400"
              >
                <Users className="h-4 w-4" />
                <span>Join over 10,000+ creators and developers</span>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative w-full max-w-md"
            >
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-sm text-gray-400">Project Dashboard</div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-gray-900 p-3 rounded-md">
                    <div className="flex items-center gap-3">
                      <GitBranch className="text-purple-400 h-5 w-5" />
                      <span className="text-gray-200">
                        Social Media Campaign
                      </span>
                    </div>
                    <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-900 p-3 rounded-md">
                    <div className="flex items-center gap-3">
                      <Code className="text-blue-400 h-5 w-5" />
                      <span className="text-gray-200">Web App Development</span>
                    </div>
                    <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                      In Progress
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-900 p-3 rounded-md">
                    <div className="flex items-center gap-3">
                      <GitPullRequest className="text-green-400 h-5 w-5" />
                      <span className="text-gray-200">API Integration</span>
                    </div>
                    <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                      Completed
                    </span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Project Completion</span>
                    <span className="text-gray-200">68%</span>
                  </div>
                  <div className="mt-2 h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      style={{ width: "68%" }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 h-40 w-40 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-3xl"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
