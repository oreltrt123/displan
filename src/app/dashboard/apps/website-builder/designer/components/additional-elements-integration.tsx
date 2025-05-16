import type React from "react"
import type { ElementType } from "../types"
import {
  renderSearch,
  renderCard,
  renderForm,
  renderGallery,
  renderSlider,
  renderTabFilter,
  renderNewsletterBox,
  renderSocialFollow,
  renderCta,
  renderFaq,
  renderPricing,
  renderStats,
  renderTeam,
  renderTestimonials,
  renderFeatures,
} from "./additional-elements"

/**
 * This function checks if the element type is one of the additional types
 * and renders it accordingly.
 *
 * Add this function to your element-renderer.tsx file and call it in the renderElement function
 * before the default case to handle the additional element types.
 */
export function renderAdditionalElement(baseType: string, element: ElementType): React.ReactNode | null {
  switch (baseType) {
    case "search":
      return renderSearch(element)
    case "card":
      return renderCard(element)
    case "form":
      return renderForm(element)
    case "gallery":
      return renderGallery(element)
    case "slider":
      // Note: If there's already a slider implementation in the main file,
      // you may need to rename this or handle it differently
      return renderSlider(element)
    case "tab-filter":
      return renderTabFilter(element)
    case "newsletter-box":
      return renderNewsletterBox(element)
    case "social-follow":
      return renderSocialFollow(element)
    case "cta":
      return renderCta(element)
    case "faq":
      return renderFaq(element)
    case "pricing":
      return renderPricing(element)
    case "stats":
      return renderStats(element)
    case "team":
      return renderTeam(element)
    case "testimonials":
      // Note: If there's already a testimonials implementation in the main file,
      // you may need to rename this or handle it differently
      return renderTestimonials(element)
    case "features":
      // Note: If there's already a features implementation in the main file,
      // you may need to rename this or handle it differently
      return renderFeatures(element)
    default:
      return null
  }
}
