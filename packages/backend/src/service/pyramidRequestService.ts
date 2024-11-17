import { PyramidPrompt } from "@word-games/common/src/model/pyramid";
import {
  PyramidStoreService,
  makePyramidStoreService,
} from "./pyramidStoreService";
import { WordRelationGraph } from "@word-games/common/src/word-utils/wordRelationGraph";

export const makePyramidRequestService = (
  store: PyramidStoreService = makePyramidStoreService(),
) => {
  const getPyramidOfTheDay = async () => {
    return store.getCurrentPyramidPrompt();
  };

  const isValidPyramidSolution = async (maybeSolution: PyramidPrompt) => {
    const [errorGettingPrompt, currentPrompt] =
      await store.getCurrentPyramidPrompt();
    if (errorGettingPrompt) {
      return [errorGettingPrompt, null] as const;
    }

    // are they trying to cheat the initial prompt?
    if (!nonEditableFieldsAreValid(currentPrompt, maybeSolution)) {
      return false;
    }

    // is this actually a valid pyramid answer?
    const [errorGettingSolutions, solutionsGraph] =
      await store.getCurrentPyramidSolutions();

    if (errorGettingSolutions) {
      return [errorGettingSolutions, null] as const;
    }

    const pyramidWords = maybeSolution.layers.map((layer) =>
      layer.map((cell) => cell.character).join(""),
    );

    return [null, isPyramidValid(pyramidWords, solutionsGraph)];
  };

  return {
    getPyramidOfTheDay,
    isValidPyramidSolution,
  };
};

const nonEditableFieldsAreValid = (
  trusted: PyramidPrompt,
  untrusted: PyramidPrompt,
) => {
  // wrong number of pyramid layers? the hek
  if (trusted.layers.length != untrusted.layers.length) {
    return false;
  }

  for (let layerIndex = 0; layerIndex < trusted.layers.length; layerIndex++) {
    const trustedLayer = trusted.layers[layerIndex]!;
    const untrustedLayer = untrusted.layers[layerIndex]!;

    // there's more characters in this layer? the heck!?
    if (trustedLayer.length != untrustedLayer.length) {
      return false;
    }

    for (
      let characterIndex = 0;
      characterIndex < trustedLayer.length;
      characterIndex++
    ) {
      const trustedChar = trustedLayer[characterIndex]!;
      const untrustedChar = trustedLayer[characterIndex]!;

      // they changed a non editable?! Cheater!
      if (
        !trustedChar.editable &&
        trustedChar.character != untrustedChar.character
      ) {
        return false;
      }
    }
  }

  return true;
};

const isPyramidValid = (
  pyramidWords: Array<string>,
  solutionsGraph: WordRelationGraph,
) => {
  for (let i = 0; i < pyramidWords.length - 1; i++) {
    const relations = solutionsGraph.getRelation(pyramidWords[i]);

    // we must have this word in our subgraph
    // the next word must be related to this word
    if (!relations || !relations.has(pyramidWords[i])) {
      return false;
    }
  }

  return true;
};
