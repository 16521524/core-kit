"use client"

import { Button } from "@/components/ui/button"
import { Building, ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface BlockData {
  name: string
  total: number
  available: number
  sold: number
  booked: number
  unavailable: number
}

interface BlockSliderProps {
  blockData: BlockData[]
  selectedBlockIndex: number
  theme: any
  isDarkMode: boolean
  onSelectBlock: (index: number) => void
  loading?: boolean
}

// Skeleton component for slider loading state
function SliderSkeleton({ isDarkMode, theme }: { isDarkMode: boolean; theme: any }) {
  const skeletonBase = isDarkMode ? "bg-slate-700/50 animate-pulse" : "bg-gray-200/70 animate-pulse"

  return (
    <div className={`${theme.secondary} ${theme.borderLight} border-b px-6 py-4`}>
      <div className="flex items-center justify-center gap-4">
        {/* Previous Button - disabled */}
        <Button
          variant="ghost"
          size="sm"
          disabled
          className={`h-8 w-8 p-0 rounded-full ${
            isDarkMode ? "bg-slate-800 border-slate-600" : "bg-gray-100 border-gray-200"
          } opacity-30`}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* Skeleton Cards */}
        <div className="flex gap-5">
          {Array.from({ length: 11 }).map((_, index) => (
            <div
              key={index}
              className={`p-4 rounded-2xl ${isDarkMode ? "bg-slate-800/90" : "bg-white"} shadow-md border ${
                isDarkMode ? "border-slate-600" : "border-gray-200"
              }`}
              style={{ width: "190px", height: "132px" }}
            >
              {/* Title skeleton */}
              <div className={`h-5 w-20 rounded mb-4 ${skeletonBase}`} />

              {/* Numbers skeleton */}
              <div className="flex items-start justify-between mb-2">
                <div className="text-left">
                  <div className={`h-6 w-16 rounded mb-1 ${skeletonBase}`} />
                  <div className={`h-3 w-8 rounded ${skeletonBase}`} />
                </div>
                <div className="text-right">
                  <div className={`h-6 w-12 rounded mb-1 ${skeletonBase}`} />
                  <div className={`h-3 w-10 rounded ${skeletonBase}`} />
                </div>
              </div>

              {/* Progress bars skeleton */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className={`w-1.5 h-5 rounded-full ${skeletonBase}`} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Next Button - disabled */}
        <Button
          variant="ghost"
          size="sm"
          disabled
          className={`h-8 w-8 p-0 rounded-full ${
            isDarkMode ? "bg-slate-800 border-slate-600" : "bg-gray-100 border-gray-200"
          } opacity-30`}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

export function BlockSlider({
  blockData,
  selectedBlockIndex,
  theme,
  isDarkMode,
  onSelectBlock,
  loading = false,
}: BlockSliderProps) {
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const itemWidth = 190
  const gap = 20
  const visibleItems = 5 // Show 5 items on desktop

  useEffect(() => {
    const updateScrollButtons = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
        setCanScrollLeft(scrollLeft > 0)
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
      }
    }

    const container = scrollContainerRef.current
    if (container && blockData.length > 5) {
      // Only add scroll listeners if more than 4 items
      container.addEventListener("scroll", updateScrollButtons)
      updateScrollButtons()
      return () => container.removeEventListener("scroll", updateScrollButtons)
    } else {
      // If 4 or fewer items, disable scrolling
      setCanScrollLeft(false)
      setCanScrollRight(false)
    }
  }, [blockData])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -(itemWidth + gap),
        behavior: "smooth",
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: itemWidth + gap,
        behavior: "smooth",
      })
    }
  }

  const getProgressBars = (available: number, total: number, isActive: boolean) => {
    const percentage = (available / total) * 100
    const bars = 5
    const filledBars = Math.round((percentage / 100) * bars)

    return Array.from({ length: bars }, (_, index) => (
      <div
        key={index}
        className={`w-1.5 h-4 rounded-full ${
          index < filledBars
            ? isActive
              ? "bg-white/90"
              : percentage > 70
                ? "bg-emerald-400"
                : percentage > 40
                  ? "bg-yellow-400"
                  : "bg-orange-400"
            : isActive
              ? "bg-white/20"
              : isDarkMode
                ? "bg-slate-600"
                : "bg-gray-300"
        }`}
      />
    ))
  }

  const getBuildingIcons = (available: number, total: number, isActive: boolean) => {
    const percentage = (available / total) * 100
    const buildings = 5
    const filledBuildings = Math.round((percentage / 100) * buildings)

    return Array.from({ length: buildings }, (_, index) => {
      const isFilled = index < filledBuildings
      const iconColor = isFilled
        ? isActive
          ? "#ffffff"
          : percentage > 70
            ? "#34d399" // emerald-400
            : percentage > 40
              ? "#facc15" // yellow-400
              : "#fb923c" // orange-400
        : isActive
          ? "#ffffff33"
          : isDarkMode
            ? "#475569" // slate-600
            : "#d1d5db" // gray-300

      return <Building key={index} size={14} color={iconColor} />
    })
  }

  // Show skeleton while loading
  if (loading) {
    return <SliderSkeleton isDarkMode={isDarkMode} theme={theme} />
  }

  return (
    <div className={`${theme.secondary} ${theme.borderLight} border-b px-6 py-4`}>
      <div className="flex items-center justify-center gap-4">
        {/* Previous Button - only show if more than 4 items */}
        {blockData.length > 5 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`h-8 w-8 p-0 rounded-full ${
              isDarkMode
                ? "bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 border border-slate-600"
                : "bg-white hover:bg-gray-50 disabled:bg-gray-100 border border-gray-200"
            } transition-all duration-200 shadow-sm disabled:opacity-30`}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}

        {/* Slider Container - Always show 4 items */}
        <div
          // className="relative overflow-hidden"
          // style={{
          //   width: `${5 * itemWidth + 4 * gap}px`, // Fixed width for 5 items
          // }}
          className="relative overflow-hidden w-full"
        >
          <div
            ref={scrollContainerRef}
            className={`flex gap-5 ${blockData.length > 5 ? "overflow-x-auto" : ""} scrollbar-hide scroll-smooth`}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {blockData.map((block, index) => {
              const isActive = index === selectedBlockIndex
              return (
                <div
                  key={`block-${block.name}`}
                  className={`flex-shrink-0 cursor-pointer transition-all duration-300 hover:scale-[1.02]`}
                  style={{ width: `${itemWidth}px`, height: "132px" }} // Add fixed height
                  onClick={() => onSelectBlock(index)}
                >
                  <div
                    className={`p-4 rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg border h-full ${
                      isActive
                        ? `bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-400 shadow-xl shadow-blue-500/25`
                        : `${
                            isDarkMode
                              ? "bg-slate-800/90 hover:bg-slate-700/90 border-slate-600 text-white"
                              : "bg-white hover:bg-gray-50 border-gray-200 text-gray-900"
                          }`
                    }`}
                  >
                    {/* Block Title - Same size, just color change */}
                    <div
                      className={`font-bold text-xl mb-4 ${
                        isActive ? "text-white" : isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      BLOCK {block.name}
                    </div>

                    {/* Stats Row - Same size, just color change */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-left">
                        <div
                          className={`text-md font-bold leading-none ${
                            isActive ? "text-white" : isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {block.total}
                        </div>
                        <div
                          className={`text-xs mt-1 ${
                            isActive ? "text-white/80" : isDarkMode ? "text-slate-300" : "text-gray-600"
                          }`}
                        >
                          căn
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`text-md font-bold leading-none ${isActive ? "text-white" : "text-emerald-400"}`}
                        >
                          {block.available}
                        </div>
                        <div
                          className={`text-xs mt-1 ${
                            isActive ? "text-white/80" : isDarkMode ? "text-slate-300" : "text-gray-600"
                          }`}
                        >
                          trống
                        </div>
                      </div>
                    </div>

                    {/* Progress Bars - Same size */}
                    {/* <div className="flex items-center gap-1">
                      {getProgressBars(block.available, block.total, isActive)}
                    </div> */}
                    <div className="flex items-center gap-1">
                      {getBuildingIcons(block.available, block.total, isActive)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Next Button - only show if more than 4 items */}
        {blockData.length > 5 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`h-8 w-8 p-0 rounded-full ${
              isDarkMode
                ? "bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 border border-slate-600"
                : "bg-white hover:bg-gray-50 disabled:bg-gray-100 border border-gray-200"
            } transition-all duration-200 shadow-sm disabled:opacity-30`}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
