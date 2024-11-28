import path from "path"
import fsPromises from "fs/promises"
import { ErrorType, tryCatch } from "@word-games/common"
import z from "zod"
// maybe pull from env, and default to ./storage for local?
// const storageDirectory = "./storage"
// const savedWords = "words.txt"

// const pathToSavedWords = path.join(storageDirectory, savedWords)

const envVars = z.object({
  VITE_PATH_TO_WORDS: z.string(),
})

export const makeWordStoreService = () => {
  const getWords = async (): Promise<
    ErrorType<Array<string>, Error | "ENOENT">
  > => {
    const { VITE_PATH_TO_WORDS: pathToSavedWords } = envVars.parse(
      import.meta.env,
    )
    const [readFileError, str] = await tryCatch<string, NodeJS.ErrnoException>(
      () => fsPromises.readFile(pathToSavedWords, { encoding: "utf8" }),
    )
    if (readFileError) {
      console.error(
        `[WordService] unable to load words from ${pathToSavedWords}`,
      )
      if (readFileError.code === "ENOENT") {
        return ["ENOENT", null]
      }
      return [readFileError, null]
    }
    const words = str.split("\n").map((w) => w.replace("\r", ""))
    return [null, words]
  }

  return {
    getWords,
  }
}
export type WordStoreService = ReturnType<typeof makeWordStoreService>
