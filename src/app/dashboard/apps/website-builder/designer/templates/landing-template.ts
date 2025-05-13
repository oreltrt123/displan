export const landingTemplate = (projectName: string) => {
  return {
    sections: [
      {
        id: "header-section",
        name: "Header Section",
        elements: [
          {
            id: "header-element",
            type: "cyber-header:ch-4",
            content: {
              title: projectName,
              subtitle: "Landing Page",
              text: projectName.toUpperCase(),
              showNav: true,
              navItems: [
                { label: "Home", link: "#" },
                { label: "Features", link: "#" },
                { label: "Pricing", link: "#" },
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
              heading: "The Ultimate Solution",
              subheading: "Solve your problems with our innovative product",
              buttonText: "Get Started",
              buttonLink: "#",
              src: "/placeholder.svg?height=600&width=1200",
              alt: "Landing Page Hero Image",
            },
            style: {
              backgroundColor: "#6c5ce7",
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
        id: "features-section",
        name: "Features Section",
        elements: [
          {
            id: "features-heading",
            type: "heading",
            content: {
              text: "Key Features",
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
            id: "feature-1",
            type: "cyber-card:cc-3",
            content: {
              title: "Feature 1",
              text: "Description of feature 1 and how it benefits users.",
              src: "/placeholder.svg?height=200&width=200",
            },
            style: {
              x: 50,
              y: 100,
              width: "30%",
            },
          },
          {
            id: "feature-2",
            type: "cyber-card:cc-3",
            content: {
              title: "Feature 2",
              text: "Description of feature 2 and how it benefits users.",
              src: "/placeholder.svg?height=200&width=200",
            },
            style: {
              x: 400,
              y: 100,
              width: "30%",
            },
          },
          {
            id: "feature-3",
            type: "cyber-card:cc-3",
            content: {
              title: "Feature 3",
              text: "Description of feature 3 and how it benefits users.",
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
        id: "testimonial-section",
        name: "Testimonial Section",
        elements: [
          {
            id: "testimonial-heading",
            type: "heading",
            content: {
              text: "What Our Users Say",
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
            id: "testimonial-card",
            type: "cyber-card:cc-3",
            content: {
              title: "John Doe, CEO",
              text: "This product has completely transformed our workflow. Highly recommended!",
              src: "/placeholder.svg?height=100&width=100",
            },
            style: {
              x: 300,
              y: 100,
              width: "50%",
            },
          },
        ],
      },
      {
        id: "pricing-section",
        name: "Pricing Section",
        elements: [
          {
            id: "pricing-heading",
            type: "heading",
            content: {
              text: "Pricing Plans",
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
            id: "pricing-grid",
            type: "cyber-grid:cg-8",
            content: {
              items: ["Basic Plan - $9.99/mo", "Pro Plan - $19.99/mo", "Enterprise - $49.99/mo", "Custom - Contact Us"],
            },
            style: {
              x: 100,
              y: 100,
              width: "80%",
              height: "300px",
            },
          },
        ],
      },
      {
        id: "cta-section",
        name: "Call to Action Section",
        elements: [
          {
            id: "cta-heading",
            type: "heading",
            content: {
              text: "Ready to Get Started?",
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
            id: "cta-text",
            type: "paragraph",
            content: {
              text: "Join thousands of satisfied customers who have transformed their workflow with our product.",
            },
            style: {
              textColor: "#666666",
              fontSize: "16px",
              textAlign: "center",
              x: 300,
              y: 80,
              width: "40%",
            },
          },
          {
            id: "cta-button",
            type: "cyber-button:cb-3",
            content: {
              buttonText: "Start Your Free Trial",
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
                { platform: "facebook", link: "#" },
                { platform: "instagram", link: "#" },
              ],
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
      fontFamily: "'Poppins', sans-serif",
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
          "features-section",
          "testimonial-section",
          "pricing-section",
          "cta-section",
          "footer-section",
        ],
      },
      {
        id: "features",
        name: "Features",
        path: "/features",
        sections: ["header-section", "features-section", "testimonial-section", "cta-section", "footer-section"],
      },
      {
        id: "pricing",
        name: "Pricing",
        path: "/pricing",
        sections: ["header-section", "pricing-section", "cta-section", "footer-section"],
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
        primaryColor: "#6c5ce7",
        secondaryColor: "#f8f9fa",
        fontFamily: "'Poppins', sans-serif",
      },
    },
  }
}

export default landingTemplate
