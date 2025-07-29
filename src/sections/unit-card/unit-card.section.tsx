"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Plus, Check, Lock, Ban } from "lucide-react"
import { AdminDialog } from "../admin-dialog"

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

interface UnitCardProps {
  unit: ApartmentUnit
  floor: Floor
  theme: any
  isDarkMode: boolean
  priceType: string
  statusLabels: Record<string, string>
  viewMode: "excel" | "list" | "grid"
}

const getUnitIcon = (unit: ApartmentUnit) => {
  if (unit.isBlocked) {
    return <Ban className="w-3 h-3 text-red-400" />
  }
  if (unit.isLocked) {
    return <Lock className="w-3 h-3 text-green-400" />
  }
  if (unit.isApproved) {
    return <Check className="w-3 h-3 text-blue-400" />
  }
  return null
}

export function UnitCard({ unit, floor, theme, isDarkMode, priceType, statusLabels, viewMode }: UnitCardProps) {
  return (
    <TooltipProvider>
      {viewMode === "excel" && (
        <Dialog>
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
                        <Badge className={`text-xs font-bold ${theme.statusBadges[unit.status]} px-3 py-1 shadow-sm`}>
                          {unit.area}
                        </Badge>
                      </div>
                    </div>
                    {/* Enhanced Status indicator */}
                    <div
                      className={`absolute top-2 right-2 w-3 h-3 rounded-full ${theme.statusIndicators[unit.status]} animate-pulse`}
                    />
                    {/* Icons for approval, lock, and block */}
                    <div className="absolute top-2 left-2">{getUnitIcon(unit)}</div>
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
                  ? "bg-slate-800 border-slate-600 shadow-lg text-white"
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
                {unit.isApproved && <div className="text-blue-400">✓ Đã duyệt</div>}
                {unit.isLocked && <div className="text-green-400">🔒 Đã khóa</div>}
                {unit.isBlocked && <div className="text-red-400">🚫 Bị chặn</div>}
              </div>
            </TooltipContent>
          </Tooltip>

          <AdminDialog unit={unit} theme={theme} isDarkMode={isDarkMode} />
        </Dialog>
      )}

      {viewMode === "grid" && (
        <Dialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <div
                  className={`${theme.statusColors[unit.status]} rounded-xl p-4 cursor-pointer transition-all duration-300 ${isDarkMode ? "shadow-xl hover:shadow-2xl" : "shadow-md hover:shadow-lg"} relative group hover:scale-[1.03] hover:z-10`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${theme.statusIndicators[unit.status]}`} />
                      <span className={`text-xs font-medium ${isDarkMode ? "text-white/80" : "text-current"}`}>
                        Tầng {floor.number}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {getUnitIcon(unit)}
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-6 w-6 p-0 ${isDarkMode ? "text-white/60 hover:text-white" : "text-current/60 hover:text-current"} opacity-0 group-hover:opacity-100 transition-opacity`}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className={`font-mono text-sm font-bold ${isDarkMode ? "text-white" : "text-current"} mb-1`}>
                      {unit.code}
                    </div>
                    <div className={`text-xs font-medium ${isDarkMode ? "text-white/70" : "text-current/70"}`}>
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
                  ? "bg-slate-800 border-slate-600 shadow-lg text-white"
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
                {unit.isApproved && <div className="text-blue-400">✓ Đã duyệt</div>}
                {unit.isLocked && <div className="text-green-400">🔒 Đã khóa</div>}
                {unit.isBlocked && <div className="text-red-400">🚫 Bị chặn</div>}
              </div>
            </TooltipContent>
          </Tooltip>

          <AdminDialog unit={unit} theme={theme} isDarkMode={isDarkMode} />
        </Dialog>
      )}

      {/* List view */}
      {viewMode === "list" && (
        <div className={`px-6 py-4 ${isDarkMode ? "hover:bg-slate-700/20" : "hover:bg-gray-50/50"} transition-colors`}>
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
                <div className="absolute -top-1 -left-1">{getUnitIcon(unit)}</div>
              </div>
              <div>
                <div className={`${theme.textPrimary} font-semibold text-sm`}>{unit.code}</div>
                <div className={`${theme.textMuted} text-xs font-medium`}>
                  {unit.bedrooms}PN • {unit.bathrooms}WC
                </div>
              </div>
            </div>

            <div className="col-span-1 text-right">
              <div className={`${theme.textPrimary} font-bold`}>{priceType === "vnd" ? unit.price : unit.priceUSD}</div>
            </div>

            <div className="col-span-1 text-center">
              <div className={`${theme.textPrimary} font-bold`}>{floor.number}</div>
            </div>

            <div className="col-span-2 text-center">
              <div className={`${theme.textPrimary} font-semibold`}>{unit.area}</div>
            </div>

            <div className="col-span-2 text-center">
              <div className="flex items-center justify-center gap-2">
                <Badge className={`${theme.statusBadges[unit.status]} font-medium px-3 py-1`}>
                  {statusLabels[unit.status]}
                </Badge>
                {getUnitIcon(unit)}
              </div>
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
                <AdminDialog unit={unit} theme={theme} isDarkMode={isDarkMode} />
              </Dialog>
            </div>
          </div>
        </div>
      )}
    </TooltipProvider>
  )
}
