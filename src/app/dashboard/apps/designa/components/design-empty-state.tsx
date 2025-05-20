import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import CreateDesignDialog from "./create-design-dialog"

export function DesignEmptyState() {
  return (
    <Card className="mt-6 border-dashed">
      <CardHeader className="gap-2">
        <CardTitle className="text-xl">No designs yet</CardTitle>
        <CardDescription>Create your first design to get started with your creative journey.</CardDescription>
      </CardHeader>
      <CardContent className="flex min-h-[300px] flex-col items-center justify-center rounded-md border border-dashed p-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <PlusCircle className="h-10 w-10 text-primary" />
        </div>
        <h3 className="mt-6 text-lg font-medium">Start creating</h3>
        <p className="mb-4 mt-2 text-center text-sm text-muted-foreground">
          Click the button below to create your first design project.
        </p>
      </CardContent>
      <CardFooter className="justify-center pb-8">
        <CreateDesignDialog>
          <Button size="lg" className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Your First Design
          </Button>
        </CreateDesignDialog>
      </CardFooter>
    </Card>
  )
}
