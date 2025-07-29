"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Grid,
  List,
  Table,
  Upload,
  Download,
  Plus,
  TrendingUp,
  TrendingDown,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import dynamic from "next/dynamic"

interface ApartmentUnit {
  code: string
  price: string
  priceUSD: string
  status: "available" | "sold" | "booked" | "special"
  area: string
  bedrooms: number
  bathrooms: number
  view: string
  block: string
}

interface Floor {
  number: number
  units: ApartmentUnit[]
  availableCount: number
  block: string
}

// Generate more mock data for testing scroll
const generateFloorData = (floorNumber: number, block: string) => {
  const units: ApartmentUnit[] = []
  const statuses: ("available" | "sold" | "booked" | "special")[] = ["available", "sold", "booked", "special"]
  const views = ["City", "River", "Garden", "Mountain", "Park"]

  // Generate 10 units per floor for horizontal scroll
  for (let i = 1; i <= 20; i++) {
    const unitCode = `L${floorNumber}${block}.${floorNumber}${String(i).padStart(2, "0")}`
    const basePrice = 2.5 + Math.random() * 1.5 // 2.5 - 4.0 tỷ
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const area = 65 + Math.floor(Math.random() * 25) // 65-90m²
    const bedrooms = Math.random() > 0.3 ? 2 : 3
    const bathrooms = bedrooms === 3 ? 2 : Math.random() > 0.5 ? 2 : 1
    const view = views[Math.floor(Math.random() * views.length)]

    units.push({
      code: unitCode,
      price: `${basePrice.toFixed(1)} tỷ`,
      priceUSD: `$${Math.floor(basePrice * 41000)}`,
      status,
      area: `${area}m²`,
      bedrooms,
      bathrooms,
      view,
      block,
    })
  }

  const availableCount = units.filter((unit) => unit.status === "available").length

  return {
    number: floorNumber,
    units,
    availableCount,
    block,
  }
}

// Generate extensive mock data - 30 floors for vertical scroll
const mockData: Floor[] = []

// Block M1 - floors 15-30
for (let floor = 30; floor >= 15; floor--) {
  mockData.push(generateFloorData(floor, "M1"))
}

// Block M2 - floors 10-25
for (let floor = 25; floor >= 10; floor--) {
  mockData.push(generateFloorData(floor, "M2"))
}

// Block M3 - floors 5-20
for (let floor = 20; floor >= 5; floor--) {
  mockData.push(generateFloorData(floor, "M3"))
}

