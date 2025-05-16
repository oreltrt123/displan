// Add React import at the top
import type { CSSProperties } from "react"
import { Search, ChevronRight, ArrowRight } from "lucide-react"

interface ElementType {
  id: string
  type: string
  style?: any
  content?: any
  transitions?: any[]
}

// This file contains implementations for additional elements that can be used by the ElementRenderer
// These elements were referenced in the AI assistant but weren't implemented in the original element-renderer.tsx

export function renderSearch(element: ElementType) {
  const placeholder = element.content?.placeholder || "Search..."
  const buttonText = element.content?.buttonText || "Search"
  const showButton = element.content?.showButton !== false

  return (
    <div
      style={element.style as CSSProperties}
      className="search-container flex items-center border border-gray-300 rounded-lg overflow-hidden"
    >
      <div className="search-icon-wrapper px-3 py-2 text-gray-500">
        <Search className="h-5 w-5" />
      </div>
      <input type="text" placeholder={placeholder} className="search-input flex-grow py-2 px-2 outline-none" />
      {showButton && (
        <button className="search-button bg-primary text-white px-4 py-2 hover:bg-primary/90 transition-colors">
          {buttonText}
        </button>
      )}
    </div>
  )
}

export function renderCard(element: ElementType) {
  const title = element.content?.title || "Card Title"
  const text = element.content?.text || "Card content goes here."
  const imageSrc = element.content?.imageSrc
  const buttonText = element.content?.buttonText
  const buttonLink = element.content?.buttonLink || "#"

  return (
    <div style={element.style as CSSProperties} className="card bg-white rounded-lg shadow-md overflow-hidden">
      {imageSrc && (
        <div className="card-image-container">
          <img src={imageSrc || "/placeholder.svg"} alt={title} className="card-image w-full h-48 object-cover" />
        </div>
      )}
      <div className="card-content p-4">
        <h3 className="card-title text-xl font-semibold mb-2">{title}</h3>
        <p className="card-text text-gray-600 mb-4">{text}</p>
        {buttonText && (
          <a
            href={buttonLink}
            className="card-button inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          >
            {buttonText}
          </a>
        )}
      </div>
    </div>
  )
}

