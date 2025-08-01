"use client"

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
  units: (ApartmentUnit | null)[]
  availableCount: number
  block: string
}

interface BlockMetadata {
  id: string
  name: string
  numUnits: number
  numFloors: number
  available: number
  sold: number
}

export function generateMockDataFromMetadata(blockMetadata: BlockMetadata): Floor[] {
  const floors: Floor[] = []
  const statuses: ("available" | "sold" | "booked" | "unavailable")[] = ["available", "sold", "booked", "unavailable"]
  const views = ["City", "River", "Garden", "Mountain", "Park", "Đông Nam", "Tây Bắc", "Đông Bắc", "Tây Nam"]
  const directions = ["Bắc", "Nam", "Đông", "Tây", "Đông Bắc", "Tây Bắc", "Đông Nam", "Tây Nam"]
  const phongThuyOptions = [
    "Hợp mệnh Hỏa",
    "Hợp mệnh Thổ",
    "Hợp mệnh Kim",
    "Hợp mệnh Mộc",
    "Hợp mệnh Thủy",
    "Phong thuỷ tài lộc",
    "Phong thủy vượng khí",
    "Phong thủy an lạc",
    "View sông",
    "Góc đẹp",
    "View trung tâm",
  ]

  // Calculate units per floor
  const unitsPerFloor = Math.ceil(blockMetadata.numUnits / blockMetadata.numFloors)

  // Generate floors from bottom to top (floor 1 at top, highest floor at bottom)
  for (let floorNum = 1; floorNum <= blockMetadata.numFloors; floorNum++) {
    const units: (ApartmentUnit | null)[] = []

    // Generate units for this floor
    for (let unitNum = 1; unitNum <= unitsPerFloor; unitNum++) {
      // Some positions might be empty (public restroom, utility area, etc.)
      const isEmpty = Math.random() < 0.1 // 10% chance of empty space

      if (isEmpty) {
        units.push(null) // Push null for empty spaces
        continue
      }

      const unitCode = `${blockMetadata.name}-${String(floorNum).padStart(2, "0")}-${String(unitNum).padStart(2, "0")}`

      // Base price increases with floor
      const floorMultiplier = 1 + (floorNum - 1) * 0.01 // 1% increase per floor
      const basePrice = (2.5 + Math.random() * 1.5) * floorMultiplier // 2.5 - 4.0 billion

      const area = 50 + Math.floor(Math.random() * 30) // 50-80m²
      const bedrooms = Math.random() > 0.3 ? (Math.random() > 0.5 ? 2 : 3) : 1
      const bathrooms = bedrooms === 3 ? 2 : Math.random() > 0.5 ? 2 : 1
      const view = views[Math.floor(Math.random() * views.length)]
      const direction = directions[Math.floor(Math.random() * directions.length)]
      const phongThuy = phongThuyOptions[Math.floor(Math.random() * phongThuyOptions.length)]

      // Determine status based on block statistics
      let status: "available" | "sold" | "booked" | "unavailable"
      const rand = Math.random()
      const availableRatio = blockMetadata.available / blockMetadata.numUnits
      const soldRatio = blockMetadata.sold / blockMetadata.numUnits

      if (rand < availableRatio) {
        status = "available"
      } else if (rand < availableRatio + soldRatio) {
        status = "sold"
      } else if (rand < availableRatio + soldRatio + 0.1) {
        status = "booked"
      } else {
        status = "unavailable"
      }

      units.push({
        code: unitCode,
        price: `${basePrice.toFixed(1)} billion`,
        priceUSD: `$${Math.floor(basePrice * 41000)}`,
        status,
        area: `${area}m²`,
        bedrooms,
        bathrooms,
        view: `${direction} - ${view}`,
        block: blockMetadata.name,
        isApproved: Math.random() > 0.3,
        isLocked: Math.random() > 0.7,
        isBlocked: Math.random() > 0.9,
        buyer:
          Math.random() > 0.7
            ? {
                name: "Nguyễn Văn A",
                phone: "0909090909",
                createDate: new Date().toLocaleDateString("vi-VN"),
                buyerStatus: Math.random() > 0.5 ? "deposited" : "interested",
              }
            : undefined,
      })
    }

    const availableCount = units.filter((unit) => unit !== null && unit.status === "available").length

    floors.push({
      number: floorNum,
      units,
      availableCount,
      block: blockMetadata.name,
    })
  }

  return floors
}

export function generateBlockSummaryData(blocks: BlockMetadata[]) {
  return blocks.map((block, index) => {
    const changePercent = (Math.random() - 0.5) * 4 // -2% to +2%
    const trend = changePercent > 0.5 ? "up" : changePercent < -0.5 ? "down" : "neutral"

    return {
      name: block.name,
      change: changePercent >= 0 ? `+${changePercent.toFixed(1)}%` : `${changePercent.toFixed(1)}%`,
      total: block.numUnits,
      available: block.available,
      sold: block.sold,
      trend: trend as "up" | "down" | "neutral",
    }
  })
}
