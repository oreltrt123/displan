const blogTemplate = (projectName: string) => {
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
              subtitle: "Blog & Magazine",
              showNav: true,
              navItems: [
                { label: "Home", link: "#" },
                { label: "Articles", link: "#" },
                { label: "Categories", link: "#" },
                { label: "About", link: "#" },
                { label: "Contact", link: "#" },
              ],
            },
            style: {
              backgroundColor: "#ffffff",
              textColor: "#333333",
              padding: "20px",
              x: 0,
              y: 0,
              width: "100%",
            },
          },
        ],
      },
      {
        id: "featured-post-section",
        name: "Featured Post Section",
        elements: [
          {
            id: "featured-post-element",
            type: "hero",
            content: {
              heading: "Latest Article",
              subheading: "Discover our most recent and insightful content",
              buttonText: "Read More",
              buttonLink: "#",
              src: "/placeholder.svg?height=600&width=1200",
              alt: "Featured Post Image",
            },
            style: {
              backgroundColor: "#f8f9fa",
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
        id: "recent-posts-section",
        name: "Recent Posts Section",
        elements: [
          {
            id: "recent-posts-heading",
            type: "heading",
            content: {
              text: "Recent Articles",
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
            id: "posts-grid",
            type: "cyber-grid:cg-6",
            content: {
              items: [
                "Article 1: How to Get Started",
                "Article 2: Best Practices",
                "Article 3: Advanced Techniques",
                "Article 4: Case Studies",
              ],
            },
            style: {
              x: 100,
              y: 100,
              width: "80%",
              height: "400px",
            },
          },
          {
            id: "view-all-button",
            type: "cyber-button:cb-7",
            content: {
              buttonText: "View All Articles",
              buttonLink: "#",
            },
            style: {
              x: 400,
              y: 520,
              width: "20%",
            },
          },
        ],
      },
      {
        id: "categories-section",
        name: "Categories Section",
        elements: [
          {
            id: "categories-heading",
            type: "heading",
            content: {
              text: "Categories",
              level: "h2",
            },
            style: {
              textColor: "#333333",
              fontSize: "28px",
              fontWeight: "bold",
              x: 50,
              y: 20,
            },
          },
          {
            id: "categories-security",
            type: "cyber-security:cs-1",
            content: {
              name: "CATEGORIES",
              status: "ACTIVE",
            },
            style: {
              x: 50,
              y: 80,
              width: "40%",
            },
          },
          {
            id: "popular-posts-heading",
            type: "heading",
            content: {
              text: "Popular Posts",
              level: "h2",
            },
            style: {
              textColor: "#333333",
              fontSize: "28px",
              fontWeight: "bold",
              x: 600,
              y: 20,
            },
          },
          {
            id: "popular-posts-card",
            type: "cyber-card:cc-4",
            content: {
              title: "Top Articles",
              text: "1. Article Title One\n2. Article Title Two\n3. Article Title Three",
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
        id: "newsletter-section",
        name: "Newsletter Section",
        elements: [
          {
            id: "newsletter-card",
            type: "cyber-card:cc-4",
            content: {
              title: "Subscribe to Our Newsletter",
              text: "Get the latest articles and news delivered to your inbox",
              buttonText: "Subscribe",
              buttonLink: "#",
            },
            style: {
              x: 200,
              y: 50,
              width: "60%",
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
              address: "123 Blog St, City, Country",
              phone: "+1 234 567 890",
              email: "blog@example.com",
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
      fontFamily: "'Merriweather', serif",
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
          "featured-post-section",
          "recent-posts-section",
          "categories-section",
          "newsletter-section",
          "footer-section",
        ],
      },
      {
        id: "articles",
        name: "Articles",
        path: "/articles",
        sections: ["header-section", "recent-posts-section", "categories-section", "footer-section"],
      },
      {
        id: "article",
        name: "Article Detail",
        path: "/article",
        sections: ["header-section", "newsletter-section", "footer-section"],
      },
      {
        id: "about",
        name: "About",
        path: "/about",
        sections: ["header-section", "footer-section"],
      },
      {
        id: "contact",
        name: "Contact",
        path: "/contact",
        sections: ["header-section", "footer-section"],
      },
    ],
    settings: {
      siteName: projectName,
      favicon: "",
      theme: {
        primaryColor: "#6c5ce7",
        secondaryColor: "#f8f9fa",
        fontFamily: "'Merriweather', serif",
      },
    },
  }
}

export default blogTemplate
