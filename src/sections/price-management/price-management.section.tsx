"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DollarSign } from "lucide-react"

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

interface PriceManagementProps {
  unit: ApartmentUnit
  theme: any
  isDarkMode: boolean
}

export function PriceManagement({ unit, theme, isDarkMode }: PriceManagementProps) {
  const [isEditingPrice, setIsEditingPrice] = useState(false)
  const [tempPrice, setTempPrice] = useState("")
  const [tempPriceUSD, setTempPriceUSD] = useState("")

  const updateUnitPrice = (unitCode: string, newPrice: string, newPriceUSD: string) => {
    // In real app, this would call an API
    console.log(`Updating price for ${unitCode}: ${newPrice} / ${newPriceUSD}`)
    setIsEditingPrice(false)
    setTempPrice("")
    setTempPriceUSD("")
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className={`text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>Quản lý giá</Label>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setIsEditingPrice(!isEditingPrice)
            setTempPrice(unit.price)
            setTempPriceUSD(unit.priceUSD)
          }}
          className={`${isDarkMode ? "border-slate-600 text-slate-300 hover:bg-slate-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
        >
          <DollarSign className="w-4 h-4 mr-1" />
          {isEditingPrice ? "Hủy" : "Sửa giá"}
        </Button>
      </div>

      {isEditingPrice ? (
        <div className="space-y-3 p-3 rounded-lg border border-blue-500/30 bg-blue-500/5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className={`text-xs ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>Giá VND</Label>
              <Input
                value={tempPrice}
                onChange={(e) => setTempPrice(e.target.value)}
                placeholder="3.5 tỷ"
                className={`${isDarkMode ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}`}
              />
            </div>
            <div>
              <Label className={`text-xs ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>Giá USD</Label>
              <Input
                value={tempPriceUSD}
                onChange={(e) => setTempPriceUSD(e.target.value)}
                placeholder="$150,000"
                className={`${isDarkMode ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}`}
              />
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => updateUnitPrice(unit.code, tempPrice, tempPriceUSD)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Cập nhật giá
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="font-bold text-lg text-green-500">{unit.price}</div>
            <div className={`text-xs ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Giá VND</div>
          </div>
          <div>
            <div className="font-bold text-lg text-blue-500">{unit.priceUSD}</div>
            <div className={`text-xs ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Giá USD</div>
          </div>
        </div>
      )}
    </div>
  )
}
