import { tryCatch } from "@word-games/common"
import fs from "fs"
import fsPromises from "fs/promises"
import path from "path"

export const makeFileStorageHelper = (rootStorage: string = "./storage") => {
  const init = async () => {
    if (!fs.existsSync(rootStorage)) {
      await fsPromises.mkdir(rootStorage, { recursive: true })
    }
  }

  const getPathToFile = (file: string) => {
    return path.join(rootStorage, file)
  }

  const readFileString = async (file: string) => {
    const [readFileError, str] = await tryCatch<string, NodeJS.ErrnoException>(
      () => fsPromises.readFile(getPathToFile(file), { encoding: "utf8" }),
    )
    if (readFileError) {
      if (readFileError.code === "ENOENT") {
        return ["ENOENT", null] as const
      }
      return [readFileError, null] as const
    }
    return [null, str] as const
  }

  const readFileJson = async (file: string) => {
    const [readFileErr, str] = await readFileString(file)
    if (readFileErr) {
      return [readFileErr, null] as const
    }

    const [jsonError, json] = await tryCatch(() => JSON.parse(str))
    if (jsonError) {
      return [jsonError, null] as const
    }

    return [null, json as Record<any, any>] as const
  }

  const writeFileStr = async (file: string, contents: string) => {
    return tryCatch(() =>
      fsPromises.writeFile(getPathToFile(file), contents, {
        encoding: "utf8",
      }),
    )
  }

  const writeFileJson = async (file: string, entry: Record<any, any>) => {
    const [stringifyError, contents] = await tryCatch(async () =>
      JSON.stringify(entry, null, 4),
    )

    if (stringifyError) {
      return [stringifyError, null] as const
    }

    return writeFileStr(file, contents)
  }

  return {
    init,
    getPathToFile,
    readFileString,
    readFileJson,
    writeFileStr,
    writeFileJson,
  }
}
export type FileStorageHelper = ReturnType<typeof makeFileStorageHelper>
