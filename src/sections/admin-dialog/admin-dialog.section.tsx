"use client"

import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Settings, Check, Lock, Ban } from "lucide-react"
import { CustomerManagement } from "../customer-management"
import { PriceManagement } from "../price-management"
import { WorkflowActions } from "../workflow-actions"

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

interface AdminDialogProps {
  unit: ApartmentUnit
  theme: any
  isDarkMode: boolean
}

const statusLabels = {
  available: "Còn trống",
  sold: "Đã bán",
  booked: "Đã đặt cọc",
  unavailable: "Chưa mở bán",
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

export function AdminDialog({ unit, theme, isDarkMode }: AdminDialogProps) {
  return (
    <DialogContent
      className={`${isDarkMode ? "bg-slate-800 border-slate-600 text-white" : "bg-white border-gray-300 text-gray-900"} shadow-xl max-w-4xl max-h-[90vh] overflow-y-auto`}
    >
      <DialogHeader>
        <DialogTitle
          className={`text-xl font-semibold flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          <Settings className="w-5 h-5" />
          Admin: Quản lý căn hộ {unit.code}
        </DialogTitle>
      </DialogHeader>

      <div className="grid gap-6 mt-6">
        {/* Unit Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3
              className={`text-lg font-semibold border-b pb-2 ${isDarkMode ? "text-white border-slate-600" : "text-gray-900 border-gray-200"}`}
            >
              Thông tin căn hộ
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className={`text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
                  Mã căn hộ
                </Label>
                <div className={`font-mono font-bold text-lg mt-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {unit.code}
                </div>
              </div>
              <div>
                <Label className={`text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
                  Trạng thái
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-3 h-3 rounded-full ${theme.statusIndicators[unit.status]}`} />
                  <span className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {statusLabels[unit.status]}
                  </span>
                  {getUnitIcon(unit)}
                </div>
              </div>
            </div>

            <PriceManagement unit={unit} theme={theme} isDarkMode={isDarkMode} />

            {/* Unit Details */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className={`text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
                  Diện tích
                </Label>
                <div className={`font-semibold mt-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{unit.area}</div>
              </div>
              <div>
                <Label className={`text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
                  Phòng ngủ
                </Label>
                <div className={`font-semibold mt-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {unit.bedrooms}
                </div>
              </div>
              <div>
                <Label className={`text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
                  Phòng tắm
                </Label>
                <div className={`font-semibold mt-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {unit.bathrooms}
                </div>
              </div>
            </div>

            <div>
              <Label className={`text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
                Hướng view
              </Label>
              <div className={`font-semibold mt-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{unit.view}</div>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="space-y-4">
            <h3
              className={`text-lg font-semibold border-b pb-2 ${isDarkMode ? "text-white border-slate-600" : "text-gray-900 border-gray-200"}`}
            >
              Hành động Admin
            </h3>
            <WorkflowActions unit={unit} theme={theme} isDarkMode={isDarkMode} />
          </div>
        </div>

        {/* Customer Management */}
        <CustomerManagement unit={unit} theme={theme} isDarkMode={isDarkMode} />

        {/* Admin Notes */}
        <div className="space-y-3">
          <Label className={`text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
            Ghi chú Admin
          </Label>
          <Textarea
            placeholder="Ghi chú nội bộ về căn hộ này..."
            className={`${isDarkMode ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"} min-h-[80px]`}
          />
          <Button
            size="sm"
            variant="outline"
            className={`w-full ${isDarkMode ? "border-slate-600 text-slate-300 hover:bg-slate-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
          >
            Lưu ghi chú
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}
