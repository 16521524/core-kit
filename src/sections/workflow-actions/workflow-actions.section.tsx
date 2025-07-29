"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Check, Lock, Ban } from "lucide-react"

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

interface WorkflowActionsProps {
  unit: ApartmentUnit
  theme: any
  isDarkMode: boolean
}

export function WorkflowActions({ unit, theme, isDarkMode }: WorkflowActionsProps) {
  const updateUnitStatus = (unitCode: string, newStatus: ApartmentUnit["status"]) => {
    console.log(`Updating status for ${unitCode}: ${newStatus}`)
  }

  const approveUnit = (unitCode: string) => {
    console.log(`Approving unit ${unitCode}`)
  }

  const lockUnit = (unitCode: string) => {
    console.log(`Locking unit ${unitCode}`)
  }

  const blockUnit = (unitCode: string) => {
    console.log(`Blocking unit ${unitCode}`)
  }

  return (
    <div className="space-y-4">
      {/* Status Management */}
      <div className="space-y-3">
        <Label className={`text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
          Quản lý trạng thái
        </Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateUnitStatus(unit.code, "available")}
            className="border-emerald-500 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600"
          >
            Còn trống
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateUnitStatus(unit.code, "booked")}
            className="border-amber-500 text-amber-500 hover:bg-amber-50 hover:text-amber-600"
          >
            Đặt cọc
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateUnitStatus(unit.code, "sold")}
            className="border-rose-500 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
          >
            Đã bán
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateUnitStatus(unit.code, "unavailable")}
            className="border-gray-500 text-gray-500 hover:bg-gray-50 hover:text-gray-600"
          >
            Chưa mở bán
          </Button>
        </div>
      </div>

      {/* Workflow Actions */}
      <div className="space-y-3">
        <Label className={`text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
          Workflow Actions
        </Label>
        <div className="space-y-2">
          <Button
            size="sm"
            onClick={() => approveUnit(unit.code)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={unit.isApproved}
          >
            <Check className="w-4 h-4 mr-2" />
            {unit.isApproved ? "Đã duyệt" : "Duyệt căn hộ"}
          </Button>
          <Button
            size="sm"
            onClick={() => lockUnit(unit.code)}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            disabled={unit.isLocked}
          >
            <Lock className="w-4 h-4 mr-2" />
            {unit.isLocked ? "Đã khóa" : "Khóa căn hộ"}
          </Button>
          <Button
            size="sm"
            onClick={() => blockUnit(unit.code)}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            disabled={unit.isBlocked}
          >
            <Ban className="w-4 h-4 mr-2" />
            {unit.isBlocked ? "Đã chặn" : "Chặn căn hộ"}
          </Button>
        </div>
      </div>

      {/* Status indicators */}
      <div className="flex flex-wrap gap-2">
        {unit.isApproved && (
          <div
            className={`flex items-center gap-1 text-blue-400 px-2 py-1 rounded text-xs ${isDarkMode ? "bg-blue-900/30" : "bg-blue-50"}`}
          >
            <Check className="w-3 h-3" />
            <span>Đã duyệt</span>
          </div>
        )}
        {unit.isLocked && (
          <div
            className={`flex items-center gap-1 text-green-400 px-2 py-1 rounded text-xs ${isDarkMode ? "bg-green-900/30" : "bg-green-50"}`}
          >
            <Lock className="w-3 h-3" />
            <span>Đã khóa</span>
          </div>
        )}
        {unit.isBlocked && (
          <div
            className={`flex items-center gap-1 text-red-400 px-2 py-1 rounded text-xs ${isDarkMode ? "bg-red-900/30" : "bg-red-50"}`}
          >
            <Ban className="w-3 h-3" />
            <span>Bị chặn</span>
          </div>
        )}
      </div>
    </div>
  )
}
