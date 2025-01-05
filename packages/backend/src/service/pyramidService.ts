import {
  AnagramLookup,
  ErrorType,
  makeAnagramLookup,
  makeWordRelationGraph,
  PyramidPrompt,
  WordRelationGraph,
} from "@word-games/common"
import seedrandom from "seedrandom"
import { WordStoreService } from "./wordStoreService"

export const makePyramidService = (
  wordStore: WordStoreService,
  store: PyramidStoreAdapter,
) => {
  const getAllPyramids = async () => {
    console.time("[PyramidService] getAllPyramids");
    const [getWordsErr, words] = await wordStore.getWords()
    if (getWordsErr) {
      return [getWordsErr, null] as const
    }

    // anagramLookup helper resolves word => all anagrams super quickly.
    const anagramLookup = makeAnagramLookup()
    for (const word of words) {
      anagramLookup.insert(word)
    }

    // the graph is an abstract concept, in which every word is a unique node.
    // Here, a word X is related to word Y when Y contains all the same letters as X, except one.
    // Aka, X minus one character is an anagram of Y
    // Example:
    // fare => [far, are]
    const graph = makeWordRelationGraph()
    for (const word of words) {
      for (let i = 0; i < word.length; i++) {
        const newChars = word.slice(0, i) + word.slice(i + 1)

        const anagrams = anagramLookup.getAnagrams(newChars)
        if (!anagrams) {
          // every word is an anagram of itself, so if there's nothing found in anagrams then
          // this is not a word.
          continue
        }

        for (const nextLayerWord of anagrams) {
          graph.addDirectedRelation(word, nextLayerWord)
        }
      }
    }

    const pyramidDepth = 5
    const topLevelWords = words.filter((w) => w.length == pyramidDepth)
    const allPyramidSolutions = new Array<Array<string>>()
    for (const w of topLevelWords) {
      findAllPyramids(graph, anagramLookup, allPyramidSolutions, w, 5, [])
    }

    console.timeEnd("[PyramidService] getAllPyramids");
    return [null, { allPyramidSolutions, graph }] as const
  }

  const generate = async (strSeed: string) => {
    console.log("[pyramidService] generate game from seed", strSeed)
    const [err, result] = await getAllPyramids()
    if (err) {
      console.error("[pyramidService] Error generating game", err)
      return [err, null] as const
    }
    const { allPyramidSolutions, graph } = result

    const rand = seedrandom(strSeed)
    const randomIndex = Math.floor(rand() * allPyramidSolutions.length)
    const pyramid = allPyramidSolutions[randomIndex]

    const startingWord = pyramid[0]
    // copy subgraph of solutions for verification later
    const subgraphOfSolutions = makeWordRelationGraph()

    graph.copy(subgraphOfSolutions, startingWord)

    // Build the prompt - to be served to the UI
    const pyramidPrompt: PyramidPrompt = {
      id: strSeed,
      layers: pyramid.map((pyramidLayer) =>
        pyramidLayer.split("").map((char) => ({
          character: char,
          editable: true,
        })),
      ),
    }

    // The first and last layers are not editable
    for (const cell of pyramidPrompt.layers.at(0)!) {
      cell.editable = false
    }

    for (const cell of pyramidPrompt.layers.at(-1)!) {
      cell.editable = false
    }

    // One random character of the 2nd layer will be revealed/ not editable
    const secondLayer = pyramidPrompt.layers.at(1)!
    const randomSecondLayerCharacter = Math.floor(rand() * secondLayer.length)
    secondLayer.at(randomSecondLayerCharacter)!.editable = false

    // Solution prompt has actual answers filled in, but may not be the only answer.
    const solutionPrompt = structuredClone(pyramidPrompt)

    // if the cell is editable, clear the character!
    for (const layer of pyramidPrompt.layers) {
      for (const cell of layer) {
        if (!cell.editable) continue
        cell.character = ""
      }
    }
    // reduce the subgraph of solutions
    subgraphOfSolutions.filterRelations((from: string, to: string) => {
      const layerIdx = startingWord.length - to.length
      const layer = pyramidPrompt.layers[layerIdx]
      if (!layer) return false

      // non editable cells must not have been changed.
      for (let cellIdx = 0; cellIdx < layer.length; cellIdx++) {
        const cell = layer[cellIdx]
        if (!cell.editable && cell.character != to[cellIdx]) {
          // this possible solution is not valid because it
          // doesn't agree on the non-editable characters, so remove it!
          return false
        }
      }

      return true
    })

    // generate all answers flattened - with non editable characters agreeing from what was generated above.
    const allSolutionsStartingAtStartWord = flattenGraph(
      subgraphOfSolutions,
      startingWord,
      startingWord.length,
    )

    await store.setCurrentPyramidPrompt(pyramidPrompt)
    await store.setCurrentPyramidSolutionSubgraph(subgraphOfSolutions)
    await store.setCurrentPyramidSolutionsDebug(allSolutionsStartingAtStartWord)

    return [
      null,
      // prompt - the orignal prompt
      // solutionPrompt - one actual solution
      // subgraphOfSolutions - all possible solutions
      // allSolutionsStartingAtStartWord - flattened subgraphOfSolutions
      {
        prompt: pyramidPrompt,
        solutionPrompt,
        subgraphOfSolutions,
        allSolutionsStartingAtStartWord,
      },
    ] as const
  }

  const getPyramidOfTheDay = async () => {
    return store.getCurrentPyramidPrompt()
  }

  const isValidPyramidSolution = async (maybeSolution: PyramidPrompt) => {
    const [errorGettingPrompt, currentPrompt] =
      await store.getCurrentPyramidPrompt()
    if (errorGettingPrompt) {
      return [errorGettingPrompt, null] as const
    }

    // are they trying to cheat the initial prompt?
    if (!nonEditableFieldsAreValid(currentPrompt, maybeSolution)) {
      return [null, false] as const
    }

    // is this actually a valid pyramid answer?
    const [errorGettingSolutions, solutionsGraph] =
      await store.getCurrentPyramidSolutionGraph()

    if (errorGettingSolutions) {
      return [errorGettingSolutions, null] as const
    }

    const pyramidWords = maybeSolution.layers.map((layer) =>
      layer.map((cell) => cell.character).join(""),
    )

    return [null, isPyramidValid(pyramidWords, solutionsGraph)]
  }

  return {
    generate,
    getPyramidOfTheDay,
    isValidPyramidSolution,
  }
}

