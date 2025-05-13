export const businessTemplate = (projectName: string) => {
  return {
    sections: [
      {
        id: "header-section",
        name: "Header Section",
        elements: [
          {
            id: "header-element",
            type: "cyber-header:ch-2",
            content: {
              title: projectName,
              subtitle: "Professional Business Solutions",
              text: projectName.toUpperCase(),
              showNav: true,
              navItems: [
                { label: "Home", link: "#" },
                { label: "Services", link: "#" },
                { label: "About", link: "#" },
                { label: "Contact", link: "#" },
              ],
            },
            style: {
              x: 0,
              y: 0,
              width: "100%",
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
              heading: "Professional Solutions for Your Business",
              subheading: "We provide top-quality services to help your business grow",
              buttonText: "Get Started",
              buttonLink: "#",
              src: "/placeholder.svg?height=600&width=1200",
              alt: "Business Hero Image",
            },
            style: {
              backgroundColor: "#0066cc",
              textColor: "#ffffff",
              height: "600px",
              alignment: "center",
              x: 0,
              y: 0,
              width: "100%",
            },
          },
        ],
      },
      {
        id: "services-section",
        name: "Services Section",
        elements: [
          {
            id: "services-heading",
            type: "heading",
            content: {
              text: "Our Services",
              level: "h2",
            },
            style: {
              textColor: "#333333",
              fontSize: "32px",
              fontWeight: "bold",
              textAlign: "center",
              x: 0,
              y: 20,
              width: "100%",
            },
          },
          {
            id: "service-1",
            type: "cyber-card:cc-1",
            content: {
              title: "Business Consulting",
              text: "Strategic guidance to optimize your business operations and growth.",
              src: "/placeholder.svg?height=200&width=200",
            },
            style: {
              x: 50,
              y: 100,
              width: "30%",
            },
          },
          {
            id: "service-2",
            type: "cyber-card:cc-1",
            content: {
              title: "Financial Planning",
              text: "Comprehensive financial strategies tailored to your business needs.",
              src: "/placeholder.svg?height=200&width=200",
            },
            style: {
              x: 400,
              y: 100,
              width: "30%",
            },
          },
          {
            id: "service-3",
            type: "cyber-card:cc-1",
            content: {
              title: "Market Analysis",
              text: "In-depth market research to identify opportunities and threats.",
              src: "/placeholder.svg?height=200&width=200",
            },
            style: {
              x: 750,
              y: 100,
              width: "30%",
            },
          },
        ],
      },
      {
        id: "about-section",
        name: "About Section",
        elements: [
          {
            id: "about-heading",
            type: "heading",
            content: {
              text: "About Our Company",
              level: "h2",
            },
            style: {
              textColor: "#333333",
              fontSize: "32px",
              fontWeight: "bold",
              x: 50,
              y: 20,
            },
          },
          {
            id: "about-paragraph",
            type: "paragraph",
            content: {
              text: "Founded in 2010, our company has been providing exceptional business solutions to clients worldwide. Our team of experts is dedicated to delivering high-quality services that help businesses thrive in today's competitive market.",
            },
            style: {
              textColor: "#666666",
              fontSize: "16px",
              x: 50,
              y: 80,
              width: "45%",
            },
          },
          {
            id: "about-image",
            type: "image",
            content: {
              src: "/placeholder.svg?height=400&width=600",
              alt: "About Us Image",
            },
            style: {
              x: 600,
              y: 20,
              width: "40%",
              height: "auto",
              borderRadius: "8px",
            },
          },
        ],
      },
      {
        id: "testimonials-section",
        name: "Testimonials Section",
        elements: [
          {
            id: "testimonials-heading",
            type: "heading",
            content: {
              text: "What Our Clients Say",
              level: "h2",
            },
            style: {
              textColor: "#333333",
              fontSize: "32px",
              fontWeight: "bold",
              textAlign: "center",
              x: 0,
              y: 20,
              width: "100%",
            },
          },
          {
            id: "testimonial-1",
            type: "cyber-card:cc-2",
            content: {
              title: "John Doe, CEO of ABC Corp",
              text: "Working with this company has transformed our business operations. Their strategic guidance has been invaluable.",
              src: "/placeholder.svg?height=100&width=100",
            },
            style: {
              x: 100,
              y: 100,
              width: "40%",
            },
          },
          {
            id: "testimonial-2",
            type: "cyber-card:cc-2",
            content: {
              title: "Jane Smith, CFO of XYZ Inc",
              text: "The financial planning services provided by this team have helped us optimize our resources and increase profitability.",
              src: "/placeholder.svg?height=100&width=100",
            },
            style: {
              x: 600,
              y: 100,
              width: "40%",
            },
          },
        ],
      },
      {
        id: "cta-section",
        name: "Call to Action Section",
        elements: [
          {
            id: "cta-card",
            type: "cyber-card:cc-4",
            content: {
              title: "Ready to Get Started?",
              text: "Contact our team today for a free consultation and discover how we can help your business grow.",
            },
            style: {
              x: 200,
              y: 50,
              width: "60%",
            },
          },
          {
            id: "cta-button",
            type: "cyber-button:cb-3",
            content: {
              buttonText: "Contact Us Now",
              buttonLink: "#",
            },
            style: {
              x: 400,
              y: 150,
              width: "20%",
            },
          },
        ],
      },
      {
        id: "footer-section",
        name: "Footer Section",
        elements: [
          {
            id: "footer-element",
            type: "footer",
            content: {
              copyright: `© ${new Date().getFullYear()} ${projectName}. All rights reserved.`,
              showSocial: true,
              socialLinks: [
                { platform: "twitter", link: "#" },
                { platform: "linkedin", link: "#" },
                { platform: "facebook", link: "#" },
              ],
              address: "123 Business St, City, Country",
              phone: "+1 234 567 890",
              email: "info@business.com",
            },
            style: {
              backgroundColor: "#333333",
              textColor: "#ffffff",
              padding: "40px 20px",
              x: 0,
              y: 0,
              width: "100%",
            },
          },
        ],
      },
    ],
    globalStyles: {
      fontFamily: "Helvetica, Arial, sans-serif",
      backgroundColor: "#ffffff",
      textColor: "#333333",
    },
    pages: [
      {
        id: "home",
        name: "Home",
        path: "/",
        sections: [
          "header-section",
          "hero-section",
          "services-section",
          "testimonials-section",
          "cta-section",
          "footer-section",
        ],
      },
      {
        id: "about",
        name: "About",
        path: "/about",
        sections: ["header-section", "about-section", "testimonials-section", "footer-section"],
      },
      {
        id: "services",
        name: "Services",
        path: "/services",
        sections: ["header-section", "services-section", "cta-section", "footer-section"],
      },
      {
        id: "contact",
        name: "Contact",
        path: "/contact",
        sections: ["header-section", "cta-section", "footer-section"],
      },
    ],
    settings: {
      siteName: projectName,
      favicon: "",
      theme: {
        primaryColor: "#0066cc",
        secondaryColor: "#f5f5f5",
        fontFamily: "Helvetica, Arial, sans-serif",
      },
    },
  }
}

export default businessTemplate
