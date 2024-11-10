import { mapSetReplacer, mapSetReviver } from "../json-utils/mapReviver";

export const makeWordRelationGraph = (
  initialRelations?: Map<string, Set<string>>,
): WordRelationGraph => {
  const relations = initialRelations ?? new Map<string, Set<string>>();

  const addDirectedRelation = (fromWord: string, toWord: string) => {
    const relation = relations.get(fromWord) ?? new Set<string>();
    relation.add(toWord);
    relations.set(fromWord, relation);
  };

  const getRelation = (word: string) => relations.get(word);

  const copy = (graph: WordRelationGraph, startingWord: string) => {
    const queue = [startingWord];
    const visited = new Set();

    while (queue.length > 0) {
      const currentWord = queue.pop()!;
      if (visited.has(currentWord)) {
        continue;
      }
      visited.add(currentWord);
      const relations = getRelation(currentWord);
      if (!relations) continue;

      for (const relatedWord of relations) {
        queue.push(relatedWord);
        graph.addDirectedRelation(currentWord, relatedWord);
      }
    }
  };

  const serialize = () => {
    return JSON.stringify({ relations }, mapSetReplacer, 4);
  };

  return {
    addDirectedRelation,
    getRelation,
    serialize,
    copy,
  };
};

export const makeWordRelationGraphFromJson = (data: string) => {
  // const graph = makeWordRelationGraph();

  // ew this is grody
  const { relations } = JSON.parse(data, mapSetReviver);
  if (relations) {
    return makeWordRelationGraph(relations);
  }
};

export type WordRelationGraph = {
  addDirectedRelation: (fromWord: string, toWord: string) => void;
  getRelation: (word: string) => Set<string> | undefined;
  serialize: () => string;
  copy: (graph: WordRelationGraph, word: string) => void;
};
