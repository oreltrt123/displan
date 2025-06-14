export interface KnowledgeEntry {
  keywords: string[]
  response: string
}

export const displanKnowledgeBase: KnowledgeEntry[] = [
  {
    keywords: ["displan", "website builder", "platform"],
    response:
      "Displan is a powerful website builder platform that allows users to create professional websites with an intuitive drag-and-drop interface. It features a canvas-based editor where you can add various elements like text, buttons, images, and pre-designed templates. The platform is designed to be user-friendly while offering advanced customization options for more experienced users.",
  },
  {
    keywords: ["add element", "create element", "new element"],
    response:
      "To add elements to your canvas in Displan, you can either use the Elements panel in the left sidebar or ask me to create them for you. For example, you can say 'Add a red button with rounded corners' or 'Create a heading that says Welcome'. I'll create the element and add it to your current canvas.",
  },
  {
    keywords: ["button", "create button", "add button"],
    response:
      "Buttons are interactive elements that users can click to perform actions. In Displan, you can create buttons with various styles, colors, and sizes. You can customize properties like background color, text color, border radius, and animations. To add a button, you can ask me something like 'Add a blue button with rounded corners that says Submit'.",
  },
  {
    keywords: ["text", "heading", "paragraph", "add text"],
    response:
      "Text elements are essential for conveying information on your website. In Displan, you can add different types of text elements like headings, paragraphs, and labels. You can customize properties like font size, color, weight, and alignment. To add text, you can ask me something like 'Add a large heading that says Welcome to my Website' or 'Create a paragraph with gray text'.",
  },
  {
    keywords: ["image", "picture", "photo", "add image"],
    response:
      "Images help make your website visually appealing. In Displan, you can add image elements and customize their size, border, and other properties. You can upload your own images or use placeholder images. To add an image, you can ask me something like 'Add an image placeholder 300x200' or 'Create an image with rounded corners'.",
  },
  {
    keywords: ["template", "section", "component", "add template"],
    response:
      "Templates are pre-designed sections that you can add to your website. Displan offers various templates for common website sections like headers, heroes, features, testimonials, pricing, and more. You can customize these templates to match your brand. To add a template, you can ask me something like 'Add a hero section template' or 'Create a pricing section'.",
  },
  {
    keywords: ["style", "design", "customize", "appearance"],
    response:
      "Styling elements in Displan is easy. You can customize properties like colors, fonts, borders, shadows, and more. Each element has its own set of customizable properties that you can adjust in the Properties panel on the right sidebar. You can also ask me to create elements with specific styles, like 'Add a button with blue background and white text'.",
  },
  {
    keywords: ["animation", "animate", "motion", "transition"],
    response:
      "Animations can make your website more engaging. Displan supports various animations like fade in, slide in, bounce, zoom, rotate, and more. You can add animations to any element by selecting it and choosing an animation from the Properties panel. You can also ask me to create elements with specific animations, like 'Add a heading with fade in animation'.",
  },
  {
    keywords: ["responsive", "mobile", "tablet", "desktop"],
    response:
      "Displan creates responsive websites that look great on all devices. Elements automatically adjust to different screen sizes, but you can also customize how they appear on specific devices. You can preview your website in different device modes using the device selector in the toolbar. For best results, use relative units and flexible layouts when positioning elements.",
  },
  {
    keywords: ["save", "publish", "export", "download"],
    response:
      "To save your work in Displan, click the Save button in the top bar. Your changes will be automatically saved to your project. To publish your website, click the Publish button in the top right corner. This will make your website live and accessible to others. You can also export your project as HTML/CSS/JS files for hosting elsewhere.",
  },
  {
    keywords: ["page", "create page", "add page", "new page"],
    response:
      "In Displan, you can create multiple pages for your website. To create a new page, click the '+' button next to 'Pages' in the left sidebar, then select 'New Page' and enter a name. You can also create folders to organize your pages. Each page has its own canvas where you can add and arrange elements independently.",
  },
  {
    keywords: ["comment", "feedback", "note", "add comment"],
    response:
      "Comments are useful for collaboration and leaving notes for yourself or team members. To add a comment in Displan, select the Comment tool from the toolbar, then click anywhere on the canvas where you want to add the comment. Type your message and press Enter. Comments are visible to all project collaborators but won't appear on the published website.",
  },
  {
    keywords: ["preview", "view", "test", "preview mode"],
    response:
      "To preview your website as visitors will see it, click the Eye icon in the top bar to enter Preview mode. In this mode, you can interact with buttons and links as they would work on the live site. To exit Preview mode, click the Eye icon again. Preview mode is useful for testing your website's functionality before publishing.",
  },
  {
    keywords: ["zoom", "scale", "resize", "zoom in", "zoom out"],
    response:
      "You can zoom in and out of the canvas to focus on details or get a broader view of your layout. Use the zoom controls in the bottom toolbar to adjust the zoom level. You can also use keyboard shortcuts: Ctrl/Cmd + '+' to zoom in, Ctrl/Cmd + '-' to zoom out, and Ctrl/Cmd + '0' to reset zoom to 100%.",
  },
  {
    keywords: ["dark mode", "light mode", "theme", "toggle dark mode"],
    response:
      "Displan supports both light and dark modes for the editor interface. You can toggle between them by clicking the sun/moon icon in the bottom toolbar. This only affects the editor interface, not your website. To create a dark mode for your website, you'll need to add appropriate styles to your elements.",
  },
  {
    keywords: ["help", "tutorial", "guide", "documentation"],
    response:
      "For help with using Displan, you can ask me specific questions about features or functionality. I can guide you through various tasks and provide tips for creating better websites. You can also check the official documentation by clicking the Help icon in the bottom toolbar.",
  },
  {
    keywords: ["contact form", "contact us", "form"],
    response:
      "Contact forms are essential for allowing visitors to get in touch with you. In Displan, you can add a contact form by asking me to 'Add a contact form' or 'Create a contact us section'. The form will include fields for name, email, message, and a submit button. You can customize the form's appearance by specifying colors, sizes, and other properties.",
  },
  {
    keywords: ["header", "navigation", "menu", "nav"],
    response:
      "Headers typically appear at the top of your website and contain your logo, navigation menu, and sometimes call-to-action buttons. In Displan, you can add a header by asking me to 'Add a header' or 'Create a navigation menu'. You can choose from different header styles like modern, minimal, or centered, and customize colors and content.",
  },
  {
    keywords: ["footer", "bottom section"],
    response:
      "Footers appear at the bottom of your website and typically contain links, contact information, social media icons, and copyright notices. In Displan, you can add a footer by asking me to 'Add a footer' or 'Create a footer section'. You can choose from different footer styles and customize the content and appearance.",
  },
  {
    keywords: ["hero", "banner", "jumbotron"],
    response:
      "Hero sections are large, prominent areas at the top of a webpage that typically contain a headline, subheading, call-to-action button, and sometimes an image or video. In Displan, you can add a hero section by asking me to 'Add a hero section' or 'Create a banner'. You can customize the content, layout, and background.",
  },
  {
    keywords: ["features", "services", "benefits"],
    response:
      "Feature sections showcase your product's or service's key benefits or features. In Displan, you can add a features section by asking me to 'Add a features section' or 'Create a services showcase'. These typically include icons or images, headings, and short descriptions arranged in a grid or list layout.",
  },
  {
    keywords: ["testimonials", "reviews", "social proof"],
    response:
      "Testimonial sections display quotes or reviews from satisfied customers to build trust with potential customers. In Displan, you can add a testimonials section by asking me to 'Add testimonials' or 'Create a reviews section'. You can choose from different layouts like sliders, grids, or cards.",
  },
  {
    keywords: ["pricing", "plans", "packages"],
    response:
      "Pricing sections display your product or service pricing options in a clear, comparable format. In Displan, you can add a pricing section by asking me to 'Add a pricing table' or 'Create a pricing plans section'. These typically include plan names, prices, feature lists, and call-to-action buttons.",
  },
  {
    keywords: ["gallery", "portfolio", "showcase"],
    response:
      "Galleries or portfolios showcase your work, products, or images in an organized and visually appealing way. In Displan, you can add a gallery by asking me to 'Add an image gallery' or 'Create a portfolio section'. You can choose from different layouts like grids, masonry, or carousels.",
  },
  {
    keywords: ["call to action", "cta", "action button"],
    response:
      "Call-to-action (CTA) sections are designed to prompt users to take a specific action, like signing up or making a purchase. In Displan, you can add a CTA section by asking me to 'Add a call to action' or 'Create a CTA section'. These typically include a compelling headline and a prominent button.",
  },
  {
    keywords: ["input", "field", "form field", "text field"],
    response:
      "Input fields allow users to enter information on your website. In Displan, you can add various types of input fields like text inputs, email inputs, textareas, checkboxes, and more. To add an input field, you can ask me something like 'Add a text input field' or 'Create an email input'.",
  },
  {
    keywords: ["seo", "search engine optimization", "meta tags"],
    response:
      "Search Engine Optimization (SEO) is crucial for improving your website's visibility in search results. In Displan, you can optimize your website for search engines by adding meta titles, descriptions, and keywords in the SEO settings panel. You can access this by clicking on the SEO icon in the page settings. Additionally, use semantic HTML elements, add alt text to images, and ensure your content includes relevant keywords naturally. Displan automatically generates clean, SEO-friendly code for your website.",
  },
  {
    keywords: ["analytics", "tracking", "google analytics", "metrics"],
    response:
      "Website analytics help you understand your visitors' behavior and improve your site accordingly. In Displan, you can integrate analytics tools like Google Analytics by navigating to Settings > Integrations and entering your tracking ID. Once set up, you'll be able to track page views, user demographics, traffic sources, and user behavior. You can also set up event tracking for specific actions like button clicks or form submissions to gather more detailed insights about how users interact with your website.",
  },
  {
    keywords: ["domain", "custom domain", "connect domain", "url"],
    response:
      "To use a custom domain with your Displan website, go to Settings > Domains and click 'Connect Domain'. You can either purchase a new domain through Displan or connect a domain you already own. If connecting an existing domain, you'll need to update your DNS settings at your domain registrar by adding the provided A records and CNAME records. Once the DNS changes propagate (which can take up to 48 hours), your website will be accessible through your custom domain. Displan automatically provides SSL certificates for secure HTTPS connections.",
  },
  {
    keywords: ["hosting", "server", "web hosting"],
    response:
      "Displan includes reliable hosting for all your websites. Your sites are hosted on high-performance servers with 99.9% uptime guarantee, ensuring your website loads quickly and is always available to visitors. The hosting infrastructure automatically scales based on your traffic needs, so your site remains responsive even during traffic spikes. All hosting includes CDN (Content Delivery Network) integration for faster global content delivery, DDoS protection, and automatic backups. You don't need to manage any server configurations or worry about technical maintenance.",
  },
  {
    keywords: ["accessibility", "a11y", "ada compliance", "wcag"],
    response:
      "Web accessibility ensures your website is usable by people with various disabilities. Displan helps you create accessible websites by providing features like semantic HTML structure, proper heading hierarchy, and keyboard navigation support. When building your site, ensure you add alt text to images, maintain sufficient color contrast, use descriptive link text, and implement proper form labels. You can check your site's accessibility using the built-in accessibility checker in the Tools menu, which will identify issues and provide recommendations based on WCAG (Web Content Accessibility Guidelines) standards.",
  },
  {
    keywords: ["performance", "speed", "optimization", "page speed"],
    response:
      "Website performance is critical for user experience and SEO. Displan automatically optimizes your website for speed by minifying CSS and JavaScript, compressing images, implementing lazy loading for off-screen content, and utilizing browser caching. To further improve performance, keep your page elements minimal, optimize image sizes before uploading, use the built-in performance analyzer in the Tools menu to identify bottlenecks, and consider using the Content Delivery Network (CDN) option in the Settings panel for faster global content delivery.",
  },
  {
    keywords: ["mobile first", "responsive design", "adaptive design"],
    response:
      "Mobile-first design prioritizes the mobile experience before scaling up to larger screens. In Displan, you can enable mobile-first design by toggling the 'Mobile First' option in the responsive settings panel. This approach ensures your website works well on smartphones and tablets, which account for the majority of web traffic today. When designing, start with the mobile layout and progressively enhance the experience for larger screens. Use the device preview toolbar to test your design across different screen sizes, and utilize responsive units (%, em, rem) instead of fixed pixel values for flexible layouts.",
  },
  {
    keywords: ["grid", "layout grid", "grid system", "columns"],
    response:
      "Displan's grid system helps you create well-aligned, responsive layouts. To enable the grid, click the Grid icon in the toolbar and configure your desired column count, gutter width, and margin. You can choose between 12-column, 16-column, or custom grid configurations. Elements can snap to the grid for precise alignment. For responsive designs, you can set different grid configurations for different breakpoints. The grid is only visible in the editor and won't appear on your published website. Use it as a guide to maintain consistent spacing and alignment throughout your design.",
  },
  {
    keywords: ["color palette", "color scheme", "brand colors"],
    response:
      "Creating a consistent color palette is essential for brand identity. In Displan, you can define your brand colors by going to Settings > Brand > Colors. Add your primary, secondary, and accent colors, along with any additional colors your brand uses. Once defined, these colors will be available in color pickers throughout the editor, ensuring consistency across your website. You can also import color palettes from Adobe Color, Coolors, or by entering hex codes directly. For accessibility, Displan will automatically check color contrast ratios and warn you if text might be difficult to read against certain background colors.",
  },
  {
    keywords: ["typography", "fonts", "typeface", "text styles"],
    response:
      "Typography plays a crucial role in website design. In Displan, manage your typography by going to Settings > Brand > Typography. You can choose from hundreds of web-safe fonts and Google Fonts, or upload custom fonts. Define your heading styles (H1-H6), paragraph styles, and any special text styles you need. Creating these global typography styles ensures consistency throughout your website and makes site-wide changes easier. For optimal readability, maintain proper contrast, use appropriate line height (1.5-2x font size), and limit line length to 50-75 characters. Displan automatically ensures your fonts load efficiently to maintain good performance.",
  },
  {
    keywords: ["e-commerce", "online store", "shop", "products"],
    response:
      "Displan offers robust e-commerce functionality to create online stores. To set up an e-commerce site, select the E-commerce template when creating a new project or add e-commerce functionality to an existing site via Settings > Integrations > E-commerce. You can add product listings, shopping cart functionality, secure checkout processes, and payment gateways (including Stripe, PayPal, and Square). The product management system allows you to add products with images, descriptions, variants, and inventory tracking. You can also set up tax rules, shipping options, and discount codes. The e-commerce analytics dashboard provides insights into sales, popular products, and customer behavior.",
  },
  {
    keywords: ["blog", "articles", "posts", "content management"],
    response:
      "Creating a blog in Displan is straightforward. You can either select a blog template when starting a new project or add blog functionality to an existing site via Settings > Features > Blog. The blog system includes a content editor with formatting options, categories and tags for organization, featured images, scheduled publishing, and RSS feed generation. You can customize the blog layout, including list views, grid layouts, and single post templates. The comment system can be enabled or disabled, with moderation options available. For SEO, each blog post has individual meta settings, and the system automatically generates clean URLs and structured data markup.",
  },
  {
    keywords: ["forms", "form builder", "contact form", "submission"],
    response:
      "Displan's form builder allows you to create custom forms for various purposes. To add a form, use the Form element from the Elements panel or ask me to create one for you. You can add different field types including text, email, phone, dropdown, checkboxes, radio buttons, file uploads, and more. Each field can be configured with validation rules, placeholder text, and help text. Form submissions can be sent to your email, stored in the Displan dashboard, or integrated with services like Google Sheets, Mailchimp, or your CRM. You can also set up custom success messages, redirect users after submission, and implement CAPTCHA to prevent spam.",
  },
  {
    keywords: ["membership", "login", "user accounts", "registration"],
    response:
      "Membership functionality allows you to create gated content or user accounts on your website. In Displan, enable membership features via Settings > Features > Membership. You can create different membership levels with varying access permissions, set up registration and login forms, implement email verification, and manage user profiles. The system supports social login options (Google, Facebook, Twitter), password reset workflows, and member directories. For content restriction, you can designate specific pages or sections as member-only and control access based on membership levels. The membership dashboard provides insights into user registrations, logins, and engagement metrics.",
  },
  {
    keywords: ["social media", "social links", "share buttons", "social integration"],
    response:
      "Integrating social media with your website enhances your online presence. In Displan, you can add social media elements in several ways: 1) Social link icons that connect to your profiles, available in the Elements panel under 'Social'; 2) Share buttons that allow visitors to share your content, customizable with various designs and platform options; 3) Social feeds that display your latest posts from platforms like Instagram, Twitter, or Facebook, found in the Elements panel under 'Embeds'. You can also set up Open Graph and Twitter Card meta tags in the SEO settings to control how your content appears when shared on social platforms.",
  },
  {
    keywords: ["animations", "effects", "transitions", "motion"],
    response:
      "Animations add visual interest and guide user attention on your website. Displan offers several animation types: 1) Entrance animations that trigger when elements enter the viewport (fade, slide, zoom, etc.); 2) Hover animations that activate when users hover over elements; 3) Click animations that respond to user interactions; 4) Scroll animations that progress as users scroll down the page. To add animations, select an element, go to the Animations tab in the Properties panel, and choose your desired effect. You can customize timing, delay, easing, and intensity. For performance reasons, use animations sparingly and ensure they enhance rather than distract from the user experience.",
  },
  {
    keywords: ["video", "embed video", "background video", "youtube"],
    response:
      "Videos can significantly enhance engagement on your website. In Displan, you can add videos in several ways: 1) Embed videos from platforms like YouTube or Vimeo using the Video element in the Elements panel; 2) Upload and host videos directly on your site using the Media Library; 3) Add background videos to sections using the Background settings in the Properties panel. For optimal performance, consider using compressed video formats, enabling lazy loading, and providing poster images. You can customize video players with controls, autoplay settings (note that autoplay with sound is often blocked by browsers), loop options, and responsive sizing. For accessibility, always include captions or transcripts.",
  },
  {
    keywords: ["carousel", "slider", "slideshow", "image slider"],
    response:
      "Carousels or sliders allow you to showcase multiple images or content in a rotating format. In Displan, add a carousel using the Carousel element from the Elements panel. You can customize the number of slides, transition effects (fade, slide, zoom), navigation controls (arrows, dots, thumbnails), autoplay settings, and responsive behavior. Each slide can contain images, text, buttons, or any combination of elements. For best practices, limit the number of slides to 3-5, ensure navigation is clearly visible, and consider disabling autoplay or at least allowing users to pause it. On mobile devices, carousels automatically adjust for touch interactions.",
  },
  {
    keywords: ["maps", "google maps", "location", "directions"],
    response:
      "Adding maps to your website helps visitors find your physical location. In Displan, use the Map element from the Elements panel to embed interactive maps. You can specify the location by address or coordinates, adjust the zoom level, map style (standard, satellite, terrain), and customize markers with your brand colors or custom icons. The map settings allow you to enable or disable various controls like zoom buttons, street view, and fullscreen options. You can also add multiple markers for different locations and include information windows that display details when markers are clicked. For performance optimization, maps are lazy-loaded by default.",
  },
  {
    keywords: ["favicon", "site icon", "browser icon", "tab icon"],
    response:
      "A favicon is the small icon that appears in browser tabs, bookmarks, and mobile home screens when users save your website. In Displan, set your favicon by going to Settings > Brand > Favicon. Upload a square image (ideally 512x512 pixels) and Displan will automatically generate all the necessary favicon sizes and formats for different devices and browsers. For best results, use a simple, recognizable design that works well at small sizes. Your favicon should align with your brand identity, typically using elements from your logo. Displan also generates the appropriate meta tags and manifest files for proper favicon display across all platforms.",
  },
  {
    keywords: ["cookies", "cookie banner", "gdpr", "privacy"],
    response:
      "Cookie consent banners inform visitors about your website's use of cookies and comply with privacy regulations like GDPR and CCPA. In Displan, enable the cookie consent feature via Settings > Privacy > Cookie Consent. You can customize the banner's appearance, message text, button labels, and position on the page. The system allows you to categorize cookies (necessary, functional, analytics, marketing) and let users choose which types they accept. You can also link to your privacy policy for more information. The consent preferences are stored securely, and the banner won't reappear for users who have already made their choice unless they clear their browser data.",
  },
  {
    keywords: ["404", "error page", "not found", "custom error"],
    response:
      "A custom 404 (Not Found) error page improves user experience when visitors land on non-existent URLs. In Displan, create a custom 404 page by clicking on Pages in the sidebar, then the '+' button, and selecting '404 Page'. Design this page with helpful elements like a message explaining the error, a search bar, navigation links to important sections, and perhaps a touch of humor or brand personality. The system automatically serves this page when a visitor tries to access a URL that doesn't exist on your site. A well-designed 404 page can reduce bounce rates by keeping visitors on your site despite the initial navigation error.",
  },
  {
    keywords: ["backup", "restore", "version history", "revert"],
    response:
      "Displan automatically creates backups of your website to prevent data loss. Access your backup history by going to Settings > Backups. The system creates daily automatic backups that are stored for 30 days (longer on higher-tier plans). You can also create manual backups before making significant changes by clicking the 'Create Backup' button. To restore a previous version, select the desired backup point and click 'Restore'. You can preview backups before restoring to ensure you're selecting the correct version. The version history feature also allows you to see who made specific changes in team projects, with timestamps and user information.",
  },
  {
    keywords: ["collaboration", "team", "sharing", "permissions"],
    response:
      "Displan supports team collaboration on website projects. To invite team members, go to Settings > Team and click 'Invite Member'. You can assign different roles with varying permissions: Admin (full access), Editor (can modify content but not settings), Designer (can modify design but not publish), and Viewer (can only view and comment). Team members receive email invitations to join the project. The collaboration features include real-time editing (showing who's currently working on what), commenting for feedback, task assignments, and an activity log that tracks all changes. For agencies, you can also set up client access with limited permissions for review and feedback.",
  },
  {
    keywords: ["export", "code export", "html export", "download code"],
    response:
      "Displan allows you to export your website's code for hosting elsewhere or further customization. To export your site, go to Settings > Export and select your preferred export option. You can export as a complete HTML/CSS/JS package ready for hosting, as a WordPress theme, or as a React/Next.js project (on higher-tier plans). The exported code is clean, optimized, and follows best practices. All assets like images and fonts are included in the export package. Note that dynamic features like forms processing might require additional setup when self-hosting. The code export feature is particularly useful for developers who want to start with a visual design and then add custom functionality.",
  },
  {
    keywords: ["white label", "branding", "agency", "client"],
    response:
      "Displan's white-label feature allows agencies and freelancers to present the platform as their own branded solution to clients. Available on Agency plans, white-labeling lets you customize the editor interface with your logo, colors, and domain. You can create client accounts with your branding, set up custom email notifications, and generate branded PDF reports. The client dashboard can be tailored to show only the features you want clients to access. This creates a seamless experience where clients feel they're using your proprietary platform rather than a third-party tool. White-labeling helps strengthen your brand identity and can justify premium pricing for your web design services.",
  },
  {
    keywords: ["multilingual", "language", "translation", "international"],
    response:
      "Create multilingual websites in Displan to reach international audiences. Enable multilingual support via Settings > Languages, then add the languages you want to support. The system creates language variants of your pages where you can translate content while maintaining the same design. The language switcher element can be added to your site, allowing visitors to select their preferred language. Displan supports right-to-left languages like Arabic and Hebrew, automatically adjusting layouts as needed. For SEO, the system implements proper hreflang tags and language meta information. You can either manually translate content or use the integrated translation service (available on higher-tier plans) to automatically translate text with human review options.",
  },
  {
    keywords: ["cdn", "content delivery network", "global", "speed"],
    response:
      "Displan uses a Content Delivery Network (CDN) to ensure your website loads quickly for visitors worldwide. The CDN distributes your site's static assets (images, CSS, JavaScript) across multiple global servers, so visitors download content from the server closest to them. This significantly reduces loading times, especially for international audiences. The CDN is automatically enabled for all Displan websites, with advanced configuration options available in Settings > Performance > CDN. These include custom cache rules, image optimization settings, and security features like hotlink protection. The CDN also provides DDoS protection and absorbs traffic spikes, ensuring your site remains available even during high-traffic periods.",
  },
  {
    keywords: ["ssl", "https", "security certificate", "secure"],
    response:
      "All Displan websites include free SSL certificates to enable secure HTTPS connections. SSL encryption protects data transmitted between your website and visitors, builds trust, and is a ranking factor for search engines. The certificates are automatically provisioned and renewed, so you don't need to manage them manually. You can verify your SSL status in Settings > Security > SSL, which shows the certificate's validity period and encryption level. For custom domains, the SSL certificate is automatically issued once your domain's DNS settings are properly configured. Displan enforces HTTPS by default, automatically redirecting any HTTP requests to secure HTTPS connections.",
  },
  {
    keywords: ["api", "integration", "connect", "third party"],
    response:
      "Displan supports integrations with various third-party services and APIs to extend your website's functionality. Access available integrations in Settings > Integrations, where you can connect services like payment processors (Stripe, PayPal), email marketing tools (Mailchimp, ConvertKit), CRM systems (Salesforce, HubSpot), analytics platforms (Google Analytics, Hotjar), and more. For custom API integrations, use the API Connector element to make HTTP requests to external services and display the returned data. Advanced users can also add custom code elements to implement more complex integrations. Each integration includes setup instructions and authentication flows to securely connect your accounts.",
  },
  {
    keywords: ["custom code", "html", "css", "javascript"],
    response:
      "Displan allows you to add custom code to extend functionality beyond the visual editor's capabilities. There are several ways to add custom code: 1) The HTML element lets you insert custom HTML snippets directly on the canvas; 2) The CSS panel in Settings > Advanced lets you add site-wide custom styles; 3) The JavaScript panel allows you to add custom scripts, with options for loading in the head or body, and with various trigger conditions; 4) The Code Injection feature in page settings enables page-specific code. For more advanced needs, you can create custom elements with HTML, CSS, and JavaScript that can be reused across your site. Custom code is executed in a sandboxed environment to prevent conflicts with the core functionality.",
  },
  {
    keywords: ["popup", "modal", "lightbox", "overlay"],
    response:
      "Popups or modals are useful for highlighting important information, collecting email addresses, or displaying additional content without navigating away from the current page. In Displan, add a popup using the Popup element from the Elements panel. You can customize the trigger conditions (on page load, after a delay, on exit intent, on scroll, or on button click), animation effects, size, position, and backdrop style. Design the popup content using any combination of elements like text, images, forms, or buttons. For best practices, ensure popups are not intrusive, include a clear close button, and consider frequency capping to avoid showing the same popup repeatedly to returning visitors.",
  },
  {
    keywords: ["accordion", "collapse", "expandable", "toggle"],
    response:
      "Accordions are expandable content sections that help organize information in a compact, user-friendly format. In Displan, add an accordion using the Accordion element from the Elements panel. You can create multiple sections, each with a header and expandable content. Customize the appearance with different styles, icons, and animations. Configure behavior options like allowing multiple sections to be open simultaneously or restricting to one section at a time. Accordions are particularly useful for FAQs, product specifications, service details, or any content that benefits from a hierarchical, progressive disclosure approach. They automatically adapt to mobile screens, making them excellent for responsive designs.",
  },
  {
    keywords: ["tabs", "tab panel", "tabbed content", "tab navigation"],
    response:
      "Tab interfaces organize content into separate views that users can switch between without page reloads. In Displan, add tabs using the Tabs element from the Elements panel. You can create multiple tab panels, each with its own heading and content. Customize the tab design with different styles, orientations (horizontal or vertical), and indicator types. Each tab can contain any combination of elements, allowing for rich, organized content presentation. Tabs are particularly effective for product variations, service comparisons, or different categories of information. The system ensures proper accessibility with keyboard navigation support and ARIA attributes for screen readers.",
  },
  {
    keywords: ["countdown", "timer", "clock", "deadline"],
    response:
      "Countdown timers create urgency and anticipation for upcoming events, product launches, or limited-time offers. In Displan, add a countdown using the Countdown element from the Elements panel. Set the target date and time, and choose between various display formats (days/hours/minutes/seconds or a more compact version). Customize the appearance with different styles, colors, and sizes to match your design. You can configure actions to occur when the countdown reaches zero, such as displaying a message, showing a hidden element, or redirecting to another page. For recurring events, you can set the timer to reset automatically at specified intervals.",
  },
  {
    keywords: ["progress bar", "loading bar", "status indicator", "completion"],
    response:
      "Progress bars visually represent completion status, loading processes, or goal achievement. In Displan, add a progress bar using the Progress element from the Elements panel. You can set the progress percentage, animation speed, and choose from various styles (linear, circular, semi-circular). Customize colors, sizes, and add labels or percentage displays. For dynamic progress bars, you can connect them to form completion, scroll position, or custom triggers using the Interactions panel. Progress bars are useful for multi-step forms, fundraising goals, skill level indicators, or project timelines. They provide visual feedback that helps users understand status at a glance.",
  },
  {
    keywords: ["table", "data table", "pricing table", "comparison"],
    response:
      "Tables organize information in rows and columns for easy comparison and reference. In Displan, add a table using the Table element from the Elements panel. You can specify the number of rows and columns, add headers, and customize cell content with text, images, or other elements. Style options include border styles, cell padding, alternating row colors, and responsive behavior settings. For larger tables, enable features like sorting, filtering, and pagination to improve usability. On mobile devices, tables can automatically transform into cards or stacked layouts for better readability. Tables are ideal for pricing comparisons, feature matrices, schedules, or any structured data presentation.",
  },
  {
    keywords: ["search", "search bar", "search function", "find"],
    response:
      "A search feature helps visitors quickly find specific content on your website. In Displan, add a search bar using the Search element from the Elements panel. You can customize its appearance, placeholder text, and button style. The search functionality indexes all your website content, including pages, blog posts, products, and custom post types. Configure search settings in Settings > Features > Search, where you can prioritize certain content types, enable autocomplete suggestions, and customize the search results page layout. For e-commerce sites, you can enable product search with filters for categories, prices, and attributes. The search system supports fuzzy matching to handle typos and partial matches.",
  },
  {
    keywords: ["breadcrumbs", "navigation path", "page hierarchy"],
    response:
      "Breadcrumbs show users their current location within your website's hierarchy and provide easy navigation to parent pages. In Displan, add breadcrumbs using the Breadcrumbs element from the Elements panel. The system automatically generates the navigation path based on your site structure. You can customize the separator symbol, typography, and whether to show the home icon. For SEO benefits, breadcrumbs are implemented with proper structured data markup that search engines can use to understand your site structure. They're especially useful for websites with deep hierarchies like e-commerce stores, documentation sites, or large blogs with multiple categories.",
  },
  {
    keywords: ["ratings", "stars", "reviews", "testimonials"],
    response:
      "Rating elements display customer feedback or product ratings visually, typically using stars. In Displan, add ratings using the Rating element from the Elements panel. You can set the rating value (e.g., 4.5 out of 5), choose between different icon styles (stars, hearts, thumbs), and customize colors and sizes. For dynamic ratings, connect the element to your product database or review system. You can also enable interactive ratings on forms to collect user feedback. For SEO benefits, ratings can be implemented with proper structured data markup that search engines can use to display rich results in search listings, potentially improving click-through rates.",
  },
  {
    keywords: ["social proof", "trust badges", "testimonials", "reviews"],
    response:
      "Social proof elements build credibility by showcasing customer testimonials, reviews, trust badges, or client logos. In Displan, add social proof using various elements: 1) The Testimonial element for customer quotes with names and photos; 2) The Review element for star ratings with comments; 3) The Logo Grid for displaying client or partner logos; 4) The Trust Badge element for security certificates, payment methods, or industry affiliations. These elements can be styled to match your brand and arranged in sliders, grids, or individual highlights. For maximum impact, place social proof elements near conversion points like signup forms or checkout processes.",
  },
  {
    keywords: ["animation", "motion", "transition", "hover effect"],
    response:
      "Animations add visual interest and guide user attention on your website. In Displan, add animations to any element through the Animations panel in the Properties sidebar. You can choose from entrance animations (triggered when elements enter the viewport), hover animations (activated when users hover over elements), click animations (responding to user interactions), and scroll animations (progressing as users scroll). Each animation type offers various effects like fade, slide, zoom, rotate, and bounce. Customize timing, delay, easing function, and intensity to achieve the desired effect. For performance reasons, use animations judiciously and ensure they enhance rather than distract from the user experience.",
  },
  {
    keywords: ["parallax", "scroll effect", "depth", "3d scrolling"],
    response:
      "Parallax effects create depth by moving elements at different speeds as users scroll, creating an immersive 3D-like experience. In Displan, add parallax using the Parallax section from the Sections panel or by enabling parallax properties on existing elements. You can control the speed and direction of the parallax movement, as well as set different behaviors for different screen sizes. Common applications include parallax backgrounds, floating elements, and reveal effects. For best performance, use parallax sparingly and optimize any images used in parallax sections. The effect automatically disables on devices where it might cause performance issues, ensuring a smooth experience for all users.",
  },
  {
    keywords: ["sticky", "fixed position", "floating", "scroll"],
    response:
      "Sticky elements remain visible as users scroll down the page, useful for important navigation or call-to-action elements. In Displan, make any element sticky by enabling the 'Position: Sticky' option in the Layout panel of the Properties sidebar. You can set the sticky position (top, bottom) and offset distance, as well as specify when the element should start and stop being sticky based on scroll position. Common applications include sticky headers, navigation menus, call-to-action buttons, or video players that follow the user. For mobile devices, you can configure different sticky behavior or disable it entirely to optimize the mobile experience.",
  },
  {
    keywords: ["hover", "mouseover", "hover effect", "interaction"],
    response:
      "Hover effects provide visual feedback when users move their cursor over elements, enhancing interactivity. In Displan, add hover effects to any element through the States panel in the Properties sidebar. Select the Hover state and modify properties like background color, text color, scale, opacity, or border. You can also add transitions to create smooth animations between the normal and hover states. For more advanced hover effects, use the Interactions panel to create custom behaviors like revealing hidden elements, playing animations, or triggering other actions. Remember that hover effects don't work on touch devices, so always ensure your design functions properly without them for mobile users.",
  },
  {
    keywords: ["scroll animations", "reveal", "fade in", "scroll trigger"],
    response:
      "Scroll animations reveal elements with engaging effects as users scroll down the page. In Displan, add scroll animations using the Scroll Effects panel in the Properties sidebar. You can choose from various animation types like fade, slide, zoom, or rotate, and set the trigger point (when the animation starts relative to the element's position in the viewport). Customize timing, easing, and intensity to achieve the desired effect. For performance optimization, animations are only active when elements are near the viewport. You can also create sequential animations for multiple elements and control the animation behavior on different device sizes.",
  },
  {
    keywords: ["gradient", "color gradient", "background gradient", "fade"],
    response:
      "Gradients create smooth color transitions that add depth and visual interest to your design. In Displan, add gradients to backgrounds, buttons, text, or borders using the Color picker in the Properties panel. Select 'Gradient' as the color type, then choose between linear, radial, or conic gradient types. Add multiple color stops, adjust their positions, and set the gradient angle or radius. You can save custom gradients to your color palette for reuse across your site. For text gradients, enable the 'Text Gradient' option in the Typography panel. Gradients work well for call-to-action buttons, section backgrounds, or creating visual hierarchy between page sections.",
  },
  {
    keywords: ["shadow", "box shadow", "drop shadow", "text shadow"],
    response:
      "Shadows add depth and dimension to your design, helping elements appear to float above the page. In Displan, add shadows using the Shadow panel in the Properties sidebar. For box shadows (applied to containers, cards, buttons, etc.), you can adjust the offset (x/y position), blur radius, spread radius, and color. Enable the 'Inset' option to create inner shadows. For text shadows, use the Text Shadow option in the Typography panel, controlling offset, blur, and color. You can add multiple shadows to create complex effects. Shadows are particularly effective for call-to-action buttons, floating cards, or creating visual hierarchy between elements.",
  },
  {
    keywords: ["border", "outline", "stroke", "edge"],
    response:
      "Borders define element boundaries and can enhance visual structure. In Displan, customize borders using the Border panel in the Properties sidebar. You can set border width, style (solid, dashed, dotted, etc.), and color for all sides uniformly or for each side independently. The border radius option lets you create rounded corners, with control over each corner individually if needed. For more advanced effects, you can add multiple borders using box shadows or outline properties. Borders are useful for buttons, cards, input fields, or creating visual separation between content sections.",
  },
  {
    keywords: ["background", "bg", "backdrop", "section background"],
    response:
      "Backgrounds set the visual foundation for your content. In Displan, customize backgrounds using the Background panel in the Properties sidebar. You can choose from solid colors, gradients, images, or videos. For image backgrounds, upload custom images or select from the built-in library, then adjust positioning, size (cover, contain, custom), and repetition. Enable parallax effects or overlay colors to improve text readability. For video backgrounds, upload MP4 files or link to YouTube/Vimeo, with options for autoplay, loop, and fallback images. You can also set different backgrounds for different device sizes or create advanced effects with multiple background layers.",
  },
  {
    keywords: ["spacing", "margin", "padding", "gap"],
    response:
      "Proper spacing is crucial for readability and visual harmony. In Displan, control spacing using the Spacing panel in the Properties sidebar. Adjust margin (space outside elements) and padding (space inside elements) for all sides uniformly or for each side independently. For layouts using Flex or Grid, the Gap property controls space between child elements. You can set different spacing values for different breakpoints to optimize your design across device sizes. For consistent spacing throughout your site, use the spacing scale in Settings > Design System, which defines standard spacing increments based on your design needs.",
  },
  {
    keywords: ["flexbox", "flex layout", "flexible box", "flex container"],
    response:
      "Flexbox creates flexible, responsive layouts with powerful alignment capabilities. In Displan, enable Flexbox by setting Display: Flex on any container element in the Layout panel. Configure the flex direction (row, column), wrap behavior, and alignment properties (justify-content for main axis alignment, align-items for cross axis alignment). For individual flex items within the container, you can set properties like flex grow, shrink, and basis to control how they expand or contract. Flexbox is ideal for navigation menus, card layouts, centering content, or creating equal-height columns that respond well to different screen sizes.",
  },
  {
    keywords: ["grid", "css grid", "grid layout", "grid container"],
    response:
      "CSS Grid creates two-dimensional layouts with precise control over rows and columns. In Displan, enable Grid by setting Display: Grid on any container element in the Layout panel. Define your grid structure with grid-template-columns and grid-template-rows, using fixed values (px), flexible units (fr), or mixed units. Control the gap between grid items, and use alignment properties to position content within cells. For individual grid items, you can span multiple rows or columns and precisely position items. Grid is perfect for complex page layouts, image galleries, dashboard interfaces, or any design requiring precise two-dimensional alignment.",
  },
  {
    keywords: ["responsive", "breakpoints", "media queries", "mobile"],
    response:
      "Responsive design ensures your website looks great on all devices. In Displan, manage responsive behavior using the device selector in the top toolbar, which lets you preview and customize your design for different screen sizes. The system uses standard breakpoints (mobile, tablet, desktop, large desktop), but you can customize these in Settings > Responsive. When you make changes in a specific device view, those changes only apply to that breakpoint and smaller screens, following a mobile-first approach. You can hide/show elements, adjust layouts, change text sizes, and modify spacing for different devices to create an optimal experience across all screen sizes.",
  },
  {
    keywords: ["container", "max width", "content width", "wrapper"],
    response:
      "Containers control the maximum width of content and ensure proper alignment on larger screens. In Displan, add a Container element from the Elements panel or enable container behavior on existing sections. You can set the maximum width, enable/disable horizontal padding, and control the alignment (center, left, right). Different container widths can be set for different types of content – narrower for text-heavy pages and wider for visual content. The container automatically responds to screen size, ensuring content remains properly formatted on all devices. For nested layouts, you can use multiple containers with different maximum widths to create complex but controlled designs.",
  },
  {
    keywords: ["z-index", "layer", "stacking", "overlap"],
    response:
      "Z-index controls the stacking order of elements that overlap. In Displan, adjust z-index using the Position panel in the Properties sidebar. Higher z-index values appear above elements with lower values. This is particularly useful for creating effects like overlapping cards, floating elements above backgrounds, or ensuring dropdowns appear above other content. The Layers panel in the left sidebar also helps manage the stacking order visually, allowing you to drag and drop elements to change their position in the hierarchy. For complex layouts with multiple overlapping elements, use consistent z-index values based on a planned stacking context.",
  },
  {
    keywords: ["opacity", "transparency", "fade", "translucent"],
    response:
      "Opacity controls the transparency of elements, allowing background content to show through. In Displan, adjust opacity using the Effects panel in the Properties sidebar, with values ranging from 0 (completely transparent) to 1 (fully opaque). This is useful for creating overlay effects, subtle background elements, or hover transitions. You can animate opacity changes for fade effects or combine opacity with background colors to create semi-transparent overlays that improve text readability on image backgrounds. Remember that opacity affects an entire element including its children, so for background-only transparency, use rgba() or hsla() color values instead.",
  },
  {
    keywords: ["filter", "blur", "grayscale", "brightness", "contrast"],
    response:
      "Filters apply visual effects to elements without altering the original content. In Displan, add filters using the Effects panel in the Properties sidebar. Available filters include blur (creates a soft focus effect), brightness (adjusts luminosity), contrast (increases or decreases difference between light and dark), grayscale (removes color), sepia (adds a vintage tone), hue-rotate (shifts colors), and more. You can combine multiple filters and adjust their intensity. Filters are useful for creating depth effects, stylizing images, improving text readability over backgrounds, or creating interactive state changes on hover or scroll.",
  },
  {
    keywords: ["mask", "clip", "shape", "cutout"],
    response:
      "Masks and clips create custom shapes or cutout effects for elements. In Displan, apply masks using the Mask panel in the Properties sidebar. You can choose from preset shapes (circle, ellipse, triangle, etc.), upload custom SVG shapes, or use image masks. For text masks (text that reveals a background image), use the Text Mask element from the Elements panel. Clipping paths work similarly but affect the element's clickable area as well. These techniques are useful for creating unique image frames, decorative text effects, or creative section transitions that go beyond rectangular layouts.",
  },
  {
    keywords: ["transform", "rotate", "scale", "skew", "translate"],
    response:
      "Transforms modify an element's appearance by rotating, scaling, skewing, or moving it. In Displan, apply transforms using the Transform panel in the Properties sidebar. You can rotate elements (in degrees), scale them (larger or smaller), skew them (creating a slanted effect), or translate them (move horizontally or vertically). Combine multiple transforms to create complex effects, and set the transform origin to control the pivot point. Transforms are particularly useful for creating interactive effects on hover, decorative elements, or dynamic animations. Unlike margin or position adjustments, transforms don't affect the document flow or surrounding elements.",
  },
  {
    keywords: ["blend mode", "color blend", "overlay blend", "mix blend"],
    response:
      "Blend modes determine how elements' colors interact with the colors beneath them. In Displan, set blend modes using the Effects panel in the Properties sidebar. Options include multiply (darkens), screen (lightens), overlay (increases contrast), color-dodge (brightens), and many more. You can apply blend modes to entire elements or specifically to backgrounds using the Background Blend Mode option. This creates sophisticated color interactions without image editing software. Blend modes are excellent for creating duotone effects, textured backgrounds, or creative image overlays. Experiment with different modes to achieve unique visual effects that enhance your design.",
  },
  {
    keywords: ["typography", "font", "text", "typeface"],
    response:
      "Typography is fundamental to web design, affecting readability and brand personality. In Displan, manage typography through the Typography panel in the Properties sidebar and global settings in Settings > Typography. You can choose from hundreds of web fonts (Google Fonts, Adobe Fonts) or upload custom fonts. Define text properties including font family, size, weight, line height, letter spacing, and text transform. Create typography presets for headings, paragraphs, and other text elements to maintain consistency. For responsive designs, you can set different font sizes for different screen sizes. Advanced features include variable fonts, multi-color fonts, and custom text shadows or stroke effects.",
  },
  {
    keywords: ["color", "palette", "brand colors", "color scheme"],
    response:
      "A cohesive color palette strengthens brand identity and user experience. In Displan, manage colors through the Color picker in various property panels and globally in Settings > Colors. Define primary, secondary, and accent colors, along with semantic colors for success, warning, error, and info states. You can create color variations with different shades and tints for each base color. The Global Colors feature ensures consistency – updating a global color automatically updates all elements using it. The color system supports HEX, RGB, HSL, and named colors, with built-in accessibility checking to ensure sufficient contrast for text readability.",
  },
  {
    keywords: ["icon", "svg icon", "icon library", "icon set"],
    response:
      "Icons enhance visual communication and user interface design. In Displan, add icons using the Icon element from the Elements panel. The platform includes thousands of built-in icons from popular sets like Material Design, Feather, Font Awesome, and more. You can search by name or browse by category. Customize icons by changing size, color, stroke width, and alignment. For custom icons, upload your own SVG files through the Media Library. Icons can be used standalone or combined with text in buttons, feature lists, navigation menus, or as decorative elements. They automatically scale for different screen sizes without losing quality.",
  },
  {
    keywords: ["image", "picture", "photo", "graphic"],
    response:
      "Images are crucial for engaging visual content. In Displan, add images using the Image element from the Elements panel. Upload your own images through the Media Library or choose from integrated stock photo services. The platform automatically optimizes uploaded images for web performance, creating multiple sizes for responsive delivery. You can crop, resize, and apply basic adjustments like brightness, contrast, and filters directly in the editor. Advanced features include focal point selection (controlling which part of the image remains visible at different crops), lazy loading for performance, and blur-up loading effects for a better user experience.",
  },
  {
    keywords: ["video", "media", "mp4", "embed"],
    response:
      "Videos increase engagement and effectively communicate complex information. In Displan, add videos using the Video element from the Elements panel. You can upload MP4 files directly, embed from platforms like YouTube or Vimeo, or use background videos in sections. Customize playback controls, autoplay settings (note that autoplay with sound is often blocked by browsers), loop behavior, and poster images. The platform automatically handles responsive sizing and implements lazy loading to improve page performance. For accessibility, you can add captions or transcripts. Self-hosted videos are automatically compressed and optimized for web delivery.",
  },
  {
    keywords: ["form", "input", "contact form", "submission"],
    response:
      "Forms collect information from visitors and enable interactions. In Displan, create forms using the Form element from the Elements panel. Add various field types including text, email, phone, number, date, checkbox, radio, select, file upload, and more. Configure validation rules, placeholder text, and help text for each field. Set up form submissions to be sent to your email, stored in the Displan dashboard, or integrated with services like Google Sheets, Mailchimp, or your CRM. You can customize success messages, redirect users after submission, and implement CAPTCHA to prevent spam. Forms automatically adapt to mobile screens for a good user experience on all devices.",
  },
  {
    keywords: ["button", "cta", "call to action", "link"],
    response:
      "Buttons guide users toward key actions on your website. In Displan, add buttons using the Button element from the Elements panel. Customize appearance with different styles (filled, outlined, text), colors, sizes, and shapes. You can add icons before or after the text, and configure hover effects to provide visual feedback. Set the button's action to navigate to a URL, scroll to a section, open a popup, submit a form, or trigger custom JavaScript. For important calls to action, use contrasting colors and strategic placement to draw attention. Create button styles in your design system to maintain consistency throughout your site.",
  },
  {
    keywords: ["navigation", "menu", "nav", "navbar"],
    response:
      "Navigation menus help users find content on your website. In Displan, add navigation using the Menu element from the Elements panel. You can create horizontal or vertical menus, with support for dropdown submenus, mega menus, and mobile hamburger menus. The menu automatically pulls links from your site structure, or you can manually define custom links. Style options include different layouts, colors, hover effects, and active state indicators. For mobile responsiveness, configure how the menu transforms on smaller screens – typically collapsing into a hamburger menu. You can also create sticky navigation that remains visible as users scroll down the page.",
  },
  {
    keywords: ["gallery", "image gallery", "portfolio", "lightbox"],
    response:
      "Galleries showcase multiple images in an organized, visually appealing way. In Displan, add galleries using the Gallery element from the Elements panel. Choose from layouts including grid, masonry, carousel, or slider. Configure settings like image size, spacing, aspect ratio, and navigation controls. Enable lightbox functionality to let visitors view images in full-screen mode with navigation between items. For performance, galleries implement lazy loading to only load images as they come into view. You can add captions, categories for filtering, and hover effects. Galleries automatically adjust their layout for different screen sizes to maintain visual appeal on all devices.",
  },
  {
    keywords: ["carousel", "slider", "slideshow", "rotator"],
    response:
      "Carousels display multiple content items in a rotating sequence. In Displan, add carousels using the Carousel element from the Elements panel. You can include various content types in each slide – images, text, buttons, or custom layouts. Configure navigation controls (arrows, dots, thumbnails), autoplay settings, transition effects (fade, slide), and timing. For touch devices, carousels support swipe gestures. Advanced features include variable width slides, center mode, infinite looping, and responsive settings for different screen sizes. For best practices, limit the number of slides, ensure navigation is clearly visible, and consider pausing autoplay on hover or interaction.",
  },
  {
    keywords: ["accordion", "collapse", "expandable", "toggle"],
    response:
      "Accordions organize content in collapsible sections, saving space and reducing cognitive load. In Displan, add accordions using the Accordion element from the Elements panel. Create multiple sections, each with a header and expandable content. Configure behavior options like allowing multiple sections open simultaneously or restricting to one section at a time. Customize appearance with different icon styles, animations, and spacing. Accordions are particularly useful for FAQs, product specifications, or any content that benefits from progressive disclosure. They automatically adapt to mobile screens and support keyboard navigation for accessibility.",
  },
  {
    keywords: ["tabs", "tab panel", "tabbed content", "tab navigation"],
    response:
      "Tabs organize related content into separate views that users can switch between. In Displan, add tabs using the Tabs element from the Elements panel. Create multiple tab panels, each with its own heading and content. Choose between horizontal or vertical orientation, and customize the appearance of tabs and indicators. Each tab can contain any combination of elements, allowing for rich, organized content presentation. Tabs are useful for product variations, service comparisons, or different categories of information. The system ensures proper accessibility with keyboard navigation support and ARIA attributes for screen readers.",
  },
  {
    keywords: ["popup", "modal", "lightbox", "overlay"],
    response:
      "Popups display content in an overlay that appears above the page. In Displan, add popups using the Popup element from the Elements panel. Configure trigger conditions (on page load, after delay, on exit intent, on scroll, or on button click), size, position, and backdrop style. Design the popup content using any combination of elements. Popups are useful for newsletter signups, important announcements, special offers, or displaying additional information without navigating away from the current page. For user experience, ensure popups are not intrusive, include a clear close button, and consider frequency capping to avoid showing the same popup repeatedly to returning visitors.",
  },
  {
    keywords: ["countdown", "timer", "clock", "deadline"],
    response:
      "Countdown timers create urgency and anticipation for upcoming events or offers. In Displan, add countdowns using the Countdown element from the Elements panel. Set the target date and time, and choose between various display formats. Customize appearance with different styles, colors, and sizes. Configure actions to occur when the countdown reaches zero, such as displaying a message, showing a hidden element, or redirecting to another page. Countdowns are effective for product launches, limited-time offers, event registration deadlines, or any time-sensitive content. For recurring events, you can set the timer to reset automatically at specified intervals.",
  },
  {
    keywords: ["progress bar", "loading bar", "status indicator", "completion"],
    response:
      "Progress bars visually represent completion status or progress toward a goal. In Displan, add progress bars using the Progress element from the Elements panel. Set the progress percentage and choose from linear or circular styles. Customize colors, sizes, and add labels or percentage displays. For dynamic progress bars, you can connect them to form completion, scroll position, or custom triggers. Progress bars are useful for multi-step forms, fundraising goals, skill level indicators, or project timelines. They provide visual feedback that helps users understand status at a glance.",
  },
  {
    keywords: ["table", "data table", "pricing table", "comparison"],
    response:
      "Tables organize information in rows and columns for easy comparison. In Displan, add tables using the Table element from the Elements panel. Specify the number of rows and columns, add headers, and customize cell content. Style options include border styles, cell padding, alternating row colors, and responsive behavior. For larger tables, enable sorting, filtering, and pagination to improve usability. On mobile devices, tables can transform into cards or stacked layouts for better readability. Tables are ideal for pricing comparisons, feature matrices, schedules, or any structured data presentation.",
  },
  {
    keywords: ["map", "google maps", "location", "directions"],
    response:
      "Maps help visitors find your physical location or visualize geographic information. In Displan, add maps using the Map element from the Elements panel. Specify locations by address or coordinates, adjust zoom level, and customize map style. Add multiple markers with custom icons and information windows that display details when clicked. Configure controls like zoom buttons, street view, and fullscreen options. Maps are particularly useful for contact pages, store locators, event venues, or travel websites. For performance optimization, maps are lazy-loaded by default, only initializing when they come into view.",
  },
  {
    keywords: ["social", "social media", "share buttons", "follow"],
    response:
      "Social media elements connect your website to your social presence. In Displan, add social features using the Social elements from the Elements panel. Options include: 1) Social link icons that connect to your profiles, with various icon styles and hover effects; 2) Share buttons that allow visitors to share your content on their networks; 3) Social feeds that display your latest posts from platforms like Instagram, Twitter, or Facebook. You can customize colors to match your brand or the original platform colors. For SEO and sharing optimization, configure Open Graph and Twitter Card meta tags in the SEO settings to control how your content appears when shared.",
  },
  {
    keywords: ["divider", "separator", "hr", "line"],
    response:
      "Dividers create visual separation between content sections. In Displan, add dividers using the Divider element from the Elements panel. Customize style (solid, dashed, dotted), thickness, color, and width (full-width or partial). For decorative dividers, add icons or text in the center, or create stylized shapes using the divider's advanced options. Dividers help organize content, improve readability, and create visual rhythm in your layout. They're particularly useful between distinct content sections, in sidebars, or to separate items in a list. For responsive designs, you can adjust divider appearance for different screen sizes.",
  },
  {
    keywords: ["embed", "iframe", "html embed", "widget"],
    response:
      "Embed elements incorporate external content or widgets into your website. In Displan, add embeds using the Embed element from the Elements panel. You can paste HTML code from third-party services, or use the specialized embed options for common platforms like YouTube, Vimeo, Spotify, SoundCloud, Google Maps, and more. These specialized embeds include optimized settings and responsive behavior. For custom iframes, you can control dimensions, scrolling behavior, and border style. Embeds are useful for incorporating reservation systems, payment widgets, chat support, or any third-party functionality that enhances your website.",
  },
  {
    keywords: ["list", "bullet list", "numbered list", "checklist"],
    response:
      "Lists organize information in a sequential or grouped format. In Displan, add lists using the List element from the Elements panel. Choose between unordered lists (bullet points), ordered lists (numbered), or checklists (with checkmarks). Customize marker style, spacing, and typography. For advanced styling, you can replace default markers with custom icons or create multi-level nested lists. Lists are effective for presenting features, steps in a process, product benefits, or any content that benefits from a structured format. They improve readability by breaking information into digestible chunks and creating visual hierarchy.",
  },
  {
    keywords: ["card", "info card", "content card", "feature card"],
    response:
      "Cards are versatile containers that group related content in a visually distinct way. In Displan, add cards using the Card element from the Elements panel. Each card can contain various elements like images, headings, text, buttons, or custom content. Customize appearance with different background colors, borders, shadows, and hover effects. Cards are commonly used for product listings, team members, service offerings, blog post previews, or pricing plans. They create clear visual boundaries around related content and work well in grid layouts for comparing multiple items. For responsive designs, cards automatically adjust to maintain readability on all screen sizes.",
  },
  {
    keywords: ["testimonial", "review", "quote", "feedback"],
    response:
      "Testimonials build trust by showcasing positive feedback from customers. In Displan, add testimonials using the Testimonial element from the Elements panel. Each testimonial can include a quote, customer name, position, company, photo, and rating. Choose from various layouts including cards, sliders, or grids. Customize appearance with different styles, colors, and quote mark designs. For maximum credibility, include specific details in testimonials rather than generic praise. Testimonials are most effective when placed near conversion points like pricing sections or call-to-action buttons. For larger collections, implement filtering by industry, product, or rating to help visitors find relevant feedback.",
  },
    {
    keywords: ["team", "team member", "staff", "about us"],
    response:
      "Team sections introduce the people behind your organization. In Displan, create team sections using the Team element from the Elements panel or by combining individual Team Member elements. Each profile can include a photo, name, position, bio, and social links. Choose from layouts like grid, carousel, or list view. Customize appearance with different card styles, hover effects, and typography. Team sections are essential for about pages, establishing credibility and adding a human element to your brand. For larger teams, consider grouping members by department or adding filtering options.",
  },
  {
    keywords: ["pricing", "price table", "plans", "subscription"],
    response:
      "Pricing sections present your product or service costs in a clear, comparable format. In Displan, create pricing tables using the Pricing Table element from the Elements panel. Configure multiple plans with features, prices, and call-to-action buttons. Highlight recommended plans, add badges for popular options, and include toggle switches for monthly/annual pricing. Customize appearance with different styles, colors, and hover effects. For effective pricing pages, clearly communicate the value proposition of each tier, use simple language, and make the differences between plans obvious. Consider adding testimonials or guarantees near pricing to reduce purchase anxiety.",
  },
  {
    keywords: ["faq", "frequently asked questions", "accordion", "questions"],
    response:
      "FAQ sections address common customer questions and reduce support inquiries. In Displan, create FAQ sections using the FAQ element from the Elements panel, which implements an accessible accordion interface. Group questions by category if you have many, and arrange them with the most common questions first. Each question can expand to reveal a detailed answer, including text, images, or links. For SEO benefits, FAQs are implemented with proper structured data markup that search engines can use to display rich results in search listings. Consider adding a search box for larger FAQ sections to help users quickly find specific information.",
  },
  {
    keywords: ["contact", "contact info", "address", "phone"],
    response:
      "Contact sections provide ways for visitors to reach you. In Displan, create contact sections using the Contact element from the Elements panel. Include components like contact form, address, phone number, email, business hours, and map. Use icons to visually distinguish different contact methods. For multi-location businesses, create tabs or accordions for each location. Ensure contact information is consistent across your website and matches your Google Business profile for SEO benefits. For better user experience, make phone numbers and email addresses clickable with proper tel: and mailto: links that work on mobile devices.",
  },
  {
    keywords: ["blog", "blog post", "article", "news"],
    response:
      "Blog sections showcase your latest content and establish thought leadership. In Displan, create blog layouts using the Blog element from the Elements panel. Choose from layouts like grid, list, or masonry for your post previews. Each preview typically includes featured image, title, excerpt, publication date, author, and category. Configure the number of posts to display, sorting options, and pagination style. For dynamic blogs, the system automatically updates the section when you publish new content. You can also add filtering by category or tags, featured post highlights, and related post suggestions to encourage deeper engagement with your content.",
  },
  {
    keywords: ["portfolio", "projects", "work", "case studies"],
    response:
      "Portfolio sections showcase your work and demonstrate expertise. In Displan, create portfolio galleries using the Portfolio element from the Elements panel. Choose from layouts like grid, masonry, or carousel. Each project can include images, title, category, description, and link to a detailed case study. Add filtering options to let visitors sort by project type, industry, or other relevant categories. For best results, include high-quality images and concise descriptions that highlight the problem solved and results achieved. Consider adding client testimonials alongside portfolio items to strengthen credibility. The portfolio automatically adjusts its layout for different screen sizes.",
  },
  {
    keywords: ["statistics", "stats", "numbers", "counter"],
    response:
      "Statistics sections highlight impressive numbers related to your business. In Displan, create statistics displays using the Stats element from the Elements panel. Each stat can include a number (with optional animation that counts up from zero), label, icon, and brief description. Arrange stats in rows or grids, and customize appearance with different styles, colors, and typography. Statistics are effective for showcasing achievements like years in business, clients served, projects completed, or satisfaction rates. For credibility, use specific, verifiable numbers rather than round figures, and consider adding a brief source note for particularly impressive statistics.",
  },
  {
    keywords: ["timeline", "history", "process", "steps"],
    response:
      "Timelines visualize sequential information like company history or process steps. In Displan, create timelines using the Timeline element from the Elements panel. Choose between horizontal or vertical orientation, and customize the connector style, markers, and content cards. Each timeline entry can include date/title, description, images, and links. For interactive timelines, enable features like scroll animation or click-to-expand details. Timelines are effective for about pages (company history), explaining multi-step processes, project case studies, or product evolution stories. They create a narrative flow that guides visitors through sequential information in an engaging visual format.",
  },
  {
    keywords: ["comparison", "compare", "versus", "table"],
    response:
      "Comparison sections help visitors evaluate options side by side. In Displan, create comparison tables using the Comparison element from the Elements panel. Set up multiple columns for different products, services, or plans, and rows for various features or specifications. Customize with icons to indicate yes/no or good/better/best ratings. Add visual highlights for recommended options or feature differences. Comparison tables are particularly effective for product variations, service tiers, or competitive analysis. For mobile optimization, the table automatically transforms into a more readable format on small screens, typically stacking the columns vertically with repeated headers.",
  },
  {
    keywords: ["hero", "banner", "header", "jumbotron"],
    response:
      "Hero sections create a powerful first impression at the top of your website. In Displan, create hero sections using the Hero element from the Elements panel. Choose from layouts like centered, split, fullscreen, or animated. Include components such as headline, subheading, call-to-action buttons, background image/video, and optional decorative elements. For engaging heroes, use concise, benefit-focused headlines, high-quality visuals, and clear call-to-action buttons. Consider adding subtle animations or parallax effects for visual interest. The hero automatically adjusts for different screen sizes, with customizable text alignment and spacing for mobile devices.",
  },
  {
    keywords: ["features", "feature list", "benefits", "advantages"],
    response:
      "Feature sections highlight your product's or service's key benefits. In Displan, create feature sections using the Features element from the Elements panel. Choose from layouts like grid, columns, tabs, or icon list. Each feature can include icon, title, description, and optional image or link. For effective feature sections, focus on benefits rather than specifications, use consistent icon style, and organize features by importance or logical grouping. Consider adding visual dividers between features, hover effects for interactive engagement, and clear headings that communicate the overall value proposition before diving into specific features.",
  },
  {
    keywords: ["cta", "call to action", "conversion", "action button"],
    response:
      "Call-to-action (CTA) sections prompt visitors to take a specific next step. In Displan, create CTA sections using the CTA element from the Elements panel. Choose from styles like banner, box, split, or fullwidth. Include components such as headline, supporting text, buttons, and optional image or background. For effective CTAs, use action-oriented button text ('Start Free Trial' rather than 'Submit'), create visual contrast to draw attention, and communicate a clear benefit or solve a specific pain point. Strategic placement is crucial – add CTAs after establishing value, at natural decision points, and at the end of content sections.",
  },
  {
    keywords: ["footer", "page footer", "bottom", "site footer"],
    response:
      "Footers provide important links and information at the bottom of every page. In Displan, create footers using the Footer element from the Elements panel. Choose from layouts like simple, multi-column, or complex. Include components such as logo, navigation links, contact information, social icons, newsletter signup, copyright notice, and legal links. For effective footers, organize links in logical groups, ensure contact information is up-to-date, and include trust elements like security badges or association logos if relevant. The footer automatically adjusts its layout for different screen sizes, typically stacking columns on mobile devices.",
  },
  {
    keywords: ["header", "navigation", "navbar", "top bar"],
    response:
      "Headers provide navigation and branding at the top of your website. In Displan, create headers using the Header element from the Elements panel. Choose from styles like centered, split, minimal, or complex. Include components such as logo, navigation menu, search bar, call-to-action button, and optional extras like language selector or social icons. For effective headers, ensure navigation labels are clear and concise, limit the number of menu items (7±2 is ideal), and consider making the header sticky so it remains visible as users scroll. The header automatically transforms for mobile devices, typically using a hamburger menu to conserve space.",
  },
  {
    keywords: ["logo", "brand", "identity", "logotype"],
    response:
      "Your logo is the visual cornerstone of your brand identity. In Displan, add your logo using the Logo element from the Elements panel. Upload your logo file (SVG format recommended for best quality at all sizes) through the Media Library. For dark/light mode support, you can upload alternate versions and configure when each appears. Set appropriate sizing that ensures visibility without dominating the layout, and add alt text for accessibility and SEO. The logo element automatically links to your homepage by default. For responsive designs, you can configure different logo versions or sizes for various screen sizes, such as using a simplified icon-only version on mobile.",
  },
  {
    keywords: ["newsletter", "subscribe", "email signup", "mailing list"],
    response:
      "Newsletter signup forms help you build an email list for marketing. In Displan, create newsletter sections using the Newsletter element from the Elements panel. Choose from layouts like inline, card, popup, or banner. Include components such as headline, benefit statement, input field, submit button, and privacy note. For effective newsletter signups, clearly communicate the value proposition (what subscribers will receive), set expectations for email frequency, and consider offering an incentive for signing up. The form connects to popular email marketing services like Mailchimp, ConvertKit, or Campaign Monitor through the integrations panel in settings.",
  },
  {
    keywords: ["search", "search bar", "search box", "find"],
    response:
      "Search functionality helps visitors quickly find specific content. In Displan, add search features using the Search element from the Elements panel. Choose from styles like simple, expanded, or overlay. Customize the placeholder text, button style, and results display format. The search system indexes all your website content, including pages, blog posts, products, and custom post types. For enhanced search, enable features like autocomplete suggestions, search filters, and recent/popular searches display. The search results page can be customized with different layouts and sorting options. For e-commerce sites, product search can include filters for categories, prices, and attributes.",
  },
  {
    keywords: ["animation", "animate", "motion", "movement"],
    response:
      "Animations add visual interest and guide user attention. In Displan, add animations to any element through the Animations panel in the Properties sidebar. Choose from entrance animations (triggered when elements enter the viewport), hover animations (activated when users hover over elements), click animations (responding to user interactions), and scroll animations (progressing as users scroll). Each animation type offers various effects like fade, slide, zoom, rotate, and bounce. Customize timing, delay, easing function, and intensity. For performance and user experience, use animations purposefully to highlight important elements or guide attention, rather than animating everything.",
  },
  {
    keywords: ["mobile", "responsive", "phone", "tablet"],
    response:
      "Mobile optimization ensures your website works well on all devices. In Displan, preview and customize your mobile design using the device selector in the top toolbar. The system follows a mobile-first approach, where you design for mobile and then enhance for larger screens. You can adjust layout, spacing, font sizes, and visibility for different breakpoints. For optimal mobile experience: ensure tap targets (buttons, links) are at least 44×44 pixels, use readable font sizes (minimum 16px for body text), optimize images for faster loading, simplify navigation with hamburger menus, and test all interactive elements for touch compatibility. The preview mode lets you test your mobile design with touch gestures.",
  },
  {
    keywords: ["seo", "search engine", "ranking", "google"],
    response:
      "SEO (Search Engine Optimization) helps your website rank higher in search results. In Displan, manage SEO settings through the SEO panel accessible from page settings. For each page, you can set custom meta titles, descriptions, and focus keywords. The system automatically generates clean, semantic HTML with proper heading structure and schema markup. For images, always add descriptive alt text. The platform also creates an XML sitemap and robots.txt file for better search engine crawling. Additional SEO features include customizable URL slugs, canonical tags for duplicate content, and social sharing meta tags (Open Graph and Twitter Cards) to control how your content appears when shared.",
  },
  {
    keywords: ["performance", "speed", "loading", "optimization"],
    response:
      "Website performance affects user experience and SEO rankings. Displan automatically implements several optimizations: image compression and responsive delivery, code minification, lazy loading for off-screen content, and browser caching. To further improve performance: optimize image sizes before uploading (aim for under 200KB per image), limit the number of custom fonts, use the built-in performance analyzer in the Tools menu to identify bottlenecks, and consider enabling the Content Delivery Network option in Settings > Performance for faster global content delivery. The system provides a performance score based on key metrics like load time, time to interactive, and cumulative layout shift.",
  },
  {
    keywords: ["accessibility", "a11y", "wcag", "ada"],
    response:
      "Accessibility ensures your website is usable by people with disabilities. Displan helps you create accessible websites by providing features like semantic HTML structure, proper heading hierarchy, and keyboard navigation support. The built-in accessibility checker in the Tools menu identifies issues based on WCAG standards. For better accessibility: add alt text to all images, maintain sufficient color contrast (4.5:1 for normal text), use descriptive link text instead of 'click here', implement proper form labels, and ensure interactive elements are keyboard-accessible. The platform supports ARIA attributes for complex components and automatically generates an accessibility statement page that you can customize with your specific compliance information.",
  },
  {
    keywords: ["analytics", "tracking", "statistics", "data"],
    response:
      "Analytics help you understand visitor behavior and improve your website. In Displan, set up analytics through Settings > Integrations > Analytics. The platform supports popular services like Google Analytics, Facebook Pixel, and Hotjar. Once connected, you can track metrics like page views, traffic sources, user demographics, and behavior flow. For more detailed insights, set up event tracking for specific actions like button clicks, form submissions, or video plays. The dashboard provides visual reports with key metrics and trends over time. For e-commerce sites, you can track additional metrics like conversion rates, average order value, and revenue. The data helps you make informed decisions about content, design, and marketing strategies.",
  },
  {
    keywords: ["domain", "url", "website address", "custom domain"],
    response:
      "A custom domain creates a professional web address for your site. In Displan, manage domains through Settings > Domains. You can either purchase a new domain directly through the platform or connect a domain you already own from another registrar. For existing domains, you'll need to update your DNS settings with the provided A records and CNAME records. The system automatically provisions SSL certificates for secure HTTPS connections. You can also set up subdomain redirects, configure www vs. non-www preference, and manage domain privacy settings. For international audiences, consider adding multiple language-specific domains that redirect to the appropriate language version of your site.",
  },
  {
    keywords: ["publish", "go live", "launch", "deploy"],
    response:
      "Publishing makes your website live and accessible to visitors. In Displan, publish your site by clicking the Publish button in the top right corner. You can choose to publish all changes or select specific changes to go live. Before publishing, use the Preview mode to check how your site will appear to visitors. The platform automatically optimizes all assets for production, generates a sitemap, and updates search engine indexes. For larger updates, you can schedule publishing for a specific date and time. After publishing, the system performs availability checks to ensure your site is accessible. You can also enable staging environments (on higher-tier plans) to test changes before pushing them to your live site.",
  },
  {
    keywords: ["backup", "restore", "version", "history"],
    response:
      "Backups protect your work and allow you to restore previous versions. Displan automatically creates daily backups of your website, stored for 30 days (longer on higher-tier plans). Access your backup history through Settings > Backups, where you can view a timeline of changes. Create manual backups before making significant changes by clicking the 'Create Backup' button. To restore a previous version, select the desired backup point and click 'Restore'. You can preview backups before restoring to ensure you're selecting the correct version. For team projects, the version history includes information about who made specific changes, with timestamps and user details. You can also export backups locally for additional security.",
  },
  {
    keywords: ["collaboration", "team", "multi-user", "sharing"],
    response:
      "Collaboration features allow multiple people to work on a website. In Displan, manage team access through Settings > Team. Invite team members via email and assign different roles: Admin (full access), Editor (can modify content but not settings), Designer (can modify design but not publish), and Viewer (can only view and comment). The platform supports real-time collaboration, showing who's currently working on what section. The commenting system allows team members to leave feedback directly on specific elements. For agencies, you can set up client access with limited permissions for review and approval workflows. The activity log tracks all changes with user attribution, making it easy to monitor project progress and accountability.",
  },
  {
    keywords: ["e-commerce", "shop", "store", "sell online"],
    response:
      "E-commerce functionality lets you sell products or services online. In Displan, set up an online store through Settings > E-commerce. The platform supports physical products, digital downloads, subscriptions, and services. Create product listings with images, descriptions, variants (like size or color), and inventory tracking. Set up payment processing through integrations with Stripe, PayPal, Square, or other providers. Configure shipping options, tax rules, and discount codes. The checkout process is optimized for conversions, with features like guest checkout, saved payment methods, and order confirmation emails. The e-commerce dashboard provides sales analytics, inventory alerts, and order management tools. For marketing, you can implement abandoned cart recovery, product recommendations, and integration with email marketing platforms.",
  },
  {
    keywords: ["blog", "articles", "posts", "content management"],
    response:
      "Blogging features help you publish and manage content regularly. In Displan, set up a blog through Settings > Blog. The content management system includes a rich text editor with formatting options, media embedding, and SEO tools. Organize content with categories and tags, schedule posts for future publishing, and enable features like author profiles and commenting. Choose from various blog layouts like list, grid, or magazine style, and customize the appearance of post previews and detail pages. For content strategy, use the analytics integration to track popular topics and reader engagement. The system automatically generates RSS feeds for subscribers and implements proper structured data markup for better search engine visibility.",
  },
  {
    keywords: ["forms", "contact form", "submission", "data collection"],
    response:
      "Forms collect information from visitors and enable interactions. In Displan, create forms using the Form Builder in the Elements panel. Add various field types including text, email, phone, number, date, checkbox, radio, select, file upload, and more. Configure validation rules, error messages, and conditional logic that shows/hides fields based on previous answers. Set up form submissions to be sent to your email, stored in the dashboard, or integrated with services like Google Sheets, CRM systems, or email marketing platforms. For spam prevention, enable CAPTCHA or honeypot fields. The form analytics show submission rates, completion times, and common drop-off points to help you optimize for better conversion.",
  },
  {
    keywords: ["membership", "login", "registration", "user accounts"],
    response:
      "Membership functionality creates gated content or user accounts. In Displan, enable membership features through Settings > Membership. Set up registration and login forms, email verification workflows, and member profiles. Create different membership levels with varying access permissions to control who can view specific content. The system supports social login options (Google, Facebook, Twitter) for easier registration. For paid memberships, integrate with payment processors to handle subscriptions or one-time fees. The member dashboard allows users to update their profiles, view their subscription status, and access exclusive content. For community building, you can add member directories, private messaging, or forum integration depending on your plan level.",
  },
  {
    keywords: ["multilingual", "translation", "language", "international"],
    response:
      "Multilingual features let you create content in multiple languages. In Displan, set up language versions through Settings > Languages. Add the languages you want to support, and the system creates language variants of your pages where you can translate content while maintaining the same design. The language switcher element can be added to your site, allowing visitors to select their preferred language. The platform supports right-to-left languages like Arabic and Hebrew, automatically adjusting layouts as needed. For SEO, the system implements proper hreflang tags and language meta information. You can either manually translate content or use the integrated translation service (available on higher-tier plans) to automatically translate text with human review options.",
  },
  {
    keywords: ["security", "protection", "privacy", "ssl"],
    response:
      "Security features protect your website and visitor data. Displan implements several security measures by default: SSL encryption for all sites, DDoS protection, regular security updates, and secure password storage. Additional security options in Settings > Security include two-factor authentication for admin access, IP blocking for suspicious activity, content security policies to prevent code injection, and automated malware scanning. For forms and user data, the platform is GDPR-compliant with features like consent checkboxes, data export tools, and privacy policy generators. The security log tracks login attempts and other security-related events, alerting you to potential issues. For e-commerce sites, additional PCI compliance features ensure secure handling of payment information.",
  },
  {
    keywords: ["hosting", "server", "uptime", "reliability"],
    response:
      "Displan includes reliable hosting for all websites. Your sites are hosted on high-performance servers with 99.9% uptime guarantee, ensuring your website loads quickly and is always available to visitors. The hosting infrastructure automatically scales based on your traffic needs, so your site remains responsive even during traffic spikes. All hosting includes CDN (Content Delivery Network) integration for faster global content delivery, DDoS protection, and automatic daily backups. The system handles all technical maintenance, including security updates and performance optimizations. For higher-tier plans, additional features include dedicated resources, priority support, and advanced caching mechanisms for even better performance.",
  },
  {
    keywords: ["white label", "branding", "agency", "client"],
    response:
      "White-labeling allows agencies to present Displan as their own platform. Available on Agency plans, white-labeling lets you customize the editor interface with your logo, colors, and domain. Create client accounts with your branding, set up custom email notifications, and generate branded PDF reports. The client dashboard can be tailored to show only the features you want clients to access. This creates a seamless experience where clients feel they're using your proprietary platform rather than a third-party tool. Additional agency features include client billing management, team collaboration tools, and project templates that speed up the creation of new client websites with your preferred starting points and brand guidelines.",
  },
  {
    keywords: ["export", "code export", "html", "download"],
    response:
      "Code export lets you download your website's code for hosting elsewhere. In Displan, export your site through Settings > Export, choosing from formats like complete HTML/CSS/JS package, WordPress theme, or React/Next.js project (on higher-tier plans). The exported code is clean, optimized, and follows best practices, with all assets included in the package. This feature is useful for developers who want to start with a visual design and then add custom functionality, or for situations where you need to migrate to a different hosting platform. Note that dynamic features like forms processing might require additional setup when self-hosting. The export includes documentation on how to deploy and maintain your exported site.",
  },
  {
    keywords: ["api", "integration", "connect", "third party"],
    response:
      "API integrations connect your website with external services. In Displan, manage integrations through Settings > Integrations, where you can connect with payment processors, email marketing tools, CRM systems, analytics platforms, and more. For custom API integrations, use the API Connector element to make HTTP requests to external services and display the returned data. The platform includes authentication handling for OAuth, API keys, and other common methods. For developers, Displan also offers its own API (on higher-tier plans) that allows programmatic access to your website content and settings, enabling custom applications or workflows that interact with your site data.",
  },
  {
    keywords: ["custom code", "html", "css", "javascript"],
    response:
      "Custom code extends functionality beyond the visual editor. In Displan, add custom code through several methods: 1) The HTML element for inline HTML snippets; 2) The CSS panel in Settings > Advanced for site-wide styles; 3) The JavaScript panel for custom scripts, with loading options and trigger conditions; 4) The Code Injection feature in page settings for page-specific code. For reusable functionality, create custom elements with HTML, CSS, and JavaScript that can be saved to your library. The code editor includes syntax highlighting, error checking, and auto-completion to help you write clean code. Custom code executes in a sandboxed environment to prevent conflicts with core functionality, with console access for debugging.",
  },
  {
    keywords: ["design system", "style guide", "brand guidelines", "consistency"],
    response:
      "Design systems ensure visual consistency across your website. In Displan, create and manage your design system through Settings > Design System. Define global styles for colors, typography, spacing, borders, shadows, and other visual elements. Create component variants for buttons, cards, form fields, and other reusable elements. When you update a design system element, all instances throughout your site update automatically, making site-wide design changes efficient. The design system can be exported as documentation for your brand guidelines, helping team members understand and correctly implement your visual identity. For agencies, you can create master design systems that can be applied to new projects as starting points.",
  },
  {
    keywords: ["templates", "starter", "preset", "theme"],
    response:
      "Templates provide ready-made designs to jumpstart your website. In Displan, access templates when creating a new project or through the Templates panel in the editor. Browse categories like business, portfolio, e-commerce, blog, landing page, and more. Each template includes professionally designed pages with placeholder content that you can easily customize. You can also save your own designs as custom templates for future use or team sharing. For specific sections rather than full pages, use the Section Templates in the Elements panel, which provide pre-designed components for common needs like heroes, features, testimonials, or contact sections. Templates are fully responsive and follow design best practices, giving you a solid foundation to build upon.",
  },
  {
    keywords: ["revision history", "undo", "version control", "changes"],
    response:
      "Revision history tracks changes to your website over time. In Displan, access the revision history through the History panel in the left sidebar. View a chronological list of all changes, including who made them and when. Select any previous version to preview how your site looked at that point, and restore if needed. For specific elements, you can view their individual edit history by right-clicking and selecting 'View History'. The system also creates automatic save points during editing to prevent data loss. For team collaboration, the revision history includes user attribution and optional comments explaining significant changes, making it easy to understand how the site has evolved and who contributed specific updates.",
  },
  {
    keywords: ["comments", "feedback", "collaboration", "review"],
    response:
      "Comments facilitate feedback and collaboration on your website design. In Displan, use the Comment tool in the top toolbar to add comments anywhere on your canvas. Click where you want to comment, type your message, and optionally assign it to a team member. Comments appear as pins on the canvas that expand when clicked, showing the conversation thread. Team members can reply to comments, mark them as resolved, or reopen them if needed. The Comments panel in the sidebar shows all comments across your project, with filtering options for status, assignee, or page. Email notifications alert team members to new comments or replies. This system streamlines the review process and keeps feedback organized directly within the context of your design.",
  },
  {
    keywords: ["preview", "test", "device preview", "responsive testing"],
    response:
      "Preview mode shows how your website will appear to visitors. In Displan, enter Preview mode by clicking the Eye icon in the top toolbar. This displays your site without the editor interface, allowing you to test interactions like clicking links, submitting forms, or navigating between pages. Use the device selector to preview how your site looks on different screen sizes, from mobile phones to large desktops. The responsive preview includes accurate device frames and touch interaction simulation. You can also generate shareable preview links to send to clients or team members for feedback, even if they don't have editor access. These preview links can be password-protected and include commenting functionality for collecting feedback.",
  },
  {
    keywords: ["grid", "layout grid", "alignment", "guides"],
    response:
      "Layout grids help create aligned, consistent designs. In Displan, enable the grid by clicking the Grid icon in the toolbar. Configure column count (typically 12 or 16), gutter width, and margin size. Elements can snap to the grid for precise alignment. For more flexibility, you can create custom grid configurations for different sections of your page. The grid is only visible in the editor and won't appear on your published website. In addition to the column grid, you can enable baseline grids for vertical rhythm, ensuring text aligns to consistent baselines. For pixel-perfect positioning, use the rulers and guides feature, which lets you drag out custom alignment guides from the horizontal and vertical rulers.",
  },
  {
    keywords: ["layers", "z-index", "stacking", "element hierarchy"],
    response:
      "The Layers panel manages the structure and stacking order of your elements. In Displan, access the Layers panel from the left sidebar. It displays a hierarchical tree of all elements on your page, showing parent-child relationships and grouping. Select any element in the panel to highlight it on the canvas, or right-click for additional options like duplicate, delete, or hide. Drag elements within the panel to change their stacking order (z-index) or to move them between different container elements. The panel includes filtering and search options to help you find specific elements in complex pages. For organization, you can rename elements with descriptive labels that make the structure more understandable.",
  },
  {
    keywords: ["assets", "media library", "images", "files"],
    response:
      "The Media Library manages all images and files used in your website. In Displan, access the Media Library from the left sidebar or when adding media elements. Upload images, videos, documents, or other files, which are automatically organized by type and date. The system optimizes uploaded images for web performance, creating multiple sizes for responsive delivery. You can create folders to organize assets, add metadata like alt text or descriptions, and use the search function to quickly find specific files. The library shows where each asset is used across your site, making it easy to update or replace assets globally. For team collaboration, you can see who uploaded each asset and when, with version history for tracking changes.",
  },
  {
    keywords: ["components", "reusable", "symbols", "library"],
    response:
      "Components are reusable elements that maintain consistency across your site. In Displan, create components by selecting any element or group, right-clicking, and choosing 'Save as Component'. Give it a name and category, then access it from the Components panel in the left sidebar. When you update a component, all instances throughout your site update automatically, saving time and ensuring consistency. You can create component variants with different states or styles, and set which properties can be overridden in individual instances. For team collaboration, components are shared across the project, creating a unified design language. The component library can be exported or imported between projects, helping you build a consistent design system across multiple websites.",
  },
  {
    keywords: ["interactions", "events", "triggers", "actions"],
    response:
      "Interactions add dynamic behavior to your website without coding. In Displan, add interactions through the Interactions panel in the Properties sidebar. Select an element, choose a trigger event (click, hover, scroll, load, etc.), and define the resulting action. Actions include show/hide elements, animate properties, play media, scroll to section, toggle class, or run custom JavaScript. You can chain multiple actions together and add conditions for when they should occur. For complex interactions, use the timeline editor to sequence animations with precise timing control. The interaction preview mode lets you test your interactions directly in the editor before publishing. All interactions are implemented with performance and accessibility in mind, ensuring they work well across devices.",
  },
  {
    keywords: ["shortcuts", "keyboard", "hotkeys", "efficiency"],
    response:
      "Keyboard shortcuts speed up your workflow in Displan. Access the full list by pressing ? or through Help > Keyboard Shortcuts. Common shortcuts include: Ctrl/Cmd+S to save, Ctrl/Cmd+Z to undo, Ctrl/Cmd+Y to redo, Ctrl/Cmd+D to duplicate selected elements, Delete to remove elements, Arrow keys to nudge elements, Ctrl/Cmd+G to group elements, and Spacebar to temporarily access the Hand tool for canvas navigation. When selecting multiple elements, hold Shift while clicking. For precise resizing, hold Shift while resizing to maintain proportions, or Alt/Option to resize from the center. You can customize certain shortcuts in Settings > Preferences to match your workflow preferences.",
  },
  {
    keywords: ["publish", "go live", "launch", "deploy"],
    response:
      "Publishing makes your website live and accessible to visitors. In Displan, publish your site by clicking the Publish button in the top right corner. You can choose to publish all changes or select specific changes to go live. Before publishing, use the Preview mode to check how your site will appear to visitors. The platform automatically optimizes all assets for production, generates a sitemap, and updates search engine indexes. For larger updates, you can schedule publishing for a specific date and time. After publishing, the system performs availability checks to ensure your site is accessible. You can also enable staging environments (on higher-tier plans) to test changes before pushing them to your live site.",
  },
  {
    keywords: ["undo", "redo", "revert", "history"],
    response:
      "Undo and redo functionality helps you recover from mistakes or experiment with different options. In Displan, use Ctrl/Cmd+Z to undo your last action and Ctrl/Cmd+Y (or Ctrl/Cmd+Shift+Z) to redo. The History panel in the left sidebar shows a complete list of actions you've taken, allowing you to jump back to any previous state. Each action is timestamped and labeled with a descriptive name. For more selective reverting, you can use the element history feature by right-clicking any element and selecting 'View History', which shows changes specific to that element. The system maintains your undo history even if you refresh the page or close the browser, ensuring you don't lose your editing context.",
  },
  {
    keywords: ["duplicate", "copy", "clone", "replicate"],
    response:
      "Duplicating elements saves time when creating similar content. In Displan, select any element and duplicate it using Ctrl/Cmd+D, the duplicate icon in the toolbar, or right-click and select 'Duplicate'. The duplicate appears near the original with the same properties and content. You can also copy elements between different pages or projects using Ctrl/Cmd+C to copy and Ctrl/Cmd+V to paste. For creating multiple copies with a specific arrangement, use the Repeat feature (right-click > Repeat) to specify the number of copies and their arrangement (grid, horizontal, or vertical) with customizable spacing. When duplicating complex elements like forms or interactive components, all settings and functionality are preserved in the copies.",
  },
  {
    keywords: ["group", "ungroup", "organize", "container"],
    response:
      "Grouping helps organize related elements for easier manipulation. In Displan, select multiple elements and group them using Ctrl/Cmd+G, the group icon in the toolbar, or right-click and select 'Group'. Grouped elements move and resize together, simplifying layout management. To edit individual elements within a group, either double-click the group to enter it, or use the Layers panel to select specific children. Ungroup elements with Ctrl/Cmd+Shift+G or right-click and select 'Ungroup'. You can create nested groups (groups within groups) for complex hierarchies, and give groups descriptive names in the Layers panel for better organization. Groups can have their own styling, such as background colors or borders, creating visual containers for their contents.",
  },
  {
    keywords: ["align", "distribute", "arrangement", "positioning"],
    response:
      "Alignment tools help create precise, professional layouts. In Displan, select multiple elements and use the alignment options in the toolbar or right-click menu. Horizontal alignment options include left, center, and right; vertical options include top, middle, and bottom. For even spacing between elements, use the distribution tools, which equalize the space between selected elements horizontally or vertically. The smart guides feature automatically shows alignment lines as you drag elements, helping you line up with other elements on the page. For more precise control, enable the grid and snapping features, which help elements align to consistent increments. You can also specify exact position coordinates in the Position panel for pixel-perfect placement.",
  },
  {
    keywords: ["resize", "scale", "dimensions", "size"],
    response:
      "Resizing controls the dimensions of your elements. In Displan, select any element and use the handles to resize it visually, or enter exact dimensions in the Size panel of the Properties sidebar. Hold Shift while resizing to maintain the element's aspect ratio, or Alt/Option to resize from the center point. For responsive designs, you can set different sizes for different device breakpoints, or use relative units like percentages instead of fixed pixels. The constraint controls let you decide how elements should resize when their container changes size, with options to maintain aspect ratio, fill available space, or fix specific dimensions. For text elements, you can enable auto-height to let the container expand based on content length.",
  },
  {
    keywords: ["constraints", "responsive", "relative", "parent-child"],
    response:
      "Constraints control how elements respond when their parent container resizes. In Displan, set constraints through the Constraints panel in the Properties sidebar. Horizontal constraints determine whether an element sticks to the left, right, both sides, or center of its container. Vertical constraints work similarly for top, bottom, both, or middle positioning. For elements that should maintain a specific aspect ratio, enable the 'Preserve ratio' option. Constraints are particularly important for responsive design, ensuring elements adapt appropriately to different screen sizes. For example, a button might be constrained to the bottom-right of a card, staying in that position regardless of how the card resizes across different devices.",
  },
  {
    keywords: ["canvas", "artboard", "workspace", "editing area"],
    response:
      "The canvas is your main workspace for designing websites in Displan. Navigate the canvas using the Hand tool (press and hold Spacebar), zoom controls in the bottom toolbar, or mouse wheel scrolling. For precise positioning, enable rulers (View > Rulers) and drag out guides from them. The canvas background can be customized in Settings > Canvas to better visualize how your design will look on different backgrounds. For complex projects, you can use multiple artboards on the same canvas to design different page variations side by side. The canvas automatically saves your work as you edit, with periodic auto-save points that you can return to if needed. For collaborative editing, you can see other team members' cursors on the canvas in real-time.",
  },
  {
    keywords: ["toolbar", "tools", "actions", "controls"],
    response:
      "The toolbar provides quick access to common tools and actions. In Displan, the main toolbar appears at the top of the editor, with context-sensitive options that change based on your selection. Common tools include Select, Text, Shape, Image, and Comment. The Properties toolbar appears when you select an element, showing the most frequently used settings for quick editing. The bottom toolbar includes zoom controls, preview mode, device selector, and editor preferences. You can customize the toolbar layout in Settings > Preferences to prioritize the tools you use most often. For screen space efficiency, you can collapse toolbars into icon-only mode, or use keyboard shortcuts to access tools without clicking the toolbar buttons.",
  },
  {
    keywords: ["panels", "sidebar", "properties", "inspector"],
    response:
      "Panels provide detailed controls for editing and organizing your website. In Displan, the left sidebar contains panels for Elements (adding new content), Layers (managing structure), Assets (media library), Components (reusable elements), and Pages (site navigation). The right sidebar shows the Properties panel, which changes based on your current selection, with tabs for different aspects like Layout, Typography, Background, and Interactions. You can resize panels by dragging their edges, collapse them to save space, or enter fullscreen mode to focus on the canvas. For custom workflows, you can save panel layouts as workspace presets, quickly switching between different arrangements optimized for specific tasks like design, content editing, or development.",
  },
  {
    keywords: ["selection", "select", "multiple select", "element selection"],
    response:
      "Selection tools help you target specific elements for editing. In Displan, use the Select tool (V key) to click on elements directly on the canvas. For multiple selection, either drag a selection box around elements or hold Shift while clicking additional elements. To select elements within groups, double-click to enter the group or use the Layers panel for precise selection. The selection highlight shows the element's boundaries and control points. Right-clicking a selection opens the context menu with common actions. For selecting elements that might be overlapped by others, use the Layers panel or the selection breadcrumb trail that appears at the top of the canvas, showing the hierarchy path to your current selection.",
  },
  {
    keywords: ["zoom", "magnify", "scale view", "canvas navigation"],
    response:
      "Zoom controls adjust your view of the canvas. In Displan, zoom using the controls in the bottom toolbar, mouse wheel scrolling (hold Ctrl/Cmd for zoom instead of scroll), or keyboard shortcuts (Ctrl/Cmd+ '+' to zoom in, Ctrl/Cmd+ '-' to zoom out, Ctrl/Cmd+ '0' to reset to 100%). The Zoom tool (Z key) lets you click to zoom in or Alt/Option+click to zoom out. For quickly focusing on specific elements, use 'Zoom to Selection' (right-click > Zoom to Selection) or double-click the element in the Layers panel. The 'Fit to Screen' option (Ctrl/Cmd+1) adjusts the zoom level to show your entire page. For precise work, you can zoom up to 400% for pixel-level editing, or zoom out to see the overall layout context.",
  },
  {
    keywords: ["device preview", "responsive", "mobile view", "breakpoints"],
    response:
      "Device preview shows how your website appears on different screens. In Displan, use the device selector in the top toolbar to switch between desktop, tablet, mobile landscape, and mobile portrait views. Each view represents a standard breakpoint where responsive designs typically adapt their layout. When you make changes in a specific device view, those changes only apply to that breakpoint and smaller screens, following a mobile-first approach. The preview includes accurate device frames and simulates touch interactions for testing mobile experiences. You can customize the default breakpoint values in Settings > Responsive to match your specific target devices, or add custom breakpoints for unique requirements like kiosks or large displays.",
  },
  {
    keywords: ["export", "download", "save assets", "image export"],
    response:
      "Export features let you save elements or assets from your project. In Displan, export individual elements by right-clicking and selecting 'Export', or use File > Export for multiple selections or full pages. Choose from formats including PNG, JPG, SVG, and PDF, with options for scale, quality, and transparency. For developers, you can export HTML/CSS code snippets of specific elements. The batch export feature lets you export multiple elements or pages simultaneously with consistent settings. For design handoff, the Inspect mode generates specifications including dimensions, colors, typography, and assets that developers can download. All exports include an option to add your project branding and custom annotations for better communication with team members or clients.",
  },
  {
    keywords: ["import", "upload", "bring in", "external content"],
    response:
      "Import features bring external content into your Displan projects. Import images, videos, or documents through the Media Library in the Assets panel, supporting common formats like JPG, PNG, SVG, GIF, MP4, PDF, and more. For design files, you can import from Figma, Sketch, or Adobe XD (on higher-tier plans), preserving layers and styles. The platform also supports importing content from existing websites by entering the URL, which creates editable elements based on the site's structure. For bulk content, use the CSV import feature to populate dynamic elements like product listings, team members, or blog posts from spreadsheet data. When importing typography, the system automatically detects and offers to add any web fonts used in imported designs.",
  },
  {
    keywords: ["preferences", "settings", "options", "customize"],
    response:
      "Preferences customize your editing experience in Displan. Access preferences through Settings > Preferences or the gear icon in the bottom toolbar. Customize interface options like theme (light/dark), language, and panel layouts. Set default behaviors for new elements, such as preferred units (px, em, rem), color format (HEX, RGB, HSL), and text styles. Configure autosave frequency, undo history depth, and performance settings for your hardware capabilities. For team consistency, administrators can define certain preferences that apply to all team members. Your preferences are stored with your account and apply across all projects and devices, creating a consistent editing experience wherever you work.",
  },
  {
    keywords: ["help", "support", "documentation", "tutorials"],
    response:
      "Help resources provide guidance on using Displan effectively. Access help through the Help menu or ? icon in the bottom toolbar. The help center includes searchable documentation, video tutorials, and step-by-step guides for common tasks. Context-sensitive help is available throughout the interface – click the ? icon next to any feature for an explanation. For interactive learning, the platform offers guided tours for new users and feature walkthroughs when new capabilities are released. The community forum connects you with other Displan users for questions, inspiration, and best practices. For direct assistance, support options include live chat, email tickets, and scheduled video calls (availability depends on your plan level).",
  },
  {
    keywords: ["account", "profile", "subscription", "billing"],
    response:
      "Account management handles your Displan subscription and profile. Access account settings through the avatar menu in the top-right corner. Update your profile information, change your password, and manage notification preferences. View and modify your subscription plan, payment methods, and billing history. For teams, manage seats and user permissions from the Team section. The usage dashboard shows statistics on your projects, storage, and bandwidth consumption relative to your plan limits. Security settings include two-factor authentication, connected devices management, and account activity logs. For agencies, the client management section lets you create and organize client accounts with customized access and branding.",
  },
  {
    keywords: ["dashboard", "projects", "overview", "home"],
    response:
      "The dashboard is your starting point in Displan, showing all your websites and projects. Access it by clicking the Displan logo or Home icon. The dashboard displays project thumbnails with status indicators, last edit date, and quick action buttons for common tasks. Filter projects by status, date, or team member, and use the search function to find specific projects. The Recent section shows your most recently edited projects for quick access. For teams, the dashboard includes collaboration features like shared projects, team activity feeds, and task assignments. The analytics overview provides key metrics across all your projects, helping you monitor performance and identify sites that need attention.",
  },
  {
    keywords: ["templates", "starter", "preset", "theme"],
    response:
      "Templates provide ready-made designs to jumpstart your website. In Displan, access templates when creating a new project or through the Templates panel in the editor. Browse categories like business, portfolio, e-commerce, blog, landing page, and more. Each template includes professionally designed pages with placeholder content that you can easily customize. You can also save your own designs as custom templates for future use or team sharing. For specific sections rather than full pages, use the Section Templates in the Elements panel, which provide pre-designed components for common needs like heroes, features, testimonials, or contact sections. Templates are fully responsive and follow design best practices, giving you a solid foundation to build upon.",
  },
  {
    keywords: ["ai", "artificial intelligence", "assistant", "automation"],
    response:
      "AI features in Displan enhance your productivity and creativity. The AI Assistant helps with design suggestions, content generation, and problem-solving – ask it questions or request specific elements like 'Create a contact form with gradient buttons'. The AI Design Generator creates custom layouts based on your description, industry, and style preferences. For content, the AI Writer helps create headlines, product descriptions, or blog posts tailored to your brand voice. The Image Generator creates custom visuals from text descriptions, while the AI Styler can suggest color schemes, typography pairings, and design improvements for existing elements. All AI features learn from your preferences over time, becoming more aligned with your design style and brand guidelines.",
  },
  {
    keywords: ["performance", "optimization", "speed", "loading"],
    response:
      "Performance optimization ensures your website loads quickly. Displan automatically implements several optimizations: image compression and responsive delivery, code minification, lazy loading for off-screen content, and browser caching. The Performance panel in Tools provides real-time analysis of your page, identifying potential bottlenecks with specific recommendations for improvement. Key metrics include total page size, request count, largest contentful paint, and cumulative layout shift. For images, the system automatically creates WebP versions and properly sized variants for different devices. Advanced options include critical CSS extraction, font subsetting, and code splitting. The performance score helps you track improvements over time, with separate scores for mobile and desktop experiences.",
  },
  {
    keywords: ["accessibility", "a11y", "inclusive", "wcag"],
    response:
      "Accessibility features make your website usable by people with disabilities. Displan's Accessibility Checker (in the Tools menu) scans your site for issues based on WCAG standards, providing specific recommendations with severity levels. The editor enforces best practices like semantic HTML structure, proper heading hierarchy, and sufficient color contrast. For images, the system requires alt text and warns about missing descriptions. Form elements automatically include proper labels and ARIA attributes. The keyboard navigation test mode lets you verify that all interactive elements are accessible without a mouse. The accessibility panel provides guidance on creating inclusive content, with references to relevant guidelines and explanations of why each recommendation matters.",
  },
  {
    keywords: ["seo", "search engine optimization", "ranking", "meta"],
    response:
      "SEO tools help your website rank higher in search results. In Displan, manage SEO through the SEO panel in page settings. For each page, set custom meta titles, descriptions, and focus keywords. The SEO analyzer evaluates your content against best practices, checking keyword usage, readability, meta tag optimization, and URL structure. The system automatically generates clean, semantic HTML with proper heading structure and schema markup. For images, it enforces alt text and optimizes file sizes. Technical SEO features include automatic sitemap generation, robots.txt configuration, canonical URL management, and structured data implementation for rich search results. The SEO preview shows how your page will appear in Google search results and social media shares.",
  },
  {
    keywords: ["analytics", "statistics", "tracking", "insights"],
    response:
      "Analytics provide insights into your website's performance and visitor behavior. In Displan, connect analytics services through Settings > Integrations > Analytics, supporting platforms like Google Analytics, Facebook Pixel, and Hotjar. The built-in analytics dashboard shows key metrics including visitors, page views, traffic sources, device breakdown, and user flow. For e-commerce sites, track additional metrics like conversion rates, average order value, and revenue. The heatmap feature visualizes where visitors click, move, and scroll on your pages. Event tracking can be set up for specific actions like button clicks, form submissions, or video plays. Custom reports let you focus on the metrics most relevant to your goals, with scheduled email summaries to keep stakeholders informed.",
  },
  {
    keywords: ["collaboration", "team", "sharing", "feedback"],
    response:
      "Collaboration features enable team-based website creation. In Displan, invite team members through Settings > Team, assigning roles with appropriate permissions. Real-time collaboration shows who's currently editing what section, with cursors labeled by user. The commenting system allows feedback directly on specific elements, with threaded discussions, @mentions, and resolution tracking. For client collaboration, create shareable preview links with optional password protection and commenting capabilities. The activity log tracks all changes with user attribution and timestamps. For larger teams, the workflow management features include task assignment, status tracking, and approval processes. Integration with communication tools like Slack or Microsoft Teams can notify team members about important updates or required reviews.",
  },
  {
    keywords: ["backup", "restore", "version history", "recovery"],
    response:
      "Backup features protect your work from loss or mistakes. Displan automatically creates daily backups of your website, stored for 30 days (longer on higher-tier plans). Access your backup history through Settings > Backups, where you can view a timeline of changes with thumbnails and descriptions. Create manual backups before making significant changes by clicking the 'Create Backup' button. To restore a previous version, select the desired backup point and click 'Restore', with options to restore the entire site or specific pages. For selective recovery, the version comparison tool highlights differences between versions, letting you choose which changes to keep or revert. You can also export backups locally for additional security or for transferring to different accounts.",
  },
  {
    keywords: ["domain", "custom domain", "url", "dns"],
    response:
      "Domain management connects your website to a custom web address. In Displan, manage domains through Settings > Domains. You can purchase a new domain directly through the platform (with options for various TLDs like .com, .org, .io) or connect a domain you already own from another registrar. For existing domains, the system provides clear instructions for updating your DNS settings with the required A records and CNAME records. The platform automatically provisions SSL certificates for secure HTTPS connections, with automatic renewal. Additional domain features include subdomain management, domain forwarding, email forwarding, and privacy protection. For international audiences, you can set up multiple language-specific domains that redirect to the appropriate language version of your site.",
  },
  {
    keywords: ["hosting", "server", "uptime", "reliability"],
    response:
      "Hosting services ensure your website is available to visitors. Displan includes reliable hosting for all websites, with servers strategically located worldwide for fast global access. The infrastructure automatically scales based on your traffic needs, so your site remains responsive even during traffic spikes. All hosting includes CDN (Content Delivery Network) integration for faster content delivery, DDoS protection against attacks, and automatic daily backups. The system handles all technical maintenance, including security updates and performance optimizations. For higher-tier plans, additional features include dedicated resources, priority routing, advanced caching mechanisms, and guaranteed uptime SLAs. The hosting dashboard provides real-time status information and historical uptime statistics for your sites.",
  },
  {
    keywords: ["e-commerce", "online store", "shop", "sell"],
    response:
      "E-commerce functionality lets you sell products or services online. In Displan, set up an online store through Settings > E-commerce. Create product listings with images, descriptions, variants (like size or color), inventory tracking, and pricing options including sale prices or quantity discounts. Configure payment processing through integrations with providers like Stripe, PayPal, Square, or regional payment methods. Set up shipping options with rules based on location, weight, or order value. The tax management system handles different rates by region and product type. Customer accounts allow for saved payment methods, order history, and wishlist functionality. The e-commerce dashboard provides sales analytics, inventory alerts, and order management tools. Marketing features include abandoned cart recovery, product recommendations, and integration with email marketing platforms.",
  },
  {
    keywords: ["blog", "articles", "posts", "content management"],
    response:
      "Blogging features help you publish and manage content regularly. In Displan, set up a blog through Settings > Blog. The content management system includes a rich text editor with formatting options, media embedding, and SEO tools. Organize content with categories and tags, schedule posts for future publishing, and enable features like author profiles and commenting. Choose from various blog layouts like list, grid, or magazine style, and customize the appearance of post previews and detail pages. The system supports content workflows with draft, review, and published states, helpful for team collaboration. For content strategy, use the analytics integration to track popular topics and reader engagement. The system automatically generates RSS feeds for subscribers and implements proper structured data markup for better search engine visibility.",
  },
  {
    keywords: ["forms", "contact form", "submission", "data collection"],
    response:
      "Forms collect information from visitors and enable interactions. In Displan, create forms using the Form Builder in the Elements panel. Add various field types including text, email, phone, number, date, checkbox, radio, select, file upload, and more. Configure validation rules, error messages, and conditional logic that shows/hides fields based on previous answers. Set up form submissions to be sent to your email, stored in the dashboard, or integrated with services like Google Sheets, CRM systems, or email marketing platforms. For spam prevention, enable CAPTCHA or honeypot fields. The form analytics show submission rates, completion times, and common drop-off points to help you optimize for better conversion. Advanced features include multi-step forms, save and resume functionality, and pre-filling fields for logged-in users.",
  },
  {
    keywords: ["membership", "login", "registration", "user accounts"],
    response:
      "Membership functionality creates gated content or user accounts. In Displan, enable membership features through Settings > Membership. Set up registration and login forms, email verification workflows, and member profiles. Create different membership levels with varying access permissions to control who can view specific content. The system supports social login options (Google, Facebook, Twitter) for easier registration. For paid memberships, integrate with payment processors to handle subscriptions or one-time fees. The member dashboard allows users to update their profiles, view their subscription status, and access exclusive content. For community building, you can add member directories, private messaging, or forum integration depending on your plan level. Security features include password policies, account lockout protection, and privacy controls for user data.",
  },
  {
    keywords: ["multilingual", "translation", "language", "international"],
    response:
      "Multilingual features let you create content in multiple languages. In Displan, set up language versions through Settings > Languages. Add the languages you want to support, and the system creates language variants of your pages where you can translate content while maintaining the same design. The language switcher element can be added to your site, allowing visitors to select their preferred language. The platform supports right-to-left languages like Arabic and Hebrew, automatically adjusting layouts as needed. For SEO, the system implements proper hreflang tags and language meta information. You can either manually translate content or use the integrated translation service (available on higher-tier plans) to automatically translate text with human review options. The system also handles language-specific formatting for dates, numbers, and currencies.",
  },
  {
    keywords: ["security", "protection", "privacy", "ssl"],
    response:
      "Security features protect your website and visitor data. Displan implements several security measures by default: SSL encryption for all sites, DDoS protection, regular security updates, and secure password storage. Additional security options in Settings > Security include two-factor authentication for admin access, IP blocking for suspicious activity, content security policies to prevent code injection, and automated malware scanning. For forms and user data, the platform is GDPR-compliant with features like consent checkboxes, data export tools, and privacy policy generators. The security log tracks login attempts and other security-related events, alerting you to potential issues. For e-commerce sites, additional PCI compliance features ensure secure handling of payment information. Regular security audits and penetration testing keep the platform protected against emerging threats.",
  },
    {
    keywords: ["professional website", "make website look good", "design tips"],
    response:
      "To make your website look professional in Displan, follow these tips: 1) Use a consistent color palette (set in Settings > Brand > Colors) with 2-3 primary colors and complementary accents. 2) Choose modern, readable fonts (e.g., Roboto, Open Sans) and define typography styles globally. 3) Leverage Displan’s pre-designed templates for sections like heroes or features to ensure polished layouts. 4) Add subtle animations (e.g., fade-in on scroll) for engagement, but avoid overusing them. 5) Optimize images for fast loading and use high-quality visuals. 6) Ensure mobile responsiveness by testing with the device preview toolbar. You can also ask me to generate a professional layout, like 'Create a modern hero section with a gradient background'.",
  },
  {
    keywords: ["custom css", "add css", "style with css", "css variables"],
    response:
      "To add custom CSS in Displan, go to Settings > Advanced > CSS. You can write site-wide styles or target specific elements using selectors. For example, to style all buttons, use: `button { background-color: #007bff; color: white; }`. To use CSS variables for consistent theming, define them like: `:root { --primary-color: #007bff; }` and apply with `background-color: var(--primary-color);`. For page-specific CSS, use the Code Injection feature in page settings. Ensure your CSS doesn’t conflict with Displan’s generated styles by using specific selectors or the !important rule sparingly. You can also ask me to generate CSS snippets, like 'Create CSS for a glowing button hover effect'.",
  },
  {
    keywords: ["custom javascript", "add javascript", "js event", "script"],
    response:
      "To add custom JavaScript in Displan, navigate to Settings > Advanced > JavaScript. You can add site-wide scripts or use page-specific Code Injection in page settings. For example, to add a click event to a button, use: `document.querySelector('.my-button').addEventListener('click', () => alert('Clicked!'));`. Specify whether scripts load in the `<head>` or `<body>`, and set triggers like 'on load' or 'on scroll'. For reusable scripts, create custom elements with embedded JavaScript. Avoid external script sources unless added via Settings > Integrations for security. Ask me for specific scripts, like 'Add JavaScript to toggle a menu on click'.",
  },
  {
    keywords: ["element not showing", "missing element", "element hidden", "troubleshoot"],
    response:
      "If an element isn’t showing on your Displan canvas, try these steps: 1) Check the Layers panel to ensure the element isn’t hidden (eye icon off) or has a low z-index. 2) Verify its opacity isn’t set to 0 in the Effects panel. 3) Ensure it’s not outside the canvas boundaries or covered by another element with a higher z-index. 4) Check responsive settings in the device preview to confirm it’s not hidden for specific breakpoints. 5) Inspect the element’s display property in the Layout panel (e.g., ensure it’s not set to 'none'). If the issue persists, ask me with details, like 'Why is my blue button not showing on mobile?'.",
  },
  {
    keywords: ["sticky header", "fixed header", "scroll header", "navbar sticky"],
    response:
      "To create a sticky header in Displan, add a Header element from the Elements panel or select an existing header. In the Layout panel of the Properties sidebar, set 'Position: Sticky' and choose 'Top' with an offset of 0px. Ensure the header’s z-index is high (e.g., 1000) in the Position panel to stay above other content. For mobile, you can adjust sticky behavior or disable it in the responsive settings. Test in Preview mode to confirm it stays fixed while scrolling. You can say, 'Make my header sticky with a white background and shadow', and I’ll generate the setup for you.",
  },
  {
    keywords: ["micro-interaction", "button hover", "interactive effect", "small animation"],
    response:
      "Micro-interactions enhance user engagement with subtle feedback. In Displan, select an element (e.g., a button) and go to the Interactions panel. For a hover effect, choose 'Hover' as the trigger and add actions like 'Scale' (e.g., 1.1x) or 'Change Background Color'. Set a transition duration (e.g., 0.3s) for smoothness. For example, a button hover could use: `transform: scale(1.1); box-shadow: 0 4px 8px rgba(0,0,0,0.2);`. You can also use the Animations panel for pre-built effects like 'Pulse'. Ask me to create one, like 'Add a micro-interaction to a button that grows and glows on hover'.",
  },
  {
    keywords: ["webgl", "3d effect", "three.js", "canvas animation"],
    response:
      "Displan supports WebGL for 3D effects via custom code. Add a Canvas element from the Elements panel, then use the Code Injection feature to include a WebGL library like Three.js. For example, include Three.js via CDN: `<script src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'></script>`, then add a script to create a simple 3D cube: `const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(...);`. Place this in Settings > Advanced > JavaScript. Due to complexity, test in Preview mode and optimize for performance. Ask me for a specific WebGL effect, like 'Create a 3D rotating globe on my homepage'.",
  },
  {
    keywords: ["ai design", "generate layout", "ai suggestion", "auto design"],
    response:
      "Displan’s AI Design Generator can create custom layouts based on your needs. Describe your goal, like 'Generate a modern e-commerce homepage with a hero, product grid, and footer'. The AI will propose a layout using Displan’s templates and elements, tailored to your brand colors and typography (set in Settings > Brand). You can refine the result by asking for tweaks, like 'Make the hero fullscreen with a video background'. The AI also suggests content, such as headlines or placeholder text. To use, say something like 'Design a portfolio page for a photographer with a masonry gallery'. I’ll create the layout and add it to your canvas.",
  },
  {
    keywords: ["ai content", "generate text", "write copy", "content creation"],
    response:
      "Displan’s AI Writer can generate website content. Specify what you need, like 'Write a 100-word about section for a tech startup' or 'Create a catchy headline for a fitness app'. The AI uses your brand voice (set in Settings > Brand > Voice) to produce tailored text. You can request specific tones (e.g., professional, friendly) or formats (e.g., bullet points, paragraphs). The generated text appears as a Text element on your canvas, ready for editing. For SEO, the AI can include keywords you provide. Try something like 'Generate three testimonials for a coffee shop website'.",
  },
  {
    keywords: ["api integration", "third-party api", "connect api", "data fetch"],
    response:
      "To integrate a third-party API in Displan, use the API Connector element from the Elements panel. Enter the API endpoint URL, method (GET, POST, etc.), and authentication details (e.g., API key or OAuth). Map the response data to elements like Text or List for display. For example, to fetch weather data, set the endpoint to `https://api.openweathermap.org/data/2.5/weather?q=London&appid=your_key` and bind the temperature to a Text element. For advanced needs, add custom JavaScript in Settings > Advanced to process API responses. Test in Preview mode. Ask me for help, like 'Connect a news API to display headlines on my homepage'.",
  },
  {
    keywords: ["dynamic content", "data binding", "cms", "content management"],
    response:
      "Displan supports dynamic content through its CMS features. Go to Settings > CMS to create data collections (e.g., Products, Blog Posts). Define fields like title, image, or price. Add a List or Grid element to your canvas, then bind it to your collection via the Data panel in the Properties sidebar. For example, a product grid can pull images and prices dynamically. Use the API Connector for external data sources. For single items, bind fields to Text or Image elements. You can say, 'Create a dynamic blog post list with featured images and titles', and I’ll set it up for you.",
  },
  {
    keywords: ["parallax background", "scroll parallax", "parallax effect"],
    response:
      "To add a parallax background in Displan, select a Section or Container element and go to the Background panel in the Properties sidebar. Choose an image, then enable 'Parallax' and adjust the speed (e.g., 0.3 for subtle movement). For best results, use high-resolution images and ensure text remains readable with an overlay (e.g., rgba(0,0,0,0.5)). Test the effect in Preview mode, as it may disable on mobile for performance. You can request, 'Add a parallax background to my hero section with a city skyline image', and I’ll configure it for you.",
  },
  {
    keywords: ["gradient button", "gradient style", "button design"],
    response:
      "To create a gradient button in Displan, add a Button element from the Elements panel. In the Properties sidebar, go to the Background panel and select 'Gradient'. Choose a linear or radial gradient, then set colors (e.g., #007bff to #00d4ff). Adjust the angle (e.g., 45deg) and add a hover effect in the States panel (e.g., reverse the gradient). For text contrast, ensure the button text is readable (e.g., white). You can say, 'Create a button with a blue-to-green gradient and white text', and I’ll add it to your canvas with the specified styles.",
  },
  {
    keywords: ["fullscreen video", "video background", "hero video"],
    response:
      "To add a fullscreen video background in Displan, add a Hero or Section element. In the Background panel of the Properties sidebar, select 'Video' and upload an MP4 file or link to a YouTube/Vimeo URL. Enable 'Cover' to make it fullscreen and set 'Loop' for continuous playback. Add a fallback image for mobile or browsers that block autoplay. For readability, apply an overlay color (e.g., rgba(0,0,0,0.4)) in the Background panel. Test in Preview mode. Say, 'Create a fullscreen video hero with a looping nature video', and I’ll set it up for you.",
  },
  {
    keywords: ["error message", "form validation", "input error"],
    response:
      "To add form validation error messages in Displan, select a Form element and add Input fields. In the Properties sidebar, go to the Validation tab for each field and set rules (e.g., required, email format). Customize error messages in the same tab, like 'Please enter a valid email'. Style error messages in the Form’s Style panel (e.g., red text, 14px). For dynamic display, errors appear automatically when users submit invalid data. Test in Preview mode. You can ask, 'Add email validation to my contact form with a custom error message', and I’ll configure it for you.",
  },
  {
    keywords: ["lazy loading", "image optimization", "performance image"],
    response:
      "Displan enables lazy loading for images by default to improve performance. To confirm, select an Image element and check the Loading panel in the Properties sidebar; 'Lazy' should be enabled. Images load only when they enter the viewport, reducing initial page load time. For further optimization, upload images under 200KB and let Displan generate WebP formats. Add a low-resolution placeholder in the Effects panel for a blur-up effect. You can say, 'Optimize all images on my homepage for lazy loading', and I’ll ensure the settings are applied across your page.",
  },
  {
    keywords: ["a/b testing", "split testing", "experiment", "variant"],
    response:
      "Displan supports A/B testing to compare design variants. Go to Settings > Experiments and create a new test. Define two or more variants of a page or section (e.g., different button colors). Assign traffic percentages (e.g., 50% to each variant) and set a goal (e.g., button clicks, form submissions). Use the Analytics integration to track results. For setup, duplicate your page in the Pages panel, modify the variant, and link it to the experiment. Test in Preview mode. Say, 'Set up an A/B test for my CTA button with red and blue variants', and I’ll guide you through the process.",
  },
  {
    keywords: ["chat widget", "live chat", "support chat", "messenger"],
    response:
      "To add a chat widget in Displan, go to Settings > Integrations > Chat and connect a service like Intercom, LiveChat, or Tawk.to by entering your widget code. Alternatively, add an Embed element from the Elements panel and paste the chat provider’s HTML snippet. Position the widget (e.g., bottom-right) using the Position panel and set a high z-index (e.g., 1000). For custom styling, use CSS in Settings > Advanced. Test the widget in Preview mode to ensure it loads correctly. Say, 'Add a live chat widget to my website', and I’ll provide the steps or set it up with a placeholder provider.",
  },
  {
    keywords: ["schema markup", "structured data", "seo markup"],
    response:
      "Displan automatically adds basic schema markup (e.g., Organization, WebPage) for SEO. To add custom structured data, go to Settings > SEO > Structured Data and use JSON-LD format. For example, to add Product schema: `{ '@context': 'https://schema.org', '@type': 'Product', 'name': 'Your Product', 'price': '29.99' }`. Place this in the page’s Code Injection or site-wide in Settings > Advanced > JavaScript. For specific elements like FAQs or reviews, use the respective elements, which include schema by default. Validate with Google’s Structured Data Testing Tool. Say, 'Add schema markup for a local business', and I’ll generate the JSON-LD for you.",
  },
  {
    keywords: ["custom font", "upload font", "web font", "typography"],
    response:
      "To use a custom font in Displan, go to Settings > Brand > Typography and click 'Upload Font'. Upload font files (WOFF, WOFF2, or TTF formats) and specify the font name and weight. The font will appear in the font picker for all text elements. For performance, limit to 2-3 weights and enable font subsetting in Settings > Performance. Alternatively, add Google Fonts or Adobe Fonts via the same panel without uploading. For CSS control, define the font with `@font-face` in Settings > Advanced > CSS. Say, 'Add a custom font called Montserrat to my website', and I’ll guide you or set it up.",
  },
  {
    keywords: ["exit intent popup", "popup on exit", "leave popup"],
    response:
      "To create an exit-intent popup in Displan, add a Popup element from the Elements panel. In the Properties sidebar, set the trigger to 'Exit Intent' under the Interactions panel. Design the popup with elements like a headline, form, or button (e.g., for newsletter signup). Customize appearance (e.g., size, overlay opacity) and set frequency capping (e.g., show once per session) to avoid annoyance. Test in Preview mode by moving your cursor outside the browser window. Say, 'Create an exit-intent popup with a newsletter form', and I’ll add it to your canvas with the specified trigger and design.",
  },
  {
    keywords: ["ai image search", "find picture", "image library", "photo search"],
    response:
      "To search for AI-generated images, click the 'Assets' button in the sidebar (left panel). Use the search bar in the Assets panel to type keywords like 'nature' or 'tech'. Results from our AI-powered library will display instantly. Drag an image onto the canvas or select it to set as a background. For specific styles, add terms like '3D' or 'minimalist'. Test in Preview mode. Say, 'Find a 3D cityscape image for my homepage', and I’ll suggest options.",
  },
  {
    keywords: ["video background", "3d video", "add video", "canvas video"],
    response:
      "To add a 3D video background, go to the canvas, select a Section, and click the Background icon in the Properties sidebar. Choose 'Video', then search our API-connected video library via the Assets panel (sidebar > Assets). Enter keywords like '3D abstract' or 'space'. Select a video, enable 'Cover' for fullscreen, and set 'Loop'. Add an overlay (e.g., rgba(0,0,0,0.3)) for text readability. Test in Preview. Say, 'Add a 3D galaxy video background to my hero section'.",
  },
  {
    keywords: ["custom domain", "add domain", "own domain", "site url"],
    response:
      "To add a custom domain, go to Settings (bottom-middle rectangle > Settings button). In the Domain tab, enter your domain name (e.g., mywebsite.com). Since domain purchasing isn’t available yet, connect an existing domain via DNS settings provided in the panel. Save and verify in Preview mode. For subdomains or passwords, use the Access tab. Say, 'Connect my domain to my project', and I’ll guide you through the DNS setup.",
  },
  {
    keywords: ["canvas comments", "add comment", "edit comment", "delete comment"],
    response:
      "To add comments on the canvas, click the 'Comments' button in the bottom rectangle toolbar. Click anywhere on the canvas to pin a comment, then type your note. To edit or delete, hover over the comment in the Comments sidebar (right panel) and select the appropriate action. Comments are visible to collaborators. Say, 'Add a comment to my button about changing its color', and I’ll pin it for you.",
  },
  {
    keywords: ["canvas background", "change background", "sleeping background", "dynamic background"],
    response:
      "To change the canvas background, click the canvas, then the Background icon in the Properties sidebar. Choose a color, gradient, image, or video. For a dynamic effect like a 'sleeping' background, select a gradient with four colors (e.g., blue to purple) and enable 'Animate' with a slow transition (e.g., 10s). Use AI images from the Assets panel for unique visuals. Say, 'Create a dreamy gradient background with animation', and I’ll set it up.",
  },
  {
    keywords: ["drag canvas", "move canvas", "canvas navigation", "light drag"],
    response:
      "To drag the canvas, click the 'Hand' icon in the bottom rectangle toolbar or hold the spacebar and drag with your mouse. For precise movement, use the arrow keys. To zoom, use the '+' or '-' buttons in the toolbar or scroll with the mouse wheel. This helps reposition elements or view the entire layout. Say, 'How do I move the canvas to focus on my footer?', and I’ll explain further.",
  },
  {
    keywords: ["new button design", "modern button", "button colors", "pricing button"],
    response:
      "To create a modern button, drag a Button element from the Elements sidebar (left panel). In the Properties sidebar, go to Style and select from new designs like 'Gradient Glow' or 'Neon Outline'. Customize colors in the Color panel (e.g., #ff5733 to #ffc107 gradient). For pricing buttons, add text like 'Buy Now' and link to a checkout page. Say, 'Design a pricing button with a red-to-orange gradient', and I’ll add it to your canvas.",
  },
  {
    keywords: ["cms blog", "create blog", "dynamic blog", "content management"],
    response:
      "To create a blog CMS, go to Settings > CMS (bottom rectangle > Settings). Click 'New Collection' and name it 'Blog'. Add fields like Title, Content, Image, and Date. In the canvas, add a List element from the Elements sidebar and bind it to the Blog collection in the Data panel. Style the list for featured images and titles. Say, 'Create a blog page with a grid of posts', and I’ll set up the CMS and layout.",
  },
  {
    keywords: ["creator sticker", "custom sticker", "sticker marketplace", "design sticker"],
    response:
      "The upcoming Creator Sticker feature lets you design custom stickers. Go to Elements > Stickers (available soon) and click 'Create New'. Use the Sticker Editor to add text, shapes, or AI-generated graphics. Save and publish to the marketplace for others to use, earning a commission. For now, use existing stickers from the Elements panel. Say, 'Design a shiny star sticker for my hero section', and I’ll simulate the setup.",
  },
  {
    keywords: ["quantum widget", "holo-canvas", "futuristic element", "sci-fi design"],
    response:
      "For a futuristic 'quantum widget' effect, add a Container element from the Elements sidebar. In the Properties sidebar, apply a 3D transform (Effects > 3D) and a glowing gradient background (Background > Gradient). Add micro-animations like 'Spin' in the Interactions panel. Use AI-generated 'sci-fi' images from Assets for a holo-canvas look. Say, 'Create a holographic button with a quantum effect', and I’ll configure it.",
  },
  {
    keywords: ["export project", "download project", "save project", "project export"],
    response:
      "Project export is coming soon. Once available, go to Settings > Export (bottom rectangle > Settings) to download your project as HTML, CSS, and JavaScript files. For now, save your project manually via the 'Save' button in the top-right corner. Ensure all assets are uploaded to the Assets panel to avoid missing files. Say, 'How do I export my website?', and I’ll update you when the feature launches.",
  },
  {
    keywords: ["password protect", "secure project", "project password", "private site"],
    response:
      "To password-protect your project, go to Settings > Access (bottom rectangle > Settings). Enable 'Password Protection' and set a secure password. Share it with authorized users. This makes your site private, ideal for professional previews. Test in Preview mode to verify. Say, 'Add a password to my project for client review', and I’ll enable it for you.",
  },
  {
    keywords: ["custom code", "html code", "css code", "javascript code"],
    response:
      "To add custom code, go to Settings > Code (bottom rectangle > Settings). In the Code Injection tab, add HTML, CSS, or JavaScript for site-wide or page-specific effects. For example, add a CSS glow effect: `button:hover { box-shadow: 0 0 10px #ff5733; }`. Place scripts in `<head>` or `<body>` as needed. Test in Preview mode. Say, 'Add a JavaScript alert to my button click', and I’ll inject the code.",
  },
  {
    keywords: ["minimalist design", "clean layout", "simple website", "modern look"],
    response:
      "For a minimalist design, start with a 'Clean' template from the Templates panel (sidebar). Use a single color palette (Settings > Brand > Colors) and a sans-serif font like 'Inter'. Add sparse elements like a Text and Button, with generous spacing in the Layout panel. Enable subtle animations (e.g., fade-in) in the Interactions panel. Say, 'Create a minimalist homepage with a white background', and I’ll set it up.",
  },
  {
    keywords: ["ai text design", "generate text", "text styles", "custom typography"],
    response:
      "To generate AI-designed text, add a Text element from the Elements sidebar. In the Properties sidebar, click 'AI Styles' to generate unique typography based on your brand (Settings > Brand > Voice). Choose from styles like 'Bold Neon' or 'Elegant Serif'. Edit the text directly or request specific content, like 'Generate a headline for a tech startup'. Say, 'Create a neon-style headline for my app', and I’ll apply it.",
  },
  {
    keywords: ["sidebar buttons", "toolbar buttons", "canvas controls", "navigation buttons"],
    response:
      "The sidebar (left panel) includes buttons for Elements, Assets, Templates, and CMS. The bottom rectangle toolbar has buttons for Hand (drag canvas), Zoom, Comments, and Settings. Click Settings to access Brand, Code, or CMS options. For quick navigation, hover over buttons for tooltips. Say, 'Where are the sidebar buttons for adding images?', and I’ll point you to the Assets panel.",
  },
  {
    keywords: ["animation colors", "color animation", "dynamic colors", "gradient animation"],
    response:
      "To animate colors, select an element (e.g., Section) and go to the Background panel in the Properties sidebar. Choose a gradient with multiple colors (e.g., blue, purple, pink). In the Interactions panel, add a 'Color Shift' animation with a duration (e.g., 5s) and set to 'Loop'. Test in Preview mode for smoothness. Say, 'Animate my section background with a blue-to-pink gradient', and I’ll configure it.",
  },
  {
    keywords: ["3d element", "3d design", "three.js element", "3d animation"],
    response:
      "To add a 3D element, use a Canvas element from the Elements sidebar. In Settings > Code, inject Three.js via CDN: `<script src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'></script>`. Add a script for a 3D object, like a rotating cube. Bind it to the Canvas in the Properties sidebar. Test in Preview mode. Say, 'Add a 3D spinning sphere to my homepage', and I’ll provide the code.",
  },
  {
    keywords: ["search videos", "video library", "find video", "api video"],
    response:
      "To search for videos, open the Assets panel (sidebar > Assets) and type keywords like 'ocean' or 'tech demo' in the search bar. The API-connected library returns results instantly. Drag a video to a Section or set it as a background in the Properties sidebar. Enable 'Loop' and 'Mute' for seamless playback. Say, 'Find a 4K drone video for my background', and I’ll suggest options.",
  },
  {
    keywords: ["project history", "save history", "version history", "undo changes"],
    response:
      "To view project history, go to Settings > History (bottom rectangle > Settings). See a timeline of saves and changes. Click a version to restore it or undo specific actions. Manual saves occur via the 'Save' button (top-right). Auto-save runs every 5 minutes. Say, 'How do I revert my project to yesterday’s version?', and I’ll guide you to the History tab.",
  },
  {
    keywords: ["ai picture unsubscribe", "remove ai image", "cancel ai asset", "delete picture"],
    response:
      "To remove an AI-generated picture, go to the Assets panel (sidebar > Assets). Find the image in your 'Used Assets' list, hover, and click 'Remove'. This unlinks it from your canvas but doesn’t delete it from the library. To stop AI suggestions, disable 'AI Assets' in Settings > Assets. Say, 'Remove the AI beach image from my section', and I’ll help you unlink it.",
  },
  {
    keywords: ["new template", "modern template", "template update", "fresh design"],
    response:
      "To use a new template, open the Templates panel (sidebar > Templates). Browse categories like 'E-commerce' or 'Portfolio' for the latest designs. Drag a template onto the canvas to apply it. Customize colors and fonts in Settings > Brand. New templates are added weekly. Say, 'Apply a modern portfolio template to my homepage', and I’ll add it for you.",
  },
  {
    keywords: ["micro-animation", "small animation", "hover effect", "interactive animation"],
    response:
      "To add a micro-animation, select an element (e.g., Button) and go to the Interactions panel in the Properties sidebar. Choose a trigger like 'Hover' and an action like 'Scale' (e.g., 1.05x) or 'Fade'. Set a duration (e.g., 0.2s) for subtlety. Test in Preview mode. Say, 'Add a hover scale animation to my CTA button', and I’ll apply it.",
  },
  {
    keywords: ["pricing design", "pricing table", "subscription design", "plan layout"],
    response:
      "To create a pricing table, drag a Pricing element from the Elements sidebar. In the Properties sidebar, add plans (e.g., Free, $5/month) with features and buttons. Style with gradients or shadows in the Style panel. Link buttons to checkout pages. Say, 'Design a pricing table with a free and premium plan', and I’ll set it up on your canvas.",
  },
  {
    keywords: ["contact form", "form design", "lead capture", "form styling"],
    response:
      "To add a contact form, drag a Form element from the Elements sidebar. Add fields like Name, Email, and Message in the Properties sidebar. Style the form with modern designs (e.g., 'Glassmorphism') in the Style panel. Set the submission action to your email or CMS in the Data panel. Say, 'Create a sleek contact form for my footer', and I’ll design it.",
  },
  {
    keywords: ["icon library", "add icon", "custom icon", "icon design"],
    response:
      "To add icons, open the Assets panel (sidebar > Assets) and select 'Icons'. Search for keywords like 'arrow' or 'cart'. Drag an icon to the canvas or embed it in a Button or Text element. Customize size and color in the Properties sidebar. Say, 'Add a blue arrow icon to my button', and I’ll place it for you.",
  },
  {
    keywords: ["canvas settings", "access settings", "site settings", "configure canvas"],
    response:
      "To access canvas settings, click the Settings button in the bottom rectangle toolbar (middle of the screen). This opens tabs for Brand, CMS, Code, Domain, and more. Adjust colors, fonts, or animations in the Brand tab, or add custom code in the Code tab. Say, 'How do I get to the canvas settings?', and I’ll direct you to the toolbar.",
  },
  {
    keywords: ["mobile preview", "responsive design", "device preview", "mobile view"],
    response:
      "To preview your site on mobile, click the 'Device Preview' button in the bottom rectangle toolbar. Select a device (e.g., iPhone 12) to see the responsive layout. Adjust elements for mobile in the Properties sidebar under the Responsive tab. Test interactions in Preview mode. Say, 'Show my homepage on a mobile view', and I’ll guide you to the preview.",
  },
  {
    keywords: ["gradient text", "colorful text", "text gradient", "styled text"],
    response:
      "To add gradient text, select a Text element and go to the Style panel in the Properties sidebar. Choose 'Gradient' for the text fill and pick colors (e.g., #ff5733 to #ffc107). Adjust the angle (e.g., 90deg). For better contrast, add a shadow in the Effects panel. Say, 'Create gradient text for my headline', and I’ll style it for you.",
  },
  {
    keywords: ["parallax scroll", "scroll effect", "parallax design", "motion background"],
    response:
      "To add a parallax scroll effect, select a Section and go to the Background panel in the Properties sidebar. Choose an image or video, then enable 'Parallax' with a speed (e.g., 0.4). Test in Preview mode to ensure smooth scrolling. Disable on mobile if needed in the Responsive tab. Say, 'Add a parallax city image to my section', and I’ll set it up.",
  },
  {
    keywords: ["lazy load", "image performance", "fast loading", "optimize image"],
    response:
      "Lazy loading is enabled by default for images. To confirm, select an Image element and check the Loading panel in the Properties sidebar. Ensure images are under 200KB (optimize in Assets panel). Add a blur-up placeholder in the Effects panel for a smooth load. Say, 'Optimize images for faster loading', and I’ll verify the settings.",
  },
  {
    keywords: ["exit popup", "popup trigger", "leave intent", "newsletter popup"],
    response:
      "To create an exit-intent popup, add a Popup element from the Elements sidebar. In the Interactions panel, set the trigger to 'Exit Intent'. Add a Form or Text element for content (e.g., newsletter signup). Style with a modern overlay in the Style panel. Say, 'Add an exit popup for email capture', and I’ll design it for you.",
  },
  {
    keywords: ["custom cursor", "cursor design", "pointer style", "animated cursor"],
    response:
      "To add a custom cursor, go to Settings > Code (bottom rectangle > Settings). Add CSS like: `body { cursor: url('/assets/custom-cursor.png'), auto; }` in the Code Injection tab. Upload the cursor image to the Assets panel first. For animations, use JavaScript in the same tab. Test in Preview mode. Say, 'Create a glowing custom cursor', and I’ll provide the code.",
  },
  {
    keywords: ["dark mode", "theme toggle", "night mode", "color scheme"],
    response:
      "To enable dark mode, go to Settings > Brand > Colors and create a 'Dark' theme with darker colors (e.g., #1a1a1a background). Add a Toggle element from the Elements sidebar to switch themes. Bind it to the theme in the Interactions panel. Test in Preview mode. Say, 'Add a dark mode toggle to my site', and I’ll set it up.",
  },
  {
    keywords: ["chat integration", "live chat", "support widget", "chat bubble"],
    response:
      "To add a chat widget, go to Settings > Integrations (bottom rectangle > Settings). Paste the code for a service like Tawk.to or Intercom in the Chat tab. Alternatively, use an Embed element from the Elements sidebar for custom placement. Style with CSS in Settings > Code. Say, 'Add a chat bubble to my site', and I’ll guide you.",
  },
  {
    keywords: ["schema seo", "structured data", "seo markup", "json-ld"],
    response:
      "To add schema markup, go to Settings > SEO > Structured Data. Use JSON-LD, like: `{ '@context': 'https://schema.org', '@type': 'WebPage', 'name': 'Your Site' }`. Add it site-wide or per page in the Code Injection tab. Validate with Google’s Structured Data Testing Tool. Say, 'Add schema for a blog post', and I’ll generate it.",
  },
  {
    keywords: ["analytics setup", "track visitors", "site analytics", "google analytics"],
    response:
      "To set up analytics, go to Settings > Integrations > Analytics. Paste your Google Analytics or other tracking code (e.g., GA4 ID). The code loads site-wide. For event tracking, add custom JavaScript in Settings > Code. Test in Preview mode to verify. Say, 'Add Google Analytics to my site', and I’ll help you configure it.",
  },
  {
    keywords: ["font upload", "custom font", "typography upload", "web font"],
    response:
      "To upload a custom font, go to Settings > Brand > Typography. Click 'Upload Font' and select WOFF or TTF files. Name the font and set weights. Apply it to Text elements in the Style panel. For performance, limit to 2 weights. Say, 'Upload a custom font for my headlines', and I’ll guide you.",
  },
  {
    keywords: ["multi-language", "language switch", "translate site", "bilingual site"],
    response:
      "To add multi-language support, go to Settings > Languages. Add languages (e.g., English, Spanish) and translate content in the CMS or Text elements. Use a Language Switcher element from the Elements sidebar to toggle languages. Test in Preview mode. Say, 'Make my site bilingual with English and French', and I’ll set it up.",
  },
  {
    keywords: ["scroll snap", "snap sections", "scroll effect", "section snap"],
    response:
      "To enable scroll snapping, select a Section and go to the Layout panel in the Properties sidebar. Enable 'Scroll Snap' and choose 'Full Height'. Apply to multiple sections for a smooth, full-screen scroll effect. Test in Preview mode. Say, 'Add scroll snapping to my sections', and I’ll configure it.",
  },
  {
    keywords: ["video embed", "youtube embed", "vimeo embed", "video player"],
    response:
      "To embed a video, add an Embed element from the Elements sidebar. Paste a YouTube or Vimeo iframe code in the Properties sidebar. Adjust size and alignment in the Layout panel. For custom controls, use CSS in Settings > Code. Say, 'Embed a YouTube video in my section', and I’ll add it for you.",
  },
  {
    keywords: ["a/b test", "split test", "experiment design", "variant test"],
    response:
      "To set up A/B testing, go to Settings > Experiments. Create a test with two page variants (e.g., different headlines). Set traffic split (e.g., 50/50) and a goal (e.g., button clicks). Duplicate your page in the Pages panel and modify the variant. Track results in Analytics. Say, 'Run an A/B test on my CTA', and I’ll guide you.",
  },
  {
    keywords: ["social media icons", "social links", "footer icons", "connect social"],
    response:
      "To add social media icons, drag a Social Icons element from the Elements sidebar. In the Properties sidebar, link to your profiles (e.g., Twitter, Instagram). Style with colors or hover effects in the Style panel. Place in the footer or header. Say, 'Add social media icons to my footer', and I’ll design it.",
  },
  {
    keywords: ["glitch effect", "distortion effect", "cyberpunk design", "glitch animation"],
    response:
      "To add a glitch effect, select a Text or Image element and go to the Effects panel in the Properties sidebar. Choose 'Glitch' and adjust intensity (e.g., 0.5). Set a hover trigger in the Interactions panel for interactivity. Test in Preview mode. Say, 'Add a glitch effect to my headline', and I’ll apply it.",
  },
  {
    keywords: ["mega footer", "large footer", "footer design", "content footer"],
    response:
      "To create a mega footer, drag a Footer element from the Elements sidebar. Add multiple columns (Layout panel) with Text, Social Icons, and Forms. Use a dark background (Background panel) and modern typography (Settings > Brand). Link to pages or CMS. Say, 'Design a mega footer with four columns', and I’ll set it up.",
  },
  {
    keywords: ["carousel slider", "image slider", "gallery carousel", "slideshow"],
    response:
      "To add a carousel, drag a Carousel element from the Elements sidebar. Upload images or bind to CMS in the Properties sidebar. Set autoplay speed (e.g., 3s) and navigation arrows in the Style panel. Test in Preview mode. Say, 'Create an image carousel for my products', and I’ll design it.",
  },
  {
    keywords: ["tooltip hover", "info tooltip", "hover popup", "element tooltip"],
    response:
      "To add a tooltip, select an element (e.g., Button) and go to the Interactions panel in the Properties sidebar. Choose 'Tooltip' on hover and enter text (e.g., 'Click to learn more'). Style with colors and position in the Style panel. Test in Preview. Say, 'Add a tooltip to my icon', and I’ll configure it.",
  },
  {
    keywords: ["sticky element", "fixed element", "scroll sticky", "persistent element"],
    response:
      "To make an element sticky, select it (e.g., Button) and go to the Layout panel in the Properties sidebar. Set 'Position: Sticky' and choose 'Top' or 'Bottom'. Adjust z-index (e.g., 100) to stay above others. Test in Preview mode. Say, 'Make my sidebar button sticky on scroll', and I’ll set it up.",
  },
  {
    keywords: ["404 page", "error page", "custom 404", "not found page"],
    response:
      "To create a custom 404 page, go to Settings > Pages and click 'Add 404 Page'. Drag a Section and add Text like 'Page Not Found' and a Button linking to the homepage. Style with your brand colors (Settings > Brand). Test in Preview mode. Say, 'Design a fun 404 page', and I’ll create it for you.",
  },
  {
    keywords: ["progress bar", "scroll progress", "loading bar", "page progress"],
    response:
      "To add a scroll progress bar, go to Settings > Code and inject CSS/JavaScript. Example CSS: `.progress { position: fixed; top: 0; height: 5px; background: #007bff; }`. Add JS to update width on scroll. Place in a Header element for visibility. Say, 'Add a blue scroll progress bar', and I’ll provide the code.",
  },
    {
    keywords: ["glassmorphism", "frosted glass", "blur effect", "modern style"],
    response:
      "To create a glassmorphism effect, add a Container element from the Elements sidebar. In the Properties sidebar, go to Background and select 'Color' with low opacity (e.g., rgba(255,255,255,0.1)). Enable 'Blur' in the Effects panel (e.g., 10px). Place it over a vibrant background for contrast. Test in Preview mode. Say, 'Add a glassmorphism card to my section', and I’ll design it for you.",
  },
  {
    keywords: ["neumorphism", "soft shadow", "neomorphic design", "minimal effect"],
    response:
      "For a neumorphic design, select an element like a Button from the Elements sidebar. In the Properties sidebar, set a light background (e.g., #e0e0e0) and add two shadows in the Effects panel: one dark (e.g., 5px, #bebebe) and one light (e.g., -5px, #ffffff). Use rounded corners. Test in Preview mode. Say, 'Create a neumorphic button for my form', and I’ll set it up.",
  },
  {
    keywords: ["ai animation", "generate animation", "dynamic effect", "motion ai"],
    response:
      "To generate AI-driven animations, select an element (e.g., Image) and go to the Interactions panel in the Properties sidebar. Click 'AI Motion' to let the AI suggest animations like 'Bounce' or 'Slide-In' based on your brand style (Settings > Brand). Adjust duration (e.g., 0.5s). Test in Preview mode. Say, 'Generate an AI animation for my logo', and I’ll apply it.",
  },
  {
    keywords: ["canvas lag", "slow canvas", "performance issue", "fix lag"],
    response:
      "If the canvas is lagging, try these steps: 1) Reduce high-resolution images in the Assets panel (optimize to <200KB). 2) Limit animations in the Interactions panel to essential elements. 3) Disable '3D Effects' for complex sections in the Effects panel. 4) Clear browser cache or test in Preview mode. Say, 'Why is my canvas slow?', and I’ll analyze your setup.",
  },
  {
    keywords: ["recover element", "undo delete", "restore element", "deleted item"],
    response:
      "To recover a deleted element, go to Settings > History (bottom rectangle > Settings). Find the version before the deletion in the timeline and click 'Restore'. Alternatively, check the 'Trash' tab in the Layers panel (right sidebar) to recover recently deleted items. Say, 'I deleted my header, how do I get it back?', and I’ll guide you.",
  },
  {
    keywords: ["collaborate comments", "team comments", "share canvas", "comment collaboration"],
    response:
      "To collaborate via comments, click the 'Comments' button in the bottom rectangle toolbar. Pin a comment on the canvas and tag team members (set up in Settings > Team). Others can reply or resolve comments in the Comments sidebar (right panel). Share the project via Settings > Share. Say, 'How do I collaborate with my team on comments?', and I’ll set it up.",
  },
  {
    keywords: ["custom domain preview", "test domain", "domain setup", "preview url"],
    response:
      "To preview a custom domain, go to Settings > Domain (bottom rectangle > Settings). After connecting your domain, click 'Test URL' to view it in Preview mode. Ensure DNS settings are correct (provided in the Domain tab). For issues, check the Access tab for restrictions. Say, 'Preview my site with my custom domain', and I’ll help you test it.",
  },
  {
    keywords: ["webrtc video", "video call", "live video", "video chat"],
    response:
      "To add a WebRTC video call feature, use an Embed element from the Elements sidebar. Inject WebRTC JavaScript (e.g., via SimplePeer) in Settings > Code. Example: `<script src='https://cdn.jsdelivr.net/npm/simple-peer@9.11.1/simplepeer.min.js'></script>`. Configure the video stream in the Properties sidebar. Test in Preview mode. Say, 'Add a video chat button to my site', and I’ll provide the code.",
  },
  {
    keywords: ["neural canvas", "ai canvas", "smart canvas", "intelligent design"],
    response:
      "For a 'neural canvas' effect, leverage AI tools. Go to Settings > AI Design (bottom rectangle > Settings) and enable 'Smart Layout'. The AI suggests element placements based on your content. Add AI animations in the Interactions panel for dynamic effects. Test in Preview mode. Say, 'Create a neural canvas layout for my homepage', and I’ll generate it.",
  },
  {
    keywords: ["crypto badge", "blockchain badge", "nft display", "crypto icon"],
    response:
      "To add a crypto badge, drag an Image element from the Elements sidebar. Upload a blockchain-inspired icon from the Assets panel (search 'crypto'). Add a hover animation (e.g., 'Pulse') in the Interactions panel. Link to your crypto wallet or NFT page in the Properties sidebar. Say, 'Add a crypto badge to my footer', and I’ll design it.",
  },
  {
    keywords: ["site speed", "make site faster", "optimize performance", "load time"],
    response:
      "To improve site speed, optimize images in the Assets panel (<200KB, WebP format). Enable lazy loading in the Loading panel for all Images. Minify custom code in Settings > Code. Use lightweight templates from the Templates panel. Test load time in Preview mode. Say, 'How do I make my site load faster?', and I’ll optimize it.",
  },
  {
    keywords: ["accordion menu", "collapsible menu", "faq accordion", "expandable section"],
    response:
      "To create an accordion menu, drag an Accordion element from the Elements sidebar. Add sections with titles and content in the Properties sidebar. Style with colors or icons in the Style panel. Ideal for FAQs or menus. Test in Preview mode. Say, 'Add an FAQ accordion to my page', and I’ll set it up.",
  },
  {
    keywords: ["timeline design", "history timeline", "event timeline", "vertical timeline"],
    response:
      "To add a timeline, drag a Timeline element from the Elements sidebar. In the Properties sidebar, add events with dates, titles, and descriptions. Style with gradients or icons in the Style panel. Choose vertical or horizontal layout. Say, 'Create a vertical timeline for my company history', and I’ll design it.",
  },
  {
    keywords: ["cookie consent", "gdpr popup", "cookie banner", "privacy popup"],
    response:
      "To add a cookie consent popup, drag a Popup element from the Elements sidebar. Set the trigger to 'On Load' in the Interactions panel. Add Text and a Button (e.g., 'Accept Cookies'). Style with your brand colors in the Style panel. Test in Preview mode. Say, 'Add a GDPR cookie banner', and I’ll configure it.",
  },
  {
    keywords: ["progressive web app", "pwa setup", "mobile app", "installable site"],
    response:
      "To make your site a PWA, go to Settings > PWA (bottom rectangle > Settings). Enable 'PWA Mode' and upload icons in the Assets panel. Add a manifest.json file via Settings > Code: `{ 'name': 'Your Site', 'start_url': '/' }`. Test installability in Preview mode. Say, 'Turn my site into a PWA', and I’ll guide you.",
  },
  {
    keywords: ["heat map", "user tracking", "click map", "analytics heat"],
    response:
      "To add a heat map, integrate a tool like Hotjar via Settings > Integrations. Paste the tracking code in the Analytics tab. Alternatively, add custom JavaScript in Settings > Code to track clicks. Visualize results in your analytics dashboard. Say, 'Add a heat map to track clicks', and I’ll help you set it up.",
  },
  {
    keywords: ["dynamic hero", "hero slider", "animated hero", "hero section"],
    response:
      "To create a dynamic hero, drag a Hero element from the Elements sidebar. Add a slideshow of images or videos in the Properties sidebar. Enable AI animations (e.g., 'Ken Burns') in the Interactions panel. Customize text and buttons. Say, 'Design a dynamic hero with sliding images', and I’ll add it to your canvas.",
  },
  {
    keywords: ["voice search", "voice input", "speech recognition", "voice command"],
    response:
      "To add voice search, use an Embed element from the Elements sidebar. Inject Web Speech API JavaScript in Settings > Code: `const recognition = new SpeechRecognition();`. Bind it to a search bar in the Properties sidebar. Test in Preview mode. Say, 'Add voice search to my site', and I’ll provide the code.",
  },
  {
    keywords: ["masonry grid", "photo grid", "gallery layout", "irregular grid"],
    response:
      "To create a masonry grid, drag a Grid element from the Elements sidebar. In the Properties sidebar, enable 'Masonry' layout. Add Images or bind to a CMS collection. Adjust spacing and breakpoints in the Layout panel. Say, 'Add a masonry photo gallery', and I’ll design it for you.",
  },
  {
    keywords: ["scroll reveal", "fade in scroll", "reveal effect", "scroll animation"],
    response:
      "To add a scroll reveal effect, select an element (e.g., Text) and go to the Interactions panel in the Properties sidebar. Choose 'Scroll' trigger and 'Fade In' action. Set offset (e.g., 100px) and duration (e.g., 0.5s). Test in Preview mode. Say, 'Add a fade-in effect on scroll for my section', and I’ll apply it.",
  },
  {
    keywords: ["custom scrollbar", "styled scrollbar", "scrollbar design", "scroll style"],
    response:
      "To style the scrollbar, go to Settings > Code and add CSS: `::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-thumb { background: #007bff; }`. Apply site-wide or to specific sections. Test in Preview mode for compatibility. Say, 'Add a blue custom scrollbar', and I’ll inject the code.",
  },
  {
    keywords: ["blog pagination", "post navigation", "blog pages", "next prev"],
    response:
      "To add pagination to a blog, drag a List element from the Elements sidebar and bind it to your Blog CMS (Settings > CMS). In the Properties sidebar, enable 'Pagination' and style buttons (e.g., 'Next', 'Prev'). Test in Preview mode. Say, 'Add pagination to my blog posts', and I’ll configure it.",
  },
  {
    keywords: ["countdown timer", "event timer", "launch countdown", "timer widget"],
    response:
      "To add a countdown timer, drag a Timer element from the Elements sidebar. Set the target date in the Properties sidebar (e.g., '2025-12-31'). Style numbers and labels in the Style panel. Test in Preview mode. Say, 'Add a countdown for my product launch', and I’ll design it.",
  },
  {
    keywords: ["image hotspot", "interactive image", "clickable image", "hotspot map"],
    response:
      "To create image hotspots, drag an Image element from the Elements sidebar. In the Properties sidebar, enable 'Hotspots' and click to add interactive points. Link each to a URL or popup. Style with animations in the Interactions panel. Say, 'Add hotspots to my product image', and I’ll set it up.",
  },
  {
    keywords: ["sticker animation", "animated sticker", "creator sticker motion", "sticker effect"],
    response:
      "For an animated sticker (available soon), go to Elements > Stickers and select a custom sticker. In the Interactions panel, add animations like 'Bounce' or 'Rotate'. For now, use an Image element with AI animations from the Interactions panel. Say, 'Add an animated heart sticker', and I’ll simulate it.",
  },
  {
    keywords: ["split screen", "dual section", "half screen design", "side by side"],
    response:
      "To create a split-screen layout, drag a Container element from the Elements sidebar. In the Layout panel, set it to 'Flex' with two child Sections (50% width each). Add different backgrounds or content. Test in Preview mode. Say, 'Design a split-screen hero with text and image', and I’ll add it.",
  },
  {
    keywords: ["user profile", "account page", "profile design", "user dashboard"],
    response:
      "To create a user profile page, drag a Section element from the Elements sidebar. Add Text for name, Image for avatar, and Form for editable fields. Bind to user data in Settings > CMS. Style with a modern card layout. Say, 'Design a user profile page', and I’ll set it up.",
  },
  {
    keywords: ["background music", "audio background", "site music", "ambient sound"],
    response:
      "To add background music, drag an Audio element from the Elements sidebar. Upload an MP3 from the Assets panel and enable 'Loop' in the Properties sidebar. Add a toggle button to pause/play via the Interactions panel. Test in Preview mode. Say, 'Add ambient music to my site', and I’ll configure it.",
  },
  {
    keywords: ["form analytics", "form tracking", "submission stats", "form data"],
    response:
      "To track form submissions, go to Settings > Analytics and integrate a tool like Google Analytics. Bind form submissions to events in the Properties sidebar (Form > Data). View stats in your analytics dashboard. Say, 'Track my contact form submissions', and I’ll help you set it up.",
  },
  {
    keywords: ["gradient border", "colorful border", "border style", "outline gradient"],
    response:
      "To add a gradient border, select an element (e.g., Button) and go to Settings > Code. Inject CSS: `button { border: 2px solid; border-image: linear-gradient(45deg, #ff5733, #ffc107) 1; }`. Apply in the Properties sidebar. Test in Preview mode. Say, 'Add a gradient border to my button', and I’ll provide the code.",
  },
  {
    keywords: ["page transition", "smooth transition", "page animation", "fade page"],
    response:
      "To add page transitions, go to Settings > Code and inject JavaScript for a library like GSAP. Example: `gsap.to('.page', { opacity: 0, duration: 0.5, onComplete: () => window.location = 'new-page' });`. Apply to navigation links. Test in Preview mode. Say, 'Add a fade page transition', and I’ll set it up.",
  },
  {
    keywords: ["testimonial slider", "review carousel", "client feedback", "quotes slider"],
    response:
      "To add a testimonial slider, drag a Carousel element from the Elements sidebar. Add Text and Image elements for quotes and avatars in the Properties sidebar. Bind to a CMS collection for dynamic reviews. Style with animations. Say, 'Create a testimonial slider', and I’ll design it.",
  },
  {
    keywords: ["sticky footer", "fixed footer", "persistent footer", "scroll footer"],
    response:
      "To make a footer sticky, drag a Footer element from the Elements sidebar. In the Layout panel, set 'Position: Fixed' and 'Bottom: 0'. Adjust z-index (e.g., 100) in the Properties sidebar. Test in Preview mode. Say, 'Make my footer sticky', and I’ll configure it.",
  },
  {
    keywords: ["product zoom", "image zoom", "magnify image", "zoom effect"],
    response:
      "To add a product zoom effect, select an Image element and go to the Interactions panel in the Properties sidebar. Enable 'Zoom' on hover and set magnification (e.g., 2x). Test in Preview mode for smoothness. Say, 'Add a zoom effect to my product image', and I’ll apply it.",
  },
  {
    keywords: ["category filter", "product filter", "dynamic filter", "cms filter"],
    response:
      "To add a category filter, drag a List element from the Elements sidebar and bind it to a CMS collection (Settings > CMS). In the Properties sidebar, enable 'Filters' and add categories (e.g., 'Clothing', 'Electronics'). Style buttons in the Style panel. Say, 'Add a product category filter', and I’ll set it up.",
  },
  {
    keywords: ["parallax text", "text scroll effect", "motion text", "scroll text"],
    response:
      "To add parallax text, select a Text element and go to the Interactions panel in the Properties sidebar. Enable 'Parallax' and set speed (e.g., 0.3). Adjust offset for subtle motion. Test in Preview mode. Say, 'Add a parallax effect to my headline', and I’ll configure it.",
  },
  {
    keywords: ["off-canvas menu", "slide menu", "hidden menu", "side menu"],
    response:
      "To create an off-canvas menu, drag a Menu element from the Elements sidebar. In the Properties sidebar, set 'Type: Off-Canvas' and choose slide direction (e.g., Left). Add a toggle button in the Interactions panel. Style with animations. Say, 'Add an off-canvas menu', and I’ll design it.",
  },
  {
    keywords: ["qr code", "generate qr", "qr link", "scan code"],
    response:
      "To add a QR code, drag an Image element from the Elements sidebar. In Settings > Code, inject a QR code library like QRCode.js: `<script src='https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js'></script>`. Generate a QR for your URL in the Properties sidebar. Say, 'Add a QR code for my homepage', and I’ll set it up.",
  },
  {
    keywords: ["infinite scroll", "endless scroll", "load more", "dynamic scroll"],
    response:
      "To enable infinite scroll, drag a List element from the Elements sidebar and bind it to a CMS collection. In the Properties sidebar, enable 'Infinite Scroll'. Set batch size (e.g., 10 items). Test in Preview mode for smooth loading. Say, 'Add infinite scroll to my blog', and I’ll configure it.",
  },
  {
    keywords: ["text shadow", "glow text", "shadow effect", "text styling"],
    response:
      "To add a text shadow, select a Text element and go to the Effects panel in the Properties sidebar. Enable 'Shadow' and set values (e.g., 2px, 2px, #007bff). For a glow effect, use a larger blur (e.g., 10px). Test in Preview mode. Say, 'Add a blue glow to my text', and I’ll apply it.",
  },
  {
    keywords: ["content lock", "paywall", "premium content", "restricted access"],
    response:
      "To lock content, drag a Section element from the Elements sidebar. In the Properties sidebar, enable 'Access Restriction' and set a password or user role (configured in Settings > Access). Add a login form for premium users. Say, 'Lock my premium content section', and I’ll set it up.",
  },
  {
    keywords: ["image comparison", "before after", "slider comparison", "image split"],
    response:
      "To add an image comparison slider, drag a Comparison element from the Elements sidebar. Upload two images in the Properties sidebar (e.g., before/after). Adjust the slider handle style in the Style panel. Test in Preview mode. Say, 'Add a before-after image slider', and I’ll design it.",
  },
  {
    keywords: ["lottie animation", "json animation", "vector animation", "lottie player"],
    response:
      "To add a Lottie animation, drag an Embed element from the Elements sidebar. Upload a Lottie JSON file to the Assets panel and inject the player: `<script src='https://cdn.jsdelivr.net/npm/lottie-web@5.9.6/build/player/lottie.min.js'></script>`. Bind in the Properties sidebar. Say, 'Add a Lottie animation to my hero', and I’ll set it up.",
  },
  {
    keywords: ["dynamic pricing", "price update", "cms pricing", "real-time price"],
    response:
      "To add dynamic pricing, drag a Text element from the Elements sidebar and bind it to a CMS collection (Settings > CMS) with a 'Price' field. Update prices in the CMS to reflect real-time changes. Style in the Style panel. Say, 'Add dynamic pricing to my product page', and I’ll configure it.",
  },
  {
    keywords: ["scroll to top", "back to top", "top button", "scroll button"],
    response:
      "To add a 'Scroll to Top' button, drag a Button element from the Elements sidebar. In the Interactions panel, set 'On Click' to 'Scroll to Top'. Style with a fixed position (Layout panel) and icon (Assets panel). Say, 'Add a scroll-to-top button', and I’ll design it.",
  },
  {
    keywords: ["dynamic filter", "cms filter", "category sort", "content filter"],
    response:
      "To add a dynamic CMS filter, drag a List element from the Elements sidebar and bind it to a CMS collection (Settings > CMS). In the Properties sidebar, enable 'Filters' and define categories (e.g., 'News', 'Events'). Style filter buttons in the Style panel. Test in Preview mode. Say, 'Add a filter for my blog categories', and I’ll configure it.",
  },
  {
    keywords: ["webxr", "ar element", "augmented reality", "3d immersive"],
    response:
      "To add a WebXR (AR) element, drag a Canvas element from the Elements sidebar. Inject a WebXR library like A-Frame in Settings > Code: `<script src='https://aframe.io/releases/1.5.0/aframe.min.js'></script>`. Add a 3D model from the Assets panel and configure AR in the Properties sidebar. Test in Preview mode on AR-compatible devices. Say, 'Add an AR product viewer', and I’ll set it up.",
  },
  {
    keywords: ["gizmo flux", "kinetic widget", "interactive gizmo", "motion flux"],
    response:
      "For a 'gizmo flux' effect, add a Container element from the Elements sidebar. In the Interactions panel, apply a kinetic animation (e.g., 'Orbit') with AI-generated motion from Settings > AI Design. Style with a glowing gradient in the Background panel. Test in Preview mode. Say, 'Create a kinetic gizmo for my hero', and I’ll design it.",
  },
  {
    keywords: ["meta-canvas", "virtual canvas", "immersive design", "vr layout"],
    response:
      "To create a 'meta-canvas' layout, use the AI Design tool in Settings > AI Design (bottom rectangle > Settings). Enable 'Immersive Mode' to generate a 3D-inspired layout. Add Canvas elements with WebGL effects via Settings > Code. Test in Preview mode. Say, 'Design a meta-canvas homepage', and I’ll generate the layout.",
  },
  {
    keywords: ["site standout", "unique website", "make site pop", "distinct design"],
    response:
      "To make your site stand out, use a bold color palette (Settings > Brand > Colors), add AI-generated visuals from the Assets panel, and apply micro-animations in the Interactions panel. Choose a unique template from the Templates panel and customize with 3D elements. Test in Preview mode. Say, 'Make my site visually unique', and I’ll suggest a design.",
  },
  {
    keywords: ["broken layout", "fix layout", "element overlap", "layout issue"],
    response:
      "If your layout is broken, check the Layers panel (right sidebar) for overlapping elements or incorrect z-index values. Adjust positioning in the Layout panel (Properties sidebar). Ensure responsive settings match in the Responsive tab. Test in Preview mode. Say, 'Fix my overlapping footer', and I’ll troubleshoot it.",
  },
  {
    keywords: ["mobile performance", "optimize mobile", "fast mobile", "mobile speed"],
    response:
      "To optimize mobile performance, enable lazy loading for Images in the Loading panel (Properties sidebar). Use lightweight assets (<100KB) from the Assets panel. Disable heavy animations for mobile in the Responsive tab. Test in Device Preview mode. Say, 'Improve my site’s mobile speed', and I’ll optimize it.",
  },
  {
    keywords: ["ai video edit", "generate video", "video customization", "ai clip"],
    response:
      "To edit AI-generated videos, go to the Assets panel (sidebar > Assets) and search for a video. Select it, then click 'AI Edit' to adjust length, add text, or apply filters. Drag the edited video to a Section or set as a background. Test in Preview mode. Say, 'Generate a 10-second intro video', and I’ll create it.",
  },
  {
    keywords: ["canvas zoom", "zoom control", "scale canvas", "canvas view"],
    response:
      "To zoom the canvas, click the '+' or '-' buttons in the bottom rectangle toolbar. Alternatively, use the mouse scroll wheel while holding Ctrl. Reset zoom with the 'Fit' button in the toolbar. This helps focus on specific elements. Say, 'How do I zoom into my canvas?', and I’ll guide you.",
  },
  {
    keywords: ["comment workflow", "manage comments", "comment approval", "canvas notes"],
    response:
      "To manage canvas comments, open the Comments sidebar (right panel) via the 'Comments' button in the bottom rectangle toolbar. Review, reply, or resolve comments. Enable 'Approval Mode' in Settings > Team to moderate comments. Say, 'Set up a comment workflow for my team', and I’ll configure it.",
  },
  {
    keywords: ["typewriter effect", "typing animation", "text animation", "dynamic text"],
    response:
      "To add a typewriter effect, select a Text element and go to the Interactions panel in the Properties sidebar. Enable 'Typewriter' and set speed (e.g., 50ms per character). Customize cursor style in the Style panel. Test in Preview mode. Say, 'Add a typewriter effect to my headline', and I’ll apply it.",
  },
  {
    keywords: ["pricing toggle", "plan switch", "pricing switcher", "toggle plans"],
    response:
      "To add a pricing toggle (e.g., Monthly/Yearly), drag a Toggle element from the Elements sidebar. In the Properties sidebar, bind it to a CMS collection with pricing data (Settings > CMS). Style the toggle in the Style panel. Test in Preview mode. Say, 'Add a pricing toggle for my plans', and I’ll set it up.",
  },
  {
    keywords: ["fullscreen menu", "overlay menu", "full menu", "navigation overlay"],
    response:
      "To create a fullscreen menu, drag a Menu element from the Elements sidebar. In the Properties sidebar, set 'Type: Fullscreen'. Add links and style with a dark overlay (Background panel). Add a toggle button in the Interactions panel. Say, 'Design a fullscreen menu', and I’ll configure it.",
  },
  {
    keywords: ["content scheduler", "post schedule", "cms scheduler", "publish later"],
    response:
      "To schedule CMS content, go to Settings > CMS and select a collection (e.g., Blog). Add a 'Publish Date' field. Set future dates for posts in the CMS editor. They’ll auto-publish at the specified time. Test in Preview mode. Say, 'Schedule a blog post for next week', and I’ll guide you.",
  },
  {
    keywords: ["rainbow hover", "color hover", "multicolor effect", "hover gradient"],
    response:
      "To add a rainbow hover effect, select an element (e.g., Button) and go to Settings > Code. Inject CSS: `button:hover { background: linear-gradient(45deg, red, orange, yellow, green, blue); }`. Apply in the Properties sidebar. Test in Preview mode. Say, 'Add a rainbow hover to my button', and I’ll provide the code.",
  },
  {
    keywords: ["user feedback", "feedback form", "survey popup", "visitor input"],
    response:
      "To collect user feedback, drag a Form element from the Elements sidebar. Add fields like 'Rating' and 'Comments' in the Properties sidebar. Set it as a popup with an 'On Load' trigger in the Interactions panel. Bind submissions to CMS. Say, 'Add a feedback popup', and I’ll design it.",
  },
  {
    keywords: ["gradient overlay", "image overlay", "color overlay", "section overlay"],
    response:
      "To add a gradient overlay, select a Section with an image background. In the Background panel (Properties sidebar), enable 'Overlay' and choose a gradient (e.g., black to transparent). Adjust opacity (e.g., 0.5). Test in Preview mode. Say, 'Add a gradient overlay to my hero image', and I’ll apply it.",
  },
  {
    keywords: ["dynamic counter", "number animation", "stats counter", "count up"],
    response:
      "To add a dynamic counter, drag a Counter element from the Elements sidebar. Set the target number (e.g., 1000) and duration (e.g., 2s) in the Properties sidebar. Style with bold typography in the Style panel. Test in Preview mode. Say, 'Add a counter for 500 users', and I’ll set it up.",
  },
  {
    keywords: ["search bar", "site search", "content search", "search function"],
    response:
      "To add a search bar, drag a Search element from the Elements sidebar. Bind it to your CMS or site pages in the Properties sidebar. Style the input and results in the Style panel. Test in Preview mode. Say, 'Add a search bar to my header', and I’ll configure it.",
  },
  {
    keywords: ["wave background", "fluid background", "wave effect", "curvy design"],
    response:
      "To create a wave background, drag a Section element from the Elements sidebar. In the Background panel, select 'Wave' and customize colors and amplitude. Add AI-generated waves via Settings > AI Design. Test in Preview mode. Say, 'Add a blue wave background', and I’ll design it.",
  },
  {
    keywords: ["portfolio filter", "gallery filter", "work showcase", "project filter"],
    response:
      "To add a portfolio filter, drag a Grid element from the Elements sidebar and bind it to a CMS collection (Settings > CMS). Enable 'Filters' in the Properties sidebar for categories (e.g., 'Web', 'Design'). Style filter buttons. Say, 'Add a portfolio filter for my projects', and I’ll set it up.",
  },
  {
    keywords: ["clip path", "shape mask", "custom shape", "element clip"],
    response:
      "To add a clip path, select an element (e.g., Image) and go to Settings > Code. Inject CSS: `.element { clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); }`. Apply in the Properties sidebar. Test in Preview mode. Say, 'Add a diamond clip path to my image', and I’ll provide the code.",
  },
  {
    keywords: ["team section", "about team", "staff profiles", "team cards"],
    response:
      "To create a team section, drag a Grid element from the Elements sidebar. Add Image and Text elements for each member in the Properties sidebar. Bind to a CMS collection for dynamic profiles. Style with hover effects. Say, 'Design a team section with cards', and I’ll set it up.",
  },
  {
    keywords: ["push notification", "web notification", "alert user", "browser notification"],
    response:
      "To add push notifications, go to Settings > Code and inject JavaScript for the Web Push API. Example: `Notification.requestPermission().then(() => new Notification('Hello!'));`. Configure triggers in the Properties sidebar. Test in Preview mode. Say, 'Add push notifications for new posts', and I’ll provide the code.",
  },
  {
    keywords: ["morphing button", "shape morph", "button animation", "dynamic button"],
    response:
      "To create a morphing button, select a Button element and go to the Interactions panel in the Properties sidebar. Enable 'Morph' and set shapes (e.g., circle to square). Adjust duration (e.g., 0.3s). Test in Preview mode. Say, 'Add a morphing button effect', and I’ll apply it.",
  },
  {
    keywords: ["event calendar", "schedule calendar", "cms calendar", "date events"],
    response:
      "To add an event calendar, drag a Calendar element from the Elements sidebar. Bind it to a CMS collection with event data (Settings > CMS). Style dates and events in the Style panel. Test in Preview mode. Say, 'Add an event calendar to my page', and I’ll configure it.",
  },
  {
    keywords: ["loading animation", "preloader", "site loader", "spinner"],
    response:
      "To add a loading animation, go to Settings > Code and inject CSS: `.loader { border: 5px solid #007bff; animation: spin 1s infinite; }`. Add a Div element for the loader in the Properties sidebar. Hide after load via JavaScript. Say, 'Add a blue spinner preloader', and I’ll set it up.",
  },
  {
    keywords: ["sticky sidebar", "fixed sidebar", "scroll sidebar", "persistent sidebar"],
    response:
      "To make a sidebar sticky, select the sidebar Container in the Layers panel. In the Layout panel (Properties sidebar), set 'Position: Sticky' and 'Top: 0'. Adjust z-index (e.g., 100). Test in Preview mode. Say, 'Make my sidebar sticky', and I’ll configure it.",
  },
  {
    keywords: ["image gallery", "photo showcase", "grid gallery", "media gallery"],
    response:
      "To create an image gallery, drag a Grid element from the Elements sidebar. Add Images from the Assets panel or bind to a CMS collection. Enable 'Lightbox' in the Properties sidebar for full-screen views. Style spacing in the Layout panel. Say, 'Add an image gallery', and I’ll design it.",
  },
  {
    keywords: ["text reveal", "scroll text effect", "fade text", "reveal animation"],
    response:
      "To add a text reveal effect, select a Text element and go to the Interactions panel in the Properties sidebar. Enable 'Scroll Reveal' and choose 'Fade Up'. Set offset (e.g., 50px) and duration (e.g., 0.5s). Test in Preview mode. Say, 'Add a text reveal on scroll', and I’ll apply it.",
  },
  {
    keywords: ["custom favicon", "site icon", "favicon upload", "browser icon"],
    response:
      "To add a custom favicon, go to Settings > Brand > Favicon (bottom rectangle > Settings). Upload a 32x32 PNG or ICO file from the Assets panel. Save and test in Preview mode to see it in the browser tab. Say, 'Add a custom favicon to my site', and I’ll guide you.",
  },
  {
    keywords: ["product variants", "variant options", "ecommerce variants", "product options"],
    response:
      "To add product variants, drag a Product element from the Elements sidebar and bind it to a CMS collection (Settings > CMS). In the Properties sidebar, add variant fields (e.g., Size, Color). Style options in the Style panel. Say, 'Add variants to my product page', and I’ll set it up.",
  },
  {
    keywords: ["scrolling marquee", "text marquee", "ticker text", "moving text"],
    response:
      "To add a scrolling marquee, drag a Text element from the Elements sidebar. In the Interactions panel, enable 'Marquee' and set speed (e.g., 50px/s). Style text in the Style panel. Test in Preview mode. Say, 'Add a scrolling marquee for news', and I’ll configure it.",
  },
  {
    keywords: ["membership login", "user login", "sign in page", "member access"],
    response:
      "To create a membership login page, drag a Form element from the Elements sidebar. Add fields for Email and Password in the Properties sidebar. Bind to user data in Settings > CMS. Style with a modern card layout. Say, 'Add a login page for members', and I’ll design it.",
  },
  {
    keywords: ["background particles", "particle effect", "animated background", "dynamic particles"],
    response:
      "To add background particles, go to Settings > Code and inject a library like particles.js: `<script src='https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js'></script>`. Configure in a Canvas element’s Properties sidebar. Test in Preview mode. Say, 'Add particle background to my hero', and I’ll set it up.",
  },
  {
    keywords: ["blog tags", "post tags", "cms tags", "content tags"],
    response:
      "To add tags to blog posts, go to Settings > CMS and select your Blog collection. Add a 'Tags' field. Assign tags in the CMS editor. Display tags in a List element by binding in the Properties sidebar. Style in the Style panel. Say, 'Add tags to my blog posts', and I’ll configure it.",
  },
  {
    keywords: ["image parallax", "scroll image effect", "parallax photo", "motion image"],
    response:
      "To add an image parallax effect, select an Image element and go to the Interactions panel in the Properties sidebar. Enable 'Parallax' and set speed (e.g., 0.2). Adjust offset for smooth motion. Test in Preview mode. Say, 'Add parallax to my section image', and I’ll apply it.",
  },
  {
    keywords: ["custom meta tags", "seo meta", "meta description", "page meta"],
    response:
      "To add custom meta tags, go to Settings > SEO > Meta Tags (bottom rectangle > Settings). Add tags like `<meta name='description' content='Your site description'>`. Apply site-wide or per page in the Properties sidebar. Test in Preview mode. Say, 'Add meta tags for SEO', and I’ll set them up.",
  },
  {
    keywords: ["feature toggle", "experiment toggle", "ab test toggle", "variant switch"],
    response:
      "To add a feature toggle for A/B testing, drag a Toggle element from the Elements sidebar. In the Properties sidebar, bind it to two CMS variants (Settings > Experiments). Style the toggle in the Style panel. Test in Preview mode. Say, 'Add a toggle for A/B testing', and I’ll configure it.",
  },
  {
    keywords: ["review stars", "rating stars", "product rating", "star widget"],
    response:
      "To add review stars, drag a Rating element from the Elements sidebar. Set the number of stars (e.g., 5) and bind to a CMS collection in the Properties sidebar. Style colors in the Style panel. Test in Preview mode. Say, 'Add star ratings to my product', and I’ll set it up.",
  },
  {
    keywords: ["content tabs", "tabbed content", "tabs section", "switch tabs"],
    response:
      "To add content tabs, drag a Tabs element from the Elements sidebar. Add tab titles and content in the Properties sidebar. Style tabs with hover effects in the Style panel. Test in Preview mode. Say, 'Add tabs for my services section', and I’ll design it.",
  },
  {
    keywords: ["geo-targeting", "location content", "user location", "dynamic location"],
    response:
      "To add geo-targeting, go to Settings > Code and inject JavaScript using the Geolocation API: `navigator.geolocation.getCurrentPosition(pos => console.log(pos));`. Bind location data to a Text element in the Properties sidebar. Test in Preview mode. Say, 'Show user location on my site', and I’ll provide the code.",
  },
  {
    keywords: ["dropdown menu", "sub menu", "nested navigation", "menu dropdown"],
    response:
      "To add a dropdown menu, drag a Menu element from the Elements sidebar. In the Properties sidebar, add sub-items under main links. Style dropdowns with hover effects in the Style panel. Test in Preview mode. Say, 'Add a dropdown menu to my nav', and I’ll configure it.",
  },
  {
    keywords: ["progress circle", "circle loader", "radial progress", "progress ring"],
    response:
      "To add a progress circle, go to Settings > Code and inject SVG/CSS: `<svg><circle cx='50' cy='50' r='45' stroke-dasharray='283' /></svg>`. Animate via JavaScript in the Properties sidebar. Test in Preview mode. Say, 'Add a progress circle for loading', and I’ll set it up.",
  },
  {
    keywords: ["blog archive", "post archive", "cms archive", "monthly archive"],
    response:
      "To add a blog archive, drag a List element from the Elements sidebar and bind it to a Blog CMS collection (Settings > CMS). In the Properties sidebar, enable 'Archive' to group by month/year. Style links in the Style panel. Say, 'Add a blog archive sidebar', and I’ll configure it.",
  },
  {
    keywords: ["custom 500 page", "error page", "server error", "500 error"],
    response:
      "To create a custom 500 error page, go to Settings > Pages and click 'Add 500 Page'. Drag a Section with Text like 'Server Error' and a Button to the homepage. Style with brand colors. Test in Preview mode. Say, 'Design a 500 error page', and I’ll set it up.",
  },
  {
    keywords: ["text highlighter", "highlight effect", "text marker", "emphasis text"],
    response:
      "To add a text highlighter effect, select a Text element and go to Settings > Code. Inject CSS: `span.highlight { background: linear-gradient(transparent 60%, #ffff99 40%); }`. Apply to text in the Properties sidebar. Test in Preview mode. Say, 'Add a highlighter to my text', and I’ll provide the code.",
  },
  {
    keywords: ["product wishlist", "save product", "wishlist button", "user wishlist"],
    response:
      "To add a product wishlist, drag a Button element from the Elements sidebar. In the Properties sidebar, bind it to a CMS collection for user data (Settings > CMS). Add a heart icon from the Assets panel. Style with hover effects. Say, 'Add a wishlist button to my product', and I’ll set it up.",
  },
  {
    keywords: ["canvas grid", "layout grid", "design grid", "alignment grid"],
    response:
      "To enable a canvas grid, click the 'Grid' button in the bottom rectangle toolbar. Adjust grid size (e.g., 10px) in the Properties sidebar. Snap elements to the grid for alignment. Toggle visibility as needed. Say, 'Show a grid on my canvas', and I’ll enable it.",
  },
  {
    keywords: ["blog share", "social share", "post sharing", "share buttons"],
    response:
      "To add social share buttons to a blog post, drag a Social Share element from the Elements sidebar. In the Properties sidebar, select platforms (e.g., Twitter, Facebook). Style buttons in the Style panel. Bind to CMS posts. Say, 'Add share buttons to my blog', and I’ll configure it.",
  },
  {
    keywords: ["image tilt", "tilt effect", "3d tilt", "hover tilt"],
    response:
      "To add an image tilt effect, select an Image element and go to the Interactions panel in the Properties sidebar. Enable 'Tilt' and set angle (e.g., 10deg). Adjust speed (e.g., 0.3s). Test in Preview mode. Say, 'Add a tilt effect to my image', and I’ll apply it.",
  },
  {
    keywords: ["custom sitemap", "xml sitemap", "seo sitemap", "site map"],
    response:
      "To create a custom sitemap, go to Settings > SEO > Sitemap. Generate an XML sitemap automatically or add custom URLs in the editor. Save and submit to search engines via Settings > SEO. Test in Preview mode. Say, 'Create an XML sitemap', and I’ll set it up.",
  },
    {
    keywords: ["vortex widget", "swirl effect", "dynamic vortex", "motion widget"],
    response:
      "To create a 'vortex widget' effect, add a Canvas element from the Elements sidebar. In Settings > Code, inject a WebGL script for a swirl animation (e.g., using Three.js). Configure motion in the Properties sidebar with AI-generated patterns from Settings > AI Design. Test in Preview mode. Say, 'Add a vortex widget to my hero', and I’ll set it up.",
  },
  {
    keywords: ["holographic grid", "futuristic grid", "3d grid", "holo layout"],
    response:
      "For a holographic grid, drag a Grid element from the Elements sidebar. In the Effects panel (Properties sidebar), enable '3D Transform' and set a glowing gradient background. Add AI animations via Settings > AI Design for a futuristic look. Test in Preview mode. Say, 'Create a holographic grid for my section', and I’ll design it.",
  },
  {
    keywords: ["ai accessibility", "accessible design", "ada compliance", "web accessibility"],
    response:
      "To enhance accessibility with AI, go to Settings > AI Design and enable 'Accessibility Mode'. The AI suggests high-contrast colors, readable fonts, and ARIA labels. Check compliance in the Properties sidebar for each element. Test with screen readers in Preview mode. Say, 'Make my site ADA-compliant', and I’ll optimize it.",
  },
  {
    keywords: ["cms data error", "fix cms", "data not showing", "cms issue"],
    response:
      "If CMS data isn’t showing, check Settings > CMS for correct field mappings in your collection. Ensure the List or Grid element is bound to the collection in the Properties sidebar. Clear cache in Settings > Performance. Test in Preview mode. Say, 'Fix my blog posts not displaying', and I’ll troubleshoot it.",
  },
  {
    keywords: ["canvas rendering", "optimize canvas", "smooth canvas", "rendering lag"],
    response:
      "To optimize canvas rendering, reduce 3D effects in the Effects panel (Properties sidebar). Use compressed assets (<200KB) from the Assets panel. Enable 'Hardware Acceleration' in Settings > Performance. Test in Preview mode. Say, 'Make my canvas render smoothly', and I’ll adjust the settings.",
  },
  {
    keywords: ["site engagement", "more engaging", "user interaction", "interactive site"],
    response:
      "To make your site more engaging, add micro-animations in the Interactions panel, use AI-generated visuals from the Assets panel, and include interactive elements like Forms or Toggles. Add a Chat widget via Settings > Integrations. Test in Preview mode. Say, 'Make my site more interactive', and I’ll suggest a layout.",
  },
  {
    keywords: ["blend mode", "css blend", "layer blend", "mix blend"],
    response:
      "To add a CSS blend mode, select an element (e.g., Image) and go to Settings > Code. Inject CSS: `.element { mix-blend-mode: multiply; }`. Apply in the Properties sidebar. Test blend effects in Preview mode for compatibility. Say, 'Add a multiply blend to my image', and I’ll provide the code.",
  },
  {
    keywords: ["webgpu effect", "gpu animation", "advanced graphics", "3d gpu"],
    response:
      "To add a WebGPU effect, drag a Canvas element from the Elements sidebar. Inject a WebGPU script in Settings > Code (e.g., using a library like Babylon.js). Configure 3D graphics in the Properties sidebar. Test in Preview mode on supported browsers. Say, 'Add a WebGPU animation', and I’ll set it up.",
  },
  {
    keywords: ["canvas collaboration", "team canvas", "live edit", "realtime edit"],
    response:
      "For live canvas collaboration, go to Settings > Team and invite collaborators. Enable 'Realtime Edit' to see live changes. Use the Comments sidebar (bottom rectangle > Comments) for feedback. Test in Preview mode. Say, 'Set up live collaboration for my team', and I’ll configure it.",
  },
  {
    keywords: ["ai content workflow", "content pipeline", "ai text flow", "content automation"],
    response:
      "To automate content with AI, go to Settings > AI Design and enable 'Content Workflow'. The AI generates text for Text elements based on your brand voice (Settings > Brand). Schedule posts in Settings > CMS. Test in Preview mode. Say, 'Automate my blog content', and I’ll set up the workflow.",
  },
  {
    keywords: ["scrolling text", "horizontal scroll", "text carousel", "scroll text"],
    response:
      "To add scrolling text, drag a Text element from the Elements sidebar. In the Interactions panel, enable 'Horizontal Scroll' and set speed (e.g., 30px/s). Style with bold fonts in the Style panel. Test in Preview mode. Say, 'Add scrolling text for my footer', and I’ll configure it.",
  },
  {
    keywords: ["product comparison", "compare table", "feature table", "comparison chart"],
    response:
      "To create a product comparison table, drag a Table element from the Elements sidebar. Add rows for features and columns for products in the Properties sidebar. Bind to a CMS collection for dynamic data. Style in the Style panel. Say, 'Add a product comparison table', and I’ll design it.",
  },
  {
    keywords: ["lazy video", "video performance", "optimize video", "video load"],
    response:
      "To enable lazy loading for videos, select a Video element and go to the Loading panel in the Properties sidebar. Enable 'Lazy Load'. Use compressed MP4s (<5MB) from the Assets panel. Add a poster image for initial display. Say, 'Optimize my video loading', and I’ll configure it.",
  },
  {
    keywords: ["custom 403 page", "access denied", "403 error", "forbidden page"],
    response:
      "To create a custom 403 error page, go to Settings > Pages and click 'Add 403 Page'. Drag a Section with Text like 'Access Denied' and a Button to the homepage. Style with your brand colors. Test in Preview mode. Say, 'Design a 403 error page', and I’ll set it up.",
  },
  {
    keywords: ["image distortion", "warp effect", "distort image", "glitch image"],
    response:
      "To add an image distortion effect, select an Image element and go to the Effects panel in the Properties sidebar. Enable 'Warp' and adjust intensity (e.g., 0.3). Set a hover trigger in the Interactions panel. Test in Preview mode. Say, 'Add a distortion effect to my image', and I’ll apply it.",
  },
  {
    keywords: ["user onboarding", "welcome tour", "site tour", "guided tour"],
    response:
      "To create a user onboarding tour, drag a Popup element from the Elements sidebar. In the Interactions panel, set 'On Load' triggers for multiple steps. Add Text and Buttons to guide users. Style in the Style panel. Say, 'Add an onboarding tour for new users', and I’ll design it.",
  },
  {
    keywords: ["css variables", "theme variables", "custom css vars", "style variables"],
    response:
      "To add CSS variables, go to Settings > Code and inject: `:root { --main-color: #007bff; }`. Use in elements via `.element { color: var(--main-color); }`. Apply in the Properties sidebar. Test in Preview mode. Say, 'Add CSS variables for my theme', and I’ll provide the code.",
  },
  {
    keywords: ["dynamic footer", "cms footer", "footer content", "auto footer"],
    response:
      "To create a dynamic footer, drag a Footer element from the Elements sidebar. Bind Text or Links to a CMS collection (Settings > CMS) for auto-updating content. Style in the Style panel. Test in Preview mode. Say, 'Add a dynamic footer with CMS links', and I’ll configure it.",
  },
  {
    keywords: ["cart button", "ecommerce cart", "add to cart", "shopping cart"],
    response:
      "To add a cart button, drag a Button element from the Elements sidebar. In the Properties sidebar, bind it to a CMS collection for products (Settings > CMS). Add a cart icon from the Assets panel. Style with hover effects. Say, 'Add a cart button to my product page', and I’ll set it up.",
  },
  {
    keywords: ["text outline", "stroke text", "outline effect", "text border"],
    response:
      "To add a text outline, select a Text element and go to Settings > Code. Inject CSS: `.text { -webkit-text-stroke: 2px #007bff; color: transparent; }`. Apply in the Properties sidebar. Test in Preview mode. Say, 'Add a blue outline to my text', and I’ll provide the code.",
  },
  {
    keywords: ["blog comments", "post comments", "cms comments", "user comments"],
    response:
      "To add comments to blog posts, drag a Form element from the Elements sidebar and bind it to a CMS collection (Settings > CMS). Enable 'Comments' in the Properties sidebar. Style input fields in the Style panel. Say, 'Add comments to my blog posts', and I’ll configure it.",
  },
  {
    keywords: ["hover zoom", "scale hover", "element zoom", "zoom effect"],
    response:
      "To add a hover zoom effect, select an element (e.g., Image) and go to the Interactions panel in the Properties sidebar. Enable 'Scale' on hover (e.g., 1.1x). Set duration (e.g., 0.3s). Test in Preview mode. Say, 'Add a hover zoom to my card', and I’ll apply it.",
  },
  {
    keywords: ["custom cursor trail", "cursor effect", "trail animation", "mouse trail"],
    response:
      "To add a cursor trail, go to Settings > Code and inject JavaScript for a canvas-based trail effect (e.g., using requestAnimationFrame). Style with CSS: `.trail { position: absolute; background: #007bff; }`. Test in Preview mode. Say, 'Add a cursor trail effect', and I’ll provide the code.",
  },
  {
    keywords: ["product slider", "ecommerce slider", "item carousel", "product showcase"],
    response:
      "To add a product slider, drag a Carousel element from the Elements sidebar. Bind it to a CMS collection for products (Settings > CMS). Style images and buttons in the Style panel. Test in Preview mode. Say, 'Add a product slider to my store', and I’ll design it.",
  },
  {
    keywords: ["sticky header animation", "animated header", "scroll header effect", "dynamic header"],
    response:
      "To animate a sticky header, drag a Header element from the Elements sidebar. In the Interactions panel, add a 'Shrink' effect on scroll. Set 'Position: Sticky' in the Layout panel. Style in the Style panel. Test in Preview mode. Say, 'Add an animated sticky header', and I’ll configure it.",
  },
  {
    keywords: ["content slider", "text slider", "dynamic text slide", "text carousel"],
    response:
      "To add a content slider, drag a Carousel element from the Elements sidebar. Add Text elements for sliding content in the Properties sidebar. Bind to a CMS collection for dynamic text. Style in the Style panel. Say, 'Add a text slider for quotes', and I’ll set it up.",
  },
  {
    keywords: ["page scroll indicator", "scroll progress", "page progress", "scroll bar"],
    response:
      "To add a scroll indicator, go to Settings > Code and inject CSS: `.progress { position: fixed; top: 0; height: 4px; background: #007bff; }`. Add JavaScript to update width on scroll. Test in Preview mode. Say, 'Add a scroll progress bar', and I’ll provide the code.",
  },
  {
    keywords: ["image flip", "card flip", "3d flip effect", "hover flip"],
    response:
      "To add an image flip effect, select an Image element and go to the Interactions panel in the Properties sidebar. Enable '3D Flip' on hover. Add a backface image in the Properties sidebar. Test in Preview mode. Say, 'Add a flip effect to my card', and I’ll apply it.",
  },
  {
    keywords: ["custom rss feed", "blog feed", "rss integration", "content feed"],
    response:
      "To add a custom RSS feed, go to Settings > CMS and enable 'RSS Feed' for your Blog collection. Customize the feed URL in Settings > SEO. Test the feed in Preview mode or with an RSS reader. Say, 'Add an RSS feed for my blog', and I’ll configure it.",
  },
  {
    keywords: ["gradient text animation", "animated gradient text", "color shift text", "dynamic text color"],
    response:
      "To add a gradient text animation, select a Text element and go to Settings > Code. Inject CSS: `.text { background: linear-gradient(90deg, #ff5733, #007bff); animation: gradient 3s infinite; }`. Apply in the Properties sidebar. Test in Preview mode. Say, 'Add animated gradient text', and I’ll provide the code.",
  },
  {
    keywords: ["user activity log", "edit history", "team activity", "change log"],
    response:
      "To view user activity, go to Settings > Team and check the 'Activity Log' tab. See edits, comments, and saves by team members. Filter by date or user. Export logs for records. Say, 'Show my team’s activity log', and I’ll guide you to the tab.",
  },
  {
    keywords: ["blog featured post", "pinned post", "highlight post", "top post"],
    response:
      "To feature a blog post, go to Settings > CMS and select your Blog collection. Mark a post as 'Featured' in the CMS editor. Bind a List element to display featured posts first. Style in the Style panel. Say, 'Feature my latest blog post', and I’ll configure it.",
  },
  {
    keywords: ["custom loader", "unique loader", "animated loader", "site spinner"],
    response:
      "To add a custom loader, drag a Div element from the Elements sidebar. In Settings > Code, inject CSS: `.loader { border: 6px solid #007bff; animation: spin 1.5s infinite; }`. Hide after load via JavaScript. Test in Preview mode. Say, 'Add a custom loader', and I’ll set it up.",
  },
  {
    keywords: ["image mask", "shape mask", "custom image shape", "mask effect"],
    response:
      "To add an image mask, select an Image element and go to Settings > Code. Inject CSS: `.image { mask-image: url('/assets/mask.svg'); }`. Upload the mask SVG to the Assets panel. Test in Preview mode. Say, 'Add a star-shaped mask to my image', and I’ll provide the code.",
  },
  {
    keywords: ["dynamic nav", "cms navigation", "auto menu", "nav from cms"],
    response:
      "To create a dynamic navigation, drag a Menu element from the Elements sidebar. Bind it to a CMS collection for pages (Settings > CMS). Auto-generate links in the Properties sidebar. Style in the Style panel. Say, 'Add a CMS-driven nav menu', and I’ll configure it.",
  },
  {
    keywords: ["scroll-triggered popup", "popup on scroll", "scroll popup", "dynamic popup"],
    response:
      "To add a scroll-triggered popup, drag a Popup element from the Elements sidebar. In the Interactions panel, set 'On Scroll' trigger at a specific offset (e.g., 50%). Add content like a Form. Style in the Style panel. Say, 'Add a popup at 50% scroll', and I’ll set it up.",
  },
  {
    keywords: ["product badges", "sale badge", "new badge", "item tag"],
    response:
      "To add product badges, drag a Text element from the Elements sidebar. Style it as a badge in the Style panel (e.g., red background, rounded corners). Bind to a CMS collection for dynamic labels (e.g., 'Sale'). Say, 'Add a sale badge to my product', and I’ll design it.",
  },
  {
    keywords: ["canvas snap", "element snap", "alignment snap", "snap guide"],
    response:
      "To enable element snapping, click the 'Snap' button in the bottom rectangle toolbar. Adjust snap sensitivity (e.g., 5px) in the Properties sidebar. Elements align to guides or grid during drag. Say, 'Enable snapping on my canvas', and I’ll turn it on.",
  },
  {
    keywords: ["blog excerpt", "post summary", "cms excerpt", "short description"],
    response:
      "To add blog excerpts, go to Settings > CMS and add an 'Excerpt' field to your Blog collection. Bind a Text element to the excerpt in a List’s Properties sidebar. Style in the Style panel. Say, 'Add excerpts to my blog posts', and I’ll configure it.",
  },
  {
    keywords: ["hover glow", "glow effect", "element glow", "shine hover"],
    response:
      "To add a hover glow effect, select an element (e.g., Button) and go to the Effects panel in the Properties sidebar. Enable 'Glow' on hover with a color (e.g., #007bff). Set blur (e.g., 10px). Test in Preview mode. Say, 'Add a glow to my button on hover', and I’ll apply it.",
  },
  {
    keywords: ["custom og tags", "social meta", "open graph", "share preview"],
    response:
      "To add custom Open Graph tags, go to Settings > SEO > Meta Tags. Add tags like `<meta property='og:title' content='Your Site'>`. Apply per page in the Properties sidebar. Test share previews in Preview mode. Say, 'Add OG tags for social sharing', and I’ll set them up.",
  },
  {
    keywords: ["faq schema", "structured faq", "seo faq", "faq markup"],
    response:
      "To add FAQ schema, drag an Accordion element from the Elements sidebar for FAQs. In Settings > SEO, inject JSON-LD: `{ '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [] }`. Bind to the accordion in the Properties sidebar. Say, 'Add FAQ schema', and I’ll configure it.",
  },
  {
    keywords: ["image carousel", "photo slider", "gallery slider", "image slideshow"],
    response:
      "To add an image carousel, drag a Carousel element from the Elements sidebar. Upload images from the Assets panel or bind to a CMS collection. Set autoplay in the Properties sidebar. Style in the Style panel. Say, 'Add an image carousel to my gallery', and I’ll design it.",
  },
  {
    keywords: ["text pulse", "pulse animation", "text effect", "dynamic pulse"],
    response:
      "To add a text pulse effect, select a Text element and go to the Interactions panel in the Properties sidebar. Enable 'Pulse' and set frequency (e.g., 1s). Style with bold colors in the Style panel. Test in Preview mode. Say, 'Add a pulse effect to my text', and I’ll apply it.",
  },
  {
    keywords: ["custom error message", "form error", "validation message", "input error"],
    response:
      "To customize form error messages, drag a Form element from the Elements sidebar. In the Properties sidebar, go to Validation and set custom messages (e.g., 'Invalid email'). Style errors in the Style panel. Test in Preview mode. Say, 'Customize my form error messages', and I’ll set them up.",
  },
  {
    keywords: ["product stock", "inventory display", "stock status", "cms stock"],
    response:
      "To display product stock, drag a Text element from the Elements sidebar. Bind it to a CMS collection with a 'Stock' field (Settings > CMS). Style with conditional colors in the Style panel (e.g., red for low stock). Say, 'Show stock status for my product', and I’ll configure it.",
  },
  {
    keywords: ["scrolling header", "hide on scroll", "dynamic header", "scroll nav"],
    response:
      "To create a scrolling header that hides, drag a Header element from the Elements sidebar. In the Interactions panel, enable 'Hide on Scroll Down' and 'Show on Scroll Up'. Style in the Style panel. Test in Preview mode. Say, 'Add a hide-on-scroll header', and I’ll set it up.",
  },
  {
    keywords: ["content bookmark", "save content", "bookmark button", "user save"],
    response:
      "To add a bookmark button, drag a Button element from the Elements sidebar. Bind it to a CMS collection for user data (Settings > CMS). Add a bookmark icon from the Assets panel. Style with hover effects. Say, 'Add a bookmark button for my posts', and I’ll configure it.",
  },
  {
    keywords: ["canvas ruler", "measurement tool", "ruler guide", "canvas measure"],
    response:
      "To enable a canvas ruler, click the 'Ruler' button in the bottom rectangle toolbar. Drag guides from the top/left edges to measure distances. Adjust units (e.g., px) in the Properties sidebar. Say, 'Show a ruler on my canvas', and I’ll enable it.",
  },
  {
    keywords: ["blog author", "post author", "cms author", "author display"],
    response:
      "To display blog authors, go to Settings > CMS and add an 'Author' field to your Blog collection. Bind a Text element to the author in a List’s Properties sidebar. Style in the Style panel. Say, 'Show authors on my blog posts', and I’ll configure it.",
  },
  {
    keywords: ["image reflection", "mirror effect", "reflection effect", "image mirror"],
    response:
      "To add an image reflection, select an Image element and go to Settings > Code. Inject CSS: `.image { -webkit-box-reflect: below 0px linear-gradient(transparent, rgba(0,0,0,0.3)); }`. Apply in the Properties sidebar. Test in Preview mode. Say, 'Add a reflection to my image', and I’ll provide the code.",
  },
  {
    keywords: ["custom analytics event", "track event", "user action track", "event analytics"],
    response:
      "To track custom analytics events, go to Settings > Code and inject JavaScript: `gtag('event', 'click', { 'event_category': 'Button' });`. Bind to an element’s action in the Properties sidebar. Test in Preview mode. Say, 'Track button clicks in analytics', and I’ll set it up.",
  },
  {
    keywords: ["product reviews", "user reviews", "cms reviews", "review system"],
    response:
      "To add product reviews, drag a Form element from the Elements sidebar and bind it to a CMS collection (Settings > CMS). Enable 'Reviews' in the Properties sidebar. Style input fields and ratings in the Style panel. Say, 'Add reviews to my product page', and I’ll configure it.",
  },
  {
    keywords: ["text wave", "wave animation", "text motion", "dynamic wave"],
    response:
      "To add a text wave effect, select a Text element and go to the Interactions panel in the Properties sidebar. Enable 'Wave' and set amplitude (e.g., 5px). Style with bold fonts in the Style panel. Test in Preview mode. Say, 'Add a wave effect to my text', and I’ll apply it.",
  },
]
