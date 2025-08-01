"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from "lucide-react"

interface BlockData {
  name: string
  change: string
  total: number
  available: number
  sold: number
  trend: "up" | "down" | "neutral"
}

interface BlockSliderProps {
  blockData: BlockData[]
  selectedBlockIndex: number
  startIndex: number
  currentTranslate: number
  itemWidth: number
  gap: number
  itemsToShow: number
  theme: any
  isDarkMode: boolean
  onPrevBlock: () => void
  onNextBlock: () => void
  onSelectBlock: (index: number) => void
}

export function BlockSlider({
  blockData,
  selectedBlockIndex,
  startIndex,
  currentTranslate,
  itemWidth,
  gap,
  itemsToShow,
  theme,
  isDarkMode,
  onPrevBlock,
  onNextBlock,
  onSelectBlock,
}: BlockSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null)

  return (
    <div className={`${theme.secondary} ${theme.borderLight} border-b px-6 py-4 overflow-hidden`}>
      <div className="flex items-center justify-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevBlock}
          className={`${isDarkMode ? "bg-slate-700 border-slate-600 hover:bg-slate-600" : "bg-white border-gray-300 hover:bg-gray-50"} p-2 h-10 w-10 flex-shrink-0 shadow-md hover:shadow-lg transition-all duration-200 ${
            startIndex === 0 ? "opacity-0 pointer-events-none" : ""
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div
          ref={sliderRef}
          className="relative flex items-center justify-center overflow-hidden select-none"
          style={{ width: "864px" }}
        >
          <div
            className="flex items-center gap-4 transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(${currentTranslate}px)`,
              width: `${blockData.length * (itemWidth + gap)}px`,
            }}
          >
            {blockData.map((block, index) => {
              const isSelected = index === selectedBlockIndex

              return (
                <div
                  key={`${block.name}-${index}`}
                  className={`flex-shrink-0 cursor-pointer transition-all duration-300 ${
                    isSelected ? `transform scale-105 z-20` : `transform scale-95 hover:scale-100`
                  }`}
                  style={{ width: `${itemWidth}px` }}
                  onClick={() => onSelectBlock(index)}
                >
                  <div
                    className={`rounded-xl p-4 shadow-lg transition-all duration-300 ${
                      isSelected
                        ? `${theme.accent} text-white shadow-xl transform scale-105`
                        : `${isDarkMode ? "bg-slate-700/60 hover:bg-slate-600" : "bg-white/60 hover:bg-gray-50 border-2 border-gray-200/50"} ${theme.textSecondary} shadow-md hover:shadow-lg`
                    }`}
                  >
                    <div className="text-center space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold">BLOCK {block.name}</div>
                        <div className="flex items-center gap-1">
                          <span
                            className={`text-sm font-bold ${
                              block.trend === "up"
                                ? "text-emerald-400"
                                : block.trend === "down"
                                  ? "text-rose-400"
                                  : "text-amber-400"
                            }`}
                          >
                            {block.change}
                          </span>
                          {block.trend === "up" && <TrendingUp className="w-4 h-4 text-emerald-400" />}
                          {block.trend === "down" && <TrendingDown className="w-4 h-4 text-rose-400" />}
                          {block.trend === "neutral" && (
                            <div className="w-4 h-4 border border-amber-400 rounded-sm"></div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-center">
                          <div className="font-bold text-lg">{block.total}</div>
                          <div className="text-xs opacity-80">apartment</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-lg text-emerald-400">{block.available}</div>
                          <div className="text-xs opacity-80">empty</div>
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-1 rounded-full transition-all duration-300 ${
                                block.trend === "up"
                                  ? "bg-emerald-400"
                                  : block.trend === "down"
                                    ? "bg-rose-400"
                                    : "bg-amber-400"
                              }`}
                              style={{ height: `${Math.random() * 12 + 8}px` }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onNextBlock}
          className={`${isDarkMode ? "bg-slate-700 border-slate-600 hover:bg-slate-600" : "bg-white border-gray-300 hover:bg-gray-50"} p-2 h-10 w-10 flex-shrink-0 shadow-md hover:shadow-lg transition-all duration-200 ${
            startIndex + itemsToShow >= blockData.length ? "opacity-0 pointer-events-none" : ""
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Compact Indicators */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {blockData.map((_, index) => (
          <button
            key={index}
            onClick={() => onSelectBlock(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === selectedBlockIndex
                ? `${theme.accent.replace("bg-", "bg-")} scale-125 shadow-md`
                : `${isDarkMode ? "bg-slate-600" : "bg-gray-300"} hover:scale-110`
            }`}
          />
        ))}
      </div>
    </div>
  )
}
