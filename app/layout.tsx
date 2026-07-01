import type React from "react"
import type { Metadata } from "next"
import { MedievalSharp } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"

const medievalSharp = MedievalSharp({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-medieval",
})

const imFellEnglish = localFont({
  src: "../public/fonts/IMFellEnglish-Regular.woff2",
  weight: "400",
  variable: "--font-parchment",
})

export const metadata: Metadata = {
  title: "Puzzle Escape",
  description: "A mysterious puzzle game where you solve puzzles to escape",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${medievalSharp.variable} ${imFellEnglish.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#121212" />
      </head>
      <body>{children}</body>
    </html>
  )
}
