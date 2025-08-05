"use client"

import type React from "react"
import { useState, useCallback, useMemo, useRef } from "react" // Import useRef
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, CheckCircle, XCircle, AlertCircle, UploadCloud, Check, Download, X } from "lucide-react"
import * as XLSX from "xlsx"
import { priceSchema, spcodeSchema, schema as metadataSchema } from "./lib"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

// Map upload types to their local public paths
const localTemplatePaths: Record<string, string> = {
  metadata: "/templates/StackingPlan_Metadata.xlsx",
  price: "/templates/StackingPlan_Price.xlsx",
  spcode: "/templates/StackingPlan_SPCode.xlsx",
}

type UploadStep = "upload" | "confirm" | "success" | "error" // Simplified steps

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ParsedRow {
  [key: string]: string | number
  "Record Status"?: string // Add this for the status column
}

// Helper function to normalize strings for robust comparison
function normalizeString(str: string): string {
  return str
    .normalize("NFD") // Normalize to NFD form (decomposed)
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9]/g, "") // Remove non-alphanumeric characters
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploadType, setUploadType] = useState<string>("metadata")
  const [parsedData, setParsedData] = useState<ParsedRow[]>([])
  const [uploadStep, setUploadStep] = useState<UploadStep>("upload")
  const [isLoading, setIsLoading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [recordStatuses, setRecordStatuses] = useState<("Success" | "Error" | "Warning")[]>([])
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false) // New state for download loading

  const fileInputRef = useRef<HTMLInputElement>(null) // Create a ref for the file input

  // Determine which schema to use based on uploadType
  const currentSchema = useMemo(() => {
    if (uploadType === "metadata") {
      return metadataSchema
    } else if (uploadType === "price") {
      return priceSchema
    } else if (uploadType === "spcode") {
      return spcodeSchema
    }
    return metadataSchema // Default to metadataSchema
  }, [uploadType])

  // Centralized reset function
  const resetModalState = useCallback(() => {
    setFile(null)
    setParsedData([])
    setUploadStep("upload")
    setIsLoading(false)
    setUploadError(null)
    setRecordStatuses([])
    // Clear the file input value to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = "" // This is the key for re-uploading same file
    }
  }, [])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      // Only reset states relevant to the new file, NOT the input value yet
      setFile(event.target.files[0])
      setParsedData([])
      setUploadStep("upload") // Go back to upload step to show "Upload" button
      setIsLoading(false)
      setUploadError(null)
      setRecordStatuses([])
      console.log("File selected:", event.target.files[0].name)
    }
  }

  const handleUploadTypeChange = useCallback(
    (value: string) => {
      setUploadType(value)
      resetModalState() // Reset state when upload type changes, including clearing file input
    },
    [resetModalState],
  )

  const handleUpload = useCallback(async () => {
    if (!file) {
      setUploadError("Please select a file to upload.")
      return
    }

    setIsLoading(true)
    setUploadError(null)

    try {
      const reader = new FileReader()

      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: "array" })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]

          // Convert sheet to JSON, using the first row as headers
          const rawJsonData = XLSX.utils.sheet_to_json(worksheet, { header: true })

          // Filter out empty rows (if any)
          const filteredData = rawJsonData.filter((row: any) =>
            Object.values(row).some((val) => val !== null && val !== undefined && String(val).trim() !== ""),
          )

          if (filteredData.length === 0) {
            setUploadError("Excel file contains no data or is incorrectly formatted.")
            setIsLoading(false)
            setUploadStep("error")
            return
          }

          const mappedData: ParsedRow[] = filteredData.map((row: any) => {
            const newRow: ParsedRow = {}
            currentSchema.forEach((col) => {
              // Find the key in the raw row that matches the normalized schema name
              const foundKey = Object.keys(row).find((key) => normalizeString(key) === normalizeString(col.name))
              newRow[col.name] = row[foundKey || col.name] || "" // Use col.name for display in table
            })
            return newRow
          })

          console.log("Mapped data after XLSX parsing:", mappedData)

          if (mappedData.length === 0) {
            setUploadError("Excel file contains no data after mapping or is incorrectly formatted.")
            setIsLoading(false)
            setUploadStep("error")
            return
          }

          setParsedData(mappedData)

          // Simulate backend check and return record statuses
          await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call

          const simulatedStatuses: ("Success" | "Error" | "Warning")[] = mappedData.map((_, index) => {
            if (index % 7 === 0) return "Error" // Simulate some errors
            if (index % 5 === 0) return "Warning" // Simulate some warnings
            return "Success"
          })
          setRecordStatuses(simulatedStatuses)
          setIsLoading(false)
          setUploadStep("confirm") // Go directly to confirm/preview step
        } catch (parseError: any) {
          console.error("XLSX parsing error:", parseError)
          setUploadError(`Error parsing Excel file: ${parseError.message}`)
          setIsLoading(false)
          setUploadStep("error")
        }
      }

      reader.onerror = (error) => {
        console.error("FileReader error:", error)
        setUploadError(`Error reading file: ${error.message}`)
        setIsLoading(false)
        setUploadStep("error")
      }

      reader.readAsArrayBuffer(file) // Read the file as ArrayBuffer for XLSX.read
    } catch (error: any) {
      console.error("File processing initiation error:", error)
      setUploadError(`File processing initiation error: ${error.message}`)
      setIsLoading(false)
      setUploadStep("error")
    }
  }, [file, currentSchema])

  const handleConfirm = useCallback(async () => {
    setIsLoading(true)
    setUploadError(null)

    // Prepare data for final save, including record statuses
    const dataToSave = parsedData.map((row, index) => {
      const newRow: { [key: string]: string | number } = {}
      currentSchema.forEach((col) => {
        // Use currentSchema here
        // Use col.excelKey as the new key, and the value from row[col.name]
        if (col.excelKey && row[col.name] !== undefined) {
          newRow[col.excelKey] = row[col.name]
        }
      })
      // Add record status if needed, using a consistent key
      newRow["record_status"] = recordStatuses[index] // Using snake_case for consistency
      return newRow
    })

    console.log("Final data to save:", dataToSave)

    // Simulate final API call to save data
    await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API call

    setIsLoading(false)
    setUploadStep("success")
    toast({
      title: "Upload successful!",
      description: "Your data has been processed and stored.",
      variant: "default",
    })

    // Reset modal state after successful upload
    setTimeout(() => {
      resetModalState() // Use the centralized reset function
    }, 2000) // Give some time for the success message to be seen
  }, [parsedData, recordStatuses, currentSchema, resetModalState]) // Add resetModalState to dependencies

  const handleCloseModal = () => {
    resetModalState() // Reset state when modal is closed, including clearing file input
    onClose()
  }

  const handleDownloadTemplate = useCallback(async () => {
    setIsDownloadingTemplate(true)
    try {
      const templatePath = localTemplatePaths[uploadType]
      if (!templatePath) {
        toast({
          title: "Download Error",
          description: "No template found for this upload type.",
          variant: "destructive",
        })
        return
      }

      // Fetch the content from the local public path
      const response = await fetch(templatePath)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const fileContent = await response.blob() // Fetch as blob for XLSX

      const blob = new Blob([fileContent], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }) // Changed MIME type
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.setAttribute("download", `StackingPlan_${uploadType}_Template.xlsx`) // Changed filename extension
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href) // Clean up the URL object
      toast({
        title: "Excel template downloaded",
        description: "You can use this file to import data.",
      })
    } catch (error: any) {
      console.error("Error downloading template:", error)
      toast({
        title: "Download Failed",
        description: `Could not download template: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsDownloadingTemplate(false)
    }
  }, [uploadType]) // Only uploadType is needed here as currentSchema is not used for content

  const getStatusIcon = (status: "Success" | "Error" | "Warning" | undefined) => {
    switch (status) {
      case "Success":
        return <CheckCircle className="h-4 w-4" />
      case "Error":
        return <XCircle className="h-4 w-4" />
      case "Warning":
        return <AlertCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusBadgeVariant = (status: "Success" | "Error" | "Warning" | undefined) => {
    switch (status) {
      case "Success":
        return "success" as const
      case "Error":
        return "destructive" as const
      case "Warning":
        return "warning" as const
      default:
        return "secondary" as const
    }
  }

  const tableHeaders = useMemo(() => {
    const headers = currentSchema.map((col) => col.name) // Use currentSchema here
    return [...headers, "Record Status"]
  }, [currentSchema]) // Add currentSchema to dependencies

  const renderTableContent = () => {
    if (isLoading && uploadStep === "confirm") {
      // Only show skeleton for confirm step if loading
      return Array.from({ length: 10 }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {tableHeaders.map((_, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton className="h-4 w-[100px]" />
            </TableCell>
          ))}
        </TableRow>
      ))
    }

    if (parsedData.length === 0 && uploadStep === "confirm") {
      return (
        <TableRow>
          <TableCell colSpan={tableHeaders.length} className="text-center py-8 text-muted-foreground">
            No data to display.
          </TableCell>
        </TableRow>
      )
    }

    return parsedData.map((row, rowIndex) => (
      <TableRow key={rowIndex}>
        {currentSchema.map(
          (
            col, // Use currentSchema here
          ) => (
            <TableCell key={col.name} className="whitespace-nowrap">
              {String(row[col.name])}
            </TableCell>
          ),
        )}
        <TableCell className="whitespace-nowrap">
          <Badge variant={getStatusBadgeVariant(recordStatuses[rowIndex])} className="flex items-center gap-1">
            {getStatusIcon(recordStatuses[rowIndex])}
            {recordStatuses[rowIndex] || "Pending review"}
          </Badge>
        </TableCell>
      </TableRow>
    ))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-[90vw] h-[90vh] flex flex-col bg-background text-foreground rounded-lg shadow-xl">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-border sticky top-0 bg-background z-10 rounded-t-lg">
          <h2 className="text-2xl font-bold">Upload Excel Data</h2>
          <p className="text-muted-foreground">
            {uploadStep === "upload" && "Select Excel/CSV file and data type to upload."}
            {uploadStep === "confirm" && "Review record status and confirm save."}
            {uploadStep === "success" && "Data uploaded and saved successfully!"}
            {uploadStep === "error" && "An error occurred during upload."}
          </p>
          {/* File Input and Upload Type always visible in header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end mt-4">
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="file" className="text-base font-medium">
                Excel File
              </Label>
              <div className="relative flex">
                <Input
                  id="file"
                  type="file"
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // Chỉ chấp nhận .xlsx
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  ref={fileInputRef} // Attach the ref here
                />
                <div className="flex-1 border border-input rounded-l-md bg-background px-3 py-2 text-sm text-muted-foreground h-10 flex items-center overflow-hidden whitespace-nowrap text-ellipsis">
                  {file ? file.name : "No file chosen"}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-l-none border-l bg-transparent h-10"
                  onClick={() => document.getElementById("file")?.click()}
                >
                  Choose File
                </Button>
              </div>
              {uploadError && <p className="text-sm text-destructive mt-1">{uploadError}</p>}
            </div>
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="upload-type" className="text-base font-medium">
                Upload Type
              </Label>
              <Select value={uploadType} onValueChange={handleUploadTypeChange}>
                <SelectTrigger id="upload-type" className="bg-background border-input h-10">
                  <SelectValue placeholder="Select upload type" />
                </SelectTrigger>
                <SelectContent className="bg-popover text-popover-foreground">
                  <SelectItem value="metadata">Metadata</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="spcode">SPCode</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCloseModal}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-7 w-7" /> {/* Changed to X icon and larger size */}
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          {" "}
          {/* Removed overflow-y-auto from here */}
          {/* Skeleton for initial upload loading */}
          {isLoading && uploadStep === "upload" && (
            <div className="flex flex-col items-center justify-center h-full text-center py-20 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <h3 className="text-xl font-bold text-muted-foreground">Processing your file...</h3>
              <p className="text-muted-foreground">This may take a moment.</p>
              <div className="w-full max-w-3xl mt-8 space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          )}
          {/* Content for upload step when not loading */}
          {uploadStep === "upload" && !isLoading && (
            <div className="space-y-6 max-w-2xl mx-auto py-10">
              <p className="text-center text-muted-foreground mb-6">
                Please download the Excel template, fill in the data, and upload it here.
              </p>
            </div>
          )}
          {/* Show table if in confirm step or if data is parsed and not in upload/success/error */}
          {(uploadStep === "confirm" ||
            (parsedData.length > 0 &&
              uploadStep !== "upload" &&
              uploadStep !== "success" &&
              uploadStep !== "error")) && (
            <div className="border border-border rounded-lg overflow-hidden shadow-sm h-full max-h-[calc(90vh-280px)]">
              {" "}
              {/* Added max-h and overflow-y-auto */}
              <div className="relative w-full overflow-y-auto h-full">
                {" "}
                {/* Added overflow-y-auto here */}
                <Table>
                  <TableHeader className="sticky top-0 bg-muted z-10">
                    <TableRow>
                      {tableHeaders.map((header) => (
                        <TableHead key={header} className="whitespace-nowrap text-muted-foreground">
                          {header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>{renderTableContent()}</TableBody>
                </Table>
                {/* This overlay is for the table specifically, when loading in confirm step */}
                {isLoading && uploadStep === "confirm" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
              </div>
            </div>
          )}
          {uploadStep === "success" && (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <Check className="h-20 w-20 text-green-500 mb-6" />
              <h3 className="text-3xl font-bold mb-3">Upload successful!</h3>
              <p className="text-lg text-muted-foreground">Your data has been processed and stored.</p>
            </div>
          )}
          {uploadStep === "error" && (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <XCircle className="h-20 w-20 text-destructive mb-6" />
              <h3 className="text-3xl font-bold mb-3">An error occurred!</h3>
              <p className="text-lg text-muted-foreground">{uploadError || "Please try again."}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-border sticky bottom-0 bg-background z-10 rounded-b-lg flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handleCloseModal}
            disabled={isLoading}
            className="px-4 py-2 bg-transparent"
          >
            Close
          </Button>
          <div className="flex gap-3">
            {uploadStep === "upload" && (
              <>
                <Button
                  onClick={handleDownloadTemplate}
                  disabled={isDownloadingTemplate} // Disable button during download
                  variant="outline"
                  className="flex items-center gap-2 text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 bg-transparent"
                >
                  {isDownloadingTemplate ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Download Excel Template
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!file || isLoading}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <UploadCloud className="mr-2 h-4 w-4" />
                  )}
                  Upload
                </Button>
              </>
            )}
            {uploadStep === "confirm" && (
              <Button
                onClick={handleConfirm}
                disabled={isLoading}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center"
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                Confirm Save
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
