import { bloodDiseasesBook } from "./blood-diseases"
import { serialKillersBook } from "./serial-killers"
import { demonologyBook } from "../books"
import { botanyBook } from "../books"

export const books = {
  bloodDiseasesBook,
  serialKillersBook,
  demonologyBook,
  botanyBook,
}

export type BookKey = keyof typeof books
