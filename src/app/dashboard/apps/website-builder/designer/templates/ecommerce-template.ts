export const ecommerceTemplate = (projectName: string) => {
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
              subtitle: "Online Store",
              showNav: true,
              navItems: [
                { label: "Home", link: "#" },
                { label: "Shop", link: "#" },
                { label: "Categories", link: "#" },
                { label: "Cart", link: "#" },
                { label: "Account", link: "#" },
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
        id: "hero-section",
        name: "Hero Section",
        elements: [
          {
            id: "hero-element",
            type: "hero",
            content: {
              heading: "New Collection",
              subheading: "Discover our latest products with special offers",
              buttonText: "Shop Now",
              buttonLink: "#",
              src: "/placeholder.svg?height=600&width=1200",
              alt: "E-commerce Hero Image",
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
        id: "featured-products-section",
        name: "Featured Products Section",
        elements: [
          {
            id: "products-heading",
            type: "heading",
            content: {
              text: "Featured Products",
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
            id: "products-grid",
            type: "cyber-grid:cg-10",
            content: {
              items: ["Product 1 - $99", "Product 2 - $149", "Product 3 - $79", "Product 4 - $129"],
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
            type: "cyber-button:cb-8",
            content: {
              buttonText: "View All Products",
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
        id: "promo-section",
        name: "Promotional Section",
        elements: [
          {
            id: "promo-card",
            type: "cyber-card:cc-8",
            content: {
              title: "Special Offer",
              text: "Get 20% off on all products with code: SPECIAL20",
              src: "/placeholder.svg?height=300&width=600",
            },
            style: {
              x: 100,
              y: 50,
              width: "80%",
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
              text: "Shop by Category",
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
            id: "category-1",
            type: "cyber-card:cc-5",
            content: {
              title: "Category 1",
              text: "Explore our collection",
              src: "/placeholder.svg?height=200&width=200",
            },
            style: {
              x: 100,
              y: 100,
              width: "25%",
            },
          },
          {
            id: "category-2",
            type: "cyber-card:cc-5",
            content: {
              title: "Category 2",
              text: "Explore our collection",
              src: "/placeholder.svg?height=200&width=200",
            },
            style: {
              x: 450,
              y: 100,
              width: "25%",
            },
          },
          {
            id: "category-3",
            type: "cyber-card:cc-5",
            content: {
              title: "Category 3",
              text: "Explore our collection",
              src: "/placeholder.svg?height=200&width=200",
            },
            style: {
              x: 800,
              y: 100,
              width: "25%",
            },
          },
        ],
      },
      {
        id: "newsletter-section",
        name: "Newsletter Section",
        elements: [
          {
            id: "newsletter-heading",
            type: "heading",
            content: {
              text: "Subscribe to Our Newsletter",
              level: "h2",
            },
            style: {
              textColor: "#333333",
              fontSize: "28px",
              fontWeight: "bold",
              textAlign: "center",
              x: 0,
              y: 20,
              width: "100%",
            },
          },
          {
            id: "newsletter-text",
            type: "paragraph",
            content: {
              text: "Stay updated with our latest products and special offers.",
            },
            style: {
              textColor: "#666666",
              fontSize: "16px",
              textAlign: "center",
              x: 300,
              y: 70,
              width: "40%",
            },
          },
          {
            id: "newsletter-button",
            type: "cyber-button:cb-3",
            content: {
              buttonText: "Subscribe Now",
              buttonLink: "#",
            },
            style: {
              x: 400,
              y: 120,
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
                { platform: "facebook", link: "#" },
                { platform: "instagram", link: "#" },
                { platform: "twitter", link: "#" },
              ],
              address: "123 Shop St, City, Country",
              phone: "+1 234 567 890",
              email: "shop@example.com",
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
      fontFamily: "'Open Sans', sans-serif",
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
          "featured-products-section",
          "promo-section",
          "categories-section",
          "newsletter-section",
          "footer-section",
        ],
      },
      {
        id: "shop",
        name: "Shop",
        path: "/shop",
        sections: ["header-section", "featured-products-section", "categories-section", "footer-section"],
      },
      {
        id: "product",
        name: "Product Detail",
        path: "/product",
        sections: ["header-section", "promo-section", "newsletter-section", "footer-section"],
      },
      {
        id: "cart",
        name: "Shopping Cart",
        path: "/cart",
        sections: ["header-section", "footer-section"],
      },
    ],
    settings: {
      siteName: projectName,
      favicon: "",
      theme: {
        primaryColor: "#4a6cf7",
        secondaryColor: "#f8f9fa",
        fontFamily: "'Open Sans', sans-serif",
      },
    },
  }
}

export default ecommerceTemplate
