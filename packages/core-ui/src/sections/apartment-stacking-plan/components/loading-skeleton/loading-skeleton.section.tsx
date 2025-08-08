"use client"

import { FloorSkeleton } from "../floor-skeleton"

interface LoadingSkeletonProps {
  viewMode: "excel" | "list" | "grid"
  theme: any
  isDarkMode: boolean
}

export function LoadingSkeleton({ viewMode, theme, isDarkMode }: LoadingSkeletonProps) {
  const floors = 20 // Increased from 15 to 20 floors
  const unitsPerFloor = 20 // Increased units per floor

  if (viewMode === "excel") {
    return (
      <div className={`relative ${theme.primary} h-[calc(100vh-180px)] overflow-auto`}>
        <div className="min-w-max">
          {/* Fixed Header Skeleton */}
          <div className={`sticky top-0 z-30 ${theme.secondary} ${theme.borderLight} border-b shadow-sm`}>
            <div className="flex">
              {/* Fixed Corner Cell */}
              <div
                className={`sticky left-0 z-40 ${theme.secondary} ${theme.border} border-r p-3 w-32 flex flex-col items-center justify-center`}
              >
                <div
                  className={`h-4 w-12 rounded mb-1 ${isDarkMode ? "bg-slate-700 animate-pulse" : "bg-gray-200 animate-pulse"}`}
                />
                <div
                  className={`h-3 w-16 rounded ${isDarkMode ? "bg-slate-700 animate-pulse" : "bg-gray-200 animate-pulse"}`}
                />
              </div>

              {/* Unit Headers Skeleton */}
              {Array.from({ length: unitsPerFloor }).map((_, index) => (
                <div
                  key={`header-skeleton-${index}`}
                  className={`p-3 w-28 text-center ${theme.border} border-r last:border-r-0 ${theme.secondary} flex flex-col items-center justify-center min-w-[112px] max-w-[112px]`}
                >
                  <div
                    className={`h-4 w-16 rounded mb-1 ${isDarkMode ? "bg-slate-700 animate-pulse" : "bg-gray-200 animate-pulse"}`}
                  />
                  <div
                    className={`h-3 w-8 rounded ${isDarkMode ? "bg-slate-700 animate-pulse" : "bg-gray-200 animate-pulse"}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Floors Skeleton */}
          <div className={`divide-y ${theme.borderLightRow}`}>
            {Array.from({ length: floors }).map((_, floorIndex) => (
              <FloorSkeleton
                key={`floor-skeleton-${floorIndex}`}
                viewMode={viewMode}
                theme={theme}
                isDarkMode={isDarkMode}
                unitsPerFloor={unitsPerFloor}
                floorNumber={floorIndex + 1}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (viewMode === "list") {
    return (
      <div className={`${theme.primary} h-[calc(100vh-180px)] overflow-auto`}>
        {/* Header Skeleton */}
        <div className={`sticky top-0 z-20 ${theme.secondary} ${theme.borderLight} border-b px-6 py-4 shadow-sm`}>
          <div className={`grid grid-cols-12 gap-4 text-sm font-medium`}>
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={`list-header-skeleton-${index}`} className={index < 2 ? "col-span-2" : "col-span-1"}>
                <div
                  className={`h-4 w-16 rounded ${isDarkMode ? "bg-slate-700 animate-pulse" : "bg-gray-200 animate-pulse"}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* List Items Skeleton */}
        <div className={`divide-y ${theme.borderLightRow}`}>
          {Array.from({ length: floors * 12 }).map((_, index) => (
            <FloorSkeleton
              key={`list-skeleton-${index}`}
              viewMode={viewMode}
              theme={theme}
              isDarkMode={isDarkMode}
              unitsPerFloor={1}
              floorNumber={index}
            />
          ))}
        </div>
      </div>
    )
  }

  if (viewMode === "grid") {
    return (
      <div className={`p-6 ${theme.primary} h-[calc(100vh-180px)] overflow-auto`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
          {Array.from({ length: floors * 12 }).map((_, index) => (
            <FloorSkeleton
              key={`grid-skeleton-${index}`}
              viewMode={viewMode}
              theme={theme}
              isDarkMode={isDarkMode}
              unitsPerFloor={1}
              floorNumber={index}
            />
          ))}
        </div>
      </div>
    )
  }

  return null
}
