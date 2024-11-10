import {
  AnagramLookup,
  makeAnagramLookup,
} from "@word-games/common/src/word-utils/anagramLookup";
import {
  makePyramidStoreService,
  PyramidStoreService,
} from "./pyramidStoreService";
import { makeWordStoreService, WordStoreService } from "./wordStoreService";
import {
  makeWordRelationGraph,
  WordRelationGraph,
} from "@word-games/common/src/word-utils/wordRelationGraph";
import seedrandom from "seedrandom";
import { PyramidPrompt } from "@word-games/common/src/model/pyramid";

export const makePyramidGeneratorService = (
  wordStore: WordStoreService = makeWordStoreService(),
  store: PyramidStoreService = makePyramidStoreService(),
) => {
  const init = async () => {
    await store.init();
  };
  const getAllPyramids = async () => {
    const [getWordsErr, words] = await wordStore.getWords();
    if (getWordsErr) {
      return [getWordsErr, null] as const;
    }

    // anagramLookup helper resolves word => all anagrams super quickly.
    const anagramLookup = makeAnagramLookup();
    for (const word of words) {
      anagramLookup.insert(word);
    }

    // the graph is an abstract concept, in which every word is a unique node.
    // Here, a word X is related to word Y when Y contains all the same letters as X, except one.
    // Aka, X minus one character is an anagram of Y
    // Example:
    // fare => [far, are]
    const graph = makeWordRelationGraph();
    for (const word of words) {
      for (let i = 0; i < word.length; i++) {
        const newChars = word.slice(0, i) + word.slice(i + 1);

        const anagrams = anagramLookup.getAnagrams(newChars);
        if (!anagrams) {
          // every word is an anagram of itself, so if there's nothing found in anagrams then
          // this is not a word.
          continue;
        }

        for (const nextLayerWord of anagrams) {
          graph.addDirectedRelation(word, nextLayerWord);
        }
      }
    }

    const pyramidDepth = 5;
    const topLevelWords = words.filter((w) => w.length == pyramidDepth);
    const allPyramidSolutions = new Array<Array<string>>();
    for (const w of topLevelWords) {
      findAllPyramids(graph, anagramLookup, allPyramidSolutions, w, 5, []);
    }

    return [null, { allPyramidSolutions, graph }] as const;
  };

  const generate = async (strSeed: string) => {
    const [err, result] = await getAllPyramids();
    if (err) {
      console.error("[pyramidGeneratorService] Error generating game", err);
      return [err, null] as const;
    }

    const { allPyramidSolutions, graph } = result;

    const rand = seedrandom(strSeed);
    const pyramid =
      allPyramidSolutions[Math.floor(rand() * allPyramidSolutions.length)];

    const startingWord = pyramid[0];
    // copy subgraph of solutions for verification later
    const subgraphOfSolutions = makeWordRelationGraph();
    console.log("starting word", startingWord);
    graph.copy(subgraphOfSolutions, startingWord);
    console.log("copy done");

    // Build the prompt - to be served to the UI
    const pyramidPrompt: PyramidPrompt = {
      id: strSeed,
      layers: pyramid.map((pyramidLayer) =>
        pyramidLayer.split("").map((char) => ({
          character: char,
          editable: false,
        })),
      ),
    };

    // The first and last layers are not editable
    for (const cell of pyramidPrompt.layers.at(0)!) {
      cell.editable = false;
    }

    for (const cell of pyramidPrompt.layers.at(-1)!) {
      cell.editable = false;
    }

    // One random character of the 2nd layer will be revealed/ not editable
    const secondLayer = pyramidPrompt.layers.at(1)!;
    const randomSecondLayerCharacter = Math.floor(rand() * secondLayer.length);
    secondLayer.at(randomSecondLayerCharacter)!.editable = false;

    await store.setCurrentPyramidPrompt(pyramidPrompt);
    await store.setCurrentPyramidSolutions(subgraphOfSolutions);

    return [null, { prompt: pyramidPrompt }] as const;
  };

  return {
    init,
    generate,
  };
};
export type PyramidGeneratorService = ReturnType<
  typeof makePyramidGeneratorService
>;

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
  path.push(word);
  if (depth === 1) {
    // if we got to depth 1 - then this is a solution to a pyramid!
    solutions.push(path);
    return;
  }

  const relations = graph.getRelation(word);
  // if there are no relations in the graph, then there doesn't exist any anagram for this word minus any character
  if (!relations) return;

  for (const relatedChars of [...relations]) {
    const relatedWords = anagramLookup.getAnagrams(relatedChars);
    if (!relatedWords) return;
    for (const relatedWord of relatedWords) {
      findAllPyramids(graph, anagramLookup, solutions, relatedWord, depth - 1, [
        ...path,
      ]);
    }
  }
};
