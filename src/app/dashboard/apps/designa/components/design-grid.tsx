import type { Design } from "../types/design"
import DesignCard from "./design-card"

interface DesignGridProps {
  designs: Design[]
}

export function DesignGrid({ designs }: DesignGridProps) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {designs.map((design) => (
        <DesignCard key={design.id} design={design} />
      ))}
    </div>
  )
}
