export const portfolioTemplate = (projectName: string) => {
  return {
    sections: [
      {
        id: "header-section",
        name: "Header Section",
        elements: [
          {
            id: "header-element",
            type: "header",
            content: {
              title: projectName,
              subtitle: "Creative Portfolio",
              showNav: true,
              navItems: [
                { label: "Home", link: "#" },
                { label: "Portfolio", link: "#" },
                { label: "About", link: "#" },
                { label: "Contact", link: "#" },
              ],
            },
            style: {
              backgroundColor: "#000000",
              textColor: "#ffffff",
              padding: "20px",
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
              heading: "Creative Works",
              subheading: "Showcasing my best projects and designs",
              buttonText: "View Portfolio",
              buttonLink: "#",
              src: "/placeholder.svg?height=600&width=1200",
              alt: "Portfolio Hero Image",
            },
            style: {
              backgroundColor: "#111111",
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
        id: "portfolio-section",
        name: "Portfolio Section",
        elements: [
          {
            id: "portfolio-heading",
            type: "heading",
            content: {
              text: "My Projects",
              level: "h2",
            },
            style: {
              textColor: "#ffffff",
              fontSize: "32px",
              fontWeight: "bold",
              textAlign: "center",
              x: 0,
              y: 20,
              width: "100%",
            },
          },
          {
            id: "portfolio-grid",
            type: "cyber-grid:cg-1",
            content: {
              items: ["Project 1", "Project 2", "Project 3", "Project 4"],
            },
            style: {
              x: 100,
              y: 100,
              width: "80%",
              height: "400px",
            },
          },
          {
            id: "portfolio-description",
            type: "paragraph",
            content: {
              text: "These are some of my recent projects. Each one represents a unique challenge and creative solution.",
            },
            style: {
              textColor: "#cccccc",
              fontSize: "16px",
              textAlign: "center",
              x: 200,
              y: 520,
              width: "60%",
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
              text: "About Me",
              level: "h2",
            },
            style: {
              textColor: "#ffffff",
              fontSize: "32px",
              fontWeight: "bold",
              x: 50,
              y: 20,
            },
          },
          {
            id: "about-card",
            type: "cyber-card:cc-2",
            content: {
              title: "Creative Professional",
              text: "I'm a creative professional with expertise in design and development. With over 5 years of experience, I've worked on a variety of projects for clients across different industries.",
              src: "/placeholder.svg?height=300&width=300",
            },
            style: {
              x: 50,
              y: 80,
              width: "40%",
            },
          },
          {
            id: "skills-server",
            type: "cyber-server:cs-1",
            content: {
              name: "SKILLS",
              status: "ONLINE",
            },
            style: {
              x: 600,
              y: 80,
              width: "40%",
            },
          },
        ],
      },
      {
        id: "contact-section",
        name: "Contact Section",
        elements: [
          {
            id: "contact-heading",
            type: "heading",
            content: {
              text: "Get In Touch",
              level: "h2",
            },
            style: {
              textColor: "#ffffff",
              fontSize: "32px",
              fontWeight: "bold",
              textAlign: "center",
              x: 0,
              y: 20,
              width: "100%",
            },
          },
          {
            id: "contact-card",
            type: "cyber-card:cc-10",
            content: {
              title: "Contact Information",
              text: "Email: contact@example.com\nPhone: +1 234 567 890\nLocation: City, Country",
            },
            style: {
              x: 300,
              y: 100,
              width: "50%",
            },
          },
          {
            id: "contact-button",
            type: "cyber-button:cb-5",
            content: {
              buttonText: "Send Message",
              buttonLink: "#",
            },
            style: {
              x: 400,
              y: 250,
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
                { platform: "instagram", link: "#" },
                { platform: "dribbble", link: "#" },
                { platform: "linkedin", link: "#" },
              ],
            },
            style: {
              backgroundColor: "#000000",
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
      fontFamily: "'Montserrat', sans-serif",
      backgroundColor: "#111111",
      textColor: "#ffffff",
    },
    pages: [
      {
        id: "home",
        name: "Home",
        path: "/",
        sections: [
          "header-section",
          "hero-section",
          "portfolio-section",
          "about-section",
          "contact-section",
          "footer-section",
        ],
      },
      {
        id: "portfolio",
        name: "Portfolio",
        path: "/portfolio",
        sections: ["header-section", "portfolio-section", "footer-section"],
      },
      {
        id: "about",
        name: "About",
        path: "/about",
        sections: ["header-section", "about-section", "footer-section"],
      },
      {
        id: "contact",
        name: "Contact",
        path: "/contact",
        sections: ["header-section", "contact-section", "footer-section"],
      },
    ],
    settings: {
      siteName: projectName,
      favicon: "",
      theme: {
        primaryColor: "#ff3366",
        secondaryColor: "#111111",
        fontFamily: "'Montserrat', sans-serif",
      },
    },
  }
}

export default portfolioTemplate
