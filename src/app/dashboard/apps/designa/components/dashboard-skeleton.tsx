import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-3/4" />
          </CardHeader>
          <CardContent className="pb-2">
            <Skeleton className="h-32 w-full mb-3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3 mt-2" />
          </CardContent>
          <CardFooter className="flex justify-between pt-2 border-t">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-8 w-16" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
