"use client"

import { useEffect } from "react"

export default function Page() {
  useEffect(() => {
    const listFiles = async () => {
      try {
        const response = await fetch("/api/list-files")
        const data = await response.json()
        console.log("Files in public directory:", data)
      } catch (error) {
        console.error("Error listing files:", error)
      }
    }

    listFiles()
  }, [])

  return (
    <div>
      <h1>Puzzle Escape</h1>
    </div>
  )
}
