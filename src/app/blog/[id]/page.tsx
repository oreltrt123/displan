"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import { Calendar, User, Heart, MessageSquare, Share2, ArrowLeft } from 'lucide-react'
import { createClient } from "../../../../supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

// Blog posts data (same as in blog/page.tsx)
const blogPosts = [
  {
    id: 1,
    title: "How DisPlan Prevents Collaboration Scams",
    excerpt: "Learn how our secure payment system and escrow features protect both parties in a collaboration.",
    date: "2023-10-15",
    author: "John Doe",
    category: "Security",
    image: "https://images.unsplash.com/photo-1560472355-536de3962603?w=800&q=80",
    likes: 1458,
    content: `
      <p>In the digital collaboration space, security is paramount. At DisPlan, we've built a system designed from the ground up to prevent scams and protect both parties in any collaboration.</p>
      
      <h2>The Problem with Traditional Collaboration</h2>
      
      <p>When creators and developers work together online, there's often a significant trust gap. Who pays first? How do you ensure work is completed to specification? What happens if one party doesn't fulfill their obligations?</p>
      
      <p>These questions have traditionally made online collaboration risky, especially for first-time partnerships where no trust has been established.</p>
      
      <h2>Our Escrow-Based Solution</h2>
      
      <p>DisPlan addresses these concerns through our secure escrow payment system. Here's how it works:</p>
      
      <ol>
        <li><strong>Milestone Definition</strong>: Projects are broken down into clear, manageable milestones with defined deliverables.</li>
        <li><strong>Secured Funding</strong>: Clients deposit payment for each milestone into our secure escrow system.</li>
        <li><strong>Work Verification</strong>: Developers complete the work for the current milestone.</li>
        <li><strong>Review Process</strong>: Clients review and approve the completed work.</li>
        <li><strong>Automatic Release</strong>: Once approved, funds are automatically released to the developer.</li>
      </ol>
      
      <p>This system ensures that developers know the money is available before they start work, while clients maintain control over releasing payments only when satisfied with the deliverables.</p>
      
      <h2>Dispute Resolution</h2>
      
      <p>In the rare case where disagreements arise, our platform offers a structured dispute resolution process. Neutral moderators review the project requirements, completed work, and communication history to make fair determinations.</p>
      
      <h2>Additional Security Features</h2>
      
      <ul>
        <li><strong>Identity Verification</strong>: Optional but recommended verification steps to confirm user identities.</li>
        <li><strong>Communication Logging</strong>: All project-related communications are stored securely for reference.</li>
        <li><strong>Rating System</strong>: Transparent feedback from past collaborations helps establish trust.</li>
        <li><strong>Contract Templates</strong>: Clear, legally-sound templates for defining project parameters.</li>
      </ul>
      
      <p>By combining these security measures, DisPlan creates a safe environment for collaboration without the overhead of traditional contract enforcement or the risks of direct payments.</p>
      
      <h2>Real-World Impact</h2>
      
      <p>Since implementing these features, we've seen a 98% successful completion rate for projects on our platform, with dispute rates below 2% - significantly better than industry averages.</p>
      
      <p>Our commitment to security doesn't end here. We're constantly evolving our protection mechanisms to stay ahead of potential threats and ensure DisPlan remains the safest place for digital collaboration.</p>
    `,
    comments: [
      {
        id: 101,
        author: "Sarah Williams",
        date: "2023-10-16",
        content:
          "This is exactly why I use DisPlan for all my freelance projects now. The escrow system gives me peace of mind that I'll actually get paid for my work.",
      },
      {
        id: 102,
        author: "Michael Rodriguez",
        date: "2023-10-17",
        content:
          "As someone who's been scammed before on other platforms, I really appreciate the thought that went into this system. The milestone approach makes so much sense.",
      },
    ],
  },
  {
    id: 2,
    title: "Best Practices for Managing Remote Development Teams",
    excerpt:
      "Discover effective strategies for coordinating developers across different time zones and ensuring project success.",
    date: "2023-10-10",
    author: "Jane Smith",
    category: "Project Management",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    likes: 1884,
    content: `
      <p>Managing remote development teams presents unique challenges, but with the right approach, it can lead to incredible productivity and innovation. Here are our best practices for effective remote team management.</p>
      
      <h2>Establish Clear Communication Channels</h2>
      
      <p>Communication is the foundation of successful remote work. We recommend:</p>
      
      <ul>
        <li><strong>Daily Check-ins</strong>: Brief synchronous meetings to align priorities and address blockers</li>
        <li><strong>Dedicated Channels</strong>: Separate spaces for different projects, casual conversation, and announcements</li>
        <li><strong>Documentation</strong>: Thorough documentation of decisions and discussions to keep everyone informed</li>
      </ul>
      
      <h2>Navigate Time Zone Differences</h2>
      
      <p>With team members across the globe, time zone management becomes critical:</p>
      
      <ul>
        <li><strong>Overlap Hours</strong>: Identify and protect core hours when most team members are available</li>
        <li><strong>Asynchronous Workflows</strong>: Design processes that don't require immediate responses</li>
        <li><strong>Rotating Meeting Times</strong>: Share the burden of odd-hour meetings across the team</li>
      </ul>
      
      <h2>Track Progress Effectively</h2>
      
      <p>Without physical proximity, progress tracking requires intentional systems:</p>
      
      <ul>
        <li><strong>Clear Milestones</strong>: Break projects into well-defined milestones with specific deliverables</li>
        <li><strong>Visual Management</strong>: Use kanban boards or similar tools to make progress visible</li>
        <li><strong>Regular Demos</strong>: Schedule frequent demonstrations of working features</li>
      </ul>
      
      <h2>Build Team Cohesion</h2>
      
      <p>Remote teams need deliberate culture-building:</p>
      
      <ul>
        <li><strong>Virtual Social Events</strong>: Create opportunities for non-work interaction</li>
        <li><strong>Recognition Programs</strong>: Celebrate achievements and contributions publicly</li>
        <li><strong>Occasional In-Person Gatherings</strong>: When possible, bring the team together physically</li>
      </ul>
      
      <h2>Tools That Make a Difference</h2>
      
      <p>The right toolset can dramatically improve remote collaboration:</p>
      
      <ul>
        <li><strong>Project Management</strong>: Tools like DisPlan's task boards for organizing work</li>
        <li><strong>Version Control</strong>: Robust systems for managing code changes</li>
        <li><strong>Documentation</strong>: Centralized, searchable knowledge bases</li>
        <li><strong>Real-time Collaboration</strong>: Tools for pair programming and collaborative editing</li>
      </ul>
      
      <p>By implementing these practices, remote development teams can achieve and often exceed the productivity of co-located teams, while providing team members with the flexibility and autonomy they value.</p>
    `,
    comments: [
      {
        id: 201,
        author: "David Chen",
        date: "2023-10-11",
        content:
          "The tip about rotating meeting times is so important. We implemented this in our team and it really helped with morale - nobody feels like they're always the one staying up late.",
      },
    ],
  },
  {
    id: 3,
    title: "Content Creator's Guide to Finding Technical Partners",
    excerpt:
      "A comprehensive guide for content creators looking to partner with developers for their next big project.",
    date: "2023-10-05",
    author: "Alex Johnson",
    category: "Collaboration",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    likes: 3244,
    content: `
      <p>As a content creator, finding the right technical partner can be the difference between a successful digital product and a frustrating experience. This guide will help you navigate the process of finding, vetting, and collaborating with developers.</p>
      
      <h2>Defining Your Technical Needs</h2>
      
      <p>Before you start looking for a developer, get clear on what you actually need:</p>
      
      <ul>
        <li><strong>Project Scope</strong>: What exactly are you trying to build?</li>
        <li><strong>Technical Requirements</strong>: What platforms, features, and integrations are necessary?</li>
        <li><strong>Timeline</strong>: When do you need the project completed?</li>
        <li><strong>Budget</strong>: What can you realistically afford to invest?</li>
      </ul>
      
      <p>The more specific you can be, the easier it will be to find the right match.</p>
      
      <h2>Where to Find Technical Partners</h2>
      
      <p>Several platforms specialize in connecting creators with technical talent:</p>
      
      <ul>
        <li><strong>DisPlan</strong>: Our platform specifically focuses on creator-developer partnerships</li>
        <li><strong>Specialized Freelance Sites</strong>: Platforms focused on development talent</li>
        <li><strong>Developer Communities</strong>: Forums and communities where developers gather</li>
        <li><strong>Your Existing Audience</strong>: Often overlooked, but your followers may include skilled developers</li>
      </ul>
      
      <h2>Evaluating Potential Partners</h2>
      
      <p>Not all developers are created equal. Here's how to assess candidates:</p>
      
      <ul>
        <li><strong>Portfolio Review</strong>: Examine their previous work for quality and relevance</li>
        <li><strong>Technical Interview</strong>: Prepare questions specific to your project needs</li>
        <li><strong>References</strong>: Speak with previous clients about their experiences</li>
        <li><strong>Trial Project</strong>: Consider starting with a small paid test project</li>
      </ul>
      
      <h2>Setting Up for Success</h2>
      
      <p>Once you've found your technical partner, set the foundation for a productive relationship:</p>
      
      <ul>
        <li><strong>Clear Contracts</strong>: Define deliverables, timelines, payment terms, and ownership</li>
        <li><strong>Communication Plan</strong>: Establish regular check-ins and preferred communication channels</li>
        <li><strong>Milestone Structure</strong>: Break the project into manageable chunks with clear approval processes</li>
        <li><strong>Feedback Process</strong>: Create a constructive system for sharing and implementing feedback</li>
      </ul>
      
      <h2>Managing the Relationship</h2>
      
      <p>Ongoing management is key to a successful partnership:</p>
      
      <ul>
        <li><strong>Respect Expertise</strong>: Trust your developer's technical judgment</li>
        <li><strong>Provide Clear Feedback</strong>: Be specific about what's working and what isn't</li>
        <li><strong>Address Issues Early</strong>: Don't let small problems grow into project-threatening conflicts</li>
        <li><strong>Celebrate Wins</strong>: Acknowledge achievements and progress</li>
      </ul>
      
      <p>By following these guidelines, content creators can find technical partners who not only have the skills to bring their vision to life but also share their passion for creating valuable digital products.</p>
    `,
    comments: [
      {
        id: 301,
        author: "Emma Thompson",
        date: "2023-10-06",
        content:
          "This came at the perfect time! I'm a YouTuber looking to create a custom membership site and wasn't sure where to start with finding a developer.",
      },
      {
        id: 302,
        author: "Jason Park",
        date: "2023-10-07",
        content:
          "The trial project suggestion is gold. I've saved myself from several bad partnerships by starting small before committing to a full project.",
      },
      {
        id: 303,
        author: "Sophia Rodriguez",
        date: "2023-10-08",
        content:
          "Would love to see a follow-up article about how to effectively communicate your vision to developers when you're not technically savvy yourself.",
      },
    ],
  },
  {
    id: 4,
    title: "Understanding Payment Protection in Project Collaboration",
    excerpt: "A deep dive into how milestone-based payments and escrow services protect both clients and freelancers.",
    date: "2023-09-28",
    author: "Michael Chen",
    category: "Payments",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    likes: 12034,
    content: `
      <p>Payment protection is a critical component of successful online collaboration. This article explores how modern payment systems like those used by DisPlan help create trust between parties who may never meet in person.</p>
      
      <h2>The Trust Problem in Online Collaboration</h2>
      
      <p>Online collaboration introduces a fundamental trust challenge:</p>
      
      <ul>
        <li><strong>Clients</strong> worry about paying for work they haven't received yet</li>
        <li><strong>Freelancers</strong> worry about completing work they haven't been paid for</li>
      </ul>
      
      <p>Without a solution to this dilemma, collaboration becomes risky for both parties.</p>
      
      <h2>How Milestone-Based Payments Work</h2>
      
      <p>Milestone-based payment systems address the trust problem by breaking projects into manageable chunks:</p>
      
      <ol>
        <li><strong>Project Division</strong>: The overall project is divided into clear milestones</li>
        <li><strong>Individual Funding</strong>: Each milestone is funded separately</li>
        <li><strong>Completion & Verification</strong>: Work is completed and verified for each milestone</li>
        <li><strong>Payment Release</strong>: Payment is released upon milestone approval</li>
      </ol>
      
      <p>This approach limits risk for both parties by reducing the amount of work or money at stake at any given time.</p>
      
      <h2>The Role of Escrow</h2>
      
      <p>Escrow services add another layer of protection:</p>
      
      <ul>
        <li><strong>Third-Party Holding</strong>: Funds are held by a trusted third party (the platform)</li>
        <li><strong>Verification Before Release</strong>: Money is only released when work is verified</li>
        <li><strong>Dispute Resolution</strong>: The escrow provider can help resolve disagreements</li>
      </ul>
      
      <p>This arrangement gives freelancers confidence that funds are available while giving clients assurance that they maintain control over when payments are released.</p>
      
      <h2>Setting Up Effective Milestones</h2>
      
      <p>The key to successful milestone-based payments is proper milestone definition:</p>
      
      <ul>
        <li><strong>Clear Deliverables</strong>: Each milestone should have specific, verifiable outputs</li>
        <li><strong>Reasonable Scope</strong>: Milestones should be substantial enough to be meaningful but small enough to limit risk</li>
        <li><strong>Logical Sequence</strong>: Milestones should follow a natural progression of the project</li>
        <li><strong>Fair Valuation</strong>: Payment amounts should reflect the work involved in each milestone</li>
      </ul>
      
      <h2>Handling Disputes</h2>
      
      <p>Even with the best systems, disagreements can arise:</p>
      
      <ul>
        <li><strong>Clear Criteria</strong>: Establish acceptance criteria before work begins</li>
        <li><strong>Revision Policies</strong>: Define how many revisions are included</li>
        <li><strong>Mediation Process</strong>: Understand the platform's process for resolving disputes</li>
        <li><strong>Documentation</strong>: Maintain clear records of all agreements and communications</li>
      </ul>
      
      <p>By implementing these payment protection strategies, both clients and freelancers can collaborate with greater confidence, focusing on creating great work rather than worrying about payment security.</p>
    `,
    comments: [],
  },
  {
    id: 5,
    title: "The Future of Open Source Collaboration",
    excerpt: "How community-driven development is changing the landscape of software creation and distribution.",
    date: "2023-09-20",
    author: "Sarah Williams",
    category: "Development",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    likes: 30003,
    content: `
      <p>Open source software has transformed from a niche movement to a dominant force in the technology landscape. This article explores current trends and future directions for open source collaboration.</p>
      
      <h2>The Evolution of Open Source</h2>
      
      <p>Open source has gone through several distinct phases:</p>
      
      <ul>
        <li><strong>Early Days</strong>: Focused on operating systems and developer tools</li>
        <li><strong>Web Era</strong>: Expanded to web servers, databases, and frameworks</li>
        <li><strong>Corporate Adoption</strong>: Embraced by major tech companies</li>
        <li><strong>Current Phase</strong>: Becoming the default approach for many types of software</li>
      </ul>
      
      <p>This evolution has dramatically changed how software is built, distributed, and monetized.</p>
      
      <h2>New Models of Collaboration</h2>
      
      <p>Modern open source collaboration extends beyond traditional models:</p>
      
      <ul>
        <li><strong>Distributed Maintainership</strong>: Moving beyond single-maintainer projects</li>
        <li><strong>Corporate Sponsorship</strong>: Companies funding open source development</li>
        <li><strong>Foundation Governance</strong>: Neutral organizations managing major projects</li>
        <li><strong>Community-Led Development</strong>: Democratic processes for decision-making</li>
      </ul>
      
      <p>These approaches help create more sustainable and resilient projects.</p>
      
      <h2>Funding and Sustainability</h2>
      
      <p>Ensuring open source sustainability remains a critical challenge. New approaches include:</p>
      
      <ul>
        <li><strong>Open Core</strong>: Free open source with paid proprietary extensions</li>
        <li><strong>SaaS Models</strong>: Hosted versions of open source software</li>
        <li><strong>Direct Sponsorship</strong>: Platforms like GitHub Sponsors and Open Collective</li>
        <li><strong>Bounty Systems</strong>: Payments for specific features or bug fixes</li>
      </ul>
      
      <p>These funding mechanisms help maintain project health and developer livelihoods.</p>
      
      <h2>The Role of Platforms</h2>
      
      <p>Collaboration platforms are evolving to better support open source:</p>
      
      <ul>
        <li><strong>Integrated Tools</strong>: Combining code, issues, CI/CD, and documentation</li>
        <li><strong>Contribution Pathways</strong>: Making it easier for newcomers to contribute</li>
        <li><strong>Community Management</strong>: Tools for governance and decision-making</li>
        <li><strong>Metrics and Analytics</strong>: Better visibility into project health</li>
      </ul>
      
      <p>DisPlan aims to be at the forefront of these platform innovations, creating spaces where open collaboration can thrive.</p>
      
      <h2>Future Trends</h2>
      
      <p>Looking ahead, we see several emerging trends:</p>
      
      <ul>
        <li><strong>AI-Assisted Development</strong>: Using AI to accelerate open source contributions</li>
        <li><strong>Cross-Project Collaboration</strong>: Better integration between related projects</li>
        <li><strong>Global Participation</strong>: More diverse contributor bases from around the world</li>
        <li><strong>Open Source Beyond Software</strong>: Applying open principles to hardware, data, and more</li>
      </ul>
      
      <p>These trends point to an exciting future where open collaboration continues to reshape how we build technology together.</p>
    `,
    comments: [
      {
        id: 501,
        author: "Thomas Lee",
        date: "2023-09-21",
        content:
          "Great article! I'd add that open source is also becoming increasingly important in AI, with models like those from Hugging Face leading the way.",
      },
      {
        id: 502,
        author: "Priya Sharma",
        date: "2023-09-22",
        content:
          "The sustainability issue is so important. I've seen too many critical projects abandoned because maintainers couldn't afford to keep working on them.",
      },
    ],
  },
  {
    id: 6,
    title: "Design Systems That Scale: Lessons from DisPlan",
    excerpt: "Learn how we built a design system that supports thousands of components while maintaining consistency.",
    date: "2023-09-15",
    author: "David Lee",
    category: "Design",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    likes: 6837,
    content: `
      <p>Building a design system that scales effectively is one of the most challenging aspects of modern product development. At DisPlan, we've learned valuable lessons about creating and maintaining design systems that we're sharing in this article.</p>
      
      <h2>Starting with Strong Foundations</h2>
      
      <p>A scalable design system begins with solid fundamentals:</p>
      
      <ul>
        <li><strong>Design Tokens</strong>: Abstracting colors, spacing, typography into reusable variables</li>
        <li><strong>Core Components</strong>: Building primitive elements that serve as building blocks</li>
        <li><strong>Clear Principles</strong>: Establishing guiding principles for design decisions</li>
        <li><strong>Documentation</strong>: Creating comprehensive guides from day one</li>
      </ul>
      
      <p>These foundations provide the structure needed for sustainable growth.</p>
      
      <h2>Component Architecture</h2>
      
      <p>How components are structured determines how well a system scales:</p>
      
      <ul>
        <li><strong>Composition over Configuration</strong>: Favoring small, composable components</li>
        <li><strong>Prop API Design</strong>: Creating intuitive, consistent component interfaces</li>
        <li><strong>Variants vs. New Components</strong>: Guidelines for when to extend vs. create</li>
        <li><strong>Accessibility Built-in</strong>: Making accessibility a core requirement, not an add-on</li>
      </ul>
      
      <p>This approach has allowed us to maintain consistency while supporting diverse use cases.</p>
      
      <h2>Governance and Evolution</h2>
      
      <p>Managing change is critical for long-term success:</p>
      
      <ul>
        <li><strong>Contribution Process</strong>: Clear pathways for proposing and implementing changes</li>
        <li><strong>Review Standards</strong>: Consistent criteria for evaluating additions and modifications</li>
        <li><strong>Versioning Strategy</strong>: Approach to managing breaking changes</li>
        <li><strong>Deprecation Policies</strong>: How to phase out outdated components</li>
      </ul>
      
      <p>These processes help the system evolve without creating fragmentation.</p>
      
      <h2>Tools and Infrastructure</h2>
      
      <p>The right tooling amplifies a design system's effectiveness:</p>
      
      <ul>
        <li><strong>Design-to-Code Workflow</strong>: Streamlining the handoff between designers and developers</li>
        <li><strong>Testing Automation</strong>: Ensuring components meet quality standards</li>
        <li><strong>Documentation Generation</strong>: Keeping documentation in sync with components</li>
        <li><strong>Usage Analytics</strong>: Understanding how components are being used</li>
      </ul>
      
      <p>Investing in these tools has significantly improved our team's productivity.</p>
      
      <h2>Cultural Factors</h2>
      
      <p>Beyond technical aspects, culture plays a crucial role:</p>
      
      <ul>
        <li><strong>Cross-functional Ownership</strong>: Shared responsibility between design and engineering</li>
        <li><strong>Education and Advocacy</strong>: Helping teams understand and embrace the system</li>
        <li><strong>Feedback Loops</strong>: Creating channels for users to provide input</li>
        <li><strong>Measuring Success</strong>: Defining and tracking meaningful metrics</li>
      </ul>
      
      <p>By addressing both technical and cultural dimensions, we've created a design system that continues to scale with our product's growing complexity while maintaining the consistency our users expect.</p>
    `,
    comments: [
      {
        id: 601,
        author: "Lisa Wang",
        date: "2023-09-16",
        content:
          "I'd love to hear more about how you handle design tokens across different platforms. Do you use a single source of truth?",
      },
    ],
  },
]

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(0)
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState<Array<{id: number, author: string, date: string, content: string}>>([])
  const commentRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Find the current post based on the ID in the URL
  const postId = Number(params.id)
  const post = blogPosts.find((p) => p.id === postId)

  useEffect(() => {
    if (!post) {
      router.push("/blog")
      return
    }

    // Set initial likes and comments
    setLikes(post.likes || 0)
    setComments(post.comments || [])

    // Check if user is logged in
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)

      // If user is logged in, check if they've liked this post
      // This would typically be fetched from a database
      if (data.user) {
        // Simulate checking if user has liked the post
        const hasLiked = localStorage.getItem(`liked-${postId}`) === "true"
        setLiked(hasLiked)
      }
    }
    getUser()
  }, [post, postId, router])

  if (!post) {
    return null // This will be handled by the useEffect redirect
  }

  const handleLike = () => {
    if (!user) {
      setShowLoginModal(true)
      return
    }

    if (liked) {
      setLiked(false)
      setLikes(likes - 1)
      localStorage.removeItem(`liked-${postId}`)
    } else {
      setLiked(true)
      setLikes(likes + 1)
      localStorage.setItem(`liked-${postId}`, "true")
    }
  }

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setShowLoginModal(true)
      return
    }

    if (!comment.trim()) return

    // Add the new comment
    const newComment = {
      id: Date.now(),
      author: user.email || "Anonymous User",
      date: new Date().toISOString().split('T')[0],
      content: comment
    }

    setComments([...comments, newComment])
    setComment("")
  }

  return (
    <div className="w-full min-h-screen text-white bg-background relative">
      <Navbar />
      <main className="flex flex-col pt-32 pb-20">
        <div className="px-6 mx-auto max-w-4xl w-full">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-white/60 mb-8">
            <Link href="/blog" className="hover:text-white transition-colors">
              Blog
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/40">{post.category}</span>
          </div>

          {/* Article header */}
          <article>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-blue-900 text-blue-300">
                {post.category}
              </span>

              <div className="flex items-center text-sm text-white/60">
                <User className="h-4 w-4 mr-1" />
                <span>{post.author}</span>
              </div>

              <div className="flex items-center text-sm text-white/60">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{post.date}</span>
              </div>

              <button
                onClick={handleLike}
                className={`flex items-center text-sm ${liked ? "text-red-500" : "text-white/60"} hover:text-red-500 transition-colors`}
              >
                <Heart className={`h-4 w-4 mr-1 ${liked ? "fill-current" : ""}`} />
                <span>{likes} likes</span>
              </button>
            </div>

            {/* Featured image */}
            <div className="w-full h-[400px] mb-10 rounded-xl overflow-hidden">
              <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
            </div>

            {/* Article content */}
            <div
              className="prose prose-invert prose-lg max-w-none mb-16"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Article actions */}
            <div className="flex justify-between items-center border-t border-b border-white/10 py-6 mb-10">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  liked ? "bg-red-500/20 text-red-500" : "bg-white/5 text-white/80 hover:bg-white/10"
                } transition-colors`}
              >
                <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
                <span>{liked ? "Liked" : "Like"}</span>
              </button>

              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-white/80 hover:bg-white/10 transition-colors">
                <Share2 className="h-5 w-5" />
                <span>Share</span>
              </button>
            </div>

            {/* Comments section */}
            <div ref={commentRef} className="mb-10">
              <h2 className="text-2xl font-semibold mb-6">Comments ({comments.length})</h2>

              {/* Comment form */}
              <form onSubmit={handleComment} className="mb-10">
                <div className="mb-4">
                  <textarea
                    placeholder="Add a comment..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                  >
                    Post Comment
                  </button>
                </div>
              </form>

              {/* Comments list */}
              {comments.length > 0 ? (
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-4 rounded-lg bg-white/5">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">{comment.author}</div>
                        <div className="text-sm text-white/60">{comment.date}</div>
                      </div>
                      <p className="text-white/80">{comment.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-white/60">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No comments yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </article>

          {/* Back to blog */}
          <div className="mt-10">
            <Link href="/blog" className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to all articles
            </Link>
          </div>
        </div>
      </main>

      {/* Login Modal (simplified - in a real app you'd have a proper modal component) */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Sign in required</h3>
            <p className="mb-6">Please sign in to like posts and leave comments.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowLoginModal(false)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => router.push('/login')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
