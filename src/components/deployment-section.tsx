"use client"

import { useState } from "react"
import { Globe, ExternalLink, Copy, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface DeploymentSectionProps {
  projectId: string
  currentSubdomain?: string
  isPublished?: boolean
}

export function DeploymentSection({ projectId, currentSubdomain, isPublished }: DeploymentSectionProps) {
  const [subdomain, setSubdomain] = useState(currentSubdomain || "")
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentStatus, setDeploymentStatus] = useState<"idle" | "success" | "error">("idle")
  const [deployedUrl, setDeployedUrl] = useState(currentSubdomain ? `https://${currentSubdomain}.displan.design` : "")
  const [errorMessage, setErrorMessage] = useState("")

  const handleDeploy = async () => {
    if (!subdomain.trim()) {
      setErrorMessage("Please enter a subdomain")
      setDeploymentStatus("error")
      return
    }

    setIsDeploying(true)
    setDeploymentStatus("idle")
    setErrorMessage("")

    try {
      const response = await fetch("/api/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          subdomain: subdomain.toLowerCase().trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to deploy")
      }

      setDeployedUrl(data.url)
      setDeploymentStatus("success")
    } catch (error) {
      console.error("Deployment error:", error)
      setErrorMessage(error instanceof Error ? error.message : "Failed to deploy")
      setDeploymentStatus("error")
    } finally {
      setIsDeploying(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(deployedUrl)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const openSite = () => {
    if (deployedUrl) {
      window.open(deployedUrl, "_blank")
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <Globe className="w-5 h-5 mr-2" />
        Deploy to Internet
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Publish your website to the internet with a custom subdomain. Your site will be available at{" "}
        <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">https://[subdomain].displan.design</code>
      </p>

      <div className="space-y-4">
        {/* Subdomain Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Choose your subdomain
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <span className="px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm border-r border-gray-300 dark:border-gray-600">
                https://
              </span>
              <input
                type="text"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none"
                placeholder="mysite"
                disabled={isDeploying}
              />
              <span className="px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm border-l border-gray-300 dark:border-gray-600">
                .displan.design
              </span>
            </div>
            <button
              onClick={handleDeploy}
              disabled={isDeploying || !subdomain.trim()}
              className="button_edit_project_r22232_Bu inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeploying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deploying...
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 mr-2" />
                  Deploy
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Only lowercase letters, numbers, and hyphens are allowed
          </p>
        </div>

        {/* Status Messages */}
        {deploymentStatus === "success" && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
              <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                Website deployed successfully!
              </span>
            </div>
          </div>
        )}

        {deploymentStatus === "error" && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
              <span className="text-sm text-red-700 dark:text-red-300 font-medium">{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Deployed URL */}
        {deployedUrl && (
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your website is live at:</p>
                <p className="text-blue-600 dark:text-blue-400 font-mono text-sm break-all">{deployedUrl}</p>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={copyToClipboard}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  title="Copy URL"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={openSite}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  title="Open site"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">How it works:</h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Choose a unique subdomain for your website</li>
            <li>• Click Deploy to publish your site to the internet</li>
            <li>• Your site will be available at https://[subdomain].displan.design</li>
            <li>• Updates to your project will automatically reflect on your live site</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
