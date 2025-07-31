"use client"

import { useState, useEffect } from "react"

// API Types
interface ApiProject {
  id: string
  name: string
  location: string
  description: string
  created_at: string
}

interface ApiBlock {
  id: string
  project_id: string
  name: string
  num_units: number
  num_floors: number
  description: string
  created_at: string
  available: number
  sole: number
}

interface ApiUnit {
  id: string
  block_id: string
  code: string
  floor: string
  number: string
  area: number
  price: number
  direction: string
  balcony_direction: string
  num_bedrooms: number
  num_bathrooms: number
  phong_thuy: string
  status: "available" | "sold" | "booked" | "unavailable"
  created_at: string
  buyer?: {
    name: string
    phone: string
    create_date: string
    buyer_status: "interested" | "deposited" | "contracted" | "completed"
  }
  is_approved?: boolean
  is_locked?: boolean
  product_price_pack?: number
}

interface BlockMetadata {
  id: string
  name: string
  unit_numbers: Array<{
    number: string
    direction: string
  }>
  floors: string[]
  total_units: number
  total_floors: number
  available: number
  sold: number
  product_type: string
  apartment_type: string
  balcony_view_url: string
}

interface ApiResponse<T> {
  data: T
  message: string
  meta?: {
    total: number
    skip: number
    take: number
    page: number
    totalPages: number
  }
}

const API_BASE_URL = "https://ai-gate-dev.aurora-tech.com/stacking-plan-service/api/v1"
// const API_BASE_URL = "http://192.168.11.102:3000/api/v1"

