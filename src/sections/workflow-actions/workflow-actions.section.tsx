"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Lock, Ban, Settings, Clock } from "lucide-react"

interface WorkflowActionsProps {
  unit: {
    code: string
    status: string
    isApproved?: boolean
    isLocked?: boolean
    isBlocked?: boolean
  }
  theme: any
  isDarkMode: boolean
}

export function WorkflowActions({ unit, theme, isDarkMode }: WorkflowActionsProps) {
  const getWorkflowStep = () => {
    if (unit.isBlocked) return "blocked"
    if (unit.isLocked) return "locked"
    if (unit.isApproved) return "approved"
    return "setup"
  }

  const workflowStep = getWorkflowStep()

  const workflowSteps = [
    { key: "setup", label: "Thiết lập giá", icon: Settings, color: "gray" },
    { key: "approved", label: "Đã duyệt", icon: CheckCircle, color: "blue" },
    { key: "locked", label: "Đã khóa", icon: Lock, color: "green" },
    { key: "blocked", label: "Bị chặn", icon: Ban, color: "red" },
  ]

  return (
    <Card className={`${isDarkMode ? "bg-slate-700 border-slate-600" : "bg-white border-gray-200"}`}>
      <CardHeader>
        <CardTitle className={`text-lg flex items-center gap-2 ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>
          <Clock className="w-5 h-5" />
          Workflow - {unit.code}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-slate-600" : "bg-gray-50"}`}>
          <div className={`text-sm ${isDarkMode ? "text-slate-300" : "text-gray-600"} mb-2`}>Trạng thái hiện tại:</div>
          <div className="flex items-center gap-2">
            {workflowSteps.map((step) => {
              const Icon = step.icon
              const isActive = step.key === workflowStep
              const isPassed =
                workflowSteps.findIndex((s) => s.key === workflowStep) >=
                workflowSteps.findIndex((s) => s.key === step.key)

              return (
                <div key={step.key} className="flex items-center">
                  <div
                    className={`p-2 rounded-full ${
                      isActive
                        ? step.color === "gray"
                          ? "bg-gray-500"
                          : step.color === "blue"
                            ? "bg-blue-500"
                            : step.color === "green"
                              ? "bg-green-500"
                              : "bg-red-500"
                        : isPassed
                          ? isDarkMode
                            ? "bg-slate-500"
                            : "bg-gray-300"
                          : isDarkMode
                            ? "bg-slate-700"
                            : "bg-gray-100"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? "text-white"
                          : isPassed
                            ? isDarkMode
                              ? "text-slate-300"
                              : "text-gray-600"
                            : isDarkMode
                              ? "text-slate-500"
                              : "text-gray-400"
                      }`}
                    />
                  </div>
                  {step.key !== "blocked" && (
                    <div
                      className={`w-8 h-0.5 ${
                        isPassed && step.key !== workflowStep
                          ? isDarkMode
                            ? "bg-slate-500"
                            : "bg-gray-300"
                          : isDarkMode
                            ? "bg-slate-700"
                            : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
          <div className="mt-3">
            <Badge
              className={`${
                workflowStep === "setup"
                  ? "bg-gray-500"
                  : workflowStep === "approved"
                    ? "bg-blue-500"
                    : workflowStep === "locked"
                      ? "bg-green-500"
                      : "bg-red-500"
              } text-white`}
            >
              {workflowSteps.find((s) => s.key === workflowStep)?.label}
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className={`text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
            Hành động có thể thực hiện:
          </div>

          <div className="grid grid-cols-2 gap-3">
            {workflowStep === "setup" && (
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => console.log("Approve unit")}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Duyệt
              </Button>
            )}

            {workflowStep === "approved" && (
              <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => console.log("Lock unit")}>
                <Lock className="w-4 h-4 mr-2" />
                Khóa
              </Button>
            )}

            {(workflowStep === "setup" || workflowStep === "approved") && (
              <Button variant="destructive" onClick={() => console.log("Block unit")}>
                <Ban className="w-4 h-4 mr-2" />
                Chặn
              </Button>
            )}

            {workflowStep === "blocked" && (
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => console.log("Unblock unit")}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Bỏ chặn
              </Button>
            )}
          </div>
        </div>

        {/* Workflow History */}
        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-slate-600" : "bg-gray-50"}`}>
          <div className={`text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-gray-700"} mb-3`}>
            Lịch sử workflow:
          </div>
          <div className="space-y-2 text-sm">
            <div className={`flex justify-between ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
              <span>Tạo căn hộ</span>
              <span>25/07/2025 12:01</span>
            </div>
            {unit.isApproved && (
              <div className={`flex justify-between ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
                <span>Đã duyệt</span>
                <span>25/07/2025 14:30</span>
              </div>
            )}
            {unit.isLocked && (
              <div className={`flex justify-between ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
                <span>Đã khóa</span>
                <span>25/07/2025 16:15</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
