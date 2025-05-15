"use client"

import React from "react"
import { Calendar, Clock, ChevronDown, ChevronRight, X, Check, ArrowRight, TrendingUp, Eye } from "lucide-react"

// Helper function to get social icon component
const getSocialIcon = (platform: string) => {
  // This is a placeholder - you should import the actual icons you need
  // For example: import { Twitter, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react'

  // Return a placeholder icon for now
  return (props: any) => (
    <div {...props} className={`${props.className} social-icon-${platform}`}>
      {platform}
    </div>
  )
}

// Helper function to get social color
const getSocialColor = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "twitter":
      return "bg-[#1DA1F2]"
    case "facebook":
      return "bg-[#1877F2]"
    case "instagram":
      return "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]"
    case "linkedin":
      return "bg-[#0A66C2]"
    case "youtube":
      return "bg-[#FF0000]"
    default:
      return "bg-gray-800"
  }
}

// Mega Menu Renderer
export function renderMegaMenu(element: any) {
  const categories = element.content?.categories || []
  const featuredArticles = element.content?.featuredArticles || []
  const showTrending = element.content?.showTrending
  const trendingTags = element.content?.trendingTags || []

  return (
    <div className="mega-menu bg-white shadow-xl rounded-b-lg p-6 border-t border-gray-200 w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Categories */}
        <div className="col-span-3 grid grid-cols-1 md:grid-cols-4 gap-6">
          {categories.map((category: any, index: number) => (
            <div key={index} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
              <ul className="space-y-2">
                {category.subcategories.map((subcategory: string, subIndex: number) => (
                  <li key={subIndex}>
                    <a href="#" className="text-gray-600 hover:text-primary hover:underline text-sm">
                      {subcategory}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Featured Articles */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">Featured</h3>
          <div className="space-y-4">
            {featuredArticles.map((article: any, index: number) => (
              <a key={index} href={article.link} className="group block">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-16 h-12 bg-gray-200 rounded overflow-hidden">
                    <img
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm text-gray-700 group-hover:text-primary group-hover:underline">
                    {article.title}
                  </p>
                </div>
              </a>
            ))}
          </div>

          {/* Trending Tags */}
          {showTrending && trendingTags.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Trending</h4>
              <div className="flex flex-wrap gap-2">
                {trendingTags.map((tag: string, index: number) => (
                  <a
                    key={index}
                    href="#"
                    className="px-3 py-1 bg-gray-100 text-xs text-gray-700 rounded-full hover:bg-gray-200"
                  >
                    {tag}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Announcement Renderer
export function renderAnnouncement(element: any, isDismissed: boolean, setIsDismissed: (value: boolean) => void) {
  if (isDismissed) return null

  const text = element.content?.text || "Announcement"
  const link = element.content?.link || "#"
  const linkText = element.content?.linkText
  const dismissible = element.content?.dismissible

  return (
    <div className="announcement-bar bg-indigo-600 text-white py-2 px-4 text-center relative">
      <div className="container mx-auto flex items-center justify-center">
        <span className="text-sm">{text}</span>
        {linkText && (
          <a href={link} className="ml-2 text-sm font-medium underline hover:text-white/90">
            {linkText}
          </a>
        )}
      </div>
      {dismissible && (
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

// Slider Renderer
export function renderSlider(element: any, activeSlide: number, setActiveSlide: (value: number) => void) {
  const slides = element.content?.slides || []
  const controls = element.content?.controls
  const indicators = element.content?.indicators
  const animation = element.content?.animation || "fade"

  if (slides.length === 0) {
    return (
      <div className="slider-placeholder bg-gray-200 rounded-lg flex items-center justify-center h-96">
        <p className="text-gray-500">Slider (No slides)</p>
      </div>
    )
  }

  return (
    <div className="slider-container relative overflow-hidden rounded-lg">
      {/* Slides */}
      <div className="slider-track relative h-[70vh] min-h-[500px]">
        {slides.map((slide: any, index: number) => (
          <div
            key={index}
            className={`slider-slide absolute inset-0 transition-opacity duration-1000 ${
              index === activeSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={slide.backgroundImage || "/placeholder.svg?height=800&width=1600"}
                alt=""
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ backgroundColor: slide.overlayColor || "rgba(0, 0, 0, 0.4)" }}
              ></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div
                className={`container mx-auto px-6 ${
                  slide.position === "left" ? "text-left" : slide.position === "right" ? "text-right" : "text-center"
                }`}
              >
                <div
                  className={`max-w-lg ${
                    slide.position === "left" ? "" : slide.position === "right" ? "ml-auto" : "mx-auto"
                  }`}
                >
                  {slide.tag && (
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full mb-4">
                      {slide.tag}
                    </span>
                  )}
                  {slide.category && (
                    <p className="text-white/90 text-sm font-medium uppercase tracking-wider mb-2">{slide.category}</p>
                  )}
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{slide.heading}</h2>
                  {slide.subheading && <p className="text-white/80 text-lg mb-6">{slide.subheading}</p>}
                  <div className="flex items-center space-x-4 mt-6">
                    {slide.buttonText && (
                      <a
                        href={slide.buttonLink || "#"}
                        className="px-6 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        {slide.buttonText}
                      </a>
                    )}
                    {slide.secondaryButtonText && (
                      <a
                        href={slide.secondaryButtonLink || "#"}
                        className="px-6 py-3 bg-transparent border border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
                      >
                        {slide.secondaryButtonText}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      {controls && slides.length > 1 && (
        <>
          <button
            onClick={() => setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
            className="slider-control prev absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronDown className="h-6 w-6 rotate-90" />
          </button>
          <button
            onClick={() => setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))}
            className="slider-control next absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors"
            aria-label="Next slide"
          >
            <ChevronDown className="h-6 w-6 -rotate-90" />
          </button>
        </>
      )}

      {/* Indicators */}
      {indicators && slides.length > 1 && (
        <div className="slider-indicators absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                index === activeSlide ? "bg-white" : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      )}
    </div>
  )
}

// Particles Renderer
export function renderParticles(element: any) {
  // This is a placeholder - in a real implementation, you would use a library like particles.js
  const count = element.content?.count || 100
  const color = element.content?.color || "#ffffff"
  const opacity = element.content?.opacity || 0.3
  const connectParticles = element.content?.connectParticles || false

  return (
    <div className="particles-container absolute inset-0 overflow-hidden pointer-events-none">
      <div className="relative w-full h-full">
        {/* Placeholder for particles effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sm opacity-50">
            Particles effect ({count} particles, {connectParticles ? "connected" : "disconnected"})
          </p>
        </div>

        {/* Simulate some particles */}
        {Array.from({ length: Math.min(count, 20) }).map((_, i) => {
          const size = Math.random() * 3 + 1
          const top = Math.random() * 100
          const left = Math.random() * 100

          return (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                backgroundColor: color,
                opacity: opacity,
                width: `${size}px`,
                height: `${size}px`,
                top: `${top}%`,
                left: `${left}%`,
              }}
            ></div>
          )
        })}
      </div>
    </div>
  )
}

// Scroll Indicator Renderer
export function renderScrollIndicator(element: any, getIconComponent: (name: string) => any) {
  const text = element.content?.text || "Scroll to explore"
  const icon = element.content?.icon || "chevron-down"
  const target = element.content?.target || "#"

  const IconComponent = getIconComponent(icon)

  return (
    <div className="scroll-indicator flex flex-col items-center justify-center">
      <span className="text-sm mb-2">{text}</span>
      <a href={target} className="animate-bounce p-1" aria-label="Scroll down">
        <IconComponent className="h-6 w-6" />
      </a>
    </div>
  )
}

// Featured Grid Renderer
export function renderFeaturedGrid(element: any) {
  const mainArticle = element.content?.mainArticle || {
    title: "Main Article Title",
    excerpt: "This is the main article excerpt.",
    image: "/placeholder.svg?height=800&width=1200",
    link: "#",
  }

  const secondaryArticles = element.content?.secondaryArticles || []
  const showReadMore = element.content?.showReadMore
  const readMoreLink = element.content?.readMoreLink || "#"
  const layout = element.content?.layout || "asymmetric"

  return (
    <div className="featured-grid container mx-auto px-4">
      <div className={`grid gap-6 ${layout === "asymmetric" ? "lg:grid-cols-2" : "grid-cols-1"}`}>
        {/* Main Article */}
        <div className={`featured-main ${layout === "asymmetric" ? "lg:row-span-2" : ""}`}>
          <div className="bg-white rounded-lg overflow-hidden shadow-md h-full">
            <a href={mainArticle.link} className="block">
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={mainArticle.image || "/placeholder.svg"}
                  alt={mainArticle.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                {mainArticle.badge && (
                  <span className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                    {mainArticle.badge}
                  </span>
                )}
                {mainArticle.category && (
                  <span className="absolute top-4 right-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                    {mainArticle.category}
                  </span>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3 text-sm text-gray-500">
                  {mainArticle.date && (
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {mainArticle.date}
                    </span>
                  )}
                  {mainArticle.readTime && (
                    <span className="flex items-center ml-4">
                      <Clock className="h-4 w-4 mr-1" />
                      {mainArticle.readTime}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-3 hover:text-primary transition-colors">{mainArticle.title}</h3>
                <p className="text-gray-600 mb-4">{mainArticle.excerpt}</p>

                {mainArticle.author && (
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      <img
                        src={mainArticle.author.avatar || "/placeholder.svg"}
                        alt={mainArticle.author.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{mainArticle.author.name}</p>
                      {mainArticle.author.title && <p className="text-xs text-gray-500">{mainArticle.author.title}</p>}
                    </div>
                  </div>
                )}
              </div>
            </a>
          </div>
        </div>

        {/* Secondary Articles */}
        <div
          className={`featured-secondary ${layout === "asymmetric" ? "grid lg:grid-cols-1" : "grid md:grid-cols-2 lg:grid-cols-3"} gap-6`}
        >
          {secondaryArticles.map((article: any, index: number) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
              <a href={article.link} className="block">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {article.category && (
                    <span className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                      {article.category}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center mb-2 text-xs text-gray-500">
                    {article.date && (
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {article.date}
                      </span>
                    )}
                    {article.readTime && (
                      <span className="flex items-center ml-3">
                        <Clock className="h-3 w-3 mr-1" />
                        {article.readTime}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold mb-2 hover:text-primary transition-colors">{article.title}</h3>
                  {article.excerpt && <p className="text-sm text-gray-600 mb-3">{article.excerpt}</p>}

                  {article.author && (
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                        <img
                          src={article.author.avatar || "/placeholder.svg"}
                          alt={article.author.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm font-medium text-gray-900">{article.author.name}</p>
                    </div>
                  )}
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Read More Link */}
      {showReadMore && (
        <div className="text-center mt-8">
          <a href={readMoreLink} className="inline-flex items-center text-primary font-medium hover:underline">
            View all featured articles
            <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </div>
      )}
    </div>
  )
}

// Call to Action Renderer
export function renderCallToAction(element: any) {
  const text = element.content?.text || "Call to action text"
  const buttonText = element.content?.buttonText || "Button"
  const buttonLink = element.content?.buttonLink || "#"
  const style = element.content?.style || "primary"
  const secondButtonText = element.content?.secondButtonText
  const secondButtonLink = element.content?.secondButtonLink

  let buttonClasses = "px-6 py-3 rounded-lg font-medium transition-colors"
  let secondButtonClasses = "px-6 py-3 rounded-lg font-medium transition-colors"

  // Primary button styles
  if (style === "primary") {
    buttonClasses += " bg-primary text-white hover:bg-primary/90"
    secondButtonClasses += " bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
  } else if (style === "outlined") {
    buttonClasses += " bg-transparent border-2 border-primary text-primary hover:bg-primary/10"
    secondButtonClasses += " bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100"
  } else if (style === "light-outline") {
    buttonClasses += " bg-transparent border-2 border-white text-white hover:bg-white/10"
    secondButtonClasses += " bg-white text-gray-800 hover:bg-gray-100"
  }

  return (
    <div className="call-to-action text-center py-8">
      {text && <p className="text-lg mb-6">{text}</p>}
      <div className="flex flex-wrap justify-center gap-4">
        <a href={buttonLink} className={buttonClasses}>
          {buttonText}
        </a>
        {secondButtonText && (
          <a href={secondButtonLink || "#"} className={secondButtonClasses}>
            {secondButtonText}
          </a>
        )}
      </div>
    </div>
  )
}

// Pill Carousel Renderer
export function renderPillCarousel(element: any) {
  const topics = element.content?.topics || []
  const showCount = element.content?.showCount
  const highlightTrending = element.content?.highlightTrending
  const autoScroll = element.content?.autoScroll

  if (topics.length === 0) {
    return (
      <div className="pill-carousel-placeholder bg-gray-100 rounded-lg p-6 text-center">
        <p className="text-gray-500">Pill Carousel (No topics)</p>
      </div>
    )
  }

  return (
    <div className="pill-carousel relative overflow-hidden py-4">
      <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
        {topics.map((topic: any, index: number) => (
          <a
            key={index}
            href={topic.link}
            className={`pill-item flex items-center whitespace-nowrap px-4 py-2 rounded-full border transition-colors ${
              highlightTrending && topic.trending
                ? "bg-primary/10 border-primary text-primary hover:bg-primary/20"
                : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {topic.trending && highlightTrending && <TrendingUp className="h-3.5 w-3.5 mr-1.5" />}
            <span>{topic.name}</span>
            {showCount && topic.count && (
              <span className="ml-1.5 text-xs bg-white px-1.5 py-0.5 rounded-full">{topic.count}</span>
            )}
          </a>
        ))}
      </div>

      {/* Scroll indicators */}
      <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
      <div className="absolute top-0 left-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
    </div>
  )
}

// Topic Highlights Renderer
export function renderTopicHighlights(element: any) {
  const topic = element.content?.topic || "Topic"
  const articles = element.content?.articles || []
  const showMoreLink = element.content?.showMoreLink || "#"

  return (
    <div className="topic-highlights bg-gray-50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">{topic}</h3>
        <a href={showMoreLink} className="text-sm text-primary hover:underline flex items-center">
          View all
          <ChevronRight className="h-4 w-4 ml-1" />
        </a>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {articles.map((article: any, index: number) => (
          <a key={index} href={article.link} className="block group">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md">
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h4 className="font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h4>
                <p className="text-sm text-gray-600 mb-3">{article.excerpt}</p>
                <div className="flex items-center text-xs text-gray-500">
                  {article.date && (
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {article.date}
                    </span>
                  )}
                  {article.readTime && (
                    <span className="flex items-center ml-3">
                      <Clock className="h-3 w-3 mr-1" />
                      {article.readTime}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

// Tab Filter Renderer
export function renderTabFilter(element: any, activeFilter: string, setActiveFilter: (value: string) => void) {
  const filters = element.content?.filters || []
  const target = element.content?.target || ""

  return (
    <div className="tab-filter mb-8">
      <div className="flex flex-wrap justify-center border-b">
        {filters.map((filter: any, index: number) => (
          <button
            key={index}
            onClick={() => setActiveFilter(filter.value)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeFilter === filter.value
                ? "text-primary border-b-2 border-primary -mb-px"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// Article Grid Renderer
export function renderArticleGrid(element: any) {
  const articles = element.content?.articles || []
  const layout = element.content?.layout || "card"
  const columns = element.content?.columns || { desktop: 3, tablet: 2, mobile: 1 }
  const showCategories = element.content?.showCategories
  const showAuthors = element.content?.showAuthors
  const showDates = element.content?.showDates
  const showReadTime = element.content?.showReadTime
  const cardStyle = element.content?.cardStyle || "shadow"
  const hoverEffect = element.content?.hoverEffect || "scale-up"
  const pagination = element.content?.pagination

  // Determine grid columns classes
  const gridColsClasses = `grid grid-cols-1 ${columns.tablet ? `md:grid-cols-${columns.tablet}` : "md:grid-cols-2"} ${
    columns.desktop ? `lg:grid-cols-${columns.desktop}` : "lg:grid-cols-3"
  } gap-6`

  // Card hover effect classes
  const getHoverClasses = () => {
    switch (hoverEffect) {
      case "scale-up":
        return "hover:scale-[1.02]"
      case "zoom":
        return "" // Applied to the image
      case "border":
        return "hover:border-primary"
      default:
        return ""
    }
  }

  // Card style classes
  const getCardClasses = () => {
    let classes = "bg-white rounded-lg overflow-hidden transition-all duration-300 "

    if (cardStyle === "shadow") {
      classes += "shadow-sm hover:shadow-md "
    } else if (cardStyle === "border") {
      classes += "border border-gray-200 "
    }

    classes += getHoverClasses()

    return classes
  }

  return (
    <div className="article-grid">
      <div className={gridColsClasses}>
        {articles.map((article: any, index: number) => (
          <div key={index} className="article-card">
            <a href={article.link} className="block h-full">
              <div className={getCardClasses()}>
                {/* Image */}
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    className={`w-full h-full object-cover ${hoverEffect === "zoom" ? "transition-transform duration-500 hover:scale-110" : ""}`}
                  />
                  {article.category && showCategories && (
                    <span className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                      {article.category}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 text-gray-900 hover:text-primary transition-colors">
                    {article.title}
                  </h3>

                  {article.excerpt && <p className="text-gray-600 text-sm mb-4">{article.excerpt}</p>}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    {/* Author */}
                    {article.author && showAuthors && (
                      <div className="flex items-center">
                        {article.author.avatar && (
                          <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                            <img
                              src={article.author.avatar || "/placeholder.svg"}
                              alt={article.author.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <span className="font-medium">{article.author.name}</span>
                      </div>
                    )}

                    {/* Meta info */}
                    <div className="flex items-center space-x-4 text-xs">
                      {article.date && showDates && (
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {article.date}
                        </span>
                      )}
                      {article.readTime && showReadTime && (
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {article.readTime}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.type === "load-more" && (
        <div className="text-center mt-10">
          <button className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors">
            Load More
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Showing {articles.length} of {pagination.totalItems} articles
          </p>
        </div>
      )}
    </div>
  )
}

// Author Carousel Renderer
export function renderAuthorCarousel(element: any, activeAuthor: number, setActiveAuthor: (value: number) => void) {
  const authors = element.content?.authors || []
  const showSocial = element.content?.showSocial
  const showFollowers = element.content?.showFollowers
  const showArticleCount = element.content?.showArticleCount
  const slidesPerView = element.content?.slidesPerView || { desktop: 3, tablet: 2, mobile: 1 }

  if (authors.length === 0) {
    return (
      <div className="author-carousel-placeholder bg-gray-100 rounded-lg p-6 text-center">
        <p className="text-gray-500">Author Carousel (No authors)</p>
      </div>
    )
  }

  return (
    <div className="author-carousel relative">
      {/* Carousel Track */}
      <div className="overflow-hidden px-4">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeAuthor * (100 / slidesPerView.desktop)}%)` }}
        >
          {authors.map((author: any, index: number) => (
            <div
              key={index}
              className={`flex-shrink-0 px-4 w-full md:w-1/${slidesPerView.tablet} lg:w-1/${slidesPerView.desktop}`}
            >
              <div className="bg-white rounded-xl overflow-hidden shadow-md p-6 text-center h-full">
                {/* Avatar */}
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                  <img
                    src={author.avatar || "/placeholder.svg"}
                    alt={author.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Author Info */}
                <h3 className="font-bold text-xl mb-1">{author.name}</h3>
                {author.title && <p className="text-gray-600 text-sm mb-3">{author.title}</p>}

                {/* Bio */}
                <p className="text-gray-700 text-sm mb-4">{author.bio}</p>

                {/* Stats */}
                <div className="flex justify-center space-x-4 mb-4 text-sm">
                  {showArticleCount && author.articles !== undefined && (
                    <div className="text-center">
                      <p className="font-bold text-gray-900">{author.articles}</p>
                      <p className="text-xs text-gray-500">Articles</p>
                    </div>
                  )}

                  {showFollowers && author.followers !== undefined && (
                    <div className="text-center">
                      <p className="font-bold text-gray-900">{author.followers}</p>
                      <p className="text-xs text-gray-500">Followers</p>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                {showSocial && author.social && (
                  <div className="flex justify-center space-x-3">
                    {Object.entries(author.social).map(([platform, url], i) => {
                      const SocialIcon = getSocialIcon(platform)
                      return (
                        <a
                          key={i}
                          href={url as string}
                          className="text-gray-500 hover:text-primary transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <SocialIcon className="h-5 w-5" />
                        </a>
                      )
                    })}
                  </div>
                )}

                {/* Profile Link */}
                {author.profileLink && (
                  <div className="mt-4">
                    <a href={author.profileLink} className="text-sm text-primary hover:underline">
                      View Profile
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      {authors.length > slidesPerView.desktop && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => setActiveAuthor((prev) => Math.max(0, prev - 1))}
            disabled={activeAuthor === 0}
            className={`p-2 rounded-full ${
              activeAuthor === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            aria-label="Previous author"
          >
            <ChevronDown className="h-5 w-5 rotate-90" />
          </button>
          <button
            onClick={() => setActiveAuthor((prev) => Math.min(authors.length - slidesPerView.desktop, prev + 1))}
            disabled={activeAuthor >= authors.length - slidesPerView.desktop}
            className={`p-2 rounded-full ${
              activeAuthor >= authors.length - slidesPerView.desktop
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            aria-label="Next author"
          >
            <ChevronDown className="h-5 w-5 -rotate-90" />
          </button>
        </div>
      )}
    </div>
  )
}

// Category Cards Renderer
export function renderCategoryCards(element: any, getIconComponent: (name: string) => any) {
  const categories = element.content?.categories || []
  const layout = element.content?.layout || "grid"
  const columns = element.content?.columns || { desktop: 3, tablet: 2, mobile: 1 }
  const showIcon = element.content?.showIcon
  const showCount = element.content?.showCount
  const aspectRatio = element.content?.aspectRatio || "16/9"
  const hoverEffect = element.content?.hoverEffect || "zoom"

  // Determine grid columns classes
  const gridColsClasses = `grid grid-cols-1 ${columns.tablet ? `md:grid-cols-${columns.tablet}` : "md:grid-cols-2"} ${
    columns.desktop ? `lg:grid-cols-${columns.desktop}` : "lg:grid-cols-3"
  } gap-6`

  return (
    <div className={`category-cards ${layout === "grid" ? gridColsClasses : "flex flex-wrap gap-4"}`}>
      {categories.map((category: any, index: number) => (
        <a
          key={index}
          href={category.link}
          className={`category-card group block overflow-hidden rounded-lg relative ${
            layout === "grid" ? "w-full" : "w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)]"
          }`}
        >
          <div
            className={`relative overflow-hidden ${
              aspectRatio === "1/1"
                ? "aspect-square"
                : aspectRatio === "4/3"
                  ? "aspect-[4/3]"
                  : aspectRatio === "3/2"
                    ? "aspect-[3/2]"
                    : "aspect-[16/9]"
            }`}
          >
            {/* Background Image */}
            <img
              src={category.image || "/placeholder.svg"}
              alt={category.name}
              className={`w-full h-full object-cover ${
                hoverEffect === "zoom" ? "transition-transform duration-500 group-hover:scale-110" : ""
              }`}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <div className="flex items-center mb-2">
                {showIcon && category.icon && (
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3">
                    {getIconComponent(category.icon) &&
                      React.createElement(getIconComponent(category.icon), {
                        className: "h-5 w-5 text-white",
                      })}
                  </div>
                )}
                <h3 className="text-white text-xl font-bold">{category.name}</h3>
                {showCount && category.count !== undefined && (
                  <span className="ml-2 bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                )}
              </div>

              {category.description && <p className="text-white/80 text-sm">{category.description}</p>}
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}

// Tag Cloud Renderer
export function renderTagCloud(element: any) {
  const tags = element.content?.tags || []
  const minSize = element.content?.minSize || 12
  const maxSize = element.content?.maxSize || 24
  const colorGradient = element.content?.colorGradient || ["#6c5ce7", "#74b9ff"]

  // Calculate font size based on weight
  const calculateFontSize = (weight: number) => {
    const maxWeight = Math.max(...tags.map((tag) => tag.weight))
    const minWeight = Math.min(...tags.map((tag) => tag.weight))

    // Normalize weight to a value between 0 and 1
    const normalizedWeight = (weight - minWeight) / (maxWeight - minWeight || 1)

    // Calculate font size
    return minSize + normalizedWeight * (maxSize - minSize)
  }

  // Calculate color based on weight
  const calculateColor = (weight: number) => {
    const maxWeight = Math.max(...tags.map((tag) => tag.weight))
    const minWeight = Math.min(...tags.map((tag) => tag.weight))

    // Normalize weight to a value between 0 and 1
    const normalizedWeight = (weight - minWeight) / (maxWeight - minWeight || 1)

    // For simplicity, just return the first color for lower weights and second for higher weights
    return normalizedWeight < 0.5 ? colorGradient[0] : colorGradient[1]
  }

  return (
    <div className="tag-cloud p-6 bg-white rounded-lg shadow-sm">
      <div className="flex flex-wrap justify-center gap-3">
        {tags.map((tag: any, index: number) => (
          <a
            key={index}
            href={tag.link}
            className="hover:underline transition-colors"
            style={{
              fontSize: `${calculateFontSize(tag.weight)}px`,
              color: calculateColor(tag.weight),
            }}
          >
            {tag.name}
          </a>
        ))}
      </div>
    </div>
  )
}

// Category Popular Renderer
export function renderCategoryPopular(element: any, currentTab: number, setCurrentTab: (value: number) => void) {
  const categories = element.content?.categories || []
  const layout = element.content?.layout || "tabs"
  const showViews = element.content?.showViews

  if (categories.length === 0) {
    return (
      <div className="category-popular-placeholder bg-gray-100 rounded-lg p-6 text-center">
        <p className="text-gray-500">Category Popular (No categories)</p>
      </div>
    )
  }

  return (
    <div className="category-popular bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b">
        {categories.map((category: any, index: number) => (
          <button
            key={index}
            onClick={() => setCurrentTab(index)}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              currentTab === index
                ? "text-primary border-b-2 border-primary -mb-px"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        {categories[currentTab]?.articles?.map((article: any, index: number) => (
          <a
            key={index}
            href={article.link}
            className="block py-3 px-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-center">
              <h4 className="text-gray-900 font-medium hover:text-primary transition-colors">{article.title}</h4>
              {showViews && article.views !== undefined && (
                <span className="text-xs text-gray-500 flex items-center">
                  <Eye className="h-3 w-3 mr-1" />
                  {article.views.toLocaleString()}
                </span>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

// Stats Counter Renderer
export function renderStatsCounter(element: any) {
  const stats = element.content?.stats || []
  const animation = element.content?.animation

  return (
    <div className="stats-counter">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat: any, index: number) => (
          <div key={index} className="text-center">
            <p className="text-4xl font-bold mb-2">
              {stat.prefix || ""}
              {stat.value.toLocaleString(undefined, {
                minimumFractionDigits: stat.decimals || 0,
                maximumFractionDigits: stat.decimals || 0,
              })}
              {stat.suffix || ""}
            </p>
            <p className="text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Newsletter Box Renderer
export function renderNewsletterBox(element: any) {
  const heading = element.content?.heading || "Subscribe to Our Newsletter"
  const subheading = element.content?.subheading
  const description = element.content?.description
  const buttonText = element.content?.buttonText || "Subscribe"
  const placeholder = element.content?.placeholder || "Your email address"
  const privacyText = element.content?.privacyText
  const image = element.content?.image
  const benefits = element.content?.benefits || []
  const alignment = element.content?.alignment || "center"
  const requireName = element.content?.requireName

  return (
    <div
      className={`newsletter-box bg-white rounded-lg shadow-md overflow-hidden ${
        alignment === "split" && image ? "md:grid md:grid-cols-2" : ""
      }`}
    >
      {/* Image (for split layout) */}
      {alignment === "split" && image && (
        <div className="relative h-64 md:h-full">
          <img src={image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Content */}
      <div className="p-8 md:p-10">
        {heading && <h3 className="text-2xl font-bold mb-3">{heading}</h3>}
        {subheading && <p className="text-lg text-gray-700 mb-2">{subheading}</p>}
        {description && <p className="text-gray-600 mb-6">{description}</p>}

        {/* Benefits */}
        {benefits.length > 0 && (
          <ul className="mb-6 space-y-2">
            {benefits.map((benefit: string, index: number) => (
              <li key={index} className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{benefit}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Form */}
        <div className="space-y-4">
          {requireName && (
            <div>
              <input
                type="text"
                placeholder="Your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-colors"
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder={placeholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-colors"
            />
            <button className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap">
              {buttonText}
            </button>
          </div>

          {privacyText && <p className="text-xs text-gray-500">{privacyText}</p>}
        </div>
      </div>
    </div>
  )
}

// Social Follow Renderer
export function renderSocialFollow(element: any) {
  const heading = element.content?.heading || "Follow Us"
  const subheading = element.content?.subheading
  const platforms = element.content?.platforms || []
  const style = element.content?.style || "simple"
  const showFollowerCount = element.content?.showFollowerCount
  const followerCounts = element.content?.followerCounts || {}

  return (
    <div className="social-follow text-center">
      {heading && <h3 className="text-xl font-bold mb-2">{heading}</h3>}
      {subheading && <p className="text-gray-600 mb-6">{subheading}</p>}

      <div className="flex flex-wrap justify-center gap-4">
        {platforms.map((platform: any, index: number) => {
          const SocialIcon = getSocialIcon(platform.icon)
          const count = followerCounts[platform.icon as keyof typeof followerCounts]

          return (
            <a
              key={index}
              href={platform.url}
              className={`social-platform flex flex-col items-center p-4 rounded-lg transition-transform hover:scale-105 ${
                style === "colorful" ? getSocialColor(platform.icon) : "bg-gray-100 hover:bg-gray-200"
              }`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <SocialIcon className={`h-6 w-6 ${style === "colorful" ? "text-white" : "text-gray-700"}`} />
              <span className={`text-sm mt-2 font-medium ${style === "colorful" ? "text-white" : "text-gray-900"}`}>
                {platform.name}
              </span>
              {showFollowerCount && count && (
                <span className={`text-xs mt-1 ${style === "colorful" ? "text-white/80" : "text-gray-500"}`}>
                  {count}
                </span>
              )}
            </a>
          )
        })}
      </div>
    </div>
  )
}

// Back to Top Renderer
export function renderBackToTop(element: any, getIconComponent: (name: string) => any) {
  const icon = element.content?.icon || "arrow-up"
  const text = element.content?.text
  const showText = element.content?.showText

  const IconComponent = getIconComponent(icon)

  return (
    <button
      className="back-to-top fixed bottom-8 right-8 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors z-50 flex items-center"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
    >
      <IconComponent className="h-5 w-5" />
      {showText && text && <span className="ml-2 text-sm">{text}</span>}
    </button>
  )
}
