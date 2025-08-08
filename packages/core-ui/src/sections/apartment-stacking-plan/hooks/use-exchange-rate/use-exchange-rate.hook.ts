import { useEffect, useState } from "react"

export function useExchangeRate(from: string, to: string): number {
  const [rate, setRate] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRate = async () => {
      setLoading(true)
      setError(null)

      const base = from.toUpperCase()
      const target = to.toUpperCase()

      try {
        const res = await fetch(`https://api.exchangerate.host/latest?base=${base}&symbols=${target}`)
        const data = await res.json()

        if (data && typeof data.rates?.[target] === "number") {
          setRate(data.rates[target])
        } else {
          setError("Invalid exchange rate response")
          console.warn("Unexpected data format:", data)
        }
      } catch (err: any) {
        setError(err?.message || "Failed to fetch exchange rate")
        console.error("Fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchRate()
  }, [from, to])

  return rate
}
