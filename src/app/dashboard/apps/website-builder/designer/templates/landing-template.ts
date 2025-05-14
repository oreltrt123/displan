import "../styles/landing-template-styles.css"

export const landingTemplate = (projectName: string) => {
  return {
    sections: [
      {
        id: "header-section",
        name: "Header Section",
        elements: [
          {
            id: "header-element",
            type: "navbar",
            content: {
              logo: {
                text: "frankie",
                icon: "flower",
              },
              navItems: [
                { label: "Home", link: "#" },
                { label: "Features", link: "#features" },
                { label: "Pricing", link: "#pricing" },
                { label: "Blog", link: "#" },
              ],
              ctaButton: {
                text: "Get the Template",
                link: "#",
              },
            },
            style: {
              backgroundColor: "#121212",
              textColor: "#ffffff",
              padding: "16px 24px",
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
            id: "hero-badge",
            type: "badge",
            content: {
              text: "Unique Technology",
              variant: "custom",
            },
            style: {
              x: 0,
              y: 20,
              width: "100%",
              textAlign: "center",
            },
          },
          {
            id: "hero-heading",
            type: "heading",
            content: {
              text: "Unleash the Power of AI",
              level: "h1",
            },
            style: {
              textColor: "#ffffff",
              fontSize: "64px",
              fontWeight: "bold",
              textAlign: "center",
              x: 0,
              y: 60,
              width: "100%",
            },
          },
          {
            id: "hero-subheading",
            type: "paragraph",
            content: {
              text: "Frankie is an AI-powered chatbot app that allows users to have conversations with a virtual assistant.",
            },
            style: {
              textColor: "#ffffff",
              fontSize: "20px",
              textAlign: "center",
              x: 0,
              y: 130,
              width: "100%",
              maxWidth: "700px",
              margin: "0 auto",
            },
          },
          {
            id: "hero-form",
            type: "hero-form",
            content: {
              placeholder: "E-mail address...",
              buttonText: "Get Notified",
              buttonLink: "#",
            },
            style: {
              x: 0,
              y: 200,
              width: "100%",
              maxWidth: "500px",
              margin: "0 auto",
            },
          },
          {
            id: "hero-mockups",
            type: "hero-mockups",
            content: {
              desktopSrc: "/placeholder.svg?height=400&width=600",
              mobileSrc: "/placeholder.svg?height=500&width=250",
            },
            style: {
              x: 0,
              y: 300,
              width: "100%",
            },
          },
        ],
        style: {
          backgroundColor: "#121212",
          padding: "80px 0 120px",
          position: "relative",
          overflow: "hidden",
        },
      },
      {
        id: "features-section",
        name: "Features Section",
        elements: [
          {
            id: "features-badge",
            type: "badge",
            content: {
              text: "Features",
              variant: "light",
            },
            style: {
              x: 0,
              y: 20,
              width: "100%",
              textAlign: "center",
            },
          },
          {
            id: "features-heading",
            type: "heading",
            content: {
              text: "Revolutionize Your Workflow",
              level: "h2",
            },
            style: {
              textColor: "#333333",
              fontSize: "48px",
              fontWeight: "bold",
              textAlign: "center",
              x: 0,
              y: 60,
              width: "100%",
            },
          },
          {
            id: "feature-1",
            type: "feature-card",
            content: {
              title: "24/7 Data Collection",
              text: "By analyzing user interactions, chat AI can help businesses identify trends and patterns, making it easier to tailor products.",
              icon: "database",
              mockupSrc: "/templates/data.png",
              mockupAlt: "Data Collection Feature",
            },
            style: {
              x: 0,
              y: 150,
              width: "100%",
            },
          },
          {
            id: "feature-2",
            type: "feature-card",
            content: {
              title: "Personalization",
              text: "This could include addressing the user by name, offering customized product recommendations, or remembering previous preferences.",
              icon: "user",
              mockupSrc: "/placeholder.svg?height=300&width=400",
              mockupAlt: "Personalization Feature",
              buttonText: "Get Started",
              buttonLink: "#",
            },
            style: {
              x: 0,
              y: 450,
              width: "100%",
            },
          },
          {
            id: "feature-3",
            type: "feature-card",
            content: {
              title: "More Accurate Responses",
              text: "This advantage emphasizes how chat AI can provide faster and more accurate responses to user inquiries.",
              icon: "check-circle",
              mockupSrc: "/placeholder.svg?height=300&width=400",
              mockupAlt: "Accurate Responses Feature",
              buttonText: "Get Started",
              buttonLink: "#",
              queryExamples: [
                "How do I make HTTP request in Javascript?",
                "Explain quantum computing",
                "How do I make HTTP request?",
              ],
            },
            style: {
              x: 0,
              y: 750,
              width: "100%",
            },
          },
        ],
      },
      {
        id: "testimonial-section",
        name: "Testimonial Section",
        elements: [
          {
            id: "testimonial-badge",
            type: "badge",
            content: {
              text: "Testimonials",
              variant: "light",
            },
            style: {
              x: 0,
              y: 20,
              width: "100%",
              textAlign: "center",
            },
          },
          {
            id: "testimonial-heading",
            type: "heading",
            content: {
              text: "What Customers Say",
              level: "h2",
            },
            style: {
              textColor: "#333333",
              fontSize: "48px",
              fontWeight: "bold",
              textAlign: "center",
              x: 0,
              y: 60,
              width: "100%",
            },
          },
          {
            id: "testimonial-subheading",
            type: "paragraph",
            content: {
              text: "Read what our satisfied customers have to say about our products/services. We take pride in providing exceptional customer service and value their feedback.",
            },
            style: {
              textColor: "#666666",
              fontSize: "18px",
              textAlign: "center",
              x: 0,
              y: 130,
              width: "100%",
              maxWidth: "800px",
              margin: "0 auto",
            },
          },
          {
            id: "testimonial-card-1",
            type: "testimonial-card",
            content: {
              quote:
                "I recently used an AI chat system and it exceeded my expectations. The speed and accuracy of the responses were impressive, and the personalized recommendations were a nice touch. I highly recommend it to anyone looking to streamline their communication process",
              author: "Derek Johnson",
              position: "VP of Engineering at Facebook",
              avatarSrc: "/placeholder.svg?height=100&width=100",
              rating: 5,
            },
            style: {
              x: 100,
              y: 200,
              width: "45%",
            },
          },
          {
            id: "testimonial-card-2",
            type: "testimonial-card",
            content: {
              quote:
                "I recently used an AI chat system and it exceeded my expectations. The speed and accuracy of the responses were impressive, and the personalized recommendations were a nice touch. I highly recommend it to anyone looking to streamline their communication process",
              author: "Sarah Miller",
              position: "Marketing Director",
              avatarSrc: "/placeholder.svg?height=100&width=100",
              rating: 4,
            },
            style: {
              x: 600,
              y: 200,
              width: "45%",
            },
          },
        ],
        style: {
          backgroundColor: "#f8f9fe",
          padding: "80px 0",
        },
      },
      {
        id: "pricing-section",
        name: "Pricing Section",
        elements: [
          {
            id: "pricing-badge",
            type: "badge",
            content: {
              text: "Pricing Plan",
              variant: "light",
            },
            style: {
              x: 0,
              y: 20,
              width: "100%",
              textAlign: "center",
            },
          },
          {
            id: "pricing-heading",
            type: "heading",
            content: {
              text: "Choose Your Best Plan",
              level: "h2",
            },
            style: {
              textColor: "#333333",
              fontSize: "48px",
              fontWeight: "bold",
              textAlign: "center",
              x: 0,
              y: 60,
              width: "100%",
            },
          },
          {
            id: "pricing-cards",
            type: "pricing-cards",
            content: {
              plans: [
                {
                  name: "Basic",
                  price: "$29.99",
                  period: "Per user, per month",
                  features: ["AI-powered chatbot", "Up to 500 interactions per month", "Email support"],
                  buttonText: "Choose Plan",
                  buttonLink: "#",
                  popular: false,
                },
                {
                  name: "Premium",
                  price: "$239.99",
                  period: "Per user, per month",
                  features: [
                    "AI-powered chatbot",
                    "Up to 10,000 interactions per month",
                    "Email support",
                    "24/7 File archive",
                  ],
                  buttonText: "Get Started",
                  buttonLink: "#",
                  popular: true,
                  badge: "Premium",
                },
                {
                  name: "Standard",
                  price: "$89.99",
                  period: "Per user, per month",
                  features: ["AI-powered chatbot", "Up to 2500 interactions per month", "Chat and email support"],
                  buttonText: "Get Started",
                  buttonLink: "#",
                  popular: false,
                },
              ],
            },
            style: {
              x: 100,
              y: 150,
              width: "80%",
            },
          },
        ],
      },
      {
        id: "faq-section",
        name: "FAQ Section",
        elements: [
          {
            id: "faq-badge",
            type: "badge",
            content: {
              text: "FAQ",
              variant: "light",
            },
            style: {
              x: 0,
              y: 20,
              width: "100%",
              textAlign: "center",
            },
          },
          {
            id: "faq-heading",
            type: "heading",
            content: {
              text: "Frequently Asked Questions",
              level: "h2",
            },
            style: {
              textColor: "#333333",
              fontSize: "48px",
              fontWeight: "bold",
              textAlign: "center",
              x: 0,
              y: 60,
              width: "100%",
            },
          },
          {
            id: "faq-accordion",
            type: "accordion",
            content: {
              items: [
                {
                  question: "What is an AI chat app?",
                  answer:
                    "An AI chat app is a software application that uses artificial intelligence to simulate conversation with human users. It can understand natural language, learn from interactions, and provide relevant responses to user queries.",
                },
                {
                  question: "How does an AI chat app work?",
                  answer:
                    "AI chat apps use natural language processing (NLP) and machine learning algorithms to understand and respond to user inputs. They analyze the text, identify intent, and generate appropriate responses based on their training data and programming.",
                },
                {
                  question: "What are the benefits of using an AI chat app?",
                  answer:
                    "AI chat apps offer 24/7 availability, consistent responses, ability to handle multiple conversations simultaneously, personalization based on user data, and cost-effectiveness compared to human customer service representatives.",
                },
                {
                  question: "Can I customize my AI chat app?",
                  answer:
                    "Yes, most AI chat apps allow for customization of appearance, tone, responses, and knowledge base. You can train them on your specific industry terminology and frequently asked questions.",
                },
                {
                  question: "How do I integrate an AI chat app into my website or app?",
                  answer:
                    "Integration typically involves adding a code snippet to your website or using an API to connect the AI chat service to your application. Most providers offer documentation and support for the integration process.",
                },
                {
                  question: "How secure is the user data collected by the AI chat app?",
                  answer:
                    "Security depends on the specific provider, but reputable AI chat services implement encryption, data anonymization, and compliance with privacy regulations like GDPR. Always review the privacy policy of your chosen provider.",
                },
              ],
            },
            style: {
              x: 100,
              y: 150,
              width: "80%",
            },
          },
        ],
        style: {
          backgroundColor: "#f8f9fe",
          padding: "80px 0",
        },
      },
      {
        id: "cta-section",
        name: "Call to Action Section",
        elements: [
          {
            id: "cta-heading",
            type: "heading",
            content: {
              text: "The Future is Now, Old Man.",
              level: "h2",
            },
            style: {
              textColor: "#ffffff",
              fontSize: "56px",
              fontWeight: "bold",
              x: 100,
              y: 50,
              width: "60%",
            },
          },
          {
            id: "cta-text",
            type: "paragraph",
            content: {
              text: "Frankie is an AI-powered chatbot app that allows users to have conversations with a virtual assistant.",
            },
            style: {
              textColor: "#ffffff",
              fontSize: "20px",
              x: 100,
              y: 150,
              width: "60%",
            },
          },
          {
            id: "cta-button",
            type: "modern-button",
            content: {
              buttonText: "Download for Mac",
              buttonLink: "#",
            },
            style: {
              x: 100,
              y: 220,
              width: "200px",
            },
          },
        ],
        style: {
          backgroundColor: "#121212",
          padding: "100px 0",
        },
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
              backgroundColor: "#121212",
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
      fontFamily: "'Inter', sans-serif",
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
          "faq-section",
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
        sections: ["header-section", "pricing-section", "faq-section", "cta-section", "footer-section"],
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
        primaryColor: "#cff245", // Lime green accent color from specifications
        secondaryColor: "#121212", // Dark background
        fontFamily: "'Inter', sans-serif",
      },
    },
    styles: `
      /* Global Styles */
      :root {
        --primary-color: #cff245;
        --secondary-color: #121212;
        --text-color: #333333;
        --text-color-light: #666666;
        --text-color-dark: #ffffff;
        --background-color: #ffffff;
        --background-color-alt: #f8f9fe;
        --border-radius: 13px;
        --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
        --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0, 0, 0, 0.05);
        --font-family: "Inter", Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
      }
      
      body {
        font-family: var(--font-family);
        -webkit-font-smoothing: antialiased;
        margin: 0;
        padding: 0;
      }
      
      /* Animations */
      @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slide-up {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      /* Section Animations */
      .section {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
      }
      
      .section.visible {
        opacity: 1;
        transform: translateY(0);
      }
      
      /* Navbar Styles */
      .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 24px;
        background-color: var(--secondary-color);
        position: sticky;
        top: 0;
        z-index: 1000;
      }
      
      .navbar-logo {
        display: flex;
        align-items: center;
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-color-dark);
      }
      
      .navbar-logo .icon {
        margin-right: 0.5rem;
        color: var(--primary-color);
      }
      
      .navbar-links {
        display: flex;
        gap: 2rem;
      }
      
      .navbar-link {
        color: var(--text-color-dark);
        text-decoration: none;
        transition: color 0.2s ease;
      }
      
      .navbar-link:hover {
        color: var(--primary-color);
      }
      
      .navbar-cta {
        display: flex;
        align-items: flex-start;
        background-image: linear-gradient(-18.2429deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.08) 100%);
        border-radius: 13px;
        padding: 12px 18px;
        color: rgb(0, 0, 238);
        cursor: pointer;
        font-family: sans-serif;
        font-size: 12px;
        transition: all 0.2s ease;
      }
      
      .navbar-cta:hover {
        background-image: linear-gradient(-18.2429deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.15) 100%);
      }
      
      /* Hero Section */
      .hero-section {
        background-color: var(--secondary-color);
        padding: 80px 20px;
        text-align: center;
        position: relative;
        overflow: hidden;
      }
      
      .hero-section::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at top right, rgba(207, 242, 69, 0.1), transparent 70%);
        z-index: 0;
      }
      
      .hero-content {
        position: relative;
        z-index: 1;
        max-width: 1200px;
        margin: 0 auto;
      }
      
      .hero-badge {
        display: inline-block;
        padding: 6px 12px;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: var(--border-radius);
        font-size: 14px;
        font-weight: 500;
        color: var(--text-color-dark);
        margin-bottom: 24px;
      }
      
      .hero-heading {
        font-size: 64px;
        font-weight: 700;
        color: var(--text-color-dark);
        margin-bottom: 24px;
        line-height: 1.1;
      }
      
      .hero-subheading {
        font-size: 20px;
        color: var(--text-color-dark);
        margin-bottom: 40px;
        max-width: 700px;
        margin-left: auto;
        margin-right: auto;
      }
      
      .hero-form {
        display: flex;
        max-width: 500px;
        margin: 0 auto 60px;
        gap: 12px;
      }
      
      .hero-input {
        flex: 1;
        appearance: none;
        background-color: rgba(235, 235, 235, 0.05);
        border: none;
        border-radius: 13px;
        box-shadow: rgb(238, 68, 68) 0px 0px 0px 1px inset;
        color: #ffffff;
        font-family: var(--font-family);
        font-size: 14px;
        font-weight: 400;
        padding: 12px;
        width: 100%;
        box-sizing: border-box;
      }
      
      .hero-input:focus {
        outline: none;
        box-shadow: rgb(207, 242, 69) 0px 0px 0px 1px inset;
      }
      
      .hero-button {
        appearance: none;
        background-color: rgb(207, 242, 69);
        border: none;
        border-radius: 13px;
        color: rgb(13, 14, 17);
        cursor: pointer;
        display: inline-block;
        font-family: var(--font-family);
        font-size: 14px;
        font-weight: 600;
        padding: 12px;
        text-align: center;
        user-select: none;
        white-space: nowrap;
        will-change: transform;
        transition: transform 0.2s ease;
      }
      
      .hero-button:hover {
        transform: translateY(-2px);
      }
      
      .hero-mockups {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        gap: 40px;
        margin-top: 60px;
      }
      
      .desktop-mockup {
        max-width: 600px;
        width: 100%;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
      }
      
      .mobile-mockup {
        max-width: 250px;
        width: 100%;
        height: auto;
        border-radius: 16px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
      }
      
      /* Badge Styles */
      .badge {
        display: inline-block;
        padding: 6px 12px;
        border-radius: var(--border-radius);
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 16px;
      }
      
      .badge-light {
        background-color: #f3f4f6;
        color: #111827;
      }
      
      .badge-dark {
        background-color: #111827;
        color: #f3f4f6;
      }
      
      .badge-primary {
        background-color: var(--primary-color);
        color: #111827;
      }
      
      .badge-custom {
        background-color: rgba(255, 255, 255, 0.1);
        color: var(--text-color-dark);
      }
      
      /* Feature Card Styles */
      .features-section {
        padding: 100px 20px;
        max-width: 1200px;
        margin: 0 auto;
      }
      
      .feature-card {
        background-color: #ffffff;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-md);
        padding: 40px;
        margin-bottom: 60px;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      
      .feature-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-lg);
      }
      
      .feature-header {
        display: flex;
        align-items: center;
        margin-bottom: 24px;
      }
      
      .feature-icon-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        background-color: rgba(207, 242, 69, 0.1);
        border-radius: 50%;
        margin-right: 16px;
      }
      
      .feature-icon {
        color: var(--primary-color);
      }
      
      .feature-title {
        font-size: 24px;
        font-weight: 600;
        color: var(--text-color);
      }
      
      .feature-content {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
      
      .feature-text {
        font-size: 16px;
        line-height: 1.6;
        color: var(--text-color-light);
      }
      
      .feature-button {
        appearance: none;
        background-color: rgb(207, 242, 69);
        border: none;
        border-radius: 13px;
        color: rgb(13, 14, 17);
        cursor: pointer;
        display: inline-block;
        font-family: var(--font-family);
        font-size: 14px;
        font-weight: 600;
        padding: 12px;
        text-align: center;
        user-select: none;
        white-space: nowrap;
        will-change: transform;
        transition: transform 0.2s ease;
        align-self: flex-start;
      }
      
      .feature-button:hover {
        transform: translateY(-2px);
      }
      
      .feature-image {
        width: 100%;
        height: auto;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-sm);
      }
      
      .feature-queries {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 24px;
      }
      
      .feature-query {
        padding: 8px 16px;
        background-color: rgba(207, 242, 69, 0.1);
        color: var(--text-color);
        border-radius: 9999px;
        font-size: 14px;
      }
      
      /* Testimonial Styles */
      .testimonial-section {
        padding: 100px 20px;
        background-color: var(--background-color-alt);
      }
      
      .testimonial-container {
        max-width: 1200px;
        margin: 0 auto;
      }
      
      .testimonial-cards {
        display: flex;
        flex-wrap: wrap;
        gap: 30px;
        justify-content: center;
        margin-top: 60px;
      }
      
      .testimonial-card {
        background-color: #ffffff;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-md);
        padding: 30px;
        flex: 1;
        min-width: 300px;
        max-width: 500px;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      
      .testimonial-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-lg);
      }
      
      .testimonial-quote {
        font-size: 16px;
        line-height: 1.6;
        color: var(--text-color);
        margin-bottom: 24px;
      }
      
      .testimonial-author {
        display: flex;
        align-items: center;
      }
      
      .testimonial-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        margin-right: 16px;
        object-fit: cover;
      }
      
      .testimonial-info {
        display: flex;
        flex-direction: column;
      }
      
      .testimonial-name {
        font-weight: 600;
        color: var(--text-color);
      }
      
      .testimonial-position {
        font-size: 14px;
        color: var(--text-color-light);
      }
      
      .testimonial-rating {
        display: flex;
        margin-top: 16px;
      }
      
      .rating-star {
        color: #ffc107;
        margin-right: 4px;
      }
      
      /* Pricing Section */
      .pricing-section {
        padding: 100px 20px;
        max-width: 1200px;
        margin: 0 auto;
      }
      
      .pricing-container {
        display: flex;
        flex-wrap: wrap;
        gap: 30px;
        justify-content: center;
        margin-top: 60px;
      }
      
      .pricing-card {
        background-color: #ffffff;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-md);
        padding: 40px;
        flex: 1;
        min-width: 280px;
        max-width: 350px;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        position: relative;
      }
      
      .pricing-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-lg);
      }
      
      .pricing-card.popular {
        background-color: var(--secondary-color);
        color: var(--text-color-dark);
        transform: scale(1.05);
        z-index: 1;
      }
      
      .pricing-card.popular:hover {
        transform: scale(1.05) translateY(-5px);
      }
      
      .pricing-badge {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        background-color: var(--primary-color);
        color: var(--secondary-color);
        text-align: center;
        padding: 8px;
        border-radius: var(--border-radius) var(--border-radius) 0 0;
        font-weight: 600;
        font-size: 14px;
      }
      
      .pricing-name {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 16px;
        text-align: center;
      }
      
      .pricing-price {
        font-size: 48px;
        font-weight: 700;
        text-align: center;
        margin-bottom: 8px;
      }
      
      .pricing-period {
        font-size: 14px;
        color: var(--text-color-light);
        text-align: center;
        margin-bottom: 32px;
      }
      
      .pricing-card.popular .pricing-period {
        color: rgba(255, 255, 255, 0.7);
      }
      
      .pricing-features {
        margin-bottom: 32px;
      }
      
      .pricing-feature {
        display: flex;
        align-items: center;
        margin-bottom: 16px;
      }
      
      .pricing-feature-icon {
        margin-right: 12px;
        color: var(--primary-color);
      }
      
      .pricing-button {
        appearance: none;
        background-color: rgb(207, 242, 69);
        border: none;
        border-radius: 13px;
        color: rgb(13, 14, 17);
        cursor: pointer;
        display: block;
        width: 100%;
        font-family: var(--font-family);
        font-size: 14px;
        font-weight: 600;
        padding: 12px;
        text-align: center;
        user-select: none;
        white-space: nowrap;
        will-change: transform;
        transition: transform 0.2s ease;
      }
      
      .pricing-button:hover {
        transform: translateY(-2px);
      }
      
      /* FAQ Section */
      .faq-section {
        padding: 100px 20px;
        background-color: var(--background-color-alt);
      }
      
      .faq-container {
        max-width: 800px;
        margin: 0 auto;
      }
      
      .accordion {
        margin-top: 60px;
      }
      
      .accordion-item {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        padding: 24px 0;
      }
      
      .accordion-button {
        width: 100%;
        text-align: left;
        background: none;
        border: none;
        padding: 0;
        font-size: 18px;
        font-weight: 600;
        color: var(--text-color);
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .accordion-icon {
        transition: transform 0.3s ease;
      }
      
      .accordion-item.open .accordion-icon {
        transform: rotate(180deg);
      }
      
      .accordion-content {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
      }
      
      .accordion-item.open .accordion-content {
        max-height: 500px;
      }
      
      .accordion-answer {
        padding-top: 16px;
        color: var(--text-color-light);
        line-height: 1.6;
      }
      
      /* CTA Section */
      .cta-section {
        background-color: var(--secondary-color);
        padding: 100px 20px;
        position: relative;
        overflow: hidden;
      }
      
      .cta-section::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at bottom left, rgba(207, 242, 69, 0.1), transparent 70%);
        z-index: 0;
      }
      
      .cta-container {
        max-width: 1200px;
        margin: 0 auto;
        position: relative;
        z-index: 1;
      }
      
      .cta-heading {
        font-size: 56px;
        font-weight: 700;
        color: var(--text-color-dark);
        margin-bottom: 24px;
        line-height: 1.1;
        max-width: 800px;
      }
      
      .cta-text {
        font-size: 20px;
        color: var(--text-color-dark);
        margin-bottom: 40px;
        max-width: 600px;
      }
      
      .cta-button {
        appearance: none;
        background-color: rgb(207, 242, 69);
        border: none;
        border-radius: 13px;
        color: rgb(13, 14, 17);
        cursor: pointer;
        display: inline-block;
        font-family: var(--font-family);
        font-size: 14px;
        font-weight: 600;
        padding: 12px 24px;
        text-align: center;
        user-select: none;
        white-space: nowrap;
        will-change: transform;
        transition: transform 0.2s ease;
      }
      
      .cta-button:hover {
        transform: translateY(-2px);
      }
      
      /* Footer Styles */
      .footer {
        background-color: var(--secondary-color);
        color: var(--text-color-dark);
        padding: 60px 20px 40px;
      }
      
      .footer-container {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 40px;
      }
      
      .footer-logo {
        display: flex;
        align-items: center;
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 16px;
      }
      
      .footer-logo .icon {
        margin-right: 0.5rem;
        color: var(--primary-color);
      }
      
      .footer-info {
        max-width: 300px;
      }
      
      .footer-description {
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 24px;
      }
      
      .footer-social {
        display: flex;
        gap: 16px;
      }
      
      .social-icon {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        transition: all 0.2s ease;
      }
      
      .social-icon:hover {
        background-color: var(--primary-color);
        color: var(--secondary-color);
      }
      
      .footer-links {
        display: flex;
        flex-wrap: wrap;
        gap: 60px;
      }
      
      .footer-column {
        min-width: 160px;
      }
      
      .footer-column-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 20px;
      }
      
      .footer-column-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      
      .footer-column-item {
        margin-bottom: 12px;
      }
      
      .footer-column-link {
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
        transition: color 0.2s ease;
      }
      
      .footer-column-link:hover {
        color: var(--primary-color);
      }
      
      .footer-bottom {
        margin-top: 60px;
        padding-top: 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 20px;
      }
      
      .footer-copyright {
        color: rgba(255, 255, 255, 0.7);
        font-size: 14px;
      }
      
      .footer-legal {
        display: flex;
        gap: 24px;
      }
      
      .footer-legal-link {
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
        font-size: 14px;
        transition: color 0.2s ease;
      }
      
      .footer-legal-link:hover {
        color: var(--primary-color);
      }
      
      /* Modern Button */
      .modern-button {
        appearance: none;
        background-color: rgb(207, 242, 69);
        border: none;
        border-radius: 13px;
        color: rgb(13, 14, 17);
        cursor: pointer;
        display: inline-block;
        font-family: var(--font-family);
        font-size: 14px;
        font-weight: 600;
        padding: 12px 24px;
        text-align: center;
        user-select: none;
        white-space: nowrap;
        will-change: transform;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      
      .modern-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(207, 242, 69, 0.4);
      }
      
      /* Responsive Styles */
      @media (max-width: 1200px) {
        .hero-heading, .cta-heading {
          font-size: 48px;
        }
        
        .section-heading {
          font-size: 40px;
        }
      }
      
      @media (max-width: 992px) {
        .hero-mockups {
          flex-direction: column;
          align-items: center;
          gap: 30px;
        }
        
        .desktop-mockup, .mobile-mockup {
          max-width: 100%;
        }
        
        .feature-content {
          flex-direction: column;
        }
        
        .pricing-container {
          flex-direction: column;
          align-items: center;
        }
        
        .pricing-card {
          width: 100%;
          max-width: 400px;
        }
        
        .pricing-card.popular {
          transform: scale(1);
        }
        
        .pricing-card.popular:hover {
          transform: translateY(-5px);
        }
      }
      
      @media (max-width: 768px) {
        .navbar {
          flex-direction: column;
          gap: 16px;
        }
        
        .navbar-links {
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        
        .hero-heading, .cta-heading {
          font-size: 36px;
        }
        
        .section-heading {
          font-size: 32px;
        }
        
        .hero-form {
          flex-direction: column;
          gap: 16px;
        }
        
        .testimonial-cards {
          flex-direction: column;
          align-items: center;
        }
        
        .testimonial-card {
          width: 100%;
        }
        
        .footer-container {
          flex-direction: column;
        }
        
        .footer-bottom {
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
      }
      
      @media (max-width: 480px) {
        .hero-heading, .cta-heading {
          font-size: 28px;
        }
        
        .section-heading {
          font-size: 24px;
        }
        
        .hero-subheading, .cta-text {
          font-size: 16px;
        }
        
        .pricing-price {
          font-size: 36px;
        }
      }
      
      /* Instagram-friendly mobile styles */
      @media (max-width: 414px) {
        body {
          overflow-x: hidden;
        }
        
        .hero-heading {
          font-size: 24px;
        }
        
        .hero-subheading {
          font-size: 14px;
        }
        
        .hero-form {
          width: 100%;
        }
        
        .feature-card, .testimonial-card, .pricing-card {
          padding: 20px;
        }
        
        .feature-title, .pricing-name {
          font-size: 20px;
        }
        
        .feature-text, .testimonial-quote {
          font-size: 14px;
        }
        
        .footer {
          padding: 40px 20px 20px;
        }
      }
    `,
  }
}

export default landingTemplate
