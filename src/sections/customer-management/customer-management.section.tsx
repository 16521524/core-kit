"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Phone, Calendar, UserPlus } from "lucide-react";

interface CustomerManagementProps {
  unit: {
    code: string;
    buyer?: {
      name: string;
      phone: string;
      createDate: string;
      buyerStatus: "interested" | "deposited" | "contracted" | "completed";
    };
  };
  theme: any;
  isDarkMode: boolean;
}

export function CustomerManagement({
  unit,
  theme,
  isDarkMode,
}: CustomerManagementProps) {
  const [customerName, setCustomerName] = useState(unit.buyer?.name || "");
  const [customerPhone, setCustomerPhone] = useState(unit.buyer?.phone || "");
  const [customerStatus, setCustomerStatus] = useState(
    unit.buyer?.buyerStatus || "interested"
  );

  const statusLabels = {
    interested: "Interested",
    deposited: "Booked",
    contracted: "Contracted",
    completed: "Completed",
  };

  const statusColors = {
    interested: "bg-yellow-500",
    deposited: "bg-blue-500",
    contracted: "bg-green-500",
    completed: "bg-emerald-500",
  };

  return (
    <Card
      className={`${
        isDarkMode
          ? "bg-slate-700 border-slate-600"
          : "bg-white border-gray-200"
      }`}
    >
      <CardHeader>
        <CardTitle
          className={`text-lg flex items-center gap-2 ${
            isDarkMode ? "text-slate-100" : "text-gray-900"
          }`}
        >
          <Users className="w-5 h-5" />
          Customer Management - {unit.code}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Customer Info */}
        {unit.buyer ? (
          <div
            className={`p-4 rounded-lg ${
              isDarkMode ? "bg-slate-600" : "bg-gray-50"
            }`}
          >
            <div
              className={`text-sm font-medium ${
                isDarkMode ? "text-slate-300" : "text-gray-700"
              } mb-3`}
            >
              Current customer info:
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span
                  className={`font-medium ${
                    isDarkMode ? "text-slate-100" : "text-gray-900"
                  }`}
                >
                  {unit.buyer.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span
                  className={`${
                    isDarkMode ? "text-slate-300" : "text-gray-600"
                  }`}
                >
                  {unit.buyer.phone}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span
                  className={`${
                    isDarkMode ? "text-slate-300" : "text-gray-600"
                  }`}
                >
                  {unit.buyer.createDate}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  className={`${
                    statusColors[unit.buyer.buyerStatus]
                  } text-white`}
                >
                  {statusLabels[unit.buyer.buyerStatus]}
                </Badge>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`p-4 rounded-lg border-2 border-dashed ${
              isDarkMode
                ? "border-slate-600 bg-slate-600/30"
                : "border-gray-300 bg-gray-50"
            }`}
          >
            <div
              className={`text-center ${
                isDarkMode ? "text-slate-400" : "text-gray-500"
              }`}
            >
              <UserPlus className="w-8 h-8 mx-auto mb-2" />
              <div>No customer yet</div>
              <div className="text-sm">Add interested customer information</div>
            </div>
          </div>
        )}

        {/* Customer Form */}
        <div className="space-y-4">
          <div
            className={`text-sm font-medium ${
              isDarkMode ? "text-slate-300" : "text-gray-700"
            }`}
          >
            {unit.buyer ? "Update information:" : "Add new customer:"}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                className={`text-sm ${
                  isDarkMode ? "text-slate-300" : "text-gray-700"
                }`}
              >
                Customer Name
              </Label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                className={`${
                  isDarkMode
                    ? "bg-slate-600 border-slate-500 text-slate-100 placeholder-slate-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>

            <div>
              <Label
                className={`text-sm ${
                  isDarkMode ? "text-slate-300" : "text-gray-700"
                }`}
              >
                Phone Number
              </Label>
              <Input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Enter phone number"
                className={`${
                  isDarkMode
                    ? "bg-slate-600 border-slate-500 text-slate-100 placeholder-slate-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>
          </div>

          <div>
            <Label
              className={`text-sm ${
                isDarkMode ? "text-slate-300" : "text-gray-700"
              }`}
            >
              Customer Status
            </Label>
            <Select
              value={customerStatus}
              onValueChange={(value) => {
                setCustomerStatus(
                  value as
                    | "interested"
                    | "deposited"
                    | "contracted"
                    | "completed"
                );
              }}
            >
              <SelectTrigger
                className={`${
                  isDarkMode
                    ? "bg-slate-600 border-slate-500 text-slate-100"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                className={`${
                  isDarkMode
                    ? "bg-slate-600 border-slate-500"
                    : "bg-white border-gray-300"
                }`}
              >
                <SelectItem value="interested">Interested</SelectItem>
                <SelectItem value="deposited">Booked</SelectItem>
                <SelectItem value="contracted">Contracted</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => console.log("Save customer")}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {unit.buyer ? "Update" : "Add Customer"}
            </Button>
            <Button
              variant="outline"
              className={`flex-1 ${
                isDarkMode
                  ? "border-slate-500 text-slate-300 hover:bg-slate-600"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => {
                setCustomerName(unit.buyer?.name || "");
                setCustomerPhone(unit.buyer?.phone || "");
                setCustomerStatus(unit.buyer?.buyerStatus || "interested");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>

        {/* Customer History */}
        <div
          className={`p-4 rounded-lg ${
            isDarkMode ? "bg-slate-600" : "bg-gray-50"
          }`}
        >
          <div
            className={`text-sm font-medium ${
              isDarkMode ? "text-slate-300" : "text-gray-700"
            } mb-3`}
          >
            Interaction History:
          </div>
          <div className="space-y-2 text-sm">
            <div
              className={`flex justify-between ${
                isDarkMode ? "text-slate-300" : "text-gray-600"
              }`}
            >
              <span>Customer showed interest</span>
              <span>30/07/2025 09:15</span>
            </div>
            {customerStatus !== "interested" && (
              <div
                className={`flex justify-between ${
                  isDarkMode ? "text-slate-300" : "text-gray-600"
                }`}
              >
                <span>Booked</span>
                <span>30/07/2025 14:30</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
