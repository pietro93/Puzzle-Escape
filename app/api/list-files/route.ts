import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

export async function GET() {
  try {
    const publicDirectory = path.join(process.cwd(), "public")
    const files = await fs.readdir(publicDirectory)
    return NextResponse.json({ files })
  } catch (error) {
    console.error("Error reading directory:", error)
    return NextResponse.json({ error: "Failed to read directory" }, { status: 500 })
  }
}
