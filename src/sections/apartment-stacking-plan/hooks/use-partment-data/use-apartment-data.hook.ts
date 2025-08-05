"use client"

import { useMemo } from "react"
import { useApiData } from "../use-api-data"
import { useExchangeRate } from "../use-exchange-rate"

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

interface Floor {
  number: number
  floorString?: string
  units: (ApartmentUnit | null)[]
  availableCount: number
  block: string
}

interface BlockData {
  name: string
  change: string
  total: number
  available: number
  sold: number
  trend: "up" | "down" | "neutral"
}

export type { ApartmentUnit, Floor, BlockData }

// Generate mock units based on metadata structure
function generateMockUnitsFromMetadata(blockMetadata: any, selectedBlock: any) {
  const mockUnits: any[] = []
  const statuses: ("available" | "sold" | "booked" | "unavailable")[] = ["available", "sold", "booked", "unavailable"]

  // Generate units for each floor and unit number combination
  blockMetadata.floors.forEach((floor: string) => {
    blockMetadata.unit_numbers.forEach((unitInfo: any, unitIndex: number) => {
      // Skip some units randomly to create realistic gaps
      if (Math.random() < 0.15) return // 15% chance to skip

      const unitCode = `${selectedBlock.name}-${floor}-${unitInfo.number}`
      const basePrice = (2.5 + Math.random() * 2.5) * 1000000000 // 2.5-5 billion
      const area = 50 + Math.floor(Math.random() * 40) // 50-90m²

      mockUnits.push({
        id: `mock-${floor}-${unitInfo.number}`,
        block_id: selectedBlock.id,
        code: unitCode,
        floor: floor,
        number: unitInfo.number,
        area: area,
        price: basePrice,
        direction: unitInfo.direction,
        balcony_direction: "Nam",
        num_bedrooms: Math.random() > 0.3 ? (Math.random() > 0.5 ? 2 : 3) : 1,
        num_bathrooms: Math.random() > 0.5 ? 2 : 1,
        phong_thuy: "Hợp mệnh Hỏa",
        status: statuses[Math.floor(Math.random() * statuses.length)],
        created_at: new Date().toISOString(),
        is_approved: Math.random() > 0.3,
        is_locked: Math.random() > 0.7,
        buyer:
          Math.random() > 0.7
            ? {
                name: "Nguyễn Văn A",
                phone: "0909090909",
                create_date: "30/07/2025",
                buyer_status: "interested",
              }
            : undefined,
      })
    })
  })

  return mockUnits
}

