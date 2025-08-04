"use client"

import { useState, useEffect } from "react"
import { Grid, List, Table, Upload, Download, Sun, Moon } from "lucide-react"
import dynamic from "next/dynamic"
import { BlockSlider, LoadingSkeleton, UnitCard } from "./components"
import { useApartmentData } from "./hooks/use-partment-data"
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, TooltipProvider } from "@/components"

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
  units: (ApartmentUnit | null)[]
  availableCount: number
  block: string
  floorString?: string
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
    borderLightRow: "divide-slate-700",
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
    borderLightRow: "divide-slate-200", 

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
  available: "Available",
  sold: "Sold",
  booked: "Booked",
  unavailable: "Unavailable",
}

export function ApartmentStackingPlan() {
  const [viewMode, setViewMode] = useState<"grid" | "list" | "excel">("excel")
  const [priceType, setPriceType] = useState("vnd")
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Use the new apartment data hook
  const {
    floors: filteredData,
    blockData,
    selectedProject,
    selectedBlock,
    projects,
    blocks,
    blockMetadata,
    loading,
    error,
    selectedProjectId,
    selectedBlockId,
    setSelectedProjectId,
    setSelectedBlockId,
  } = useApartmentData()

  // Add debug logging
  console.log("🎯 Main Component Debug:")
  console.log("- filteredData.length:", filteredData.length)
  console.log("- blockData.length:", blockData.length)
  console.log("- projects.length:", projects.length)
  console.log("- blocks.length:", blocks.length)
  console.log("- blockMetadata:", blockMetadata)
  console.log("- loading:", loading)
  console.log("- selectedProjectId:", selectedProjectId)
  console.log("- selectedBlockId:", selectedBlockId)

  // Simplified block selection - just track index
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(0)

  // Update selected block when blocks change or when slider selection changes
  useEffect(() => {
    if (blocks.length > 0 && selectedBlockIndex < blocks.length) {
      setSelectedBlockId(blocks[selectedBlockIndex].id)
    }
  }, [selectedBlockIndex, blocks, setSelectedBlockId])

  // Get current theme
  const theme = isDarkMode ? themes.dark : themes.light

  // Show loading state with skeleton ONLY for initial load
  if (loading.overall && !projects.length) {
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
                {/* <div className="flex items-center gap-6">
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
                </div> */}
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

          {/* Slider Skeleton for initial load */}
          <BlockSlider
            blockData={[]}
            selectedBlockIndex={0}
            theme={theme}
            isDarkMode={isDarkMode}
            onSelectBlock={() => {}}
            loading={true}
          />

          {/* Search & Controls Row - Skeleton */}
          <div className={`${theme.secondary} ${theme.borderLight} border-b px-6 py-1.5`}>
            <div className="flex items-center justify-between gap-4">
              {/* Left Side - Skeleton controls */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-44 h-8 rounded ${isDarkMode ? "bg-slate-700 animate-pulse" : "bg-gray-200 animate-pulse"}`}
                />
                <div
                  className={`w-60 h-8 rounded ${isDarkMode ? "bg-slate-700 animate-pulse" : "bg-gray-200 animate-pulse"}`}
                />
                <div
                  className={`w-28 h-8 rounded ${isDarkMode ? "bg-slate-700 animate-pulse" : "bg-gray-200 animate-pulse"}`}
                />
                <div
                  className={`w-32 h-8 rounded ${isDarkMode ? "bg-slate-700 animate-pulse" : "bg-gray-200 animate-pulse"}`}
                />
              </div>

              {/* Right Side - Skeleton buttons */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-20 h-8 rounded ${isDarkMode ? "bg-slate-700 animate-pulse" : "bg-gray-200 animate-pulse"}`}
                />
                <div
                  className={`w-20 h-8 rounded ${isDarkMode ? "bg-slate-700 animate-pulse" : "bg-gray-200 animate-pulse"}`}
                />
              </div>
            </div>
          </div>

          {/* Status & View Toggle Row - Skeleton */}
          <div className={`${theme.secondary} ${theme.borderLight} border-b px-6 py-1.5`}>
            <div className="flex items-center justify-between">
              {/* Left Side - Status skeleton */}
              <div className="flex items-center gap-5">
                <div
                  className={`w-16 h-4 rounded ${isDarkMode ? "bg-slate-700 animate-pulse" : "bg-gray-200 animate-pulse"}`}
                />
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${isDarkMode ? "bg-slate-700 animate-pulse" : "bg-gray-200 animate-pulse"}`}
                    />
                    <div
                      className={`w-16 h-4 rounded ${isDarkMode ? "bg-slate-700 animate-pulse" : "bg-gray-200 animate-pulse"}`}
                    />
                  </div>
                ))}
              </div>

              {/* Right Side - View toggle skeleton */}
              <div
                className={`flex items-center gap-0.5 p-0.5 ${isDarkMode ? "bg-slate-700" : "bg-gray-100"} rounded-lg`}
              >
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-16 h-8 rounded ${isDarkMode ? "bg-slate-600 animate-pulse" : "bg-gray-200 animate-pulse"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Content Skeleton */}
          <LoadingSkeleton viewMode={viewMode} theme={theme} isDarkMode={isDarkMode} />
        </div>
      </TooltipProvider>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className={`min-h-screen ${theme.primary} ${theme.textPrimary} flex items-center justify-center`}>
        <div className="text-center">
          <div className="text-red-500 mb-4">Lỗi tải dữ liệu: {error}</div>
          <div>Đang sử dụng dữ liệu mẫu...</div>
        </div>
      </div>
    )
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
                <span className={`${theme.textMuted} text-sm font-medium`}>Stacking plan</span>
              </div>
              {/* <div className="flex items-center gap-6">
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
              </div> */}
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

        {/* Block Slider - With specific loading state */}
        <BlockSlider
          blockData={blockData.map((block) => ({
            ...block,
            booked: Math.floor(Math.random() * 20), // Mock booked data
            unavailable: block.total - block.available - block.sold,
            change: `${Math.random() > 0.5 ? "+" : ""}${(Math.random() * 4 - 2).toFixed(1)}%`,
            trend: Math.random() > 0.6 ? "up" : Math.random() > 0.3 ? "down" : "neutral",
          }))}
          selectedBlockIndex={selectedBlockIndex}
          theme={theme}
          isDarkMode={isDarkMode}
          onSelectBlock={setSelectedBlockIndex}
          loading={loading.slider}
        />

        {/* Search & Controls Row - Ultra Compact - Show skeleton during initial load */}
        <div className={`${theme.secondary} ${theme.borderLight} border-b px-6 py-1.5`}>
          {loading.overall && !projects.length ? (
            <div className="flex items-center justify-between gap-4">
              {/* Left Side - Skeleton controls */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-44 h-8 rounded ${isDarkMode ? "bg-slate-700 animate-pulse" : "bg-gray-200 animate-pulse"}`}
                />
                <div
                  className={`w-60 h-8 rounded ${isDarkMode ? "bg-slate-700 animate-pulse" : "bg-gray-200 animate-pulse"}`}
                />
                <div
                  className={`w-28 h-8 rounded ${isDarkMode ? "bg-slate-700 animate-pulse" : "bg-gray-200 animate-pulse"}`}
                />
                <div
                  className={`w-32 h-8 rounded ${isDarkMode ? "bg-slate-700 animate-pulse" : "bg-gray-200 animate-pulse"}`}
                />
              </div>

              {/* Right Side - Skeleton buttons */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-20 h-8 rounded ${isDarkMode ? "bg-slate-700 animate-pulse" : "bg-gray-200 animate-pulse"}`}
                />
                <div
                  className={`w-20 h-8 rounded ${isDarkMode ? "bg-slate-700 animate-pulse" : "bg-gray-200 animate-pulse"}`}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              {/* Left Side - Search & Selects */}
              <div className="flex items-center gap-3">
                <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                  <SelectTrigger
                    className={`w-44 h-8 ${isDarkMode ? "bg-slate-700 border-slate-600" : "bg-white border-gray-300"} text-sm shadow-sm`}
                  >
                    <SelectValue placeholder="Chọn Project" />
                  </SelectTrigger>
                  <SelectContent className={isDarkMode ? "bg-slate-700 border-slate-600" : "bg-white border-gray-300"}>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Search Input */}
                {/* <div className="relative">
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
                </Select> */}
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
          )}
        </div>

        {/* Status & View Toggle Row - Compact - Show skeleton during initial load */}
        <div className={`${theme.secondary} ${theme.borderLight} border-b px-6 py-1.5`}>
          {loading.overall && !projects.length ? (
            <div className="flex items-center justify-between">
              {/* Left Side - Status skeleton */}
              <div className="flex items-center gap-5">
                <div
                  className={`w-16 h-4 rounded ${isDarkMode ? "bg-slate-700 animate-pulse" : "bg-gray-200 animate-pulse"}`}
                />
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${isDarkMode ? "bg-slate-700 animate-pulse" : "bg-gray-200 animate-pulse"}`}
                    />
                    <div
                      className={`w-16 h-4 rounded ${isDarkMode ? "bg-slate-700 animate-pulse" : "bg-gray-200 animate-pulse"}`}
                    />
                  </div>
                ))}
              </div>

              {/* Right Side - View toggle skeleton */}
              <div
                className={`flex items-center gap-0.5 p-0.5 ${isDarkMode ? "bg-slate-700" : "bg-gray-100"} rounded-lg`}
              >
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-16 h-8 rounded ${isDarkMode ? "bg-slate-600 animate-pulse" : "bg-gray-200 animate-pulse"}`}
                  />
                ))}
              </div>
            </div>
          ) : (
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
                  {/* Grid */}
                  {/* {viewMode === "excel" && (
                    <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                  )} */}
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
                  {/* List */}
                  {/* {viewMode === "list" && (
                    <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  )} */}
                </Button>

                {/* <Button
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
                </Button> */}
              </div>
            </div>
          )}
        </div>

        {/* Main Content - Show skeleton only when content is loading AND no data */}
        {loading.content && filteredData.length === 0 ? (
          <LoadingSkeleton viewMode={viewMode} theme={theme} isDarkMode={isDarkMode} />
        ) : viewMode === "excel" ? (
          // Excel-style Stacking Plan with Fixed Headers
          <div className={`relative ${theme.primary} h-[calc(100vh-375px)] overflow-auto`}>
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

                  {/* Unit Headers based on metadata */}
                  {blockMetadata?.unit_numbers.map((unitInfo, index) => (
                    <div
                      key={`${unitInfo.number}-${index}`}
                      className={`p-3 w-28 text-center ${theme.border} border-r last:border-r-0 ${theme.secondary} flex flex-col items-center justify-center min-w-[112px] max-w-[112px]`}
                    >
                      <div className={`font-semibold text-sm ${theme.textPrimary}`}>{unitInfo.number}</div>
                      <div className={`text-xs ${theme.textMuted} font-medium`}>{unitInfo.direction}</div>
                    </div>
                  )) ||
                    // Fallback hea1ders if no metadata
                    Array.from({ length: 12 }).map((_, index) => (
                      <div
                        key={`fallback-${index}`}
                        className={`p-3 w-28 text-center ${theme.border} border-r last:border-r-0 ${theme.secondary} flex flex-col items-center justify-center min-w-[112px] max-w-[112px]`}
                      >
                        <div className={`font-semibold text-sm ${theme.textPrimary}`}>
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <div className={`text-xs ${theme.textMuted} font-medium`}>
                          {index % 2 === 0 ? "East" : "West"}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Table Body */}
              <div className={`divide-y ${theme.borderLightRow}`}>
                {filteredData.map((floor, floorIndex) => (
                  <div
                    key={`${floor.block}-${floor.number}`}
                    className={`flex min-h-[110px] ${isDarkMode ? "hover:bg-slate-700/30" : "hover:bg-gray-50/50"} transition-colors ${
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
                      className={`sticky left-0 z-20 ${theme.secondary} ${theme.border} border-r p-3 w-32 flex flex-col items-center justify-center min-h-[110px]`}
                    >
                      <div className={`font-bold text-lg ${theme.textPrimary}`}>
                        {floor.floorString || floor.number}
                      </div>
                      <div className="text-xs text-emerald-500 font-medium">{floor.availableCount} units</div>
                      <div className={`text-xs ${theme.textMuted} font-medium`}>available</div>
                    </div>

                    {/* Apartment Units */}
                    {floor.units.map((unit, index) => (
                      <UnitCard
                        key={unit?.code || `empty-${floor.number}-${index}`}
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
          <div className={`${theme.primary} h-[calc(100vh-275px)] overflow-auto`}>
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

            <div className={`divide-y ${theme.borderLightRow}`}>
              {filteredData.flatMap((floor) =>
                floor.units
                  .filter((unit) => unit !== null)
                  .map((unit) => (
                    <UnitCard
                      key={unit!.code}
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
          <div className={`p-6 ${theme.primary} h-[calc(100vh-275px)] overflow-auto`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
              {filteredData.flatMap((floor) =>
                floor.units
                  .filter((unit) => unit !== null)
                  .map((unit) => (
                    <UnitCard
                      key={unit!.code}
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
                Project: <span className={`font-bold ${theme.accentText}`}>{selectedProject?.name || "N/A"}</span>
              </div>
              <div className="font-medium">
                Total: <span className={`font-bold ${theme.accentText}`}>{blockMetadata?.total_units || 0}</span>
              </div>
              <div className="font-medium">
                Available:{" "}
                <span className="font-bold text-emerald-500">
                  {blocks.find((b) => b.id === selectedBlockId)?.available || 0}
                </span>
              </div>
              <div className="font-medium">
                Sold:{" "}
                <span className="font-bold text-rose-500">
                  {blocks.find((b) => b.id === selectedBlockId)?.sold || 0}
                </span>
              </div>
              <div className="font-medium">
                Current block:{" "}
                <span className={`font-bold ${theme.accentText}`}>
                  BLOCK {blocks.find((b) => b.id === selectedBlockId)?.name || "A"}
                </span>
              </div>
              <div className="font-medium">
                Number of floors:{" "}
                <span className="font-bold text-amber-500">{blockMetadata?.total_floors || filteredData.length}</span>
              </div>
            </div>
            <div className={`${theme.textMuted} font-medium`}>
              Last updated: {new Date().toLocaleString("vi-VN")}
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