import { bloodDiseasesBook } from "./blood-diseases"
import { serialKillersBook } from "./serial-killers"
import { demonologyBook } from "../books"
import { botanyBook } from "../books"
import { puppiesBook } from "./puppies"
import { genghisKhanBook } from "./genghis-khan"

export const books = {
  bloodDiseasesBook,
  serialKillersBook,
  demonologyBook,
  botanyBook,
  puppiesBook,
  genghisKhanBook,
}

export type BookKey = keyof typeof books
