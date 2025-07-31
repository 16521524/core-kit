"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp } from "lucide-react"

interface PriceManagementProps {
  unit: {
    code: string
    price: string
    priceUSD: string
    status: string
  }
  theme: any
  isDarkMode: boolean
}

export function PriceManagement({ unit, theme, isDarkMode }: PriceManagementProps) {
  const [priceType, setPriceType] = useState("selling")
  const [currency, setCurrency] = useState("VND")
  const [newPrice, setNewPrice] = useState("3500000000")

  const formatPrice = (price: string, currency: string) => {
    const numPrice = Number.parseInt(price.replace(/[^\d]/g, ""))
    if (currency === "VND") {
      return (numPrice / 1000000000).toFixed(1) + " tỷ"
    } else {
      return "$" + Math.round(numPrice / 24000).toLocaleString()
    }
  }

  return (
    <Card className={`${isDarkMode ? "bg-slate-700 border-slate-600" : "bg-white border-gray-200"}`}>
      <CardHeader>
        <CardTitle className={`text-lg flex items-center gap-2 ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>
          <DollarSign className="w-5 h-5" />
          Quản lý giá - {unit.code}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Price Type Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className={`text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>Loại giá</Label>
            <Select value={priceType} onValueChange={setPriceType}>
              <SelectTrigger
                className={`${
                  isDarkMode ? "bg-slate-600 border-slate-500 text-slate-100" : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={`${isDarkMode ? "bg-slate-600 border-slate-500" : "bg-white border-gray-300"}`}>
                <SelectItem value="selling">Giá bán</SelectItem>
                <SelectItem value="listing">Giá niêm yết</SelectItem>
                <SelectItem value="cost">Giá gốc</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className={`text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
              Đơn vị tiền tệ
            </Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger
                className={`${
                  isDarkMode ? "bg-slate-600 border-slate-500 text-slate-100" : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={`${isDarkMode ? "bg-slate-600 border-slate-500" : "bg-white border-gray-300"}`}>
                <SelectItem value="VND">VND</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* New Price Input */}
        <div>
          <Label className={`text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>Giá mới</Label>
          <Input
            type="text"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            placeholder="Nhập giá mới"
            className={`${
              isDarkMode
                ? "bg-slate-600 border-slate-500 text-slate-100 placeholder-slate-400"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            }`}
          />
        </div>

        {/* Price Preview */}
        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-slate-600" : "bg-gray-50"}`}>
          <div className={`text-sm ${isDarkMode ? "text-slate-300" : "text-gray-600"} mb-2`}>Xem trước giá:</div>
          <div className={`text-lg font-bold ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>
            Giá hiện tại: {formatPrice(unit.price, "VND")}
          </div>
          <div className={`text-sm ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>Giá USD: {unit.priceUSD}</div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => console.log("Save price")}>
            <TrendingUp className="w-4 h-4 mr-2" />
            Lưu giá
          </Button>
          <Button
            variant="outline"
            className={`flex-1 ${
              isDarkMode
                ? "border-slate-500 text-slate-300 hover:bg-slate-600"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setNewPrice(unit.price.replace(/[^\d]/g, ""))}
          >
            Hủy
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
