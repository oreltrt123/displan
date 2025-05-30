import { getAllBoards } from "./actions/working-board-actions"
import { WorkingBoardGrid } from "./components/working-board-grid"
import { WorkingCreateDialog } from "./components/working-create-dialog"

export const dynamic = "force-dynamic";
export default async function DashboardPage() {
  const { data: boards, error } = await getAllBoards()

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading boards: {error}</p>
          <p className="text-muted-foreground">Please make sure you've run the SQL setup</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Recent boards</h1>
            <p className="text-muted-foreground mt-1">Pick up where you left off</p>
          </div>
          <WorkingCreateDialog />
        </div>

        <WorkingBoardGrid boards={boards} />
      </main>
    </div>
  )
}
// "use client"

// import { useState, useEffect } from "react"
// import { getAllBoards } from "./actions/working-board-actions"
// import { WorkingBoardGrid } from "./components/working-board-grid"
// import { WorkingCreateDialog } from "./components/working-create-dialog"
// import { DashboardSidebar } from "./components/dashboard-sidebar"
// import type { WorkingBoard } from "./actions/working-board-actions"

// export default function DashboardPage() {
//   const [boards, setBoards] = useState<WorkingBoard[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   const fetchBoards = async () => {
//     try {
//       const { data, error } = await getAllBoards()
//       if (error) {
//         setError(error)
//       } else {
//         setBoards(data)
//         setError(null)
//       }
//     } catch (err) {
//       setError("Failed to fetch boards")
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchBoards()
//   }, [])

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background">
//         <div className="text-center">
//           <p className="text-destructive mb-4">Error loading boards: {error}</p>
//           <p className="text-muted-foreground">Please make sure you've run the SQL setup</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-background flex">
//       {/* Sidebar */}
//       <DashboardSidebar />

//       {/* Main Content */}
//       <div className="flex-1">
//         <main className="container mx-auto px-6 py-8">
//           <div className="flex items-center justify-between mb-8">
//             <div>
//               <h1 className="text-2xl font-semibold text-foreground">Recent boards</h1>
//               <p className="text-muted-foreground mt-1">Pick up where you left off</p>
//             </div>
//             <WorkingCreateDialog onSuccess={fetchBoards} />
//           </div>

//           {loading ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//               {[...Array(8)].map((_, i) => (
//                 <div key={i} className="aspect-[4/3] bg-muted rounded-lg animate-pulse" />
//               ))}
//             </div>
//           ) : (
//             <WorkingBoardGrid boards={boards} onUpdate={fetchBoards} />
//           )}
//         </main>
//       </div>
//     </div>
//   )
// }