// Replace the themes object with enhanced light theme contrast:
const themes = {
  dark: {
    // ... keep existing dark theme
    primary: "bg-slate-900",
    secondary: "bg-slate-800",
    card: "bg-slate-800",
    hover: "hover:bg-slate-700",
    textPrimary: "text-white",
    textSecondary: "text-slate-200",
    textMuted: "text-slate-400",
    border: "border-slate-600",
    borderLight: "border-slate-700",
    // ... rest of dark theme
    statusColors: {
      available:
        "bg-gradient-to-br from-emerald-600/90 to-emerald-700/90 hover:from-emerald-500/90 hover:to-emerald-600/90 border-2 border-emerald-400/50 text-white shadow-lg backdrop-blur-sm",
      sold: "bg-gradient-to-br from-rose-600/90 to-rose-700/90 hover:from-rose-500/90 hover:to-rose-600/90 border-2 border-rose-400/50 text-white shadow-lg backdrop-blur-sm",
      booked:
        "bg-gradient-to-br from-yellow-600/90 to-yellow-700/90 hover:from-yellow-500/90 hover:to-yellow-600/90 border-2 border-yellow-400/50 text-white shadow-lg backdrop-blur-sm",
      special:
        "bg-gradient-to-br from-gray-600/90 to-gray-700/90 hover:from-gray-500/90 hover:to-gray-600/90 border-2 border-gray-400/50 text-white shadow-lg backdrop-blur-sm",
    },

    statusBadges: {
      available: "bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 font-semibold",
      sold: "bg-rose-500/20 text-rose-200 border border-rose-400/30 font-semibold",
      booked: "bg-blue-500/20 text-blue-200 border border-blue-400/30 font-semibold",
      special: "bg-gray-500/20 text-gray-200 border border-gray-400/30 font-semibold",
    },

    statusIndicators: {
      available: "bg-emerald-400 shadow-lg shadow-emerald-400/50",
      sold: "bg-rose-400 shadow-lg shadow-rose-400/50",
      booked: "bg-yellow-400 shadow-lg shadow-yellow-400/50",
      special: "bg-gray-400 shadow-lg shadow-gray-400/50",
    },

    // Accent colors
    accent: "bg-yellow-600",
    accentHover: "hover:bg-yellow-700",
    accentText: "text-yellow-400",
  },

  light: {
    // Enhanced light theme with better contrast
    primary: "bg-gray-50",
    secondary: "bg-white",
    card: "bg-white",
    hover: "hover:bg-gray-100",

    textPrimary: "text-gray-900",
    textSecondary: "text-gray-800", // Darker for better contrast
    textMuted: "text-gray-600", // Darker for better visibility

    border: "border-gray-300", // Stronger borders
    borderLight: "border-gray-200",

    // Enhanced status colors with better contrast
    statusColors: {
      available:
        "bg-gradient-to-br from-emerald-200 to-emerald-300 hover:from-emerald-400 hover:to-emerald-400 border-2 border-emerald-400 text-emerald-900 shadow-lg", // Xanh lá cây
      sold:
        "bg-gradient-to-br from-rose-200 to-rose-300 hover:from-rose-400 hover:to-rose-400 border-2 border-rose-400 text-rose-900 shadow-lg", // Đỏ
      booked:
        "bg-gradient-to-br from-yellow-200 to-yellow-300 hover:from-yellow-400 hover:to-yellow-400 border-2 border-yellow-400 text-yellow-900 shadow-lg", // Vàng
      special:
        "bg-gradient-to-br from-gray-200 to-gray-300 hover:from-gray-400 hover:to-gray-400 border-2 border-gray-400 text-gray-900 shadow-lg", // Xám
    },
    

    statusBadges: {
      available: "bg-emerald-300 text-emerald-900 border border-emerald-400 font-semibold", // Xanh lá cây
      sold: "bg-rose-300 text-rose-900 border border-rose-400 font-semibold",               // Đỏ
      booked: "bg-yellow-300 text-yellow-900 border border-yellow-400 font-semibold",       // Vàng
      special: "bg-gray-300 text-gray-900 border border-gray-400 font-semibold",            // Xám
    },    

    statusIndicators: {
      available: "bg-emerald-600 shadow-lg shadow-emerald-600/40",
      sold: "bg-rose-600 shadow-lg shadow-rose-600/40",
      booked: "bg-yellow-600 shadow-lg shadow-yellow-600/40",
      special: "bg-gray-600 shadow-lg shadow-gray-600/40",
    },

    accent: "bg-blue-600",
    accentHover: "hover:bg-blue-700",
    accentText: "text-blue-600",
  },
}

const statusLabels = {
  available: "Còn trống",
  sold: "Đã bán",
  booked: "Đã đặt cọc",
  special: "Chưa setup",
}

const blockData = [
  { name: "M1", change: "+2.3%", total: 160, available: 89, sold: 71, trend: "up" },
  { name: "M2", change: "-1.2%", total: 160, available: 72, sold: 88, trend: "down" },
  { name: "M3", change: "+0.8%", total: 160, available: 95, sold: 65, trend: "up" },
  { name: "A1", change: "0.0%", total: 140, available: 75, sold: 65, trend: "neutral" },
  { name: "A2", change: "+1.5%", total: 150, available: 88, sold: 62, trend: "up" },
  { name: "B1", change: "+0.9%", total: 120, available: 67, sold: 53, trend: "up" },
  { name: "B2", change: "-0.5%", total: 130, available: 71, sold: 59, trend: "down" },
  { name: "C1", change: "+1.8%", total: 180, available: 108, sold: 72, trend: "up" },
]

