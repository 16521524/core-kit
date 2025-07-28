"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Grid, List, Table, Upload, Download, Plus, TrendingUp, TrendingDown } from "lucide-react"
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
  for (let i = 1; i <= 10; i++) {
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

const statusColors = {
  available: "bg-green-600 hover:bg-green-700 border-green-500",
  sold: "bg-red-600 hover:bg-red-700 border-red-500",
  booked: "bg-orange-600 hover:bg-orange-700 border-orange-500",
  special: "bg-yellow-600 hover:bg-yellow-700 border-yellow-500",
}

const statusLabels = {
  available: "Còn trống",
  sold: "Đã bán",
  booked: "Đã đặt cọc",
  special: "Đặc biệt",
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

export function Component() {
  const [viewMode, setViewMode] = useState<"grid" | "list" | "excel">("excel")
  const [selectedUnit, setSelectedUnit] = useState<ApartmentUnit | null>(null)
  const [priceType, setPriceType] = useState("vnd")
  const [selectedBlock, setSelectedBlock] = useState<string>("M1")

  // Filter data based on selected block
  const filteredData = mockData.filter((floor) => floor.block === selectedBlock)
  const currentBlockData = blockData.find((block) => block.name === selectedBlock)

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#1a1a1a] text-white font-sans">
        {/* Block Ticker */}
        <div className="bg-[#1a1a1a] border-b border-gray-700 py-2 overflow-hidden">
          <div className="flex items-center gap-8 animate-scroll whitespace-nowrap px-4">
            {blockData.map((block) => (
              <div
                key={block.name}
                className={`flex items-center gap-3 min-w-max cursor-pointer hover:bg-gray-800/50 px-3 py-1 rounded transition-all ${
                  selectedBlock === block.name ? "bg-blue-600/20 border border-blue-500" : ""
                }`}
                onClick={() => setSelectedBlock(block.name)}
              >
                <span
                  className={`text-sm font-semibold ${
                    selectedBlock === block.name ? "text-blue-400" : "text-gray-300"
                  }`}
                >
                  BLOCK {block.name}
                </span>
                <span
                  className={`text-sm ${
                    block.trend === "up"
                      ? "text-green-400"
                      : block.trend === "down"
                        ? "text-red-400"
                        : "text-yellow-400"
                  }`}
                >
                  {block.change}
                </span>
                <span className="text-white text-sm font-bold">{block.total} căn</span>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400 text-xs">{block.available} trống |</span>
                  <span
                    className={`text-xs ${
                      block.trend === "up"
                        ? "text-green-400"
                        : block.trend === "down"
                          ? "text-red-400"
                          : "text-yellow-400"
                    }`}
                  >
                    {block.sold} bán
                  </span>
                  {block.trend === "up" && <TrendingUp className="w-3 h-3 text-green-400 ml-1" />}
                  {block.trend === "down" && <TrendingDown className="w-3 h-3 text-red-400 ml-1" />}
                  {block.trend === "neutral" && <div className="w-3 h-3 border border-yellow-400 ml-1"></div>}
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 ${
                        block.trend === "up" ? "bg-green-400" : block.trend === "down" ? "bg-red-400" : "bg-yellow-400"
                      }`}
                      style={{ height: `${Math.random() * 12 + 8}px` }}
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-[#1a1a1a] border-b border-gray-700 px-4 py-3">
          <div className="flex items-center gap-6">
            <span className="text-gray-400 text-sm">Quản lý căn hộ</span>
            <span className="text-red-500 text-sm border-b-2 border-red-500 pb-1">Stacking Plan</span>
            <span className="text-gray-400 text-sm">Báo cáo</span>
            <span className="text-gray-400 text-sm">Khách hàng</span>
            <span className="text-gray-400 text-sm">Hợp đồng</span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#1a1a1a] border-b border-gray-700 px-4 py-3">
          <div className="flex items-center gap-4 mb-3">
            <Select defaultValue="sunrise-city">
              <SelectTrigger className="w-48 bg-gray-800 border-gray-600 text-sm">
                <SelectValue placeholder="Chọn dự án" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="sunrise-city">Sunrise City</SelectItem>
                <SelectItem value="golden-tower">Golden Tower</SelectItem>
              </SelectContent>
            </Select>

            {/* Selected Block Display */}
            <div className="flex items-center gap-2 bg-blue-600 px-3 py-2 rounded text-sm">
              <span className="text-white font-semibold">BLOCK {selectedBlock}</span>
              {currentBlockData && (
                <>
                  <span className="text-blue-200">•</span>
                  <span className="text-blue-200">{currentBlockData.total} căn</span>
                  <span className="text-blue-200">•</span>
                  <span className="text-green-300">{currentBlockData.available} trống</span>
                </>
              )}
            </div>

            <Select defaultValue="vn">
              <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="vn">Vietnam</SelectItem>
                <SelectItem value="intl">International</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceType} onValueChange={setPriceType}>
              <SelectTrigger className="w-36 bg-gray-800 border-gray-600 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="vnd">VND Price</SelectItem>
                <SelectItem value="usd">USD Price</SelectItem>
              </SelectContent>
            </Select>

            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm" className="bg-gray-800 border-gray-600 hover:bg-gray-700 text-sm">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" size="sm" className="bg-gray-800 border-gray-600 hover:bg-gray-700 text-sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <div className="flex border border-gray-600 rounded">
                <Button
                  variant={viewMode === "excel" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("excel")}
                  className="rounded-r-none bg-gray-700 hover:bg-gray-600"
                >
                  <Table className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-none"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-l-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Status Legend */}
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-400">Trạng thái:</span>
            {Object.entries(statusLabels).map(([status, label]) => (
              <div key={status} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded ${statusColors[status as keyof typeof statusColors].split(" ")[0]}`} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        {viewMode === "excel" ? (
          // Excel-style Stacking Plan with Fixed Headers
          <div className="relative bg-[#1a1a1a] h-[calc(100vh-280px)] overflow-auto">
            <div className="min-w-max">
              {/* Fixed Header - Both Vertical and Horizontal Scroll */}
              <div className="sticky top-0 z-30 bg-[#242424] border-b border-gray-700">
                <div className="flex">
                  {/* Fixed Corner Cell */}
                  <div className="sticky left-0 z-40 bg-[#242424] border-r border-gray-700 p-3 w-32 flex flex-col items-center justify-center">
                    <div className="font-semibold text-sm text-white">Tầng</div>
                    <div className="text-xs text-gray-400">Số căn còn</div>
                  </div>

                  {/* Apartment Headers */}
                  {filteredData[0]?.units.map((_, index) => (
                    <div
                      key={index}
                      className="p-3 w-40 text-center border-r border-gray-700 last:border-r-0 bg-[#242424]"
                    >
                      <div className="font-semibold text-sm text-white">Căn {String(index + 1).padStart(2, "0")}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-700">
                {filteredData.map((floor) => (
                  <div key={`${floor.block}-${floor.number}`} className="flex hover:bg-gray-800/30">
                    {/* Fixed Floor Column */}
                    <div className="sticky left-0 z-20 bg-[#1a1a1a] border-r border-gray-700 p-3 w-32 flex flex-col items-center justify-center">
                      <div className="font-bold text-lg text-white">Tầng {floor.number}</div>
                      <div className="text-sm text-green-400">{floor.availableCount} căn</div>
                    </div>

                    {/* Apartment Units */}
                    {floor.units.map((unit) => (
                      <Dialog key={unit.code}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DialogTrigger asChild>
                              <div
                                className={`p-3 w-40 border-r border-gray-700 last:border-r-0 cursor-pointer transition-all ${statusColors[unit.status]} border-2`}
                              >
                                <div className="text-center">
                                  <div className="font-mono text-xs mb-1 text-white">{unit.code}</div>
                                  <div className="font-semibold text-sm text-white">
                                    {priceType === "vnd" ? unit.price : unit.priceUSD}
                                  </div>
                                  <Badge variant="secondary" className="text-xs mt-1 bg-black/20 text-white">
                                    {unit.area}
                                  </Badge>
                                </div>
                              </div>
                            </DialogTrigger>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-gray-800 border-gray-600">
                            <div className="text-sm">
                              <div className="font-semibold">{unit.code}</div>
                              <div>Diện tích: {unit.area}</div>
                              <div>Phòng ngủ: {unit.bedrooms}</div>
                              <div>Phòng tắm: {unit.bathrooms}</div>
                              <div>View: {unit.view}</div>
                              <div>Trạng thái: {statusLabels[unit.status]}</div>
                            </div>
                          </TooltipContent>
                        </Tooltip>

                        <DialogContent className="bg-gray-800 border-gray-600 text-white">
                          <DialogHeader>
                            <DialogTitle>Chi tiết căn hộ {unit.code}</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm text-gray-400">Mã căn hộ</label>
                                <div className="font-mono">{unit.code}</div>
                              </div>
                              <div>
                                <label className="text-sm text-gray-400">Trạng thái</label>
                                <div>
                                  <Badge className={statusColors[unit.status]}>{statusLabels[unit.status]}</Badge>
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm text-gray-400">Giá VND</label>
                                <div className="font-semibold text-lg">{unit.price}</div>
                              </div>
                              <div>
                                <label className="text-sm text-gray-400">Giá USD</label>
                                <div className="font-semibold text-lg">{unit.priceUSD}</div>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <label className="text-sm text-gray-400">Diện tích</label>
                                <div>{unit.area}</div>
                              </div>
                              <div>
                                <label className="text-sm text-gray-400">Phòng ngủ</label>
                                <div>{unit.bedrooms}</div>
                              </div>
                              <div>
                                <label className="text-sm text-gray-400">Phòng tắm</label>
                                <div>{unit.bathrooms}</div>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm text-gray-400">Hướng view</label>
                              <div>{unit.view}</div>
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
          <div className="bg-[#1a1a1a] h-[calc(100vh-280px)] overflow-auto">
            <div className="sticky top-0 z-20 bg-[#242424] border-b border-gray-700 px-4 py-3">
              <div className="grid grid-cols-12 gap-4 text-sm text-gray-400">
                <div className="col-span-2">Mã căn hộ</div>
                <div className="col-span-1 text-right">Giá</div>
                <div className="col-span-1 text-center">Tầng</div>
                <div className="col-span-2 text-center">Diện tích</div>
                <div className="col-span-2 text-center">Trạng thái</div>
                <div className="col-span-2 text-center">View</div>
                <div className="col-span-2 text-center">Action</div>
              </div>
            </div>

            <div className="divide-y divide-gray-700">
              {filteredData.flatMap((floor) =>
                floor.units.map((unit) => (
                  <div key={unit.code} className="px-4 py-3 hover:bg-gray-800/30">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-2 flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${statusColors[unit.status].split(" ")[0]}`}
                        >
                          {unit.code.slice(-2)}
                        </div>
                        <div>
                          <div className="text-white font-semibold text-sm">{unit.code}</div>
                          <div className="text-gray-400 text-xs">
                            {unit.bedrooms}PN • {unit.bathrooms}WC
                          </div>
                        </div>
                      </div>

                      <div className="col-span-1 text-right">
                        <div className="text-white font-semibold">
                          {priceType === "vnd" ? unit.price : unit.priceUSD}
                        </div>
                      </div>

                      <div className="col-span-1 text-center">
                        <div className="text-white font-semibold">{floor.number}</div>
                      </div>

                      <div className="col-span-2 text-center">
                        <div className="text-white">{unit.area}</div>
                      </div>

                      <div className="col-span-2 text-center">
                        <Badge className={statusColors[unit.status]}>{statusLabels[unit.status]}</Badge>
                      </div>

                      <div className="col-span-2 text-center">
                        <div className="text-gray-400">{unit.view}</div>
                      </div>

                      <div className="col-span-2 text-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                              <Plus className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-800 border-gray-600 text-white">
                            <DialogHeader>
                              <DialogTitle>Chi tiết căn hộ {unit.code}</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm text-gray-400">Mã căn hộ</label>
                                  <div className="font-mono">{unit.code}</div>
                                </div>
                                <div>
                                  <label className="text-sm text-gray-400">Trạng thái</label>
                                  <div>
                                    <Badge className={statusColors[unit.status]}>{statusLabels[unit.status]}</Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm text-gray-400">Giá VND</label>
                                  <div className="font-semibold text-lg">{unit.price}</div>
                                </div>
                                <div>
                                  <label className="text-sm text-gray-400">Giá USD</label>
                                  <div className="font-semibold text-lg">{unit.priceUSD}</div>
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
          <div className="p-4 bg-[#1a1a1a] h-[calc(100vh-280px)] overflow-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
              {filteredData.flatMap((floor) =>
                floor.units.map((unit) => (
                  <Dialog key={unit.code}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                          <div className="bg-[#242424] border border-gray-700 rounded-lg p-4 hover:bg-[#2a2a2a] cursor-pointer transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${statusColors[unit.status].split(" ")[0]}`} />
                                <span className="text-xs text-gray-400">Tầng {floor.number}</span>
                              </div>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-white">
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>

                            <div className="mb-3">
                              <div className="font-mono text-sm font-semibold text-white mb-1">{unit.code}</div>
                              <div className="text-xs text-gray-400">
                                {unit.area} • {unit.bedrooms}PN • {unit.bathrooms}WC
                              </div>
                            </div>

                            <div className="mb-3">
                              <div className="text-lg font-bold text-white">
                                {priceType === "vnd" ? unit.price : unit.priceUSD}
                              </div>
                              <div className="text-sm text-gray-400">{statusLabels[unit.status]}</div>
                            </div>

                            <div className="text-xs text-gray-400">
                              <div>View: {unit.view}</div>
                            </div>
                          </div>
                        </DialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-gray-800 border-gray-600">
                        <div className="text-sm">
                          <div className="font-semibold">{unit.code}</div>
                          <div>Diện tích: {unit.area}</div>
                          <div>Phòng ngủ: {unit.bedrooms}</div>
                          <div>Phòng tắm: {unit.bathrooms}</div>
                          <div>View: {unit.view}</div>
                          <div>Trạng thái: {statusLabels[unit.status]}</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>

                    <DialogContent className="bg-gray-800 border-gray-600 text-white">
                      <DialogHeader>
                        <DialogTitle>Chi tiết căn hộ {unit.code}</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-gray-400">Mã căn hộ</label>
                            <div className="font-mono">{unit.code}</div>
                          </div>
                          <div>
                            <label className="text-sm text-gray-400">Trạng thái</label>
                            <div>
                              <Badge className={statusColors[unit.status]}>{statusLabels[unit.status]}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-gray-400">Giá VND</label>
                            <div className="font-semibold text-lg">{unit.price}</div>
                          </div>
                          <div>
                            <label className="text-sm text-gray-400">Giá USD</label>
                            <div className="font-semibold text-lg">{unit.priceUSD}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm text-gray-400">Diện tích</label>
                            <div>{unit.area}</div>
                          </div>
                          <div>
                            <label className="text-sm text-gray-400">Phòng ngủ</label>
                            <div>{unit.bedrooms}</div>
                          </div>
                          <div>
                            <label className="text-sm text-gray-400">Phòng tắm</label>
                            <div>{unit.bathrooms}</div>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Hướng view</label>
                          <div>{unit.view}</div>
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
        <div className="border-t border-gray-700 bg-[#242424] p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div>
                Tổng căn: <span className="font-semibold text-blue-400">{currentBlockData?.total || 0}</span>
              </div>
              <div>
                Còn trống: <span className="font-semibold text-green-400">{currentBlockData?.available || 0}</span>
              </div>
              <div>
                Đã bán: <span className="font-semibold text-red-400">{currentBlockData?.sold || 0}</span>
              </div>
              <div>
                Block hiện tại: <span className="font-semibold text-blue-400">BLOCK {selectedBlock}</span>
              </div>
              <div>
                Số tầng: <span className="font-semibold text-yellow-400">{filteredData.length}</span>
              </div>
            </div>
            <div className="text-gray-400">Cập nhật lần cuối: {new Date().toLocaleString("vi-VN")}</div>
          </div>
        </div>
      </div>
      <style>{`
      :global(body) {
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      }
      `}</style>
    </TooltipProvider>
  )
}

export default dynamic(() => Promise.resolve(Component), { ssr: false })
