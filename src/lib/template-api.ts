import { createClient } from "../../supabase/server";

// Define template types
export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  files: TemplateFile[];
}

export interface TemplateFile {
  name: string;
  content: string;
  language: string;
}

// Only two professional templates to keep the file size manageable
const TEMPLATES: Template[] = [
  {
    id: "business-website",
    name: "Professional Business Website",
    description: "A clean, modern business website template with hero section, features, about, and contact sections.",
    thumbnail: "/templates/business-website.png",
    category: "business",
    files: [
      {
        name: "index.html",
        language: "html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Professional Business</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <div class="container">
      <div class="logo">
        <h1>Business<span>Pro</span></h1>
      </div>
      <nav>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <section id="home" class="hero">
    <div class="container">
      <div class="hero-content">
        <h1>Grow Your Business With Us</h1>
        <p>We provide innovative solutions to help your business thrive in today's competitive market.</p>
        <a href="#contact" class="btn">Get Started</a>
      </div>
    </div>
  </section>

  <section id="services" class="services">
    <div class="container">
      <h2 class="section-title">Our Services</h2>
      <div class="services-grid">
        <div class="service-card">
          <div class="service-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>
          </div>
          <h3>Strategic Planning</h3>
          <p>Develop comprehensive business strategies tailored to your specific goals and market position.</p>
        </div>
        <div class="service-card">
          <div class="service-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
          </div>
          <h3>Digital Marketing</h3>
          <p>Boost your online presence with our comprehensive digital marketing solutions.</p>
        </div>
        <div class="service-card">
          <div class="service-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <h3>Consulting Services</h3>
          <p>Expert advice and guidance to help you navigate complex business challenges.</p>
        </div>
      </div>
    </div>
  </section>

  <section id="about" class="about">
    <div class="container">
      <div class="about-content">
        <div class="about-text">
          <h2 class="section-title">About Us</h2>
          <p>Founded in 2010, BusinessPro has been helping companies of all sizes achieve their business goals through innovative solutions and strategic planning.</p>
          <p>Our team of experts brings decades of combined experience across various industries, ensuring that we can provide tailored solutions to meet your specific needs.</p>
          <a href="#contact" class="btn">Learn More</a>
        </div>
        <div class="about-image">
          <img src="/placeholder.svg?height=400&width=600" alt="Our team">
        </div>
      </div>
    </div>
  </section>

  <section id="contact" class="contact">
    <div class="container">
      <h2 class="section-title">Contact Us</h2>
      <div class="contact-content">
        <div class="contact-form">
          <form>
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" id="name" name="name" required>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
              <label for="message">Message</label>
              <textarea id="message" name="message" rows="5" required></textarea>
            </div>
            <button type="submit" class="btn">Send Message</button>
          </form>
        </div>
        <div class="contact-info">
          <div class="info-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <p>+1 (555) 123-4567</p>
          </div>
          <div class="info-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <p>info@businesspro.com</p>
          </div>
          <div class="info-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <p>123 Business Ave, Suite 100<br>San Francisco, CA 94107</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <footer>
    <div class="container">
      <p>&copy; 2023 BusinessPro. All rights reserved.</p>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>`
      },
      {
        name: "styles.css",
        language: "css",
        content: `/* Base Styles */
:root {
  --primary-color: #2563eb;
  --secondary-color: #1e40af;
  --dark-color: #1e293b;
  --light-color: #f8fafc;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --danger-color: #ef4444;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f8fafc;
}

a {
  text-decoration: none;
  color: var(--primary-color);
}

ul {
  list-style: none;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.btn {
  display: inline-block;
  background-color: var(--primary-color);
  color: #fff;
  padding: 12px 24px;
  border-radius: 5px;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: var(--secondary-color);
}

.section-title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  color: var(--dark-color);
  position: relative;
  padding-bottom: 1rem;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background-color: var(--primary-color);
}

/* Header */
header {
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
}

header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.logo h1 {
  font-size: 1.8rem;
  color: var(--dark-color);
}

.logo span {
  color: var(--primary-color);
}

nav ul {
  display: flex;
}

nav ul li {
  margin-left: 20px;
}

nav ul li a {
  color: var(--dark-color);
  font-weight: 600;
  transition: color 0.3s ease;
}

nav ul li a:hover {
  color: var(--primary-color);
}

/* Hero Section */
.hero {
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/placeholder.svg?height=800&width=1200');
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  align-items: center;
  text-align: center;
  color: #fff;
  margin-top: 80px;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-content h1 {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
}

.hero-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

/* Services Section */
.services {
  padding: 100px 0;
  background-color: #fff;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.service-card {
  background-color: #f8fafc;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
}

.service-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.service-icon {
  width: 70px;
  height: 70px;
  background-color: var(--primary-color);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.service-card h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: var(--dark-color);
}

/* About Section */
.about {
  padding: 100px 0;
  background-color: #f8fafc;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  align-items: center;
}

.about-text p {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.about-image img {
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* Contact Section */
.contact {
  padding: 100px 0;
  background-color: #fff;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-family: inherit;
  font-size: 1rem;
}

.contact-info {
  background-color: var(--primary-color);
  color: #fff;
  padding: 30px;
  border-radius: 10px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.info-item svg {
  margin-right: 15px;
}

/* Footer */
footer {
  background-color: var(--dark-color);
  color: #fff;
  padding: 30px 0;
  text-align: center;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2.5rem;
  }
  
  .about-content,
  .contact-content {
    grid-template-columns: 1fr;
  }
  
  .about-image {
    order: -1;
  }
  
  nav ul {
    flex-direction: column;
    position: absolute;
    top: 80px;
    left: 0;
    background-color: #fff;
    width: 100%;
    padding: 20px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    display: none;
  }
  
  nav ul.show {
    display: block;
  }
  
  nav ul li {
    margin: 15px 0;
  }
}`
      },
      {
        name: "script.js",
        language: "javascript",
        content: `// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
  // Add mobile navigation toggle functionality
  const header = document.querySelector('header');
  const nav = document.querySelector('nav ul');
  
  // Create mobile menu button
  const mobileMenuBtn = document.createElement('button');
  mobileMenuBtn.className = 'mobile-menu-btn';
  mobileMenuBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
  
  // Insert button before nav
  header.querySelector('.container').insertBefore(mobileMenuBtn, nav);
  
  // Toggle navigation on button click
  mobileMenuBtn.addEventListener('click', function() {
    nav.classList.toggle('show');
  });
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Close mobile menu if open
      nav.classList.remove('show');
      
      // Scroll to target
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
  
  // Form submission
  const contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;
      
      // Simple validation
      if (!name || !email || !message) {
        alert('Please fill in all fields');
        return;
      }
      
      // In a real application, you would send this data to a server
      // For this template, we'll just show a success message
      contactForm.innerHTML = '<div class="success-message"><h3>Thank you for your message!</h3><p>We will get back to you soon.</p></div>';
    });
  }
  
  // Header scroll effect
  window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
      header.style.background = '#fff';
      header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
      header.style.background = '#fff';
      header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
  });
});`
      }
    ]
  },
  {
    id: "portfolio-website",
    name: "Creative Portfolio",
    description: "A modern portfolio website for creatives, featuring a gallery, about section, and contact form.",
    thumbnail: "/templates/portfolio-website.png",
    category: "portfolio",
    files: [
      {
        name: "index.html",
        language: "html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Creative Portfolio</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <div class="container">
      <div class="logo">
        <h1>Portfolio<span>.</span></h1>
      </div>
      <nav>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#work">Work</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
      <button class="menu-toggle">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </header>

  <section id="home" class="hero">
    <div class="container">
      <div class="hero-content">
        <h1>Hello, I'm <span>Alex Johnson</span></h1>
        <h2>Creative Designer & Developer</h2>
        <p>I create beautiful digital experiences that help businesses grow.</p>
        <div class="hero-buttons">
          <a href="#work" class="btn primary">View My Work</a>
          <a href="#contact" class="btn secondary">Contact Me</a>
        </div>
      </div>
    </div>
  </section>

  <section id="work" class="work">
    <div class="container">
      <h2 class="section-title">My Work</h2>
      <div class="work-filters">
        <button class="filter-btn active" data-filter="all">All</button>
        <button class="filter-btn" data-filter="web">Web Design</button>
        <button class="filter-btn" data-filter="graphic">Graphic Design</button>
        <button class="filter-btn" data-filter="branding">Branding</button>
      </div>
      <div class="work-grid">
        <div class="work-item web">
          <img src="/placeholder.svg?height=600&width=800" alt="E-commerce Website">
          <div class="work-overlay">
            <div class="work-info">
              <h3>E-commerce Website</h3>
              <p>Web Design, Development</p>
              <a href="#" class="btn small">View Project</a>
            </div>
          </div>
        </div>
        <div class="work-item graphic">
          <img src="/placeholder.svg?height=600&width=800" alt="Brand Identity">
          <div class="work-overlay">
            <div class="work-info">
              <h3>Brand Identity</h3>
              <p>Graphic Design, Branding</p>
              <a href="#" class="btn small">View Project</a>
            </div>
          </div>
        </div>
        <div class="work-item branding">
          <img src="/placeholder.svg?height=600&width=800" alt="Logo Design">
          <div class="work-overlay">
            <div class="work-info">
              <h3>Logo Design</h3>
              <p>Branding, Graphic Design</p>
              <a href="#" class="btn small">View Project</a>
            </div>
          </div>
        </div>
        <div class="work-item web">
          <img src="/placeholder.svg?height=600&width=800" alt="Portfolio Website">
          <div class="work-overlay">
            <div class="work-info">
              <h3>Portfolio Website</h3>
              <p>Web Design, Development</p>
              <a href="#" class="btn small">View Project</a>
            </div>
          </div>
        </div>
        <div class="work-item graphic">
          <img src="/placeholder.svg?height=600&width=800" alt="Poster Design">
          <div class="work-overlay">
            <div class="work-info">
              <h3>Poster Design</h3>
              <p>Graphic Design</p>
              <a href="#" class="btn small">View Project</a>
            </div>
          </div>
        </div>
        <div class="work-item branding">
          <img src="/placeholder.svg?height=600&width=800" alt="Brand Guidelines">
          <div class="work-overlay">
            <div class="work-info">
              <h3>Brand Guidelines</h3>
              <p>Branding, Graphic Design</p>
              <a href="#" class="btn small">View Project</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="about" class="about">
    <div class="container">
      <div class="about-content">
        <div class="about-image">
          <img src="/placeholder.svg?height=600&width=600" alt="Alex Johnson">
        </div>
        <div class="about-text">
          <h2 class="section-title">About Me</h2>
          <p>Hello! I'm Alex, a passionate designer and developer with over 5 years of experience creating digital solutions for clients worldwide.</p>
          <p>I specialize in creating user-centered designs that not only look beautiful but also solve real business problems. My approach combines creativity with strategic thinking to deliver results that exceed expectations.</p>
          <div class="skills">
            <h3>My Skills</h3>
            <div class="skill-bars">
              <div class="skill">
                <span class="skill-name">UI/UX Design</span>
                <div class="skill-bar">
                  <div class="skill-level" style="width: 95%"></div>
                </div>
              </div>
              <div class="skill">
                <span class="skill-name">Web Development</span>
                <div class="skill-bar">
                  <div class="skill-level" style="width: 90%"></div>
                </div>
              </div>
              <div class="skill">
                <span class="skill-name">Graphic Design</span>
                <div class="skill-bar">
                  <div class="skill-level" style="width: 85%"></div>
                </div>
              </div>
              <div class="skill">
                <span class="skill-name">Branding</span>
                <div class="skill-bar">
                  <div class="skill-level" style="width: 80%"></div>
                </div>
              </div>
            </div>
          </div>
          <a href="#" class="btn primary">Download CV</a>
        </div>
      </div>
    </div>
  </section>

  <section id="contact" class="contact">
    <div class="container">
      <h2 class="section-title">Get In Touch</h2>
      <div class="contact-content">
        <div class="contact-info">
          <div class="info-item">
            <div class="info-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </div>
            <div class="info-text">
              <h3>Phone</h3>
              <p>+1 (555) 123-4567</p>
            </div>
          </div>
          <div class="info-item">
            <div class="info-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
            <div class="info-text">
              <h3>Email</h3>
              <p>alex@portfolio.com</p>
            </div>
          </div>
          <div class="info-item">
            <div class="info-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <div class="info-text">
              <h3>Location</h3>
              <p>123 Design Street, San Francisco, CA 94107</p>
            </div>
          </div>
          <div class="social-links">
            <h3>Follow Me</h3>
            <div class="social-icons">
              <a href="#" class="social-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" class="social-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" class="social-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="#" class="social-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
            </div>
          </div>
        </div>
        <div class="contact-form">
          <form>
            <div class="form-group">
              <input type="text" id="name" name="name" placeholder="Your Name" required>
            </div>
            <div class="form-group">
              <input type="email" id="email" name="email" placeholder="Your Email" required>
            </div>
            <div class="form-group">
              <input type="text" id="subject" name="subject" placeholder="Subject" required>
            </div>
            <div class="form-group">
              <textarea id="message" name="message" placeholder="Your Message" rows="5" required></textarea>
            </div>
            <button type="submit" class="btn primary">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  </section>

  <footer>
    <div class="container">
      <p>&copy; 2023 Alex Johnson. All rights reserved.</p>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>`
      },
      {
        name: "styles.css",
        language: "css",
        content: `/* Base Styles */
:root {
  --primary-color: #6c63ff;
  --secondary-color: #4a45b1;
  --dark-color: #2d2b55;
  --light-color: #f8f9fa;
  --text-color: #333;
  --text-light: #6c757d;
  --success-color: #28a745;
  --border-color: #e9ecef;
  --transition: all 0.3s ease;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Poppins', sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--light-color);
}

a {
  text-decoration: none;
  color: var(--primary-color);
}

ul {
  list-style: none;
}

img {
  max-width: 100%;
  height: auto;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.btn {
  display: inline-block;
  padding: 12px 30px;
  border-radius: 30px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: var(--transition);
  border: none;
  outline: none;
}

.btn.primary {
  background-color: var(--primary-color);
  color: white;
}

.btn.primary:hover {
  background-color: var(--secondary-color);
}

.btn.secondary {
  background-color: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
}

.btn.secondary:hover {
  background-color: var(--primary-color);
  color: white;
}

.btn.small {
  padding: 8px 20px;
  font-size: 0.9rem;
}

.section-title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 50px;
  height: 3px;
  background-color: var(--primary-color);
}

/* Header */
header {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.logo h1 {
  font-size: 1.8rem;
  color: var(--dark-color);
  font-weight: 700;
}

.logo span {
  color: var(--primary-color);
}

nav ul {
  display: flex;
}

nav ul li {
  margin-left: 30px;
}

nav ul li a {
  color: var(--text-color);
  font-weight: 500;
  transition: var(--transition);
  position: relative;
}

nav ul li a::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--primary-color);
  transition: var(--transition);
}

nav ul li a:hover {
  color: var(--primary-color);
}

nav ul li a:hover::after {
  width: 100%;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
}

.menu-toggle span {
  display: block;
  width: 25px;
  height: 3px;
  background-color: var(--text-color);
  margin: 5px 0;
  transition: var(--transition);
}

/* Hero Section */
.hero {
  height: 100vh;
  display: flex;
  align-items: center;
  background-color: white;
  margin-top: 80px;
}

.hero-content {
  max-width: 800px;
}

.hero-content h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-content h1 span {
  color: var(--primary-color);
}

.hero-content h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--text-light);
  font-weight: 500;
}

.hero-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: var(--text-light);
}

.hero-buttons {
  display: flex;
  gap: 20px;
}

/* Work Section */
.work {
  padding: 100px 0;
  background-color: var(--light-color);
}

.work-filters {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.filter-btn {
  background: none;
  border: none;
  padding: 8px 20px;
  margin: 0 5px 10px;
  cursor: pointer;
  font-weight: 500;
  transition: var(--transition);
  border-radius: 20px;
}

.filter-btn:hover, .filter-btn.active {
  background-color: var(--primary-color);
  color: white;
}

.work-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
}

.work-item {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.work-item img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  transition: var(--transition);
}

.work-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(108, 99, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: var(--transition);
}

.work-info {
  text-align: center;
  color: white;
  padding: 20px;
  transform: translateY(20px);
  transition: var(--transition);
}

.work-info h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.work-info p {
  margin-bottom: 20px;
}

.work-item:hover .work-overlay {
  opacity: 1;
}

.work-item:hover .work-info {
  transform: translateY(0);
}

.work-item:hover img {
  transform: scale(1.1);
}

/* About Section */
.about {
  padding: 100px 0;
  background-color: white;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  align-items: center;
}

.about-image img {
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.about-text p {
  margin-bottom: 1.5rem;
  color: var(--text-light);
}

.skills {
  margin: 30px 0;
}

.skills h3 {
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.skill {
  margin-bottom: 20px;
}

.skill-name {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.skill-bar {
  height: 10px;
  background-color: var(--border-color);
  border-radius: 5px;
  overflow: hidden;
}

.skill-level {
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 5px;
}

/* Contact Section */
.contact {
  padding: 100px 0;
  background-color: var(--light-color);
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
}

.info-item {
  display: flex;
  margin-bottom: 30px;
}

.info-icon {
  width: 50px;
  height: 50px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
}

.info-text h3 {
  margin-bottom: 5px;
  font-size: 1.2rem;
}

.social-links h3 {
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.social-icons {
  display: flex;
  gap: 15px;
}

.social-icon {
  width: 40px;
  height: 40px;
  background-color: white;
  color: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.social-icon:hover {
  background-color: var(--primary-color);
  color: white;
}

.form-group {
  margin-bottom: 20px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 15px;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  font-family: inherit;
  font-size: 1rem;
  transition: var(--transition);
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: var(--primary-color);
  outline: none;
}

/* Footer */
footer {
  background-color: var(--dark-color);
  color: white;
  padding: 30px 0;
  text-align: center;
}

/* Responsive Design */
@media (max-width: 992px) {
  .about-content,
  .contact-content {
    grid-template-columns: 1fr;
  }
  
  .about-image {
    order: -1;
    text-align: center;
  }
  
  .about-image img {
    max-width: 500px;
  }
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2.5rem;
  }
  
  .hero-content h2 {
    font-size: 1.5rem;
  }
  
  .work-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
  
  nav ul {
    display: none;
    position: absolute;
    top: 80px;
    left: 0;
    width: 100%;
    background-color: white;
    flex-direction: column;
    padding: 20px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  }
  
  nav ul.show {
    display: flex;
  }
  
  nav ul li {
    margin: 15px 0;
  }
  
  .menu-toggle {
    display: block;
  }
  
  .menu-toggle.active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }
  
  .menu-toggle.active span:nth-child(2) {
    opacity: 0;
  }
  
  .menu-toggle.active span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
  }
}

@media (max-width: 576px) {
  .hero-buttons {
    flex-direction: column;
    gap: 10px;
  }
  
  .btn {
    width: 100%;
  }
  
  .section-title {
    font-size: 2rem;
  }
}`
      },
      {
        name: "script.js",
        language: "javascript",
        content: `document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav ul');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      nav.classList.toggle('show');
    });
  }
  
  // Close mobile menu when clicking on a nav link
  const navLinks = document.querySelectorAll('nav ul li a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      menuToggle.classList.remove('active');
      nav.classList.remove('show');
    });
  });
  
  // Portfolio Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workItems = document.querySelectorAll('.work-item');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove active class from all buttons
      filterBtns.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      const filter = this.getAttribute('data-filter');
      
      // Filter work items
      workItems.forEach(item => {
        if (filter === 'all' || item.classList.contains(filter)) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        
        window.scrollTo({
          top: targetPosition - headerHeight,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Form submission
  const contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;
      
      // Simple validation
      if (!name || !email || !subject || !message) {
        alert('Please fill in all fields');
        return;
      }
      
      // In a real application, you would send this data to a server
      // For this template, we'll just show a success message
      contactForm.innerHTML = '<div class="success-message"><h3>Thank you for your message!</h3><p>I will get back to you soon.</p></div>';
    });
  }
  
  // Scroll reveal animation
  const revealElements = document.querySelectorAll('.section-title, .work-item, .about-image, .about-text, .skill, .info-item, .contact-form');
  
  function checkReveal() {
    const windowHeight = window.innerHeight;
    const revealPoint = 150;
    
    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      
      if (elementTop < windowHeight - revealPoint) {
        element.classList.add('revealed');
      }
    });
  }
  
  // Add CSS for reveal animations
  const style = document.createElement('style');
  document.head.appendChild(style);
  
  // Check for elements to reveal on load and scroll
  window.addEventListener('load', checkReveal);
  window.addEventListener('scroll', checkReveal);
});`
      }
    ]
  }
];

// Function to get all templates
export async function getTemplates() {
  try {
    const supabase = createClient();
    
    // Check if templates exist in the database
    const { data: existingTemplates, error } = await supabase
      .from('website_templates')
      .select('*');
    
    if (error) throw error;
    
    // If no templates exist, seed the database with our templates
    if (!existingTemplates || existingTemplates.length === 0) {
      const { error: insertError } = await supabase
        .from('website_templates')
        .insert(TEMPLATES.map(template => ({
          id: template.id,
          name: template.name,
          description: template.description,
          thumbnail: template.thumbnail,
          category: template.category,
          content: { files: template.files }
        })));
      
      if (insertError) throw insertError;
      
      // Fetch the newly inserted templates
      const { data: newTemplates, error: fetchError } = await supabase
        .from('website_templates')
        .select('*');
      
      if (fetchError) throw fetchError;
      
      return newTemplates;
    }
    
    return existingTemplates;
  } catch (error) {
    console.error('Error getting templates:', error);
    return [];
  }
}

// Function to get a template by ID
export async function getTemplateById(id: string) {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('website_templates')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error(`Error getting template with ID ${id}:`, error);
    return null;
  }
}
