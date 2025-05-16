export const blankTemplate = (projectName: string) => {
  return {
    sections: [
      {
        id: "header-section",
        name: "Header Section",
        elements: [
          {
            id: "navbar-element",
            type: "navbar",
            content: {
              logo: {
                lightMode: "/logo_light_mode.png",
                darkMode: "/logo_dark_mode.png",
                alt: "Logo",
                width: 120,
                height: 36
              },
              navItems: [
                { label: "Features", link: "/features", animation: "fade" },
                { label: "Blog", link: "/blog", animation: "fade" },
                { label: "About", link: "/about", animation: "fade" },
                { label: "Projects", link: "/projects", animation: "fade" },
              ],
              authButtons: {
                signIn: {
                  label: "Sign in",
                  link: "/sign-in",
                  variant: "text",
                  hoverEffect: "underline",
                  transitionDuration: 300
                },
                getStarted: {
                  label: "Get started",
                  link: "/sign-up",
                  variant: "filled",
                  hoverEffect: "opacity",
                  transitionDuration: 300
                }
              },
              userMenu: {
                avatar: {
                  fallback: "user-circle",
                  size: "md"
                },
                items: [
                  { label: "Dashboard", link: "/dashboard", icon: "dashboard" },
                  { label: "Sign out", action: "signOut", icon: "log-out" }
                ],
                animation: "scale",
                position: "right"
              },
              mobileMenu: {
                breakpoint: "md",
                animation: "slide-right",
                backdrop: true
              },
              sticky: true,
              shrink: true,
              languageSwitcher: {
                position: "inline",
                showFlags: true
              }
            },
            style: {
              backgroundColor: "bg-white/80 dark:bg-background/80",
              backdropFilter: "backdrop-blur-lg",
              textColor: "text-black dark:text-white",
              padding: "px-6 py-4",
              position: "fixed top-0 left-0 right-0",
              zIndex: "z-50",
              boxShadow: "shadow-sm",
              borderBottom: "border-b border-gray-100 dark:border-gray-800/10",
              fontWeight: "font-medium",
              fontSize: "text-sm",
              letterSpacing: "tracking-tight",
              x: 0,
              y: 0,
              width: "100%",
              animation: {
                initial: { opacity: 0, y: -20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.3, ease: "easeOut" }
              },
              responsive: {
                sm: { padding: "px-4 py-3" },
                lg: { padding: "px-8 py-4" }
              }
            },
          },
        ],
      },
      {
        id: "hero-section",
        name: "Hero Section",
        elements: [
          {
            id: "hero-element",
            type: "hero",
            content: {
              heading: "Build, Sell, and Collaborate — All in One Free Platform.",
              headingHighlight: {
                text: "Free Platform",
                color: "text-primary",
                weight: "font-bold"
              },
              subheading: "Sell your digital products, find partners for startups, and grow together — with no commissions, no premium walls. 100% open, powered by community support.",
              infoTooltip: {
                text: "No hidden fees, no commissions, no extra charges. Our platform stays free thanks to community support and optional donations. Help us keep it growing — for everyone.",
                icon: "info-circle",
                position: "bottom",
                maxWidth: 320
              },
              buttons: [
                {
                  text: "Start browsing",
                  link: "/projects",
                  variant: "primary",
                  size: "lg",
                  icon: "arrow-right",
                  iconPosition: "right",
                  animation: "pulse",
                  tracking: {
                    event: "cta_click",
                    properties: { location: "hero", type: "primary" }
                  }
                },
                {
                  text: "Watch demo",
                  link: "/demo",
                  variant: "secondary",
                  size: "lg",
                  icon: "play",
                  iconPosition: "left",
                  tracking: {
                    event: "demo_click",
                    properties: { location: "hero", type: "secondary" }
                  }
                }
              ],
              image: {
                src: "https://images.pexels.com/photos/6424583/pexels-photo-6424583.jpeg",
                alt: "Project collaboration visualization",
                width: 1200,
                height: 800,
                loading: "eager",
                priority: true,
                animation: "fade-in",
                responsive: [
                  { breakpoint: "sm", src: "https://images.pexels.com/photos/6424583/pexels-photo-6424583.jpeg?auto=compress&cs=tinysrgb&w=600" },
                  { breakpoint: "md", src: "https://images.pexels.com/photos/6424583/pexels-photo-6424583.jpeg?auto=compress&cs=tinysrgb&w=800" },
                  { breakpoint: "lg", src: "https://images.pexels.com/photos/6424583/pexels-photo-6424583.jpeg?auto=compress&cs=tinysrgb&w=1200" }
                ]
              }
            },
            style: {
              backgroundColor: "bg-white dark:bg-background",
              textColor: "text-black dark:text-white",
              padding: "pt-32 pb-20 px-6",
              maxWidth: "max-w-[1200px]",
              headingSize: "text-8xl max-md:text-6xl",
              headingWeight: "font-semibold",
              headingLineHeight: "leading-[87.4px] max-md:leading-none",
              headingTracking: "tracking-tighter",
              subheadingSize: "text-2xl max-md:text-xl",
              subheadingColor: "text-black/60 dark:text-white/60",
              subheadingLineHeight: "leading-8 max-md:leading-normal",
              buttonGap: "gap-4",
              alignment: "center",
              x: 0,
              y: 0,
              width: "100%",
              animation: {
                heading: { 
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.5, delay: 0.2 }
                },
                subheading: { 
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.5, delay: 0.4 }
                },
                buttons: { 
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.5, delay: 0.6 }
                },
                image: { 
                  initial: { opacity: 0, scale: 0.95 },
                  animate: { opacity: 1, scale: 1 },
                  transition: { duration: 0.7, delay: 0.8 }
                }
              },
              responsive: {
                sm: { 
                  padding: "pt-24 pb-16 px-4",
                  headingSize: "text-5xl",
                  subheadingSize: "text-lg"
                },
                md: { 
                  padding: "pt-28 pb-20 px-6",
                  headingSize: "text-6xl"
                },
                lg: { 
                  padding: "pt-32 pb-24 px-8",
                  headingSize: "text-7xl"
                }
              }
            },
          },
        ],
      },
      {
        id: "features-section",
        name: "Features Section",
        elements: [
          {
            id: "features-heading",
            type: "heading",
            content: {
              badge: {
                text: "Why Choose Us",
                color: "bg-primary/10 text-primary",
                rounded: "rounded-full"
              },
              title: "Powerful features for modern collaboration",
              subtitle: "Everything you need to build, sell, and grow your digital products with confidence",
              alignment: "center",
              maxWidth: 800
            },
            style: {
              spacing: "mb-16",
              titleSize: "text-4xl md:text-5xl",
              titleWeight: "font-bold",
              titleColor: "text-black dark:text-white",
              titleTracking: "tracking-tight",
              subtitleSize: "text-lg md:text-xl",
              subtitleColor: "text-black/60 dark:text-white/60",
              subtitleLineHeight: "leading-relaxed",
              badgePadding: "px-4 py-1.5",
              badgeMargin: "mb-4",
              animation: {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.5 }
              }
            }
          },
          {
            id: "features-grid",
            type: "features-grid",
            content: {
              features: [
                {
                  icon: "lock",
                  iconColor: "text-purple-500",
                  iconBg: "bg-purple-500/20",
                  iconSize: "w-6 h-6",
                  iconContainerSize: "w-12 h-12",
                  iconContainerShape: "rounded-xl",
                  title: "Secure Payments",
                  description: "Protected transactions with escrow and milestone-based releases for peace of mind.",
                  link: { text: "Learn more", url: "/features/payments" }
                },
                {
                  icon: "users",
                  iconColor: "text-blue-500",
                  iconBg: "bg-blue-500/20",
                  iconSize: "w-6 h-6",
                  iconContainerSize: "w-12 h-12",
                  iconContainerShape: "rounded-xl",
                  title: "Team Collaboration",
                  description: "Work seamlessly with developers and creators worldwide on shared projects.",
                  link: { text: "Learn more", url: "/features/collaboration" }
                },
                {
                  icon: "check-circle",
                  iconColor: "text-green-500",
                  iconBg: "bg-green-500/20",
                  iconSize: "w-6 h-6",
                  iconContainerSize: "w-12 h-12",
                  iconContainerShape: "rounded-xl",
                  title: "Quality Assurance",
                  description: "Built-in review processes and quality checks for all projects to ensure excellence.",
                  link: { text: "Learn more", url: "/features/quality" }
                },
                {
                  icon: "zap",
                  iconColor: "text-amber-500",
                  iconBg: "bg-amber-500/20",
                  iconSize: "w-6 h-6",
                  iconContainerSize: "w-12 h-12",
                  iconContainerShape: "rounded-xl",
                  title: "Instant Deployment",
                  description: "Deploy your projects instantly with our one-click deployment system.",
                  link: { text: "Learn more", url: "/features/deployment" }
                },
                {
                  icon: "bar-chart",
                  iconColor: "text-rose-500",
                  iconBg: "bg-rose-500/20",
                  iconSize: "w-6 h-6",
                  iconContainerSize: "w-12 h-12",
                  iconContainerShape: "rounded-xl",
                  title: "Analytics Dashboard",
                  description: "Track performance with comprehensive analytics and reporting tools.",
                  link: { text: "Learn more", url: "/features/analytics" }
                },
                {
                  icon: "shield",
                  iconColor: "text-emerald-500",
                  iconBg: "bg-emerald-500/20",
                  iconSize: "w-6 h-6",
                  iconContainerSize: "w-12 h-12",
                  iconContainerShape: "rounded-xl",
                  title: "Enterprise Security",
                  description: "Enterprise-grade security with advanced encryption and compliance features.",
                  link: { text: "Learn more", url: "/features/security" }
                }
              ],
              columns: {
                sm: 1,
                md: 2,
                lg: 3
              },
              gap: "gap-8",
              animation: {
                stagger: 0.1,
                duration: 0.4
              }
            },
            style: {
              backgroundColor: "bg-white dark:bg-background",
              cardBg: "bg-gray-100 dark:bg-white/5",
              cardHoverBg: "hover:bg-gray-200 dark:hover:bg-white/10",
              cardBorderRadius: "rounded-2xl",
              cardPadding: "p-8",
              cardTransition: "transition-colors duration-300",
              titleColor: "text-black dark:text-white",
              titleSize: "text-xl",
              titleWeight: "font-semibold",
              titleSpacing: "mb-4",
              descriptionColor: "text-black/60 dark:text-white/60",
              descriptionSize: "text-base",
              descriptionLineHeight: "leading-relaxed",
              iconSpacing: "mb-6",
              maxWidth: "max-w-7xl",
              x: 0,
              y: 0,
              width: "100%",
            },
          },
          {
            id: "features-cta",
            type: "cta",
            content: {
              title: "Ready to get started?",
              description: "Join thousands of creators and businesses already using our platform",
              buttons: [
                {
                  text: "Get started for free",
                  link: "/sign-up",
                  variant: "primary",
                  size: "lg"
                },
                {
                  text: "Contact sales",
                  link: "/contact",
                  variant: "outline",
                  size: "lg"
                }
              ],
              alignment: "center",
              spacing: "mt-16"
            },
            style: {
              titleSize: "text-2xl md:text-3xl",
              titleWeight: "font-bold",
              titleColor: "text-black dark:text-white",
              titleSpacing: "mb-4",
              descriptionSize: "text-lg",
              descriptionColor: "text-black/60 dark:text-white/60",
              descriptionSpacing: "mb-8",
              buttonGap: "gap-4",
              animation: {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.5, delay: 0.2 }
              }
            }
          }
        ],
        style: {
          backgroundColor: "bg-white dark:bg-background",
          textColor: "text-black dark:text-white",
          padding: "py-24 px-6",
          maxWidth: "max-w-7xl mx-auto",
          x: 0,
          y: 0,
          width: "100%",
          responsive: {
            sm: { padding: "py-16 px-4" },
            md: { padding: "py-20 px-6" },
            lg: { padding: "py-24 px-8" }
          }
        }
      },
      {
        id: "testimonials-section",
        name: "Testimonials Section",
        elements: [
          {
            id: "testimonials-heading",
            type: "heading",
            content: {
              badge: {
                text: "Testimonials",
                color: "bg-primary/10 text-primary",
                rounded: "rounded-full"
              },
              title: "What our customers are saying",
              subtitle: "Don't just take our word for it — hear from some of our amazing customers",
              alignment: "center",
              maxWidth: 800
            },
            style: {
              spacing: "mb-16",
              titleSize: "text-4xl md:text-5xl",
              titleWeight: "font-bold",
              titleColor: "text-black dark:text-white",
              titleTracking: "tracking-tight",
              subtitleSize: "text-lg md:text-xl",
              subtitleColor: "text-black/60 dark:text-white/60",
              subtitleLineHeight: "leading-relaxed",
              badgePadding: "px-4 py-1.5",
              badgeMargin: "mb-4"
            }
          },
          {
            id: "testimonials-carousel",
            type: "testimonials-carousel",
            content: {
              testimonials: [
                {
                  quote: "This platform has completely transformed how we collaborate with our clients. The secure payment system gives everyone peace of mind.",
                  author: "Sarah Johnson",
                  role: "Product Manager at TechCorp",
                  avatar: "/avatars/sarah.jpg",
                  rating: 5
                },
                {
                  quote: "As a freelancer, finding reliable clients was always a challenge. This platform solved that problem completely.",
                  author: "Michael Chen",
                  role: "Independent Developer",
                  avatar: "/avatars/michael.jpg",
                  rating: 5
                },
                {
                  quote: "The quality assurance features have helped us maintain consistent standards across all our projects. Highly recommended!",
                  author: "Jessica Williams",
                  role: "Design Director at CreativeStudio",
                  avatar: "/avatars/jessica.jpg",
                  rating: 5
                }
              ],
              autoplay: true,
              interval: 5000,
              controls: true,
              indicators: true,
              animation: "slide"
            },
            style: {
              backgroundColor: "bg-gray-50 dark:bg-gray-900/30",
              borderRadius: "rounded-3xl",
              padding: "p-8 md:p-12",
              maxWidth: "max-w-5xl mx-auto",
              quoteSize: "text-xl md:text-2xl",
              quoteColor: "text-black dark:text-white",
              quoteStyle: "italic",
              quoteLineHeight: "leading-relaxed",
              authorSize: "text-base",
              authorWeight: "font-semibold",
              authorColor: "text-black dark:text-white",
              roleSize: "text-sm",
              roleColor: "text-black/60 dark:text-white/60",
              avatarSize: "w-12 h-12",
              avatarBorderRadius: "rounded-full",
              ratingColor: "text-amber-400",
              ratingSize: "w-5 h-5",
              shadow: "shadow-lg"
            }
          }
        ],
        style: {
          backgroundColor: "bg-white dark:bg-background",
          textColor: "text-black dark:text-white",
          padding: "py-24 px-6",
          maxWidth: "max-w-7xl mx-auto",
          x: 0,
          y: 0,
          width: "100%",
          responsive: {
            sm: { padding: "py-16 px-4" },
            md: { padding: "py-20 px-6" },
            lg: { padding: "py-24 px-8" }
          }
        }
      },
      {
        id: "cta-section",
        name: "Call to Action Section",
        elements: [
          {
            id: "cta-element",
            type: "cta-banner",
            content: {
              title: "Ready to transform your digital business?",
              description: "Join thousands of creators and businesses already using our platform to build, sell, and grow.",
              buttons: [
                {
                  text: "Get started for free",
                  link: "/sign-up",
                  variant: "primary",
                  size: "lg",
                  icon: "arrow-right",
                  iconPosition: "right"
                },
                {
                  text: "Schedule a demo",
                  link: "/demo",
                  variant: "outline",
                  size: "lg",
                  icon: "video",
                  iconPosition: "left"
                }
              ],
              backgroundImage: "/images/cta-background.jpg",
              overlay: "bg-black/50",
              alignment: "center"
            },
            style: {
              backgroundColor: "bg-primary",
              textColor: "text-white",
              padding: "py-20 px-6",
              borderRadius: "rounded-3xl",
              maxWidth: "max-w-7xl mx-auto",
              titleSize: "text-3xl md:text-4xl lg:text-5xl",
              titleWeight: "font-bold",
              titleSpacing: "mb-4",
              descriptionSize: "text-xl",
              descriptionSpacing: "mb-8",
              buttonGap: "gap-4 md:gap-6",
              shadow: "shadow-xl",
              x: 0,
              y: 0,
              width: "100%",
              animation: {
                initial: { opacity: 0, scale: 0.95 },
                animate: { opacity: 1, scale: 1 },
                transition: { duration: 0.5 }
              },
              responsive: {
                sm: { 
                  padding: "py-12 px-4",
                  titleSize: "text-2xl",
                  descriptionSize: "text-base"
                },
                md: { 
                  padding: "py-16 px-6",
                  titleSize: "text-3xl"
                },
                lg: { 
                  padding: "py-20 px-8",
                  titleSize: "text-4xl"
                }
              }
            }
          }
        ],
        style: {
          backgroundColor: "bg-white dark:bg-background",
          padding: "py-24 px-6",
          x: 0,
          y: 0,
          width: "100%",
          responsive: {
            sm: { padding: "py-16 px-4" },
            md: { padding: "py-20 px-6" },
            lg: { padding: "py-24 px-8" }
          }
        }
      },
      {
        id: "footer-section",
        name: "Footer Section",
        elements: [
          {
            id: "footer-element",
            type: "footer",
            content: {
              logo: {
                lightMode: "/logo_light_mode.png",
                darkMode: "/logo_dark_mode.png",
                alt: "Logo",
                width: 120,
                height: 36
              },
              description: "The complete platform for digital creators and businesses to build, sell, and grow together.",
              copyright: `© ${new Date().getFullYear()} ${projectName || "DisPlan"}. All rights reserved.`,
              columns: [
                {
                  title: "Product",
                  links: [
                    { label: "Features", href: "/features" },
                    { label: "Pricing", href: "/pricing" },
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Roadmap", href: "/roadmap" }
                  ]
                },
                {
                  title: "Company",
                  links: [
                    { label: "About", href: "/about" },
                    { label: "Blog", href: "/blog" },
                    { label: "Careers", href: "/careers" },
                    { label: "Press", href: "/press" }
                  ]
                },
                {
                  title: "Resources",
                  links: [
                    { label: "Documentation", href: "/docs" },
                    { label: "Help Center", href: "/help" },
                    { label: "Community", href: "/community" },
                    { label: "Partners", href: "/partners" }
                  ]
                },
                {
                  title: "Legal",
                  links: [
                    { label: "Privacy", href: "/privacy" },
                    { label: "Terms", href: "/terms" },
                    { label: "Cookie Policy", href: "/cookies" },
                    { label: "Licenses", href: "/licenses" }
                  ]
                }
              ],
              socialLinks: [
                { platform: "twitter", icon: "twitter", href: "https://x.com/WrRbybw84381", ariaLabel: "Twitter" },
                { platform: "linkedin", icon: "linkedin", href: "https://www.linkedin.com/in/orel-revivo-4a6262274/", ariaLabel: "LinkedIn" },
                { platform: "github", icon: "github", href: "https://github.com/orelrevivo/", ariaLabel: "GitHub" },
                { platform: "instagram", icon: "instagram", href: "https://www.instagram.com/orelrevivo3999/", ariaLabel: "Instagram" }
              ],
              newsletter: {
                title: "Subscribe to our newsletter",
                description: "Get the latest updates and news directly to your inbox.",
                placeholder: "Enter your email",
                buttonText: "Subscribe",
                privacyText: "By subscribing, you agree to our Privacy Policy and consent to receive updates."
              },
              bottomLinks: [
                { label: "Accessibility", href: "/accessibility" },
                { label: "Status", href: "/status" },
                { label: "Sitemap", href: "/sitemap" }
              ]
            },
            style: {
              backgroundColor: "bg-white dark:bg-background",
              textColor: "text-gray-700 dark:text-gray-300",
              borderTop: "border-t border-gray-200 dark:border-gray-800",
              padding: "py-16 px-6",
              columnGap: "gap-8",
              titleColor: "text-black dark:text-white",
              titleSize: "text-base",
              titleWeight: "font-semibold",
              titleSpacing: "mb-4",
              linkColor: "text-gray-600 dark:text-gray-400",
              linkHoverColor: "hover:text-purple-600 dark:hover:text-purple-400",
              linkSize: "text-sm",
              linkSpacing: "space-y-2",
              socialIconSize: "h-6 w-6",
              socialIconSpacing: "space-x-6",
              socialIconColor: "text-gray-600 dark:text-gray-400",
              socialIconHoverColor: "hover:text-purple-600 dark:hover:text-purple-400",
              copyrightSize: "text-sm",
              copyrightColor: "text-gray-600 dark:text-gray-400",
              bottomBorder: "border-t border-gray-200 dark:border-gray-800",
              bottomPadding: "pt-8 mt-8",
              x: 0,
              y: 0,
              width: "100%",
              responsive: {
                sm: { 
                  padding: "py-12 px-4",
                  columns: 2
                },
                md: { 
                  padding: "py-16 px-6",
                  columns: 4
                },
                lg: { 
                  padding: "py-20 px-8",
                  columns: 4
                }
              }
            },
          },
        ],
      },
    ],
    globalStyles: {
      fontFamily: "sans-serif",
      backgroundColor: "bg-white dark:bg-background",
      textColor: "text-black dark:text-white",
      primaryColor: "text-purple-600 dark:text-purple-400",
      secondaryColor: "text-blue-600 dark:text-blue-400",
      successColor: "text-green-600 dark:text-green-400",
      warningColor: "text-amber-600 dark:text-amber-400",
      dangerColor: "text-red-600 dark:text-red-400",
      borderRadius: {
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        "2xl": "rounded-2xl",
        "3xl": "rounded-3xl",
        full: "rounded-full"
      },
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "3rem",
        "3xl": "4rem"
      },
      fontSize: {
        xs: "text-xs",
        sm: "text-sm",
        base: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl",
        "3xl": "text-3xl",
        "4xl": "text-4xl",
        "5xl": "text-5xl",
        "6xl": "text-6xl"
      },
      fontWeight: {
        light: "font-light",
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
        extrabold: "font-extrabold"
      },
      lineHeight: {
        none: "leading-none",
        tight: "leading-tight",
        snug: "leading-snug",
        normal: "leading-normal",
        relaxed: "leading-relaxed",
        loose: "leading-loose"
      },
      shadows: {
        sm: "shadow-sm",
        md: "shadow",
        lg: "shadow-lg",
        xl: "shadow-xl",
        "2xl": "shadow-2xl",
        none: "shadow-none"
      },
      transitions: {
        fast: "transition-all duration-150",
        normal: "transition-all duration-300",
        slow: "transition-all duration-500"
      },
      animations: {
        fadeIn: {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.3 }
        },
        slideUp: {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5 }
        },
        slideDown: {
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5 }
        },
        slideLeft: {
          initial: { opacity: 0, x: 20 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.5 }
        },
        slideRight: {
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.5 }
        },
        scale: {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.5 }
        }
      },
      breakpoints: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px"
      }
    },
    pages: [
      {
        id: "home",
        name: "Home",
        path: "/",
        sections: ["header-section", "hero-section", "features-section", "testimonials-section", "cta-section", "footer-section"],
        meta: {
          title: `${projectName || "DisPlan"} - Build, Sell, and Collaborate`,
          description: "The complete platform for digital creators and businesses to build, sell, and grow together.",
          keywords: "digital marketplace, collaboration, creators, businesses, platform",
          ogImage: "/images/og-home.jpg"
        }
      },
      {
        id: "features",
        name: "Features",
        path: "/features",
        sections: ["header-section", "features-section", "testimonials-section", "cta-section", "footer-section"],
        meta: {
          title: `Features - ${projectName || "DisPlan"}`,
          description: "Explore the powerful features that make our platform the best choice for digital creators and businesses.",
          keywords: "features, secure payments, collaboration, quality assurance",
          ogImage: "/images/og-features.jpg"
        }
      },
      {
        id: "about",
        name: "About",
        path: "/about",
        sections: ["header-section", "content-section", "team-section", "cta-section", "footer-section"],
        meta: {
          title: `About Us - ${projectName || "DisPlan"}`,
          description: "Learn about our mission, vision, and the team behind our platform.",
          keywords: "about us, mission, vision, team, company",
          ogImage: "/images/og-about.jpg"
        }
      },
      {
        id: "projects",
        name: "Projects",
        path: "/projects",
        sections: ["header-section", "projects-section", "categories-section", "cta-section", "footer-section"],
        meta: {
          title: `Projects - ${projectName || "DisPlan"}`,
          description: "Browse and discover digital projects from creators around the world.",
          keywords: "projects, digital products, marketplace, creators",
          ogImage: "/images/og-projects.jpg"
        }
      },
      {
        id: "blog",
        name: "Blog",
        path: "/blog",
        sections: ["header-section", "blog-section", "newsletter-section", "footer-section"],
        meta: {
          title: `Blog - ${projectName || "DisPlan"}`,
          description: "Read the latest news, insights, and updates from our team.",
          keywords: "blog, articles, news, insights, updates",
          ogImage: "/images/og-blog.jpg"
        }
      },
      {
        id: "dashboard",
        name: "Dashboard",
        path: "/dashboard",
        sections: ["header-section", "dashboard-section", "footer-section"],
        meta: {
          title: `Dashboard - ${projectName || "DisPlan"}`,
          description: "Manage your projects, track performance, and connect with collaborators.",
          keywords: "dashboard, projects, analytics, management",
          ogImage: "/images/og-dashboard.jpg"
        },
        auth: {
          required: true,
          redirectTo: "/sign-in"
        }
      },
      {
        id: "sign-in",
        name: "Sign In",
        path: "/sign-in",
        sections: ["header-section", "auth-section", "footer-section"],
        meta: {
          title: `Sign In - ${projectName || "DisPlan"}`,
          description: "Sign in to your account to access your dashboard and projects.",
          keywords: "sign in, login, account",
          ogImage: "/images/og-auth.jpg"
        },
        auth: {
          required: false,
          redirectIfAuthenticated: "/dashboard"
        }
      },
      {
        id: "sign-up",
        name: "Sign Up",
        path: "/sign-up",
        sections: ["header-section", "auth-section", "footer-section"],
        meta: {
          title: `Sign Up - ${projectName || "DisPlan"}`,
          description: "Create a new account to start using our platform.",
          keywords: "sign up, register, create account",
          ogImage: "/images/og-auth.jpg"
        },
        auth: {
          required: false,
          redirectIfAuthenticated: "/dashboard"
        }
      },
    ],
    settings: {
      siteName: projectName || "DisPlan",
      siteUrl: "https://displan.com",
      favicon: "/favicon.ico",
      theme: {
        primaryColor: {
          light: "#6200ea", // Deep purple
          dark: "#b388ff"  // Light purple
        },
        secondaryColor: {
          light: "#0091ea", // Light blue
          dark: "#82b1ff"  // Light blue
        },
        accentColor: {
          light: "#00bfa5", // Teal
          dark: "#64ffda"  // Light teal
        },
        backgroundColor: {
          light: "#ffffff",
          dark: "#121212"
        },
        surfaceColor: {
          light: "#f5f5f5",
          dark: "#1e1e1e"
        },
        errorColor: {
          light: "#d50000",
          dark: "#ff5252"
        },
        successColor: {
          light: "#00c853",
          dark: "#69f0ae"
        },
        warningColor: {
          light: "#ffd600",
          dark: "#ffff00"
        },
        infoColor: {
          light: "#2196f3",
          dark: "#82b1ff"
        },
        fontFamily: {
          heading: "Inter, system-ui, sans-serif",
          body: "Inter, system-ui, sans-serif"
        },
        borderRadius: {
          small: "0.25rem",
          medium: "0.5rem",
          large: "1rem",
          extraLarge: "2rem",
          full: "9999px"
        },
        darkMode: {
          enabled: true,
          default: "system" // "light", "dark", or "system"
        },
        animation: {
          enabled: true,
          reducedMotion: "respect" // "respect" or "ignore"
        }
      },
      auth: {
        provider: "supabase",
        routes: {
          signIn: "/sign-in",
          signUp: "/sign-up",
          forgotPassword: "/forgot-password",
          resetPassword: "/reset-password",
          verifyEmail: "/verify-email",
          dashboard: "/dashboard"
        },
        redirects: {
          afterSignIn: "/dashboard",
          afterSignUp: "/onboarding"
        },
        providers: {
          email: true,
          google: true,
          github: true,
          twitter: true
        }
      },
      i18n: {
        enabled: true,
        defaultLocale: "en",
        locales: [
          { code: "en", name: "English", flag: "🇺🇸" },
          { code: "es", name: "Español", flag: "🇪🇸" },
          { code: "fr", name: "Français", flag: "🇫🇷" },
          { code: "de", name: "Deutsch", flag: "🇩🇪" },
          { code: "ja", name: "日本語", flag: "🇯🇵" }
        ],
        namespaces: ["common", "auth", "home", "features", "blog"]
      },
      analytics: {
        enabled: true,
        provider: "vercel", // "vercel", "google", "plausible", "fathom"
        trackingId: "",
        anonymizeIp: true,
        consentRequired: true
      },
      performance: {
        images: {
          optimization: true,
          lazyLoading: true,
          placeholders: true,
          formats: ["webp", "avif"]
        },
        fonts: {
          preload: true,
          display: "swap"
        },
        scripts: {
          defer: true
        }
      },
      seo: {
        titleTemplate: "%s | " + (projectName || "DisPlan"),
        defaultTitle: projectName || "DisPlan",
        defaultDescription: "The complete platform for digital creators and businesses to build, sell, and grow together.",
        openGraph: {
          type: "website",
          locale: "en_US",
          site_name: projectName || "DisPlan"
        },
        twitter: {
          handle: "@displan",
          site: "@displan",
          cardType: "summary_large_image"
        },
        additionalMetaTags: [
          {
            name: "application-name",
            content: projectName || "DisPlan"
          },
          {
            name: "apple-mobile-web-app-capable",
            content: "yes"
          },
          {
            name: "apple-mobile-web-app-status-bar-style",
            content: "default"
          },
          {
            name: "apple-mobile-web-app-title",
            content: projectName || "DisPlan"
          },
          {
            name: "format-detection",
            content: "telephone=no"
          },
          {
            name: "mobile-web-app-capable",
            content: "yes"
          },
          {
            name: "theme-color",
            content: "#ffffff"
          }
        ]
      },
      accessibility: {
        skipLinks: true,
        focusVisible: true,
        reducedMotion: true,
        highContrast: true,
        screenReader: true,
        aria: true
      }
    },
  }
}