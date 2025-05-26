import { getSingleBoard } from "../actions/working-board-actions"
import { BoardEditor } from "../components/board/board-editor"
import { notFound } from "next/navigation"

interface BoardPageProps {
  params: {
    id: string
  }
}

export default async function BoardPage({ params }: BoardPageProps) {
  console.log("🎯 Loading board:", params.id)

  const { data: board, error } = await getSingleBoard(params.id)

  if (error) {
    console.error("❌ Board error:", error)
    notFound()
  }

  if (!board) {
    console.error("❌ Board not found")
    notFound()
  }

  console.log("✅ Board loaded:", board.board_name)

  return (
    <div className="board-editor">
      <BoardEditor board={board} />
    </div>
  )
}