export type PyramidService = ReturnType<typeof makePyramidService>
export type PyramidStoreAdapter = {
  getCurrentPyramidPrompt: () => Promise<
    ErrorType<PyramidPrompt, Error | "ENOENT">
  >
  getCurrentPyramidSolutionGraph: () => Promise<
    ErrorType<WordRelationGraph, Error | "ENOENT">
  >
  setCurrentPyramidPrompt: (
    prompt: PyramidPrompt,
  ) => Promise<readonly [Error, null] | [null, void]>
  setCurrentPyramidSolutionSubgraph: (
    solutions: WordRelationGraph,
  ) => Promise<ErrorType<void, Error>>
  setCurrentPyramidSolutionsDebug: (
    solutions: Array<Array<string>>,
  ) => Promise<readonly [Error, null] | [null, void]>
}

const nonEditableFieldsAreValid = (
  trusted: PyramidPrompt,
  untrusted: PyramidPrompt,
) => {
  // wrong number of pyramid layers? the hek
  if (trusted.layers.length != untrusted.layers.length) {
    return false
  }

  for (let layerIndex = 0; layerIndex < trusted.layers.length; layerIndex++) {
    const trustedLayer = trusted.layers[layerIndex]!
    const untrustedLayer = untrusted.layers[layerIndex]!

    // there's more characters in this layer? the heck!?
    if (trustedLayer.length != untrustedLayer.length) {
      return false
    }

    for (
      let characterIndex = 0;
      characterIndex < trustedLayer.length;
      characterIndex++
    ) {
      const trustedChar = trustedLayer[characterIndex]!
      const untrustedChar = trustedLayer[characterIndex]!

      // they changed a non editable?! Cheater!
      if (
        !trustedChar.editable &&
        trustedChar.character != untrustedChar.character
      ) {
        return false
      }
    }
  }

  return true
}

const isPyramidValid = (
  pyramidWords: Array<string>,
  solutionsGraph: WordRelationGraph,
) => {
  for (let i = 0; i < pyramidWords.length - 1; i++) {
    const currentWord = pyramidWords[i].toLowerCase()
    const nextWord = pyramidWords[i + 1].toLowerCase()
    const relations = solutionsGraph.getRelation(currentWord)

    // we must have this word in our subgraph
    // the next word must be related to this word
    if (!relations || !relations.has(nextWord)) {
      return false
    }
  }

  return true
}

// traverse a graph to find all pyramids
const findAllPyramids = (
  graph: WordRelationGraph,
  anagramLookup: AnagramLookup,
  // all solutions
  solutions: Array<Array<string>>,
  // next word to visit
  word: string,
  // current depth, descending
  depth: number,
  // build up the pyramid of the current traversal
  path: Array<string>,
) => {
  path.push(word)
  if (depth === 1) {
    // if we got to depth 1 - then this is a solution to a pyramid!
    solutions.push(path)
    return
  }

  const relations = graph.getRelation(word)
  // if there are no relations in the graph, then there doesn't exist any anagram for this word minus any character
  if (!relations) return

  for (const relatedChars of [...relations]) {
    const relatedWords = anagramLookup.getAnagrams(relatedChars)
    if (!relatedWords) return
    for (const relatedWord of relatedWords) {
      findAllPyramids(graph, anagramLookup, solutions, relatedWord, depth - 1, [
        ...path,
      ])
    }
  }
}

const flattenGraph = (
  graph: WordRelationGraph,
  word: string,
  depth: number,
  solution: Array<string> = new Array(),
  allSolutions: Array<Array<string>> = new Array(),
) => {
  solution.push(word)
  if (depth === 1) {
    allSolutions.push(solution)
    return allSolutions
  }

  const relation = graph.getRelation(word)
  if (!relation) return allSolutions

  for (const relatedWord of relation) {
    flattenGraph(graph, relatedWord, depth - 1, [...solution], allSolutions)
  }
  return allSolutions
}
