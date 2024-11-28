import { describe, vi, expect, test } from "vitest"
import { makeWordStoreService } from "./wordStoreService"
import { makePyramidService } from "./pyramidService"
import { PyramidStoreService } from "./pyramidStoreService"
import { PyramidPrompt } from "@word-games/common"
import { WordRelationGraph } from "packages/common/src/word-utils/wordRelationGraph"

const makeMockPyramidStore = (): PyramidStoreService => {
  let solutionGraph: WordRelationGraph
  let prompt: PyramidPrompt | undefined
  return {
    init: vi.fn(),
    getCurrentPyramidPrompt: async () => {
      if (!prompt) throw "No Prompt"
      return [null, prompt]
    },
    getCurrentPyramidSolutionGraph: async () => {
      if (!solutionGraph) throw "No Solution Graph"
      return [null, solutionGraph]
    },
    setCurrentPyramidSolutionSubgraph: async (g) => {
      solutionGraph = g
      return [null, undefined]
    },
    setCurrentPyramidSolutionsDebug: vi.fn(),
    setCurrentPyramidPrompt: async (p) => {
      prompt = p
      return [null, undefined]
    },
  }
}

describe("generate pyramid games", () => {
  test("a generated game has 7 revealed, and the rest non editable", async () => {
    const pyramidGenerator = makePyramidService(
      makeWordStoreService(),
      makeMockPyramidStore(),
    )

    const [err, result] = await pyramidGenerator.generate("11/17/2024")
    expect(err).toBeFalsy()
    expect(result).toBeTruthy()

    console.log(JSON.stringify(result?.solutionPrompt, null, 4))
    const prompt = result!.prompt

    let countRevealedCharacters = 0
    for (const layer of prompt.layers) {
      for (const cell of layer) {
        if (cell.editable) {
          expect(cell.character.length).toEqual(0)
        } else {
          expect(cell.character.length).toEqual(1)
        }
        countRevealedCharacters += cell.character === "" ? 0 : 1
      }
    }

    // 5 from top layer, 1 from 2nd layer, 1 from last layer = 7
    expect(countRevealedCharacters).toEqual(7)
  })

  test("generated solution is an answer", async () => {
    const pyramidGenerator = makePyramidService(
      makeWordStoreService(),
      makeMockPyramidStore(),
    )

    const [err, result] = await pyramidGenerator.generate("11/17/2024")
    if (err) {
      throw err
    }
    const { solutionPrompt } = result

    const [isValidErr, isValid] =
      await pyramidGenerator.isValidPyramidSolution(solutionPrompt)
    console.log("isValid", { isValidErr, isValid })
  })
})
