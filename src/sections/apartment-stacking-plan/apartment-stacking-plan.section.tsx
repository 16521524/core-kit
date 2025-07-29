"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Grid, List, Table, Upload, Download, Sun, Moon } from "lucide-react"
import dynamic from "next/dynamic"
import { BlockSlider } from "../block-slider"
import { UnitCard } from "../unit-card"

interface ApartmentUnit {
  code: string
  price: string
  priceUSD: string
  status: "available" | "sold" | "booked" | "unavailable"
  area: string
  bedrooms: number
  bathrooms: number
  view: string
  block: string
  isApproved?: boolean
  isLocked?: boolean
  isBlocked?: boolean
  buyer?: {
    name: string
    phone: string
    createDate: string
    buyerStatus: "interested" | "deposited" | "contracted" | "completed"
  }
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
  const statuses: ("available" | "sold" | "booked" | "unavailable")[] = ["available", "sold", "booked", "unavailable"]
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
      isApproved: Math.random() > 0.5,
      isLocked: Math.random() > 0.7,
      isBlocked: Math.random() > 0.8,
      buyer:
        Math.random() > 0.6
          ? {
              name: "Nguyễn Văn A",
              phone: "0909090909",
              createDate: new Date().toLocaleDateString(),
              buyerStatus: Math.random() > 0.5 ? "deposited" : "interested",
            }
          : undefined,
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

// Block B1 - floors 15-30
for (let floor = 30; floor >= 15; floor--) {
  mockData.push(generateFloorData(floor, "B1"))
}

// Block B2 - floors 15-30
for (let floor = 30; floor >= 15; floor--) {
  mockData.push(generateFloorData(floor, "B2"))
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
        "bg-gradient-to-br from-amber-600/90 to-amber-700/90 hover:from-amber-500/90 hover:to-amber-600/90 border-2 border-amber-400/50 text-white shadow-lg backdrop-blur-sm",
      unavailable:
        "bg-gradient-to-br from-gray-600/90 to-gray-700/90 hover:from-gray-500/90 hover:to-gray-600/90 border-2 border-gray-400/50 text-white shadow-lg backdrop-blur-sm",
    },

    statusBadges: {
      available: "bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 font-semibold",
      sold: "bg-rose-500/20 text-rose-200 border border-rose-400/30 font-semibold",
      booked: "bg-amber-500/20 text-amber-200 border border-amber-400/30 font-semibold",
      unavailable: "bg-gray-500/20 text-gray-200 border border-gray-400/30 font-semibold",
    },

    statusIndicators: {
      available: "bg-emerald-400 shadow-lg shadow-emerald-400/50",
      sold: "bg-rose-400 shadow-lg shadow-rose-400/50",
      booked: "bg-amber-400 shadow-lg shadow-amber-400/50",
      unavailable: "bg-gray-400 shadow-lg shadow-gray-400/50",
    },

    // Accent colors
    accent: "bg-blue-600",
    accentHover: "hover:bg-blue-700",
    accentText: "text-blue-400",
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
        "bg-gradient-to-br from-emerald-200 to-emerald-300 hover:from-emerald-300 hover:to-emerald-400 border-2 border-emerald-400 text-emerald-900 shadow-lg",
      sold: "bg-gradient-to-br from-rose-200 to-rose-300 hover:from-rose-300 hover:to-rose-400 border-2 border-rose-400 text-rose-900 shadow-lg",
      booked:
        "bg-gradient-to-br from-amber-200 to-amber-300 hover:from-amber-300 hover:to-amber-400 border-2 border-amber-400 text-amber-900 shadow-lg",
      unavailable:
        "bg-gradient-to-br from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 border-2 border-gray-400 text-gray-900 shadow-lg",
    },

    statusBadges: {
      available: "bg-emerald-300 text-emerald-900 border border-emerald-400 font-semibold",
      sold: "bg-rose-300 text-rose-900 border border-rose-400 font-semibold",
      booked: "bg-amber-300 text-amber-900 border border-amber-400 font-semibold",
      unavailable: "bg-gray-300 text-gray-900 border border-gray-400 font-semibold",
    },

    statusIndicators: {
      available: "bg-emerald-600 shadow-lg shadow-emerald-600/40",
      sold: "bg-rose-600 shadow-lg shadow-rose-600/40",
      booked: "bg-amber-600 shadow-lg shadow-amber-600/40",
      unavailable: "bg-gray-600 shadow-lg shadow-gray-600/40",
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
  unavailable: "Chưa mở bán",
}

