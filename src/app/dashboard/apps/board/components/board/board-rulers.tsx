"use client"

interface BoardRulersProps {
  orientation: "horizontal" | "vertical"
}

export function BoardRulers({ orientation }: BoardRulersProps) {
  const isHorizontal = orientation === "horizontal"

  return (
    <div
      className={`bg-muted border-border ${
        isHorizontal ? "h-6 border-b flex items-end" : "w-6 border-r flex flex-col justify-start"
      }`}
    >
      <div className="text-xs text-muted-foreground p-1">{isHorizontal ? "0" : "0"}</div>
    </div>
  )
}
