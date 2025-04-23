"use client"

import { Book } from "lucide-react"
import type { Book as BookType } from "@/components/murder-mystery/types"
import { demonologyBook } from "@/library-books/demonology"
import { botanyBook } from "@/library-books/botany"

interface LibraryViewProps {
  onOpenBook: (book: BookType) => void
}

export function LibraryView({ onOpenBook }: LibraryViewProps) {
  return (
    <div className="text-gray-300 bg-black p-4">
      <p>The library contains thousands of books on various subjects.</p>
      <p className="mt-2">Two books catch your attention:</p>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div
          className="bg-gray-900 p-3 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
          onClick={() => onOpenBook(demonologyBook)}
        >
          <div className="flex items-center gap-2">
            <Book className="text-red-400" />
            <h3 className="font-semibold text-red-300">Demonology</h3>
          </div>
          <p className="text-sm mt-2">A comprehensive guide to supernatural creatures that feed on humans.</p>
        </div>

        <div
          className="bg-gray-900 p-3 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
          onClick={() => onOpenBook(botanyBook)}
        >
          <div className="flex items-center gap-2">
            <Book className="text-green-400" />
            <h3 className="font-semibold text-green-300">Botany</h3>
          </div>
          <p className="text-sm mt-2">An encyclopedia of plants, including many poisonous varieties.</p>
        </div>
      </div>
    </div>
  )
}
