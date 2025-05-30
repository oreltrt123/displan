
import React from 'react';
import { ArrowRight, Check, Star, Zap, Shield, Globe, Heart, Rocket, Users, Code, Award } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-sans overflow-hidden transition-colors duration-300">
      {/* Animated Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-conic from-purple-500/10 via-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-spin" style={{animationDuration: '20s'}}></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <div className="animate-fade-in">
            <h1 className="text-7xl md:text-9xl font-bold mb-8 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              DisPlan
            </h1>
            <p className="text-2xl md:text-3xl mb-12 text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Build, sell & collaborate — all in one free platform with{' '}
              <span className="text-purple-400 font-semibold">zero commissions</span> and{' '}
              <span className="text-blue-400 font-semibold">community-powered growth</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group px-6 py-2 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded text-sm font-semibold transition-all duration-200 hover:scale-110 hover:rotate-1">
                <span className="flex items-center gap-2">
                  Get Started for $5
                  <ArrowRight className="w-3 h-3" />
                </span>
              </button>
              <div className="text-sm text-gray-400 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                Pay once, build forever
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <section className="relative py-32 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-12 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Our Mission
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto">
            We believe every creator and startup founder deserves a level playing field. DisPlan exists to eliminate paywalls,
            middle-man fees, and geographic barriers so that talent anywhere can ship great products everywhere.
          </p>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="relative py-32 px-6 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-20 text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            What We Do
          </h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {[
              {
                title: 'Sell Digital Products',
                description: 'Launch a polished storefront in minutes and keep 100% of your earnings thanks to our Zero-Commissions, Forever policy.',
                icon: <Rocket className="w-8 h-8" />,
                gradient: 'from-purple-600 to-pink-600'
              },
              {
                title: 'Collaborate Securely',
                description: 'Work with global teammates using milestone-based escrow, transparent task boards, and built-in messaging.',
                icon: <Shield className="w-8 h-8" />,
                gradient: 'from-blue-600 to-cyan-600'
              },
              {
                title: 'Grow Together',
                description: 'Find co-founders, join open-source projects, and tap a community that provides feedback, ratings, and donations in place of ads.',
                icon: <Users className="w-8 h-8" />,
                gradient: 'from-green-600 to-emerald-600'
              },
              {
                title: 'Quality Assurance',
                description: 'Version control, review workflows, and dispute resolution tools are built-in so you can focus on shipping, not firefighting.',
                icon: <Award className="w-8 h-8" />,
                gradient: 'from-orange-600 to-red-600'
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-lg hover:shadow-2xl hover:-translate-y-2 hover:rotate-1 transition-all duration-300 cursor-pointer"
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${item.gradient} mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {item.description}
                </p>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/5 to-blue-600/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: <Code className="w-6 h-6" />, number: '100%', label: 'Open Source' },
              { icon: <Users className="w-6 h-6" />, number: '10K+', label: 'Active Users' },
              { icon: <Zap className="w-6 h-6" />, number: '0%', label: 'Commission Fee' },
              { icon: <Globe className="w-6 h-6" />, number: '50+', label: 'Countries' }
            ].map((stat, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="inline-flex p-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.number}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All-Apps Pass Section */}
      <section className="relative py-32 px-6 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              All-Apps Pass — <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">$5 USD</span>
            </h2>
          </div>
          
          <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-12 rounded-lg shadow-lg">
            <div className="relative z-10">
              <p className="text-2xl mb-8 font-medium text-center text-gray-900 dark:text-white">
                <span className="text-purple-600 font-bold">New for 2025:</span> Unlock{' '}
                <em className="text-blue-600">every</em> DisPlan productivity & collaboration app for a single one-time fee of $5.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  'Instant access to all current and future DisPlan apps',
                  'Lifetime updates and priority feature requests',
                  'Perfect for indie hackers, student teams, and lean startups'
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <p className="text-xl text-purple-600 font-semibold mb-8">Pay once, build forever.</p>
                <button className="px-8 py-2 h-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded text-sm font-bold transition-all duration-200 hover:scale-110">
                  <span className="flex items-center gap-2">
                    Get Started for $5
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="relative py-32 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-20 text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Openness & Transparency',
                description: '100% public codebase, community-governed features',
                icon: <Globe className="w-6 h-6" />
              },
              {
                title: 'Creator First',
                description: 'We never take a cut of your sales',
                icon: <Heart className="w-6 h-6" />
              },
              {
                title: 'Inclusive by Design',
                description: 'Tools localized and accessible worldwide',
                icon: <Users className="w-6 h-6" />
              },
              {
                title: 'Sustainable Growth',
                description: 'Donations and optional add-ons keep the lights on; you keep control',
                icon: <Zap className="w-6 h-6" />
              }
            ].map((value, index) => (
              <div key={index} className="group p-8 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="inline-flex p-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  {value.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 px-6 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Heart className="w-6 h-6 text-red-500 animate-pulse" />
            <span className="text-xl text-gray-600 dark:text-gray-400">
              © 2025 DisPlan. Built with love by creators, for creators.
            </span>
          </div>
          <div className="flex justify-center gap-8 text-sm text-gray-500">
            <a href="#" className="hover:text-purple-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-purple-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-purple-600 transition-colors">Support</a>
            <a href="#" className="hover:text-purple-600 transition-colors">Community</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;