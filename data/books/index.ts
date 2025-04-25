import { bloodDiseasesBook } from "./blood-diseases"
import { serialKillersBook } from "./serial-killers"
import { demonologyBook } from "../books"
import { botanyBook } from "../books"
import { puppiesBook } from "./puppies"

export const books = {
  bloodDiseasesBook,
  serialKillersBook,
  demonologyBook,
  botanyBook,
  puppiesBook,
}

export type BookKey = keyof typeof books
