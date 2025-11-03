"use client"

export function SpecsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex justify-between items-center">
          <div className="h-4 bg-gray-700 rounded w-20"></div>
          <div className="h-4 bg-gray-600 rounded w-16"></div>
        </div>
      ))}
    </div>
  )
}

export function PartsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="p-3 bg-gray-800/30 rounded-lg border border-gray-700 animate-pulse">
          <div className="flex justify-between items-start mb-2">
            <div className="h-4 bg-gray-600 rounded w-32"></div>
            <div className="h-6 bg-gray-700 rounded w-16"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <div className="h-3 bg-gray-700 rounded w-12"></div>
              <div className="h-3 bg-gray-700 rounded w-8"></div>
            </div>
            <div className="h-8 bg-gray-700 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  )
}
