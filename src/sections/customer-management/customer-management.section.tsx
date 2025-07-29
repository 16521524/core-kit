"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { UserPlus } from "lucide-react"

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

interface CustomerManagementProps {
  unit: ApartmentUnit
  theme: any
  isDarkMode: boolean
}

export function CustomerManagement({ unit, theme, isDarkMode }: CustomerManagementProps) {
  const [isAddingBuyer, setIsAddingBuyer] = useState(false)
  const [buyerForm, setBuyerForm] = useState({
    name: "",
    phone: "",
    buyerStatus: "interested" as const,
  })

  const addBuyer = (unitCode: string, buyerInfo: typeof buyerForm) => {
    console.log(`Adding buyer for ${unitCode}:`, buyerInfo)
    setIsAddingBuyer(false)
    setBuyerForm({ name: "", phone: "", buyerStatus: "interested" })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Quản lý khách hàng</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsAddingBuyer(!isAddingBuyer)}
          className={`${isDarkMode ? "border-slate-600 text-slate-300 hover:bg-slate-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          {isAddingBuyer ? "Hủy" : "Thêm khách hàng"}
        </Button>
      </div>

      {unit.buyer && (
        <div
          className={`p-4 rounded-lg border border-green-500/30 ${isDarkMode ? "bg-green-900/20" : "bg-green-500/5"}`}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label className={`text-xs ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Tên khách hàng</Label>
              <div className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{unit.buyer.name}</div>
            </div>
            <div>
              <Label className={`text-xs ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Số điện thoại</Label>
              <div className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{unit.buyer.phone}</div>
            </div>
            <div>
              <Label className={`text-xs ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Ngày tạo</Label>
              <div className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {unit.buyer.createDate}
              </div>
            </div>
            <div>
              <Label className={`text-xs ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Trạng thái KH</Label>
              <Badge
                className={`${
                  unit.buyer.buyerStatus === "completed"
                    ? isDarkMode
                      ? "bg-green-900/50 text-green-300 border-green-700"
                      : "bg-green-100 text-green-800"
                    : unit.buyer.buyerStatus === "contracted"
                      ? isDarkMode
                        ? "bg-blue-900/50 text-blue-300 border-blue-700"
                        : "bg-blue-100 text-blue-800"
                      : unit.buyer.buyerStatus === "deposited"
                        ? isDarkMode
                          ? "bg-amber-900/50 text-amber-300 border-amber-700"
                          : "bg-amber-100 text-amber-800"
                        : isDarkMode
                          ? "bg-gray-700 text-gray-300 border-gray-600"
                          : "bg-gray-100 text-gray-800"
                } text-xs`}
              >
                {unit.buyer.buyerStatus === "completed"
                  ? "Hoàn thành"
                  : unit.buyer.buyerStatus === "contracted"
                    ? "Đã ký HĐ"
                    : unit.buyer.buyerStatus === "deposited"
                      ? "Đã cọc"
                      : "Quan tâm"}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {isAddingBuyer && (
        <div
          className={`p-4 rounded-lg border border-blue-500/30 space-y-4 ${isDarkMode ? "bg-blue-900/20" : "bg-blue-500/5"}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <Label className={`text-sm ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>Tên khách hàng *</Label>
              <Input
                value={buyerForm.name}
                onChange={(e) => setBuyerForm({ ...buyerForm, name: e.target.value })}
                placeholder="Nguyễn Văn A"
                className={`${isDarkMode ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}`}
              />
            </div>
            <div>
              <Label className={`text-sm ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>Số điện thoại *</Label>
              <Input
                value={buyerForm.phone}
                onChange={(e) => setBuyerForm({ ...buyerForm, phone: e.target.value })}
                placeholder="0912345678"
                className={`${isDarkMode ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}`}
              />
            </div>
          </div>

          <div>
            <Label className={`text-sm ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
              Trạng thái khách hàng
            </Label>
            <Select
              value={buyerForm.buyerStatus}
              onValueChange={(value) => setBuyerForm({ ...buyerForm, buyerStatus: value as any })}
            >
              <SelectTrigger
                className={`${isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={isDarkMode ? "bg-slate-700 border-slate-600" : "bg-white border-gray-300"}>
                <SelectItem value="interested">Quan tâm</SelectItem>
                <SelectItem value="deposited">Đã đặt cọc</SelectItem>
                <SelectItem value="contracted">Đã ký hợp đồng</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => addBuyer(unit.code, buyerForm)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!buyerForm.name || !buyerForm.phone}
          >
            Thêm khách hàng
          </Button>
        </div>
      )}
    </div>
  )
}
