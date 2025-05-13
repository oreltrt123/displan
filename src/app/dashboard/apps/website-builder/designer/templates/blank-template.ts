export const blankTemplate = (projectName: string) => {
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
              subtitle: "Welcome to my website",
              showNav: true,
              navItems: [
                { label: "Home", link: "#" },
                { label: "About", link: "#" },
                { label: "Contact", link: "#" },
              ],
            },
            style: {
              backgroundColor: "#ffffff",
              textColor: "#000000",
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
              heading: "Welcome to My Website",
              subheading: "This is a blank template. Start building your website!",
              buttonText: "Learn More",
              buttonLink: "#",
              src: "/placeholder.svg?height=600&width=1200",
              alt: "Hero Image",
            },
            style: {
              backgroundColor: "#f5f5f5",
              textColor: "#333333",
              height: "500px",
              alignment: "center",
              x: 0,
              y: 0,
              width: "100%",
            },
          },
        ],
      },
      {
        id: "content-section",
        name: "Content Section",
        elements: [
          {
            id: "heading-element",
            type: "heading",
            content: {
              text: "About Us",
              level: "h2",
            },
            style: {
              textColor: "#333333",
              fontSize: "24px",
              fontWeight: "bold",
              x: 20,
              y: 20,
            },
          },
          {
            id: "paragraph-element",
            type: "paragraph",
            content: {
              text: "This is a sample paragraph. You can edit this text to add your own content. This blank template gives you the freedom to create your website exactly how you want it.",
            },
            style: {
              textColor: "#666666",
              fontSize: "16px",
              x: 20,
              y: 70,
              width: "80%",
            },
          },
          {
            id: "image-element",
            type: "image",
            content: {
              src: "/placeholder.svg?height=300&width=500",
              alt: "Sample Image",
            },
            style: {
              x: 20,
              y: 150,
              width: "50%",
              height: "auto",
              borderRadius: "8px",
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
              padding: "20px",
              x: 0,
              y: 0,
              width: "100%",
            },
          },
        ],
      },
    ],
    globalStyles: {
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#ffffff",
      textColor: "#333333",
    },
    pages: [
      {
        id: "home",
        name: "Home",
        path: "/",
        sections: ["header-section", "hero-section", "content-section", "footer-section"],
      },
      {
        id: "about",
        name: "About",
        path: "/about",
        sections: ["header-section", "content-section", "footer-section"],
      },
      {
        id: "contact",
        name: "Contact",
        path: "/contact",
        sections: ["header-section", "content-section", "footer-section"],
      },
    ],
    settings: {
      siteName: projectName,
      favicon: "",
      theme: {
        primaryColor: "#0066cc",
        secondaryColor: "#f5f5f5",
        fontFamily: "Arial, sans-serif",
      },
    },
  }
}
