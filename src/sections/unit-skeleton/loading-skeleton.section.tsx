"use client"

interface UnitSkeletonProps {
  viewMode: "excel" | "list" | "grid"
  theme: any
  isDarkMode: boolean
}

export function UnitSkeleton({ viewMode, theme, isDarkMode }: UnitSkeletonProps) {
  const skeletonBase = isDarkMode ? "bg-slate-700/50 animate-pulse" : "bg-gray-200/70 animate-pulse"

  if (viewMode === "excel") {
    return (
      <div
        className={`w-36 ${theme.border} border-r last:border-r-0 p-1 min-w-[144px] max-w-[144px] flex items-center justify-center`}
      >
        <div
          className={`w-full h-full rounded-xl p-2 flex flex-col items-center justify-center space-y-2 ${skeletonBase}`}
        >
          {/* Unit code skeleton */}
          <div className={`h-3 w-16 rounded ${skeletonBase}`} />

          {/* Price skeleton */}
          <div className={`h-4 w-20 rounded ${skeletonBase}`} />

          {/* Area badge skeleton */}
          <div className={`h-6 w-12 rounded-full ${skeletonBase}`} />

          {/* Status indicator skeleton */}
          <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${skeletonBase}`} />
        </div>
      </div>
    )
  }

  if (viewMode === "grid") {
    return (
      <div className={`rounded-xl p-4 ${isDarkMode ? "bg-slate-800/50" : "bg-gray-100/50"} ${skeletonBase}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${skeletonBase}`} />
            <div className={`h-3 w-12 rounded ${skeletonBase}`} />
          </div>
          <div className={`w-6 h-6 rounded ${skeletonBase}`} />
        </div>

        <div className="mb-3">
          <div className={`h-4 w-16 rounded mb-1 ${skeletonBase}`} />
          <div className={`h-3 w-20 rounded ${skeletonBase}`} />
        </div>

        <div className="mb-3">
          <div className={`h-5 w-24 rounded mb-1 ${skeletonBase}`} />
          <div className={`h-5 w-16 rounded ${skeletonBase}`} />
        </div>

        <div className={`h-3 w-28 rounded ${skeletonBase}`} />
      </div>
    )
  }

  if (viewMode === "list") {
    return (
      <div className={`px-6 py-4 ${isDarkMode ? "bg-slate-800/30" : "bg-gray-50/30"}`}>
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-2 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${skeletonBase}`} />
            <div className="space-y-1">
              <div className={`h-4 w-16 rounded ${skeletonBase}`} />
              <div className={`h-3 w-12 rounded ${skeletonBase}`} />
            </div>
          </div>

          <div className="col-span-1 text-right">
            <div className={`h-4 w-20 rounded ${skeletonBase} ml-auto`} />
          </div>

          <div className="col-span-1 text-center">
            <div className={`h-4 w-8 rounded ${skeletonBase} mx-auto`} />
          </div>

          <div className="col-span-2 text-center">
            <div className={`h-4 w-16 rounded ${skeletonBase} mx-auto`} />
          </div>

          <div className="col-span-2 text-center">
            <div className={`h-6 w-20 rounded-full ${skeletonBase} mx-auto`} />
          </div>

          <div className="col-span-2 text-center">
            <div className={`h-3 w-24 rounded ${skeletonBase} mx-auto`} />
          </div>

          <div className="col-span-2 text-center">
            <div className={`h-8 w-20 rounded ${skeletonBase} mx-auto`} />
          </div>
        </div>
      </div>
    )
  }

  return null
}
