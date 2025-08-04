"use client"

import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Building, DollarSign, Users, Settings } from "lucide-react"
import { CustomerManagement } from "../customer-management"
import { PriceManagement } from "../price-management"
import { WorkflowActions } from "../workflow-actions"

interface AdminDialogProps {
  unit: {
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
  theme: any
  isDarkMode: boolean
}

const statusLabels = {
  available: "Available",
  sold: "Sold",
  booked: "Booked",
  unavailable: "Unavailable",
}

export function AdminDialog({ unit, theme, isDarkMode }: AdminDialogProps) {
  return (
    <DialogContent
      className={`max-w-4xl max-h-[90vh] overflow-y-auto ${
        isDarkMode ? "bg-slate-800 border-slate-600 text-slate-100" : "bg-white border-gray-200 text-gray-900"
      }`}
    >
      <DialogHeader>
        <DialogTitle
          className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}
        >
          <Building className="w-5 h-5" />
          Apartment Unit Details {unit.code}
        </DialogTitle>
      </DialogHeader>

      {/* Unit Summary */}
      <div
        className={`p-4 rounded-lg border ${
          isDarkMode ? "bg-slate-700 border-slate-600" : "bg-gray-50 border-gray-200"
        }`}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className={`block text-xs ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}>Area:</span>
            <div className={`font-semibold ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>{unit.area}</div>
          </div>
          <div>
            <span className={`block text-xs ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}>Bedrooms:</span>
            <div className={`font-semibold ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>
              {unit.bedrooms} rooms
            </div>
          </div>
          <div>
            <span className={`block text-xs ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}>Bathrooms:</span>
            <div className={`font-semibold ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>
              {unit.bathrooms} rooms
            </div>
          </div>
          <div>
            <span className={`block text-xs ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}>Status:</span>
            <Badge className={`${theme.statusBadges[unit.status]} mt-1`}>{statusLabels[unit.status]}</Badge>
          </div>
        </div>
        <div className={`mt-3 pt-3 border-t ${isDarkMode ? "border-slate-600" : "border-gray-200"}`}>
          <span className={`block text-xs ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}>View:</span>
          <div className={`font-semibold ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>{unit.view}</div>
        </div>
      </div>

      {/* Admin Tabs */}
      <Tabs defaultValue="price" className="w-full">
        <TabsList className={`grid w-full grid-cols-3 ${isDarkMode ? "bg-slate-700 border-slate-600" : "bg-gray-100"}`}>
          <TabsTrigger
            value="price"
            className={`flex items-center gap-2 ${
              isDarkMode
                ? "data-[state=active]:bg-slate-600 data-[state=active]:text-slate-100 text-slate-300"
                : "data-[state=active]:bg-white data-[state=active]:text-gray-900"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Price Management
          </TabsTrigger>
          <TabsTrigger
            value="workflow"
            className={`flex items-center gap-2 ${
              isDarkMode
                ? "data-[state=active]:bg-slate-600 data-[state=active]:text-slate-100 text-slate-300"
                : "data-[state=active]:bg-white data-[state=active]:text-gray-900"
            }`}
          >
            <Settings className="w-4 h-4" />
            Workflow
          </TabsTrigger>
          <TabsTrigger
            value="customer"
            className={`flex items-center gap-2 ${
              isDarkMode
                ? "data-[state=active]:bg-slate-600 data-[state=active]:text-slate-100 text-slate-300"
                : "data-[state=active]:bg-white data-[state=active]:text-gray-900"
            }`}
          >
            <Users className="w-4 h-4" />
            Customer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="price" className="mt-4">
          <PriceManagement unit={unit} theme={theme} isDarkMode={isDarkMode} />
        </TabsContent>

        <TabsContent value="workflow" className="mt-4">
          <WorkflowActions unit={unit} theme={theme} isDarkMode={isDarkMode} />
        </TabsContent>

        <TabsContent value="customer" className="mt-4">
          <CustomerManagement unit={unit} theme={theme} isDarkMode={isDarkMode} />
        </TabsContent>
      </Tabs>
    </DialogContent>
  )
}
