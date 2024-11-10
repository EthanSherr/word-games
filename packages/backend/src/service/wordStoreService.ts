import path from "path";
import fsPromises from "fs/promises";
import {
  ErrorType,
  tryCatch,
} from "@word-games/common/src/promise-utils/tryCatch";
// maybe pull from env, and default to ./storage for local?
const storageDirectory = "./storage";
const savedWords = "words.txt";

const pathToSavedWords = path.join(storageDirectory, savedWords);

export const makeWordStoreService = () => {
  const getWords = async (): Promise<
    ErrorType<Array<string>, Error | "ENOENT">
  > => {
    const [readFileError, str] = await tryCatch<string, NodeJS.ErrnoException>(
      () => fsPromises.readFile(pathToSavedWords, { encoding: "utf8" }),
    );
    if (readFileError) {
      if (readFileError.code === "ENOENT") {
        return ["ENOENT", null];
      }
      return [readFileError, null];
    }
    const words = str.split("\n").map((w) => w.replace("\r", ""));
    return [null, words];
  };

  return {
    getWords,
  };
};
export type WordStoreService = ReturnType<typeof makeWordStoreService>;