export function useApartmentData() {
  const {
    projects,
    blocks,
    units,
    blockMetadata,
    loading,
    error,
    selectedProjectId,
    selectedBlockId,
    setSelectedProjectId,
    setSelectedBlockId,
  } = useApiData()

  const exchangeRate = useExchangeRate("VND", "USD")

  // Convert API data to component format
  const processedData = useMemo(() => {
    console.log("🔍 DEBUG - useApartmentData processedData:")
    console.log("- blocks.length:", blocks.length)
    console.log("- blockMetadata:", blockMetadata)
    console.log("- selectedBlockId:", selectedBlockId)
    console.log("- selectedProjectId:", selectedProjectId)
    console.log("- loading:", loading)

    // Return empty data only when we have no basic data at all
    if (blocks.length === 0) {
      console.log("❌ Returning empty data - no blocks")
      return {
        floors: [],
        blockData: [],
        selectedProject: null,
        selectedBlock: "",
      }
    }

    const selectedProject = projects.find((p) => p.id === selectedProjectId)
    const selectedBlock = blocks.find((b) => b.id === selectedBlockId)

    console.log("- selectedProject:", selectedProject)
    console.log("- selectedBlock:", selectedBlock)

    // Generate block summary data from API blocks
    const blockData: BlockData[] = blocks.map((block) => {
      const changePercent = (Math.random() - 0.5) * 4 // -2% to +2%
      const trend = changePercent > 0.5 ? "up" : changePercent < -0.5 ? "down" : "neutral"

      return {
        name: block.name,
        change: changePercent >= 0 ? `+${changePercent.toFixed(1)}%` : `${changePercent.toFixed(1)}%`,
        total: block.num_units,
        available: block.available,
        sold: block.sold,
        trend: trend as "up" | "down" | "neutral",
      }
    })

    // Generate floor data based on metadata
    let floors: Floor[] = []

    console.log("🏗️ About to generate floors:")
    console.log("- selectedBlock exists:", !!selectedBlock)
    console.log("- blockMetadata exists:", !!blockMetadata)

    if (selectedBlock && blockMetadata) {
      console.log("✅ Both selectedBlock and blockMetadata exist, generating floors...")
      // Use real units if available, otherwise generate mock data
      // const unitsToProcess = units.length > 0 ? units : generateMockUnitsFromMetadata(blockMetadata, selectedBlock)
      const unitsToProcess = units.length > 0 ? units : [];
      
      console.log("🔍 DEBUG - Processing units:")
      console.log("Real units count:", units.length)
      console.log("Units to process count:", unitsToProcess.length)
      console.log("Block metadata:", blockMetadata)

      // Create a map of units by floor and number for quick lookup
      const unitsMap = new Map<string, ApartmentUnit>()

      unitsToProcess.forEach((unit, index) => {
        const apartmentUnit: ApartmentUnit = {
          code: unit.code,
          price: `${(unit.price / 1000000000).toFixed(1)} billion`,
          priceUSD: exchangeRate
          ? `$${Math.round(unit.price * exchangeRate).toLocaleString()}`
          : "Updating...",
          status: unit.status,
          area: `${unit.area}m²`,
          bedrooms: unit.num_bedrooms,
          bathrooms: unit.num_bathrooms,
          view: `${unit.direction} - ${unit.phong_thuy}`,
          block: selectedBlock.name,
          isApproved: unit.is_approved,
          isLocked: unit.is_locked,
          isBlocked: false,
          buyer: unit.buyer
            ? {
                name: unit.buyer.name,
                phone: unit.buyer.phone,
                createDate: unit.buyer.create_date,
                buyerStatus: unit.buyer.buyer_status,
              }
            : undefined,
        }

        // Create key using floor and number for precise positioning
        const key = `${unit.floor}-${unit.number}`
        console.log(`🔑 Setting key: "${key}" for unit ${unit.code}`)
        unitsMap.set(key, apartmentUnit)
      })

      console.log("🗺️ UnitsMap size:", unitsMap.size)
      console.log("🗺️ UnitsMap keys:", Array.from(unitsMap.keys()))

      // Helper function to convert floor string to number for sorting
      const getFloorNumber = (floor: string): number => {
        if (floor === "G") return 0
        if (floor.includes("A")) {
          // Handle floors like "12A"
          return Number.parseInt(floor.replace("A", ""), 10) + 0.5
        }
        return Number.parseInt(floor, 10)
      }

      // Create floors array (ASCENDING ORDER: 1, 2, 3... 15)
      // const sortedFloors = [...blockMetadata.floors].sort((a, b) => {
      //   const aNum = getFloorNumber(a)
      //   const bNum = getFloorNumber(b)
      //   return aNum - bNum // ASCENDING order (1 → 15)
      // })

      const sortedFloors = blockMetadata.floors;
      
      console.log("📊 Sorted floors (ascending):", sortedFloors)

      floors = sortedFloors.map((floorString) => {
        console.log(`🏢 Processing floor: ${floorString}`)

        // Create units array based on metadata unit_numbers
        const unitsArray: (ApartmentUnit | null)[] = blockMetadata.unit_numbers.map((unitInfo: any, index: number) => {
          const key = `${floorString}-${unitInfo.number}`
          const unit = unitsMap.get(key) || null

          console.log(`  📍 Position ${index}: key="${key}" -> ${unit ? unit.code : "null"}`)

          return unit
        })

        // Count available units on this floor
        const availableCount = unitsArray.filter((unit) => unit !== null && unit.status === "available").length

        // Convert floor string to display number
        const floorNumber = floorString === "G" ? 0 : getFloorNumber(floorString)

        console.log(
          `✅ Floor ${floorString}: ${unitsArray.filter((u) => u !== null).length}/${unitsArray.length} units filled`,
        )

        return {
          number: floorNumber,
          floorString: floorString,
          units: unitsArray,
          availableCount,
          block: selectedBlock.name,
        }
      })

      console.log("🏗️ Final floors:", floors)
      console.log(
        "🏗️ Total units across all floors:",
        floors.reduce((sum, floor) => sum + floor.units.filter((u) => u !== null).length, 0),
      )
    }

    return {
      floors,
      blockData,
      selectedProject,
      selectedBlock: selectedBlock?.name || "",
    }
  }, [projects, blocks, units, blockMetadata, selectedProjectId, selectedBlockId])

  return {
    ...processedData,
    projects,
    blocks,
    blockMetadata,
    loading,
    error,
    selectedProjectId,
    selectedBlockId,
    setSelectedProjectId,
    setSelectedBlockId,
  }
}
