"use client"

import { useEffect } from "react"

export function CanvasStyles({ customCode }: { customCode?: string }) {
  useEffect(() => {
    if (customCode) {
      const customCodeContainer = document.querySelector("#html-code-container")
      if (customCodeContainer) {
        customCodeContainer.innerHTML = customCode
        const scripts = customCodeContainer.querySelectorAll("script")
        scripts.forEach((script) => {
          const newScript = document.createElement("script")
          newScript.textContent = script.textContent
          document.head.appendChild(newScript)
          document.head.removeChild(newScript)
        })
      }
    }

    const styles = `
      <style id="canvas-styles">
        .template-element-editable:hover,
        .element-container:hover,
        .template-draggable-element:hover {
          outline: 1px solid #3b82f6;
          outline-offset: 2px;
        }
        
        .template-element-selected,
        .element-selected,
        .template-draggable-element.template-element-selected {
          outline: 2px solid #3b82f6 !important;
          outline-offset: 2px;
          background-color: rgba(59, 130, 246, 0.1);
        }

        .template-element-editing {
          outline: 2px solid #10b981 !important;
          outline-offset: 2px;
          background-color: rgba(16, 185, 129, 0.1);
        }

        .template-draggable-element {
          position: relative;
          transition: all 0.2s ease;
        }

        .template-draggable-element:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .template-draggable-element.template-element-selected {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(59, 130, 246, 0.2);
        }

        .edit-input {
          background: transparent;
          border: none;
          outline: none;
          width: 100%;
          height: 100%;
          font-family: inherit;
          font-size: inherit;
          font-weight: inherit;
          color: inherit;
          text-align: inherit;
          line-height: inherit;
          padding: 2px;
          z-index: 1000;
          position: relative;
          cursor: text;
        }

        .edit-input:focus {
          outline: 2px solid #10b981;
          outline-offset: 2px;
          background-color: rgba(16, 185, 129, 0.05);
          border-radius: 4px;
        }

        .resize-handle {
          position: absolute;
          width: 8px;
          height: 8px;
          background: #3b82f6;
          border-radius: 50%;
          z-index: 1001;
          border: 1px solid white;
        }

        .resize-handle.left {
          left: -4px;
          top: 50%;
          transform: translateY(-50%);
          cursor: ew-resize;
        }

        .resize-handle.right {
          right: -4px;
          top: 50%;
          transform: translateY(-50%);
          cursor: ew-resize;
        }

        .resize-handle.top-left {
          left: -4px;
          top: -4px;
          cursor: nw-resize;
        }

        .resize-handle.top-right {
          right: -4px;
          top: -4px;
          cursor: ne-resize;
        }

        .selection-box {
          position: absolute;
          border: 1px dashed #3b82f6;
          background: rgba(59, 130, 246, 0.1);
          pointer-events: none;
          z-index: 1000;
        }

        .context-menu {
          position: absolute;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          z-index: 10000;
          min-width: 200px;
          overflow: hidden;
          user-select: none;
        }

        .context-menu-item {
          padding: 12px 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          transition: all 0.15s ease;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
        }

        .context-menu-item:hover {
          background-color: #f3f4f6;
          color: #111827;
        }

        .context-menu-item:active {
          background-color: #e5e7eb;
        }

        .context-menu-item svg {
          width: 16px;
          height: 16px;
          color: #6b7280;
        }

        .context-menu-item:hover svg {
          color: #374151;
        }

        .context-menu-separator {
          height: 1px;
          background-color: #e5e7eb;
          margin: 4px 0;
        }

        /* Template element specific styles */
        .template-element-content {
          pointer-events: auto;
          user-select: none;
        }

        .template-element-content:hover {
          cursor: pointer;
        }

        .template-element-content.editing {
          user-select: text;
          cursor: text;
        }

        /* Ensure template elements are interactive */
        [data-template-element] {
          pointer-events: auto !important;
          user-select: none;
        }

        [data-template-element]:hover {
          cursor: pointer;
        }

        [data-template-element].template-element-selected {
          cursor: move;
        }
      </style>
    `
    if (!document.querySelector("#canvas-styles")) {
      const styleElement = document.createElement("div")
      styleElement.innerHTML = styles
      document.head.appendChild(styleElement)
    }
  }, [customCode])

  return null
}