const blockData = [
  { name: "A1", change: "0.0%", total: 140, available: 75, sold: 65, trend: "neutral" as const },
  { name: "A2", change: "+1.5%", total: 150, available: 88, sold: 62, trend: "up" as const },
  { name: "B1", change: "+0.9%", total: 120, available: 67, sold: 53, trend: "up" as const },
  { name: "B2", change: "-0.5%", total: 130, available: 71, sold: 59, trend: "down" as const },
  { name: "M1", change: "+2.3%", total: 160, available: 89, sold: 71, trend: "up" as const },
  { name: "M2", change: "-1.2%", total: 160, available: 72, sold: 88, trend: "down" as const },
  { name: "M3", change: "+0.8%", total: 160, available: 95, sold: 65, trend: "up" as const },
  { name: "C1", change: "+1.8%", total: 180, available: 108, sold: 72, trend: "up" as const },
]

export function ApartmentStackingPlan() {
  const [viewMode, setViewMode] = useState<"grid" | "list" | "excel">("excel")
  const [priceType, setPriceType] = useState("vnd")
  const [isDarkMode, setIsDarkMode] = useState(true)
  // Replace the existing slider state and functions with:
  const [startIndex, setStartIndex] = useState(0)
  const [currentTranslate, setCurrentTranslate] = useState(0)
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(0) // Track selected item
  const itemWidth = 200
  const gap = 16
  const itemsToShow = 4

  // Set selected block based on selectedBlockIndex
  const selectedBlock = blockData[selectedBlockIndex].name

  // When slider moves, auto-select the first visible item
  useEffect(() => {
    setSelectedBlockIndex(startIndex)
  }, [startIndex])

  // Get current theme
  const theme = isDarkMode ? themes.dark : themes.light

  // Filter data based on selected block
  const filteredData = mockData.filter((floor) => floor.block === selectedBlock)
  const currentBlockData = blockData.find((block) => block.name === selectedBlock)

  // Enhanced block slider functions - ONLY move slider, don't change selection
  const nextBlock = () => {
    if (startIndex + itemsToShow < blockData.length) {
      const newIndex = startIndex + 1
      setStartIndex(newIndex)
      const newTranslate = currentTranslate - (itemWidth + gap)
      setCurrentTranslate(newTranslate)
      // Auto-select first visible item
      setSelectedBlockIndex(newIndex)
    }
  }

  const prevBlock = () => {
    if (startIndex > 0) {
      const newIndex = startIndex - 1
      setStartIndex(newIndex)
      const newTranslate = currentTranslate + (itemWidth + gap)
      setCurrentTranslate(newTranslate)
      // Auto-select first visible item
      setSelectedBlockIndex(newIndex)
    }
  }

  // Select block function - ONLY change selection, don't move slider
  const selectBlock = (index: number) => {
    setSelectedBlockIndex(index)
  }

  return (
    <TooltipProvider>
      <div className={`min-h-screen ${theme.primary} ${theme.textPrimary} font-sans transition-colors duration-300`}>
        {/* Navigation - Ultra Compact */}
        <div className={`${theme.secondary} ${theme.borderLight} border-b px-6 py-1.5 shadow-sm`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${theme.accent}`} />
                <span className={`${theme.textMuted} text-sm font-medium`}>Property Management</span>
              </div>
              <div className="flex items-center gap-6">
                <span
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
                </span>
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

        {/* Block Slider */}
        <BlockSlider
          blockData={blockData}
          selectedBlockIndex={selectedBlockIndex}
          startIndex={startIndex}
          currentTranslate={currentTranslate}
          itemWidth={itemWidth}
          gap={gap}
          itemsToShow={itemsToShow}
          theme={theme}
          isDarkMode={isDarkMode}
          onPrevBlock={prevBlock}
          onNextBlock={nextBlock}
          onSelectBlock={selectBlock}
        />

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
                Excel
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
                      <UnitCard
                        key={unit.code}
                        unit={unit}
                        floor={floor}
                        theme={theme}
                        isDarkMode={isDarkMode}
                        priceType={priceType}
                        statusLabels={statusLabels}
                        viewMode="excel"
                      />
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
                  <UnitCard
                    key={unit.code}
                    unit={unit}
                    floor={floor}
                    theme={theme}
                    isDarkMode={isDarkMode}
                    priceType={priceType}
                    statusLabels={statusLabels}
                    viewMode="list"
                  />
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
                  <UnitCard
                    key={unit.code}
                    unit={unit}
                    floor={floor}
                    theme={theme}
                    isDarkMode={isDarkMode}
                    priceType={priceType}
                    statusLabels={statusLabels}
                    viewMode="grid"
                  />
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