// Utility functions for cookie consent management

export const CookieConsentUtils = {
  // Check if user has given consent
  hasConsented(): boolean {
    if (typeof window === "undefined") return false
    return localStorage.getItem("cookie-consent-choice") === "accepted"
  },

  // Check if user has declined
  hasDeclined(): boolean {
    if (typeof window === "undefined") return false
    return localStorage.getItem("cookie-consent-choice") === "declined"
  },

  // Check if user has made any choice
  hasChoiceMade(): boolean {
    if (typeof window === "undefined") return false
    return localStorage.getItem("cookie-consent-choice") !== null
  },

  // Get consent timestamp
  getConsentTimestamp(): Date | null {
    if (typeof window === "undefined") return null
    const timestamp = localStorage.getItem("cookie-consent-timestamp")
    return timestamp ? new Date(timestamp) : null
  },

  // Reset consent (for testing or privacy settings)
  resetConsent(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem("cookie-consent-choice")
    localStorage.removeItem("cookie-consent-timestamp")
  },

  // Check if consent is expired (optional - for GDPR compliance)
  isConsentExpired(monthsValid = 12): boolean {
    const timestamp = this.getConsentTimestamp()
    if (!timestamp) return true

    const expiryDate = new Date(timestamp)
    expiryDate.setMonth(expiryDate.getMonth() + monthsValid)

    return new Date() > expiryDate
  },
}