export function useApiData() {
  const [projects, setProjects] = useState<ApiProject[]>([])
  const [blocks, setBlocks] = useState<ApiBlock[]>([])
  const [units, setUnits] = useState<ApiUnit[]>([])
  const [blockMetadata, setBlockMetadata] = useState<BlockMetadata | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<string>("")
  const [selectedBlockId, setSelectedBlockId] = useState<string>("")

  // Separate loading states for different components
  const [loadingStates, setLoadingStates] = useState({
    projects: true,
    blocks: true, // Start with true to show slider skeleton
    metadata: true, // Start with true to show content skeleton
    units: true, // Start with true to show content skeleton
  })

  // Computed loading states
  const loading = {
    projects: loadingStates.projects,
    blocks: loadingStates.blocks,
    slider: loadingStates.blocks, // Slider shows skeleton when blocks are loading
    content: loadingStates.metadata || loadingStates.units, // Main content shows skeleton when metadata or units loading
    overall: Object.values(loadingStates).some((state) => state), // Overall loading for initial load
  }

  const updateLoadingState = (key: keyof typeof loadingStates, value: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [key]: value }))
  }

  // Initialize with mock data immediately
  useEffect(() => {
    const initializeMockData = () => {
      console.log("🎭 Initializing mock data...")

      // Mock project data
      const mockProject: ApiProject = {
        id: "a4d5fce2-361a-40bf-96f9-721a52d7bff7",
        name: "The Tresor",
        location: "39 Bến Vân Đồn, Q4, TP.HCM",
        description: "Dự án gồm 3 block, view sông, trung tâm thành phố",
        created_at: "2025-07-25T04:53:41.622Z",
      }

      // Mock blocks data
      const mockBlocks: ApiBlock[] = [
        {
          id: "7106f059-644c-4a35-9754-16d5b9cb5b9b",
          project_id: mockProject.id,
          name: "A",
          num_units: 150,
          num_floors: 15,
          description: "Block A view Đông Nam",
          created_at: "2025-07-25T04:55:31.836Z",
          available: 48,
          sole: 5,
        },
        {
          id: "7106f059-644c-4a35-9754-16d5b9cb5b9d",
          project_id: mockProject.id,
          name: "B",
          num_units: 150,
          num_floors: 15,
          description: "Block B view Đông Bắc",
          created_at: "2025-07-25T04:55:31.836Z",
          available: 80,
          sole: 70,
        },
        {
          id: "7106f059-644c-4a35-9754-16d5b9cb5b9e",
          project_id: mockProject.id,
          name: "C",
          num_units: 150,
          num_floors: 15,
          description: "Block C view Đông Tây",
          created_at: "2025-07-25T04:55:31.836Z",
          available: 120,
          sole: 30,
        },
      ]

      // Mock metadata matching the real API structure
      const mockMetadata: BlockMetadata = {
        id: "7106f059-644c-4a35-9754-16d5b9cb5b9b",
        name: "A",
        unit_numbers: [
          { number: "G", direction: "Bắc" },
          { number: "02", direction: "Đông" },
          { number: "03", direction: "Tây Bắc" },
          { number: "03A", direction: "Tây" },
          { number: "04", direction: "Tây Nam" },
          { number: "05", direction: "Đông Bắc" },
          { number: "05A", direction: "Đông" },
          { number: "06", direction: "Nam" },
          { number: "07", direction: "Tây" },
          { number: "08", direction: "Tây" },
          { number: "09", direction: "Tây" },
          { number: "10", direction: "Tây" },
        ],
        floors: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "12A", "14", "15"],
        total_units: 150,
        total_floors: 15,
        available: 48,
        sold: 5,
        product_type: "Biệt thự",
        apartment_type: "2PN",
        balcony_view_url: "https://example.com/view/mountain-view.jpg",
      }

      setProjects([mockProject])
      setBlocks(mockBlocks)
      setBlockMetadata(mockMetadata)
      setSelectedProjectId(mockProject.id)
      setSelectedBlockId(mockBlocks[0].id)
      setUnits([]) // Empty - will generate mock data in useApartmentData

      // Set all loading states to false after mock data is ready
      setLoadingStates({
        projects: false,
        blocks: false,
        metadata: false,
        units: false,
      })
      setError(null)
    }

    // Try to fetch from API first, fallback to mock data
    const fetchProjects = async () => {
      try {
        updateLoadingState("projects", true)
        console.log("🌐 Fetching projects from API...")

        const response = await fetch(`${API_BASE_URL}/projects`)
        if (!response.ok) throw new Error("Failed to fetch projects")

        const data: ApiResponse<ApiProject[]> = await response.json()
        console.log("✅ Projects fetched successfully:", data.data.length)

        setProjects(data.data)
        setError(null)

        // Auto-select first project
        if (data.data.length > 0 && !selectedProjectId) {
          setSelectedProjectId(data.data[0].id)
        }

        updateLoadingState("projects", false)
      } catch (err) {
        console.warn("❌ API not available, using mock data:", err)
        // initializeMockData()
      }
    }

    fetchProjects()
  }, [])

  // Fetch blocks by project
  const fetchBlocks = async (projectId: string) => {
    try {
      updateLoadingState("blocks", true)
      console.log("🌐 Fetching blocks for project:", projectId)

      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/blocks`)
      if (!response.ok) throw new Error("Failed to fetch blocks")

      const data: ApiResponse<ApiBlock[]> = await response.json()
      console.log("✅ Blocks fetched successfully:", data.data.length)

      setBlocks(data.data)
      setError(null)

      // Auto-select first block
      if (data.data.length > 0) {
        setSelectedBlockId(data.data[0].id)
      }

      updateLoadingState("blocks", false)
    } catch (err) {
      console.warn("❌ API not available for blocks, keeping mock data:", err)
      updateLoadingState("blocks", false)
      setError(null)
    }
  }

  // Fetch block metadata
  const fetchBlockMetadata = async (blockId: string) => {
    try {
      updateLoadingState("metadata", true)
      console.log("🌐 Fetching metadata for block:", blockId)

      const response = await fetch(`${API_BASE_URL}/blocks/${blockId}/metadata`)
      if (!response.ok) throw new Error("Failed to fetch block metadata")

      const data: ApiResponse<BlockMetadata> = await response.json()
      console.log("✅ Metadata fetched successfully:", data.data)

      setBlockMetadata(data.data)
      setError(null)
      updateLoadingState("metadata", false)
    } catch (err) {
      console.warn("❌ API not available for metadata, using mock data:", err)
      updateLoadingState("metadata", false)
      setError(null)
    }
  }

  // Fetch units by block
  const fetchUnits = async (blockId: string) => {
    try {
      updateLoadingState("units", true)
      console.log("🌐 Fetching units for block:", blockId)

      const response = await fetch(`${API_BASE_URL}/units/block/${blockId}`)
      if (!response.ok) throw new Error("Failed to fetch units")

      const data: ApiResponse<ApiUnit[]> = await response.json()
      console.log("✅ Units fetched successfully:", data.data.length)

      setUnits(data.data)
      setError(null)
      updateLoadingState("units", false)
    } catch (err) {
      console.warn("❌ API not available for units, will use generated mock data:", err)
      setUnits([])
      updateLoadingState("units", false)
      setError(null)
    }
  }

  // Load blocks when project changes
  useEffect(() => {
    if (selectedProjectId && projects.length > 0) {
      // Clear old data when project changes
      setBlocks([])
      setBlockMetadata(null)
      setUnits([])
      setSelectedBlockId("")

      // Fetch new blocks
      fetchBlocks(selectedProjectId)
    }
  }, [selectedProjectId, projects])

  // Load metadata and units when block changes
  useEffect(() => {
    if (selectedBlockId && blocks.length > 0) {
      // Clear old data when block changes
      setBlockMetadata(null)
      setUnits([])

      // Start both requests in parallel
      fetchBlockMetadata(selectedBlockId)
      fetchUnits(selectedBlockId)
    }
  }, [selectedBlockId, blocks])

  return {
    projects,
    blocks,
    units,
    blockMetadata,
    loading, // Return the computed loading object
    error,
    selectedProjectId,
    selectedBlockId,
    setSelectedProjectId,
    setSelectedBlockId,
    refetch: {
      projects: () => {},
      blocks: () => selectedProjectId && fetchBlocks(selectedProjectId),
      units: () => selectedBlockId && fetchUnits(selectedBlockId),
      metadata: () => selectedBlockId && fetchBlockMetadata(selectedBlockId),
    },
  }
}
