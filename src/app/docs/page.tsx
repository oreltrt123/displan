import { createClient } from "../../../supabase/server"
import { ArrowRight, BookOpen, Code, Shield, CreditCard, Users, Zap } from "lucide-react"
import Link from "next/link"

export default async function DocsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // This would typically fetch documentation categories from a database or CMS
  const docCategories = [
    {
      id: "getting-started",
      title: "Getting Started",
      description: "Learn the basics of DisPlan and how to set up your account.",
      icon: <BookOpen className="h-8 w-8 text-purple-400" />,
      articles: [
        { id: "setup", title: "Initial Setup" },
        { id: "account", title: "Account Configuration" },
        { id: "first-project", title: "Creating Your First Project" },
      ],
    },
    {
      id: "project-management",
      title: "Project Management",
      description: "Learn how to create and manage collaborative projects.",
      icon: <Users className="h-8 w-8 text-purple-400" />,
      articles: [
        { id: "create-project", title: "Creating Projects" },
        { id: "invite-collaborators", title: "Inviting Collaborators" },
        { id: "milestones", title: "Setting Milestones" },
      ],
    },
    {
      id: "payments",
      title: "Payment Protection",
      description: "Understand how our secure payment system works.",
      icon: <CreditCard className="h-8 w-8 text-purple-400" />,
      articles: [
        { id: "escrow", title: "Escrow System" },
        { id: "milestone-payments", title: "Milestone-Based Payments" },
        { id: "dispute-resolution", title: "Dispute Resolution" },
      ],
    },
    {
      id: "security",
      title: "Security Features",
      description: "Learn about the security measures protecting your projects.",
      icon: <Shield className="h-8 w-8 text-purple-400" />,
      articles: [
        { id: "authentication", title: "Authentication" },
        { id: "permissions", title: "Permission Management" },
        { id: "data-protection", title: "Data Protection" },
      ],
    },
    {
      id: "api",
      title: "API Reference",
      description: "Complete API documentation for developers.",
      icon: <Code className="h-8 w-8 text-purple-400" />,
      articles: [
        { id: "endpoints", title: "API Endpoints" },
        { id: "authentication", title: "API Authentication" },
        { id: "examples", title: "Code Examples" },
      ],
    },
    {
      id: "advanced",
      title: "Advanced Features",
      description: "Discover powerful tools for experienced users.",
      icon: <Zap className="h-8 w-8 text-purple-400" />,
      articles: [
        { id: "integrations", title: "Third-party Integrations" },
        { id: "automation", title: "Workflow Automation" },
        { id: "analytics", title: "Project Analytics" },
      ],
    },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {docCategories.map((category) => (
        <div
          key={category.id}
          className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-purple-500 transition-all duration-300"
        >
          <div className="mb-4">{category.icon}</div>
          <h2 className="text-2xl font-bold mb-3" data-i18n={`doc_${category.id}_title`}>
            {category.title}
          </h2>
          <p className="text-gray-400 mb-6" data-i18n={`doc_${category.id}_desc`}>
            {category.description}
          </p>
          <ul className="space-y-3">
            {category.articles.map((article) => (
              <li key={article.id} className="group">
                <Link
                  href={`/docs/${category.id}/${article.id}`}
                  className="flex items-center justify-between text-gray-300 hover:text-purple-400 transition-colors"
                  data-i18n={`doc_${category.id}_${article.id}`}
                >
                  <span>{article.title}</span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