export function ApartmentStackingPlan() {
  const [viewMode, setViewMode] = useState<"grid" | "list" | "excel">("excel")
  const [selectedUnit, setSelectedUnit] = useState<ApartmentUnit | null>(null)
  const [priceType, setPriceType] = useState("vnd")
  const [isDarkMode, setIsDarkMode] = useState(true)
  // Replace the existing slider state and functions with:
  const [startIndex, setStartIndex] = useState(0)
  const [currentTranslate, setCurrentTranslate] = useState(0)
  const itemWidth = 200
  const gap = 16
  const itemsToShow = 4

  // Set selected block based on startIndex (first visible item)
  const [selectedBlock, setSelectedBlock] = useState(blockData[0].name)

  // Update selected block when startIndex changes
  useEffect(() => {
    setSelectedBlock(blockData[startIndex].name)
  }, [startIndex])
  const sliderRef = useRef<HTMLDivElement>(null)
  // Replace the existing slider state and functions with:

  // Get current theme
  const theme = isDarkMode ? themes.dark : themes.light

  // Filter data based on selected block
  const filteredData = mockData.filter((floor) => floor.block === selectedBlock)
  const currentBlockData = blockData.find((block) => block.name === selectedBlock)

  // Enhanced block slider functions
  const nextBlock = () => {
    if (startIndex + itemsToShow < blockData.length) {
      const newIndex = startIndex + 1
      setStartIndex(newIndex)
      const newTranslate = currentTranslate - (itemWidth + gap)
      setCurrentTranslate(newTranslate)
    }
  }

  const prevBlock = () => {
    if (startIndex > 0) {
      const newIndex = startIndex - 1
      setStartIndex(newIndex)
      const newTranslate = currentTranslate + (itemWidth + gap)
      setCurrentTranslate(newTranslate)
    }
  }

  const selectBlock = (index: number) => {
    // Calculate how many steps to move
    const diff = index - startIndex
    if (diff !== 0) {
      const newTranslate = currentTranslate - diff * (itemWidth + gap)
      setCurrentTranslate(newTranslate)
      setStartIndex(index)
    }
  }

  return (
    <TooltipProvider>
      <div className={`min-h-screen ${theme.primary} ${theme.textPrimary} font-sans transition-colors duration-300`}>
        {/* Navigation - Ultra Compact */}
        <div className={`${theme.secondary} ${theme.borderLight} border-b px-6 py-1.5 shadow-sm`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {/* <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${theme.accent}`} />
                <span className={`${theme.textMuted} text-sm font-medium`}>Property Management</span>
              </div> */}
              <div className="flex items-center gap-1">
                <img src="https://cdn.primetek.ai/cdn/logo_dxfuture.png" alt="DX FutureTech Logo" className="h-6 object-contain" />
              </div>
              <div className="flex items-center gap-6">
              <span
                  className={`${theme.textMuted} text-sm font-medium hover:${theme.textSecondary} px-2 cursor-pointer transition-colors`}
                >
                  Stacking Plan
                </span>
                {/* <span
                  className={`${theme.accentText} text-sm font-semibold border-b-2 ${theme.accentText.replace("text-", "border-")} pb-1 px-2 cursor-pointer transition-colors`}
                >
                  Stacking Plan
                </span>
                <span
                  className={`${theme.textMuted} text-sm font-medium hover:${theme.textSecondary} px-2 cursor-pointer transition-colors`}
                >
                  Analytics
                </span>
                <span
                  className={`${theme.textMuted} text-sm font-medium hover:${theme.textSecondary} px-2 cursor-pointer transition-colors`}
                >
                  Customers
                </span>
                <span
                  className={`${theme.textMuted} text-sm font-medium hover:${theme.textSecondary} px-2 cursor-pointer transition-colors`}
                >
                  Contracts
                </span>
                <span
                  className={`${theme.textMuted} text-sm font-medium hover:${theme.textSecondary} px-2 cursor-pointer transition-colors`}
                >
                  Reports
                </span> */}
              </div>
            </div>

            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`${isDarkMode ? "bg-slate-700 border-slate-600 hover:bg-slate-600" : "bg-white border-gray-300 hover:bg-gray-50"} transition-colors shadow-sm h-8`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Enhanced Block Slider - Draggable */}
        <div className={`${theme.secondary} ${theme.borderLight} border-b px-6 py-4 overflow-hidden`}>
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={prevBlock}
              className={`${isDarkMode ? "bg-slate-700 border-slate-600 hover:bg-slate-600" : "bg-white border-gray-300 hover:bg-gray-50"} p-2 h-10 w-10 flex-shrink-0 shadow-md hover:shadow-lg transition-all duration-200 ${
                startIndex === 0 ? "opacity-0 pointer-events-none" : ""
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {/* Replace the slider container in the Block Slider section: */}
            <div
              ref={sliderRef}
              className="relative flex items-center justify-center overflow-hidden select-none"
              style={{ width: "864px" }} // 4 items * 200px + 3 gaps * 16px = 848px + padding
            >
              <div
                className="flex items-center gap-4 transition-transform duration-300 ease-out"
                style={{
                  transform: `translateX(${currentTranslate}px)`,
                  width: `${blockData.length * (itemWidth + gap)}px`,
                }}
              >
                {blockData.map((block, index) => {
                  // First visible item is active
                  const isActive = index === startIndex

                  return (
                    <div
                      key={`${block.name}-${index}`}
                      className={`flex-shrink-0 cursor-pointer transition-all duration-300 ${
                        isActive
                          ? `transform scale-110 z-20 ring-4 ring-blue-400/50`
                          : `transform scale-95 hover:scale-100`
                      }`}
                      style={{ width: `${itemWidth}px` }}
                      onClick={() => selectBlock(index)}
                    >
                      <div
                        className={`rounded-xl p-4 shadow-lg transition-all duration-300 ${
                          isActive
                            ? `${theme.accent} text-white shadow-2xl border-4 border-blue-300 ring-2 ring-blue-400/30`
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
                                {/* {block.change} */}
                              </span>
                              {/* {block.trend === "up" && <TrendingUp className="w-4 h-4 text-emerald-400" />}
                              {block.trend === "down" && <TrendingDown className="w-4 h-4 text-rose-400" />} */}
                              {/* {block.trend === "neutral" && (
                                <div className="w-4 h-4 border border-amber-400 rounded-sm"></div>
                              )} */}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-center">
                              <div className="font-bold text-lg">{block.total}</div>
                              <div className="text-xs opacity-80">căn</div>
                            </div>
                            <div className="text-center">
                              <div className="font-bold text-lg text-emerald-400">{block.available}</div>
                              <div className="text-xs opacity-80">trống</div>
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
              onClick={nextBlock}
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
                onClick={() => selectBlock(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === startIndex
                    ? `${theme.accent.replace("bg-", "bg-")} scale-125 shadow-md`
                    : `${isDarkMode ? "bg-slate-600" : "bg-gray-300"} hover:scale-110`
                }`}
              />
            ))}
          </div>
        </div>

        {/* Search & Controls Row - Ultra Compact */}
        <div className={`${theme.secondary} ${theme.borderLight} border-b px-6 py-1.5`}>
          <div className="flex items-center justify-between gap-4">
            {/* Left Side - Search & Selects */}
            <div className="flex items-center gap-3">
              <Select defaultValue="sunrise-city">
                <SelectTrigger
                  className={`w-44 h-8 ${isDarkMode ? "bg-slate-700 border-slate-600" : "bg-white border-gray-300"} text-sm shadow-sm`}
                >
                  <SelectValue placeholder="Chọn dự án" />
                </SelectTrigger>
                <SelectContent className={isDarkMode ? "bg-slate-700 border-slate-600" : "bg-white border-gray-300"}>
                  <SelectItem value="sunrise-city">Sunrise City</SelectItem>
                  <SelectItem value="golden-tower">Golden Tower</SelectItem>
                </SelectContent>
              </Select>

              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search units..."
                  className={`w-60 px-3 py-1.5 pl-9 text-sm rounded-lg h-8 ${
                    isDarkMode
                      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-colors`}
                />
                <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2">
                  <svg
                    className={`w-3.5 h-3.5 ${theme.textMuted}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              <Select defaultValue="vn">
                <SelectTrigger
                  className={`w-28 h-8 ${isDarkMode ? "bg-slate-700 border-slate-600" : "bg-white border-gray-300"} text-sm shadow-sm`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={isDarkMode ? "bg-slate-700 border-slate-600" : "bg-white border-gray-300"}>
                  <SelectItem value="vn">Vietnam</SelectItem>
                  <SelectItem value="intl">International</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceType} onValueChange={setPriceType}>
                <SelectTrigger
                  className={`w-32 h-8 ${isDarkMode ? "bg-slate-700 border-slate-600" : "bg-white border-gray-300"} text-sm shadow-sm`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={isDarkMode ? "bg-slate-700 border-slate-600" : "bg-white border-gray-300"}>
                  <SelectItem value="vnd">VND Price</SelectItem>
                  <SelectItem value="usd">USD Price</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Right Side - Import/Export */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className={`${isDarkMode ? "bg-slate-700 border-slate-600 hover:bg-slate-600" : "bg-white border-gray-300 hover:bg-gray-50"} text-sm shadow-sm h-8 px-3`}
              >
                <Upload className="w-3.5 h-3.5 mr-1.5" />
                Import
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`${isDarkMode ? "bg-slate-700 border-slate-600 hover:bg-slate-600" : "bg-white border-gray-300 hover:bg-gray-50"} text-sm shadow-sm h-8 px-3`}
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Status & View Toggle Row - Compact */}
        <div className={`${theme.secondary} ${theme.borderLight} border-b px-6 py-1.5`}>
          <div className="flex items-center justify-between">
            {/* Left Side - Status Legend */}
            <div className="flex items-center gap-5 text-sm">
              <span className={`${theme.textMuted} font-medium flex items-center gap-2`}>
                <div className="w-1 h-3 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                Status:
              </span>
              {Object.entries(statusLabels).map(([status, label]) => (
                <div key={status} className="flex items-center gap-1.5">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${theme.statusIndicators[status as keyof typeof theme.statusIndicators]}`}
                  />
                  <span className={`${theme.textSecondary} font-medium text-sm`}>{label}</span>
                </div>
              ))}
            </div>

            {/* Right Side - View Toggle */}
            <div
              className={`flex items-center gap-0.5 p-0.5 ${isDarkMode ? "bg-slate-700" : "bg-gray-100"} rounded-lg border ${isDarkMode ? "border-slate-600" : "border-gray-200"} shadow-sm`}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("excel")}
                className={`relative px-3 py-1.5 rounded-md font-medium text-sm transition-all duration-200 h-8 ${
                  viewMode === "excel"
                    ? `bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105 border-0`
                    : `bg-transparent ${isDarkMode ? "hover:bg-slate-600 text-slate-300 hover:text-white" : "hover:bg-white text-gray-600 hover:text-gray-900"} hover:shadow-sm`
                }`}
              >
                <Table className="w-3.5 h-3.5 mr-1.5" />
                Matrix
                {viewMode === "excel" && (
                  <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("list")}
                className={`relative px-3 py-1.5 rounded-md font-medium text-sm transition-all duration-200 h-8 ${
                  viewMode === "list"
                    ? `bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md transform scale-105 border-0`
                    : `bg-transparent ${isDarkMode ? "hover:bg-slate-600 text-slate-300 hover:text-white" : "hover:bg-white text-gray-600 hover:text-gray-900"} hover:shadow-sm`
                }`}
              >
                <List className="w-3.5 h-3.5 mr-1.5" />
                List
                {viewMode === "list" && (
                  <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`relative px-3 py-1.5 rounded-md font-medium text-sm transition-all duration-200 h-8 ${
                  viewMode === "grid"
                    ? `bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-md transform scale-105 border-0`
                    : `bg-transparent ${isDarkMode ? "hover:bg-slate-600 text-slate-300 hover:text-white" : "hover:bg-white text-gray-600 hover:text-gray-900"} hover:shadow-sm`
                }`}
              >
                <Grid className="w-3.5 h-3.5 mr-1.5" />
                Grid
                {viewMode === "grid" && (
                  <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content - Maximum Space */}
        {viewMode === "excel" ? (
          // Excel-style Stacking Plan with Fixed Headers
          <div className={`relative ${theme.primary} h-[calc(100vh-180px)] overflow-auto`}>
            <div className="min-w-max">
              {/* Fixed Header - Both Vertical and Horizontal Scroll */}
              <div className={`sticky top-0 z-30 ${theme.secondary} ${theme.borderLight} border-b shadow-sm`}>
                <div className="flex">
                  {/* Fixed Corner Cell */}
                  <div
                    className={`sticky left-0 z-40 ${theme.secondary} ${theme.border} border-r p-3 w-32 flex flex-col items-center justify-center`}
                  >
                    <div className={`font-semibold text-sm ${theme.textPrimary}`}>Floor</div>
                    <div className={`text-xs ${theme.textMuted} font-medium`}>Available</div>
                  </div>

                  {/* Apartment Headers */}
                  {filteredData[0]?.units.map((_, index) => (
                    <div
                      key={index}
                      className={`p-3 w-36 text-center ${theme.border} border-r last:border-r-0 ${theme.secondary} flex flex-col items-center justify-center min-w-[144px] max-w-[144px]`}
                    >
                      <div className={`font-semibold text-sm ${theme.textPrimary}`}>
                        Unit {String(index + 1).padStart(2, "0")}
                      </div>
                      <div className={`text-xs ${theme.textMuted} font-medium`}>
                        {index % 2 === 0 ? "East" : "West"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Table Body */}
              <div className={`divide-y ${theme.borderLight}`}>
                {filteredData.map((floor, floorIndex) => (
                  <div
                    key={`${floor.block}-${floor.number}`}
                    className={`flex min-h-[120px] ${isDarkMode ? "hover:bg-slate-700/30" : "hover:bg-gray-50/50"} transition-colors ${
                      floorIndex % 2 === 0
                        ? isDarkMode
                          ? "bg-slate-800/50"
                          : "bg-gray-50/30"
                        : isDarkMode
                          ? "bg-slate-900/30"
                          : "bg-white"
                    }`}
                  >
                    {/* Fixed Floor Column */}
                    <div
                      className={`sticky left-0 z-20 ${theme.secondary} ${theme.border} border-r p-3 w-32 flex flex-col items-center justify-center min-h-[120px]`}
                    >
                      <div className={`font-bold text-lg ${theme.textPrimary}`}>F{floor.number}</div>
                      <div className="text-xs text-emerald-500 font-medium">{floor.availableCount} units</div>
                      <div className={`text-xs ${theme.textMuted} font-medium`}>available</div>
                    </div>

                    {/* Apartment Units */}
                    {floor.units.map((unit) => (
                      <Dialog key={unit.code}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DialogTrigger asChild>
                              <div
                                className={`w-36 ${theme.border} border-r last:border-r-0 p-1 min-w-[144px] max-w-[144px] flex items-center justify-center`}
                              >
                                <div
                                  className={`w-full h-full cursor-pointer transition-all duration-300 ${theme.statusColors[unit.status]} relative group hover:shadow-2xl hover:scale-[1.02] hover:z-10 rounded-xl p-2 flex flex-col items-center justify-center`}
                                >
                                  <div className="text-center space-y-2 w-full">
                                    <div
                                      className={`font-mono text-xs font-bold ${isDarkMode ? "text-white/90" : "text-current"} tracking-wider`}
                                    >
                                      {unit.code}
                                    </div>
                                    <div
                                      className={`font-bold text-base ${isDarkMode ? "text-white" : "text-current"} drop-shadow-sm`}
                                    >
                                      {priceType === "vnd" ? unit.price : unit.priceUSD}
                                    </div>
                                    <div className="flex justify-center">
                                      <Badge
                                        className={`text-xs font-bold ${theme.statusBadges[unit.status]} px-3 py-1 shadow-sm`}
                                      >
                                        {unit.area}
                                      </Badge>
                                    </div>
                                  </div>
                                  {/* Enhanced Status indicator */}
                                  <div
                                    className={`absolute top-2 right-2 w-3 h-3 rounded-full ${theme.statusIndicators[unit.status]} animate-pulse`}
                                  />
                                  {/* Hover glow effect */}
                                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                              </div>
                            </DialogTrigger>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className={
                              isDarkMode
                                ? "text-white bg-slate-800 border-slate-600 shadow-lg"
                                : "bg-white border-gray-300 text-gray-900 shadow-lg"
                            }
                          >
                            <div className="text-sm space-y-1">
                              <div className="font-semibold">{unit.code}</div>
                              <div>Diện tích: {unit.area}</div>
                              <div>Phòng ngủ: {unit.bedrooms}</div>
                              <div>Phòng tắm: {unit.bathrooms}</div>
                              <div>View: {unit.view}</div>
                              <div>Trạng thái: {statusLabels[unit.status]}</div>
                            </div>
                          </TooltipContent>
                        </Tooltip>

                        <DialogContent
                          className={`${isDarkMode ? "bg-slate-800 border-slate-600 text-white" : "bg-white border-gray-300 text-gray-900"} shadow-xl`}
                        >
                          <DialogHeader>
                            <DialogTitle className="text-lg font-semibold">Chi tiết căn hộ {unit.code}</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-6 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className={`text-sm font-medium ${theme.textMuted}`}>Mã căn hộ</label>
                                <div className="font-mono font-semibold mt-1">{unit.code}</div>
                              </div>
                              <div>
                                <label className={`text-sm font-medium ${theme.textMuted}`}>Trạng thái</label>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className={`w-3 h-3 rounded-full ${theme.statusIndicators[unit.status]}`} />
                                  <span className="font-medium">{statusLabels[unit.status]}</span>
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className={`text-sm font-medium ${theme.textMuted}`}>Giá VND</label>
                                <div className="font-bold text-lg mt-1">{unit.price}</div>
                              </div>
                              <div>
                                <label className={`text-sm font-medium ${theme.textMuted}`}>Giá USD</label>
                                <div className="font-bold text-lg mt-1">{unit.priceUSD}</div>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <label className={`text-sm font-medium ${theme.textMuted}`}>Diện tích</label>
                                <div className="font-semibold mt-1">{unit.area}</div>
                              </div>
                              <div>
                                <label className={`text-sm font-medium ${theme.textMuted}`}>Phòng ngủ</label>
                                <div className="font-semibold mt-1">{unit.bedrooms}</div>
                              </div>
                              <div>
                                <label className={`text-sm font-medium ${theme.textMuted}`}>Phòng tắm</label>
                                <div className="font-semibold mt-1">{unit.bathrooms}</div>
                              </div>
                            </div>
                            <div>
                              <label className={`text-sm font-medium ${theme.textMuted}`}>Hướng view</label>
                              <div className="font-semibold mt-1">{unit.view}</div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : viewMode === "list" ? (
          // List View
          <div className={`${theme.primary} h-[calc(100vh-180px)] overflow-auto`}>
            <div className={`sticky top-0 z-20 ${theme.secondary} ${theme.borderLight} border-b px-6 py-4 shadow-sm`}>
              <div className={`grid grid-cols-12 gap-4 text-sm font-medium ${theme.textMuted}`}>
                <div className="col-span-2">Unit Code</div>
                <div className="col-span-1 text-right">Price</div>
                <div className="col-span-1 text-center">Floor</div>
                <div className="col-span-2 text-center">Area</div>
                <div className="col-span-2 text-center">Status</div>
                <div className="col-span-2 text-center">View</div>
                <div className="col-span-2 text-center">Actions</div>
              </div>
            </div>

            <div className={`divide-y ${theme.borderLight}`}>
              {filteredData.flatMap((floor) =>
                floor.units.map((unit) => (
                  <div
                    key={unit.code}
                    className={`px-6 py-4 ${isDarkMode ? "hover:bg-slate-700/20" : "hover:bg-gray-50/50"} transition-colors`}
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-2 flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${
                            isDarkMode ? "bg-slate-700 text-white" : "bg-gray-100 text-gray-900"
                          } ${theme.border} border shadow-sm relative`}
                        >
                          {unit.code.slice(-2)}
                          <div
                            className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${theme.statusIndicators[unit.status]} border-2 ${isDarkMode ? "border-slate-800" : "border-white"}`}
                          />
                        </div>
                        <div>
                          <div className={`${theme.textPrimary} font-semibold text-sm`}>{unit.code}</div>
                          <div className={`${theme.textMuted} text-xs font-medium`}>
                            {unit.bedrooms}PN • {unit.bathrooms}WC
                          </div>
                        </div>
                      </div>

                      <div className="col-span-1 text-right">
                        <div className={`${theme.textPrimary} font-bold`}>
                          {priceType === "vnd" ? unit.price : unit.priceUSD}
                        </div>
                      </div>

                      <div className="col-span-1 text-center">
                        <div className={`${theme.textPrimary} font-bold`}>{floor.number}</div>
                      </div>

                      <div className="col-span-2 text-center">
                        <div className={`${theme.textPrimary} font-semibold`}>{unit.area}</div>
                      </div>

                      <div className="col-span-2 text-center">
                        <Badge className={`${theme.statusBadges[unit.status]} font-medium px-3 py-1`}>
                          {statusLabels[unit.status]}
                        </Badge>
                      </div>

                      <div className="col-span-2 text-center">
                        <div className={`${theme.textMuted} font-medium`}>{unit.view}</div>
                      </div>

                      <div className="col-span-2 text-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className={`${isDarkMode ? "bg-slate-700 border-slate-600 hover:bg-slate-600" : "bg-white border-gray-300 hover:bg-gray-50"} shadow-sm font-medium`}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Chi tiết
                            </Button>
                          </DialogTrigger>
                          <DialogContent
                            className={`${isDarkMode ? "bg-slate-800 border-slate-600 text-white" : "bg-white border-gray-300 text-gray-900"} shadow-xl`}
                          >
                            <DialogHeader>
                              <DialogTitle className="text-lg font-semibold">Chi tiết căn hộ {unit.code}</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-6 mt-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className={`text-sm font-medium ${theme.textMuted}`}>Mã căn hộ</label>
                                  <div className="font-mono font-semibold mt-1">{unit.code}</div>
                                </div>
                                <div>
                                  <label className={`text-sm font-medium ${theme.textMuted}`}>Trạng thái</label>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className={`w-3 h-3 rounded-full ${theme.statusIndicators[unit.status]}`} />
                                    <span className="font-medium">{statusLabels[unit.status]}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className={`text-sm font-medium ${theme.textMuted}`}>Giá VND</label>
                                  <div className="font-bold text-lg mt-1">{unit.price}</div>
                                </div>
                                <div>
                                  <label className={`text-sm font-medium ${theme.textMuted}`}>Giá USD</label>
                                  <div className="font-bold text-lg mt-1">{unit.priceUSD}</div>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                )),
              )}
            </div>
          </div>
        ) : (
          // Grid View
          <div className={`p-6 ${theme.primary} h-[calc(100vh-180px)] overflow-auto`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
              {filteredData.flatMap((floor) =>
                floor.units.map((unit) => (
                  <Dialog key={unit.code}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                          <div
                            className={`${theme.statusColors[unit.status]} rounded-xl p-4 cursor-pointer transition-all duration-300 ${isDarkMode ? "shadow-xl hover:shadow-2xl" : "shadow-md hover:shadow-lg"} relative group hover:scale-[1.03] hover:z-10`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${theme.statusIndicators[unit.status]}`} />
                                <span
                                  className={`text-xs font-medium ${isDarkMode ? "text-white/80" : "text-current"}`}
                                >
                                  Tầng {floor.number}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-6 w-6 p-0 ${isDarkMode ? "text-white/60 hover:text-white" : "text-current/60 hover:text-current"} opacity-0 group-hover:opacity-100 transition-opacity`}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>

                            <div className="mb-3">
                              <div
                                className={`font-mono text-sm font-bold ${isDarkMode ? "text-white" : "text-current"} mb-1`}
                              >
                                {unit.code}
                              </div>
                              <div
                                className={`text-xs font-medium ${isDarkMode ? "text-white/70" : "text-current/70"}`}
                              >
                                {unit.area} • {unit.bedrooms}PN • {unit.bathrooms}WC
                              </div>
                            </div>

                            <div className="mb-3">
                              <div className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-current"}`}>
                                {priceType === "vnd" ? unit.price : unit.priceUSD}
                              </div>
                              <Badge className={`${theme.statusBadges[unit.status]} text-xs font-medium mt-1`}>
                                {statusLabels[unit.status]}
                              </Badge>
                            </div>

                            <div className={`text-xs font-medium ${isDarkMode ? "text-white/70" : "text-current/70"}`}>
                              <div>View: {unit.view}</div>
                            </div>

                            {/* Hover glow effect */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        </DialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className={
                          isDarkMode
                            ? "bg-slate-800 border-slate-600 shadow-lg"
                            : "bg-white border-gray-300 text-gray-900 shadow-lg"
                        }
                      >
                        <div className="text-sm space-y-1">
                          <div className="font-semibold">{unit.code}</div>
                          <div>Diện tích: {unit.area}</div>
                          <div>Phòng ngủ: {unit.bedrooms}</div>
                          <div>Phòng tắm: {unit.bathrooms}</div>
                          <div>View: {unit.view}</div>
                          <div>Trạng thái: {statusLabels[unit.status]}</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>

                    <DialogContent
                      className={`${isDarkMode ? "bg-slate-800 border-slate-600 text-white" : "bg-white border-gray-300 text-gray-900"} shadow-xl`}
                    >
                      <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">Chi tiết căn hộ {unit.code}</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-6 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={`text-sm font-medium ${theme.textMuted}`}>Mã căn hộ</label>
                            <div className="font-mono font-semibold mt-1">{unit.code}</div>
                          </div>
                          <div>
                            <label className={`text-sm font-medium ${theme.textMuted}`}>Trạng thái</label>
                            <div className="flex items-center gap-2 mt-1">
                              <div className={`w-3 h-3 rounded-full ${theme.statusIndicators[unit.status]}`} />
                              <span className="font-medium">{statusLabels[unit.status]}</span>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={`text-sm font-medium ${theme.textMuted}`}>Giá VND</label>
                            <div className="font-bold text-lg mt-1">{unit.price}</div>
                          </div>
                          <div>
                            <label className={`text-sm font-medium ${theme.textMuted}`}>Giá USD</label>
                            <div className="font-bold text-lg mt-1">{unit.priceUSD}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className={`text-sm font-medium ${theme.textMuted}`}>Diện tích</label>
                            <div className="font-semibold mt-1">{unit.area}</div>
                          </div>
                          <div>
                            <label className={`text-sm font-medium ${theme.textMuted}`}>Phòng ngủ</label>
                            <div className="font-semibold mt-1">{unit.bedrooms}</div>
                          </div>
                          <div>
                            <label className={`text-sm font-medium ${theme.textMuted}`}>Phòng tắm</label>
                            <div className="font-semibold mt-1">{unit.bathrooms}</div>
                          </div>
                        </div>
                        <div>
                          <label className={`text-sm font-medium ${theme.textMuted}`}>Hướng view</label>
                          <div className="font-semibold mt-1">{unit.view}</div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )),
              )}
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className={`${theme.borderLight} border-t ${theme.secondary} p-6 shadow-sm`}>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-8">
              <div className="font-medium">
                Tổng căn: <span className={`font-bold ${theme.accentText}`}>{currentBlockData?.total || 0}</span>
              </div>
              <div className="font-medium">
                Còn trống: <span className="font-bold text-emerald-500">{currentBlockData?.available || 0}</span>
              </div>
              <div className="font-medium">
                Đã bán: <span className="font-bold text-rose-500">{currentBlockData?.sold || 0}</span>
              </div>
              <div className="font-medium">
                Block hiện tại: <span className={`font-bold ${theme.accentText}`}>BLOCK {selectedBlock}</span>
              </div>
              <div className="font-medium">
                Số tầng: <span className="font-bold text-amber-500">{filteredData.length}</span>
              </div>
            </div>
            <div className={`${theme.textMuted} font-medium`}>
              Cập nhật lần cuối: {new Date().toLocaleString("vi-VN")}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}


export const DynamicApartmentStackingPlan = dynamic(
  () => Promise.resolve(ApartmentStackingPlan),
  { ssr: false }
)