export function renderForm(element: ElementType) {
  const title = element.content?.title || "Contact Form"
  const fields = element.content?.fields || [
    { type: "text", label: "Name", placeholder: "Your Name" },
    { type: "email", label: "Email", placeholder: "Your Email" },
    { type: "textarea", label: "Message", placeholder: "Your Message" },
  ]
  const submitText = element.content?.submitText || "Submit"

  return (
    <div style={element.style as CSSProperties} className="form-container bg-white rounded-lg shadow-md p-6">
      <h3 className="form-title text-xl font-semibold mb-4">{title}</h3>
      <form className="space-y-4">
        {fields.map((field: any, index: number) => (
          <div key={index} className="form-field">
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            {field.type === "textarea" ? (
              <textarea
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
              ></textarea>
            ) : (
              <input
                type={field.type}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          {submitText}
        </button>
      </form>
    </div>
  )
}

export function renderGallery(element: ElementType) {
  const images = element.content?.images || [
    { src: "/placeholder.svg?height=300&width=400", alt: "Gallery Image 1" },
    { src: "/placeholder.svg?height=300&width=400", alt: "Gallery Image 2" },
    { src: "/placeholder.svg?height=300&width=400", alt: "Gallery Image 3" },
    { src: "/placeholder.svg?height=300&width=400", alt: "Gallery Image 4" },
  ]
  const columns = element.content?.columns || 2

  return (
    <div style={element.style as CSSProperties} className={`gallery-container grid grid-cols-${columns} gap-4`}>
      {images.map((image: any, index: number) => (
        <div key={index} className="gallery-item overflow-hidden rounded-lg">
          <img
            src={image.src || "/placeholder.svg"}
            alt={image.alt}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      ))}
    </div>
  )
}

export function renderSlider(element: ElementType) {
  const slides = element.content?.slides || [
    {
      src: "/placeholder.svg?height=400&width=800",
      alt: "Slide 1",
      title: "Slide 1",
      description: "Description for slide 1",
    },
    {
      src: "/placeholder.svg?height=400&width=800",
      alt: "Slide 2",
      title: "Slide 2",
      description: "Description for slide 2",
    },
    {
      src: "/placeholder.svg?height=400&width=800",
      alt: "Slide 3",
      title: "Slide 3",
      description: "Description for slide 3",
    },
  ]

  // Note: In a real implementation, you would need to add JavaScript for the slider functionality
  // This is just the HTML structure

  return (
    <div style={element.style as CSSProperties} className="slider-container relative overflow-hidden rounded-lg">
      <div className="slider-track flex">
        {slides.map((slide: any, index: number) => (
          <div key={index} className="slider-slide min-w-full">
            <img src={slide.src || "/placeholder.svg"} alt={slide.alt} className="w-full h-64 object-cover" />
            <div className="slider-content absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
              <h3 className="slider-title text-lg font-semibold">{slide.title}</h3>
              <p className="slider-description text-sm">{slide.description}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="slider-prev absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70">
        <ChevronRight className="h-5 w-5 transform rotate-180" />
      </button>
      <button className="slider-next absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70">
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}

export function renderTabFilter(element: ElementType) {
  const tabs = element.content?.tabs || [
    { id: "all", label: "All" },
    { id: "category1", label: "Category 1" },
    { id: "category2", label: "Category 2" },
    { id: "category3", label: "Category 3" },
  ]
  const activeTab = element.content?.activeTab || "all"

  return (
    <div style={element.style as CSSProperties} className="tab-filter-container">
      <div className="tab-filter-tabs flex space-x-2 mb-4 overflow-x-auto pb-2">
        {tabs.map((tab: any) => (
          <button
            key={tab.id}
            className={`tab-filter-tab px-4 py-2 rounded-md whitespace-nowrap ${
              tab.id === activeTab ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-filter-content">
        {/* Content would be filtered based on active tab */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow p-4">
              <div className="h-32 bg-gray-200 rounded-md mb-2"></div>
              <h3 className="font-medium">Item {item}</h3>
              <p className="text-sm text-gray-500">Category {(item % 3) + 1}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function renderNewsletterBox(element: ElementType) {
  const title = element.content?.title || "Subscribe to our Newsletter"
  const description = element.content?.description || "Get the latest updates directly to your inbox."
  const buttonText = element.content?.buttonText || "Subscribe"
  const placeholder = element.content?.placeholder || "Your email address"

  return (
    <div style={element.style as CSSProperties} className="newsletter-box bg-gray-100 rounded-lg p-6">
      <h3 className="newsletter-title text-xl font-semibold mb-2">{title}</h3>
      <p className="newsletter-description text-gray-600 mb-4">{description}</p>
      <div className="newsletter-form flex">
        <input
          type="email"
          placeholder={placeholder}
          className="newsletter-input flex-grow px-4 py-2 rounded-l-md border-y border-l border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button className="newsletter-button bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary/90 transition-colors">
          {buttonText}
        </button>
      </div>
    </div>
  )
}

export function renderSocialFollow(element: ElementType) {
  const title = element.content?.title || "Follow Us"
  const platforms = element.content?.platforms || [
    { name: "Facebook", icon: "facebook", url: "#" },
    { name: "Twitter", icon: "twitter", url: "#" },
    { name: "Instagram", icon: "instagram", url: "#" },
    { name: "LinkedIn", icon: "linkedin", url: "#" },
  ]

  // Note: This component would need the actual icon components to be passed in
  // For now, we'll just use placeholders

  return (
    <div style={element.style as CSSProperties} className="social-follow">
      <h3 className="social-follow-title text-lg font-semibold mb-3">{title}</h3>
      <div className="social-follow-icons flex space-x-3">
        {platforms.map((platform: any, index: number) => (
          <a
            key={index}
            href={platform.url}
            className="social-icon-link w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-primary hover:text-white transition-colors"
            title={platform.name}
          >
            <span className="sr-only">{platform.name}</span>
            {/* Icon would be rendered here based on platform.icon */}
            <div className="w-5 h-5"></div>
          </a>
        ))}
      </div>
    </div>
  )
}

export function renderCta(element: ElementType) {
  const title = element.content?.title || "Ready to get started?"
  const description = element.content?.description || "Join thousands of satisfied customers today."
  const buttonText = element.content?.buttonText || "Get Started"
  const buttonLink = element.content?.buttonLink || "#"
  const style = element.content?.style || "default" // default, centered, split

  if (style === "centered") {
    return (
      <div
        style={element.style as CSSProperties}
        className="cta-container bg-primary text-white text-center rounded-lg p-8"
      >
        <h2 className="cta-title text-2xl font-bold mb-3">{title}</h2>
        <p className="cta-description mb-6 max-w-md mx-auto">{description}</p>
        <a
          href={buttonLink}
          className="cta-button inline-block px-6 py-3 bg-white text-primary font-medium rounded-md hover:bg-gray-100 transition-colors"
        >
          {buttonText}
        </a>
      </div>
    )
  }

  if (style === "split") {
    return (
      <div
        style={element.style as CSSProperties}
        className="cta-container bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col md:flex-row"
      >
        <div className="cta-content p-6 md:w-2/3">
          <h2 className="cta-title text-2xl font-bold mb-3">{title}</h2>
          <p className="cta-description mb-6">{description}</p>
        </div>
        <div className="cta-action bg-gray-100 p-6 flex items-center justify-center md:w-1/3">
          <a
            href={buttonLink}
            className="cta-button inline-block px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors"
          >
            {buttonText}
          </a>
        </div>
      </div>
    )
  }

  // Default style
  return (
    <div style={element.style as CSSProperties} className="cta-container bg-gray-100 rounded-lg p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-4 md:mb-0">
          <h2 className="cta-title text-xl font-bold">{title}</h2>
          <p className="cta-description text-gray-600">{description}</p>
        </div>
        <a
          href={buttonLink}
          className="cta-button inline-block px-5 py-2 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors"
        >
          {buttonText} <ArrowRight className="inline h-4 w-4 ml-1" />
        </a>
      </div>
    </div>
  )
}

export function renderFaq(element: ElementType) {
  const title = element.content?.title || "Frequently Asked Questions"
  const items = element.content?.items || [
    { question: "What is this product?", answer: "This is a sample answer to the question." },
    { question: "How does it work?", answer: "This is a sample answer to the question." },
    { question: "What are the pricing options?", answer: "This is a sample answer to the question." },
  ]

  return (
    <div style={element.style as CSSProperties} className="faq-container">
      <h2 className="faq-title text-2xl font-bold mb-6">{title}</h2>
      <div className="faq-items space-y-4">
        {items.map((item: any, index: number) => (
          <div key={index} className="faq-item border border-gray-200 rounded-lg overflow-hidden">
            <button className="faq-question w-full flex items-center justify-between p-4 text-left font-medium bg-white hover:bg-gray-50">
              <span>{item.question}</span>
              <ChevronRight className="h-5 w-5 transform rotate-90" />
            </button>
            <div className="faq-answer bg-gray-50 p-4 border-t border-gray-200">
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function renderPricing(element: ElementType) {
  const title = element.content?.title || "Pricing Plans"
  const description = element.content?.description || "Choose the plan that works best for you."
  const plans = element.content?.plans || [
    {
      name: "Basic",
      price: "$9",
      period: "per month",
      features: ["Feature 1", "Feature 2", "Feature 3"],
      buttonText: "Get Started",
      buttonLink: "#",
      popular: false,
    },
    {
      name: "Pro",
      price: "$19",
      period: "per month",
      features: ["All Basic features", "Feature 4", "Feature 5", "Feature 6"],
      buttonText: "Get Started",
      buttonLink: "#",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$49",
      period: "per month",
      features: ["All Pro features", "Feature 7", "Feature 8", "Feature 9"],
      buttonText: "Contact Us",
      buttonLink: "#",
      popular: false,
    },
  ]

  return (
    <div style={element.style as CSSProperties} className="pricing-container">
      <div className="pricing-header text-center mb-10">
        <h2 className="pricing-title text-3xl font-bold mb-3">{title}</h2>
        <p className="pricing-description text-gray-600 max-w-2xl mx-auto">{description}</p>
      </div>

      <div className="pricing-plans grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan: any, index: number) => (
          <div
            key={index}
            className={`pricing-plan border rounded-lg overflow-hidden ${
              plan.popular ? "border-primary shadow-md" : "border-gray-200"
            }`}
          >
            {plan.popular && (
              <div className="pricing-popular-badge bg-primary text-white text-center py-1 text-sm font-medium">
                Most Popular
              </div>
            )}
            <div className="pricing-plan-header p-6 bg-white">
              <h3 className="pricing-plan-name text-xl font-bold mb-2">{plan.name}</h3>
              <div className="pricing-plan-price">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-gray-600">{plan.period}</span>
              </div>
            </div>
            <div className="pricing-plan-features p-6 bg-gray-50 border-t border-b border-gray-200">
              <ul className="space-y-3">
                {plan.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pricing-plan-action p-6 bg-white text-center">
              <a
                href={plan.buttonLink}
                className={`inline-block w-full py-2 rounded-md font-medium ${
                  plan.popular
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                } transition-colors`}
              >
                {plan.buttonText}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function renderStats(element: ElementType) {
  const title = element.content?.title
  const stats = element.content?.stats || [
    { value: "1M+", label: "Users" },
    { value: "50+", label: "Countries" },
    { value: "99%", label: "Satisfaction" },
    { value: "24/7", label: "Support" },
  ]

  return (
    <div style={element.style as CSSProperties} className="stats-container py-10">
      {title && <h2 className="stats-title text-2xl font-bold text-center mb-8">{title}</h2>}
      <div className="stats-grid grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat: any, index: number) => (
          <div key={index} className="stat-item text-center">
            <div className="stat-value text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
            <div className="stat-label text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function renderTeam(element: ElementType) {
  const title = element.content?.title || "Our Team"
  const description = element.content?.description || "Meet the talented people behind our success."
  const members = element.content?.members || [
    {
      name: "John Doe",
      position: "CEO & Founder",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Short bio about John Doe.",
    },
    {
      name: "Jane Smith",
      position: "CTO",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Short bio about Jane Smith.",
    },
    {
      name: "Mike Johnson",
      position: "Design Lead",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Short bio about Mike Johnson.",
    },
  ]

  return (
    <div style={element.style as CSSProperties} className="team-container">
      <div className="team-header text-center mb-10">
        <h2 className="team-title text-3xl font-bold mb-3">{title}</h2>
        <p className="team-description text-gray-600 max-w-2xl mx-auto">{description}</p>
      </div>

      <div className="team-members grid grid-cols-1 md:grid-cols-3 gap-8">
        {members.map((member: any, index: number) => (
          <div key={index} className="team-member text-center">
            <div className="team-member-image mb-4">
              <img
                src={member.image || "/placeholder.svg"}
                alt={member.name}
                className="w-40 h-40 object-cover rounded-full mx-auto"
              />
            </div>
            <h3 className="team-member-name text-xl font-bold mb-1">{member.name}</h3>
            <p className="team-member-position text-primary mb-3">{member.position}</p>
            <p className="team-member-bio text-gray-600">{member.bio}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function renderTestimonials(element: ElementType) {
  const title = element.content?.title || "What Our Customers Say"
  const testimonials = element.content?.testimonials || [
    {
      quote: "This product has completely transformed how we work. Highly recommended!",
      author: "John Doe",
      position: "CEO, Company Inc.",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      quote: "The best solution we've found after trying many alternatives.",
      author: "Jane Smith",
      position: "Marketing Director, Agency Co.",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      quote: "Excellent customer service and a fantastic product. Worth every penny.",
      author: "Mike Johnson",
      position: "Freelancer",
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  return (
    <div style={element.style as CSSProperties} className="testimonials-container py-10">
      <h2 className="testimonials-title text-2xl font-bold text-center mb-10">{title}</h2>

      <div className="testimonials-grid grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial: any, index: number) => (
          <div key={index} className="testimonial-item bg-white rounded-lg shadow-md p-6">
            <div className="testimonial-quote text-gray-600 italic mb-6">"{testimonial.quote}"</div>
            <div className="testimonial-author flex items-center">
              <div className="testimonial-author-image mr-4">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
              <div>
                <div className="testimonial-author-name font-semibold">{testimonial.author}</div>
                <div className="testimonial-author-position text-sm text-gray-500">{testimonial.position}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function renderFeatures(element: ElementType) {
  const title = element.content?.title || "Key Features"
  const description = element.content?.description || "Discover what makes our product special."
  const features = element.content?.features || [
    {
      title: "Feature 1",
      description: "Description of feature 1",
      icon: "zap",
    },
    {
      title: "Feature 2",
      description: "Description of feature 2",
      icon: "shield",
    },
    {
      title: "Feature 3",
      description: "Description of feature 3",
      icon: "globe",
    },
  ]

  return (
    <div style={element.style as CSSProperties} className="features-container py-10">
      <div className="features-header text-center mb-10">
        <h2 className="features-title text-3xl font-bold mb-3">{title}</h2>
        <p className="features-description text-gray-600 max-w-2xl mx-auto">{description}</p>
      </div>

      <div className="features-grid grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature: any, index: number) => (
          <div key={index} className="feature-item text-center">
            <div className="feature-icon-wrapper mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              {/* Icon would be rendered here based on feature.icon */}
              <div className="w-8 h-8 text-primary"></div>
            </div>
            <h3 className="feature-title text-xl font-bold mb-2">{feature.title}</h3>
            <p className="feature-description text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
