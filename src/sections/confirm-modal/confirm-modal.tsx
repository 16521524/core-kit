"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { CheckCircle2 } from "lucide-react"

export function ApproveModal({
  open,
  units,
  onClose,
  onApprove,
}: {
  open: boolean
  units: any[]
  onClose: () => void
  onApprove: () => void
}) {
  const { theme } = useTheme()

  const isDark = theme === "dark"

  const containerBg = isDark ? "bg-slate-800" : "bg-white"
  const textColor = isDark ? "text-white" : "text-gray-900"
  const borderColor = isDark ? "border-slate-600" : "border-gray-300"
  const scrollBg = isDark ? "bg-slate-700" : "bg-gray-100"

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={`max-w-md ${containerBg} ${textColor} ${borderColor} border shadow-lg`}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Xác nhận duyệt căn hộ
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-sm">
            Bạn có chắc chắn muốn duyệt{" "}
            <strong>{units.length}</strong> căn sau?
          </p>

          <ul
            className={`max-h-40 overflow-y-auto rounded-md px-3 py-2 text-sm ${scrollBg}`}
          >
            {units.map((u) => (
              <li key={u.code} className="py-1">
                {u.code} – {u.area}m² – {u.price}
              </li>
            ))}
          </ul>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="ghost"
              onClick={onClose}
              className={`text-sm h-8 px-3 ${
                isDark
                  ? "bg-slate-700 hover:bg-slate-600"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              Hủy
            </Button>
            <Button
              onClick={onApprove}
              className={`text-sm h-8 px-3 ${
                isDark
                  ? "text-white bg-slate-700 border-slate-600 hover:bg-slate-600"
                  : "text-slate-700 bg-white border-gray-300 hover:bg-gray-50"
              } border`}
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Duyệt
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
