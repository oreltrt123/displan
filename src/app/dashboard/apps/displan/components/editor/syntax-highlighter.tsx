"use client"

import { useEffect, useState } from "react"

interface SyntaxHighlighterProps {
  language: string
  code: string
}

export function SyntaxHighlighter({ language, code }: SyntaxHighlighterProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>("")

  useEffect(() => {
    if (!code) {
      setHighlightedCode("")
      return
    }

    // Simple syntax highlighting
    const highlighted = highlightCode(code, language)
    setHighlightedCode(highlighted)
  }, [code, language])

  const highlightCode = (code: string, lang: string): string => {
    if (!code) return ""

    let highlighted = code

    // HTML/JSX highlighting
    if (lang === "html" || lang === "react" || lang === "typescript" || lang === "vue" || lang === "angular") {
      highlighted = highlighted
        // HTML tags
        .replace(
          /(&lt;\/?)([a-zA-Z][a-zA-Z0-9]*)(.*?)(&gt;)/g,
          '<span class="tag">$1$2</span><span class="attr">$3</span><span class="tag">$4</span>',
        )
        // Attributes
        .replace(/(\w+)=("[^"]*")/g, '<span class="attr-name">$1</span>=<span class="attr-value">$2</span>')
        // Strings
        .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
        .replace(/'([^']*)'/g, "<span class=\"string\">'$1'</span>")
        // Comments
        .replace(/\/\*[\s\S]*?\*\//g, '<span class="comment">$&</span>')
        .replace(/\/\/.*$/gm, '<span class="comment">$&</span>')
        // Keywords
        .replace(
          /\b(import|export|from|const|let|var|function|class|interface|type|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|async|await|default)\b/g,
          '<span class="keyword">$1</span>',
        )
    }

    // CSS highlighting
    if (lang === "css") {
      highlighted = highlighted
        // Selectors
        .replace(/^([.#]?[a-zA-Z][a-zA-Z0-9_-]*|\*|::?[a-zA-Z-]+)/gm, '<span class="selector">$1</span>')
        // Properties
        .replace(/([a-zA-Z-]+)(\s*:)/g, '<span class="property">$1</span>$2')
        // Values
        .replace(/:(\s*)([^;{}]+)/g, ': <span class="value">$2</span>')
        // Comments
        .replace(/\/\*[\s\S]*?\*\//g, '<span class="comment">$&</span>')
        // Units and numbers
        .replace(/\b(\d+(?:\.\d+)?)(px|em|rem|%|vh|vw|deg|s|ms)?\b/g, '<span class="number">$1$2</span>')
    }

    // JavaScript highlighting
    if (lang === "javascript") {
      highlighted = highlighted
        // Strings
        .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
        .replace(/'([^']*)'/g, "<span class=\"string\">'$1'</span>")
        .replace(/`([^`]*)`/g, '<span class="string">`$1`</span>')
        // Comments
        .replace(/\/\*[\s\S]*?\*\//g, '<span class="comment">$&</span>')
        .replace(/\/\/.*$/gm, '<span class="comment">$&</span>')
        // Keywords
        .replace(
          /\b(const|let|var|function|class|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|async|await|import|export|from|default|new|this|super|extends|implements|interface|type|enum|namespace|module|declare|public|private|protected|static|readonly|abstract)\b/g,
          '<span class="keyword">$1</span>',
        )
        // Numbers
        .replace(/\b\d+(?:\.\d+)?\b/g, '<span class="number">$&</span>')
    }

    return highlighted
  }

  const addLineNumbers = (code: string): string => {
    const lines = code.split("\n")
    return lines
      .map((line, index) => {
        const lineNumber = (index + 1).toString().padStart(3, " ")
        return `<div class="code-line"><span class="line-number">${lineNumber}</span><span class="line-content">${line}</span></div>`
      })
      .join("")
  }

  if (!code) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-2">📝</div>
          <p>No code to display</p>
          <p className="text-sm">Add elements to your canvas to generate code</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 font-mono text-sm overflow-auto">
      <style jsx>{`
        .code-line {
          display: flex;
          min-height: 1.5rem;
          line-height: 1.5rem;
        }
        .line-number {
          display: inline-block;
          width: 3rem;
          padding: 0 0.5rem;
          text-align: right;
          color: #6b7280;
          background: #f9fafb;
          border-right: 1px solid #e5e7eb;
          user-select: none;
          flex-shrink: 0;
        }
        .dark .line-number {
          color: #9ca3af;
          background: #1f2937;
          border-right-color: #374151;
        }
        .line-content {
          padding: 0 1rem;
          flex: 1;
          white-space: pre;
        }
        .keyword {
          color: #7c3aed;
          font-weight: 600;
        }
        .string {
          color: #059669;
        }
        .comment {
          color: #6b7280;
          font-style: italic;
        }
        .tag {
          color: #dc2626;
        }
        .attr {
          color: #d97706;
        }
        .attr-name {
          color: #0891b2;
        }
        .attr-value {
          color: #059669;
        }
        .selector {
          color: #7c3aed;
          font-weight: 600;
        }
        .property {
          color: #0891b2;
        }
        .value {
          color: #059669;
        }
        .number {
          color: #dc2626;
        }
        .dark .keyword {
          color: #a78bfa;
        }
        .dark .string {
          color: #34d399;
        }
        .dark .comment {
          color: #9ca3af;
        }
        .dark .tag {
          color: #f87171;
        }
        .dark .attr {
          color: #fbbf24;
        }
        .dark .attr-name {
          color: #22d3ee;
        }
        .dark .attr-value {
          color: #34d399;
        }
        .dark .selector {
          color: #a78bfa;
        }
        .dark .property {
          color: #22d3ee;
        }
        .dark .value {
          color: #34d399;
        }
        .dark .number {
          color: #f87171;
        }
      `}</style>
      <div
        dangerouslySetInnerHTML={{
          __html: addLineNumbers(highlightedCode),
        }}
      />
    </div>
  )
}
