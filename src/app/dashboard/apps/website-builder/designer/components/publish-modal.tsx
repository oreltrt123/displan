"use client"
import Link from "next/link"
import { X, Settings } from "lucide-react"
import { useState } from "react"

interface PublishModalProps {
  isOpen: boolean
  onClose: () => void
  projectName: string
  onPublish: () => Promise<void>
  publishingStatus: "idle" | "publishing" | "success" | "error"
  publishedUrl: string | null
}

export function PublishModal({
  isOpen,
  onClose,
  projectName,
  onPublish,
  publishingStatus,
  publishedUrl,
}: PublishModalProps) {
  const [errorDetails, setErrorDetails] = useState<string | null>(null)

  const handlePublish = async () => {
    try {
      setErrorDetails(null)
      await onPublish()
    } catch (error) {
      console.error("Error in publish handler:", error)
      setErrorDetails(error instanceof Error ? error.message : String(error))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="p-6">
          {publishingStatus === "idle" && (
            <>
              <h2 className="text-xl font-semibold mb-4">Publish Website</h2>
              <p className="mb-4">
                Your website will be published to a subdomain of displan.design. This will make your website accessible
                on the internet.
              </p>
              <div className="bg-secondary/50 rounded p-3 mb-4">
                <p className="text-sm font-medium">Your site will be published at:</p>
                <p className="text-sm text-primary mt-1">
                  https://{projectName.toLowerCase().replace(/[^a-z0-9]/g, "-")}.displan.design
                </p>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button onClick={onClose} className="px-4 py-2 rounded text-sm bg-secondary text-secondary-foreground">
                  Cancel
                </button>
                <button
                  onClick={handlePublish}
                  className="px-4 py-2 rounded text-sm bg-primary text-primary-foreground"
                >
                  Publish
                </button>
              </div>
            </>
          )}

          {publishingStatus === "publishing" && (
            <div className="py-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-lg">Publishing your website...</p>
              <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
            </div>
          )}

          {publishingStatus === "success" && publishedUrl && (
            <>
              <div className="text-right">
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="text-center py-4">
                <h2 className="text-2xl font-bold mb-2">Congratulations</h2>
                <p className="mb-6">Your site is published and live online</p>

                <div className="bg-secondary/50 rounded flex items-center p-2 mb-8">
                  <div className="flex items-center text-xs text-muted-foreground mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-chevron-left"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-chevron-right"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </div>
                  <div className="bg-background flex-1 rounded px-3 py-2 text-sm">https://{publishedUrl}</div>
                  <a
                    href={`https://${publishedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 px-3 py-1 bg-primary text-primary-foreground rounded text-sm"
                  >
                    View Site
                  </a>
                </div>

                <div className="border-t border-b py-6 my-6">
                  <h3 className="text-lg font-medium mb-4">What's Next</h3>

                  <div className="flex items-start mb-4">
                    <div className="bg-primary/10 p-2 rounded mr-4">
                      <Settings className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-medium">Finish setting up your site</h4>
                      <p className="text-sm text-muted-foreground">
                        Complete your settings to start selling online. Just go to your dashboard and follow the setup
                        steps.
                      </p>
                      <Link href="/dashboard" className="text-primary text-sm mt-2 inline-block">
                        Complete Setup
                      </Link>
                    </div>
                  </div>
                </div>

                <button onClick={onClose} className="px-6 py-2 bg-primary text-primary-foreground rounded">
                  Done
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                You're responsible for verifying the accuracy and legality of the published content, including
                AI-generated content.
              </p>
            </>
          )}

          {publishingStatus === "error" && (
            <>
              <h2 className="text-xl font-semibold mb-4 text-destructive">Publishing Failed</h2>
              <p className="mb-4">There was an error publishing your website. Please try again later.</p>
              {errorDetails && (
                <div className="bg-destructive/10 p-3 rounded mb-4 text-sm">
                  <p className="font-medium">Error details:</p>
                  <p className="text-destructive">{errorDetails}</p>
                </div>
              )}
              <div className="flex justify-end space-x-3 mt-6">
                <button onClick={onClose} className="px-4 py-2 rounded text-sm bg-secondary text-secondary-foreground">
                  Close
                </button>
                <button
                  onClick={handlePublish}
                  className="px-4 py-2 rounded text-sm bg-primary text-primary-foreground"
                >
                  Try Again
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
