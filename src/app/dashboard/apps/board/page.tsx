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
