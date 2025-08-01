"use client"

import { UnitSkeleton } from "../unit-skeleton/loading-skeleton.section"

interface FloorSkeletonProps {
  viewMode: "excel" | "list" | "grid"
  theme: any
  isDarkMode: boolean
  unitsPerFloor?: number
  floorNumber?: number
}

export function FloorSkeleton({
  viewMode,
  theme,
  isDarkMode,
  unitsPerFloor = 10,
  floorNumber = 1,
}: FloorSkeletonProps) {
  const skeletonBase = isDarkMode ? "bg-slate-700/50 animate-pulse" : "bg-gray-200/70 animate-pulse"

  if (viewMode === "excel") {
    return (
      <div className={`flex min-h-[110px] ${isDarkMode ? "bg-slate-800/30" : "bg-gray-50/30"} transition-colors`}>
        {/* Fixed Floor Column Skeleton */}
        <div
          className={`sticky left-0 z-20 ${theme.secondary} ${theme.border} border-r p-3 w-32 flex flex-col items-center justify-center min-h-[110px]`}
        >
          <div className={`h-6 w-8 rounded mb-1 ${skeletonBase}`} />
          <div className={`h-3 w-16 rounded mb-1 ${skeletonBase}`} />
          <div className={`h-3 w-12 rounded ${skeletonBase}`} />
        </div>

        {/* Unit Skeletons */}
        {Array.from({ length: unitsPerFloor }).map((_, index) => (
          <UnitSkeleton
            key={`skeleton-${floorNumber}-${index}`}
            viewMode={viewMode}
            theme={theme}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
    )
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-0">
        {Array.from({ length: unitsPerFloor }).map((_, index) => (
          <UnitSkeleton
            key={`skeleton-list-${floorNumber}-${index}`}
            viewMode={viewMode}
            theme={theme}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
    )
  }

  if (viewMode === "grid") {
    return (
      <>
        {Array.from({ length: unitsPerFloor }).map((_, index) => (
          <UnitSkeleton
            key={`skeleton-grid-${floorNumber}-${index}`}
            viewMode={viewMode}
            theme={theme}
            isDarkMode={isDarkMode}
          />
        ))}
      </>
    )
  }

  return null
}
