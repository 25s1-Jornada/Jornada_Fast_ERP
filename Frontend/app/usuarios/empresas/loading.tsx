import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-4 w-[350px] mt-2" />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-[150px]" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[200px]" />
            <Skeleton className="h-10 w-[150px]" />
          </div>
        </div>

        <div className="border rounded-md">
          <div className="p-4">
            <div className="flex items-center space-x-4 py-3">
              <Skeleton className="h-6 w-[250px]" />
              <Skeleton className="h-6 w-[150px]" />
              <Skeleton className="h-6 w-[100px]" />
              <Skeleton className="h-6 w-[200px]" />
              <Skeleton className="h-6 w-[150px]" />
              <Skeleton className="h-6 w-[50px]" />
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 py-3">
                <Skeleton className="h-6 w-[250px]" />
                <Skeleton className="h-6 w-[150px]" />
                <Skeleton className="h-6 w-[100px]" />
                <Skeleton className="h-6 w-[200px]" />
                <Skeleton className="h-6 w-[150px]" />
                <Skeleton className="h-6 w-[50px]" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <Skeleton className="h-10 w-[300px]" />
        </div>
      </div>
    </div>
  )
}
