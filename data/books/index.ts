import { bloodDiseasesBook } from "./blood-diseases"
import { serialKillersBook } from "./serial-killers"
import { demonologyBook as demonologyBookData } from "../books"
import { botanyBook as botanyBookData } from "../books"
import { genghisKhanBook } from "./genghis-khan"
import { dogsInCostumesBook } from "./dogs-in-costumes"

export { demonologyBookData as demonologyBook } from "../books"
export { botanyBookData as botanyBook } from "../books"

export { genghisKhanBook } from "./genghis-khan"
export { dogsInCostumesBook } from "./dogs-in-costumes"

const demonologyBook = demonologyBookData
const botanyBook = botanyBookData

export const books = {
  bloodDiseasesBook,
  serialKillersBook,
  demonologyBook,
  botanyBook,
  genghisKhanBook,
  dogsInCostumesBook,
}

export type BookKey = keyof typeof books
