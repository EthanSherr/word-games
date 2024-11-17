import { mapSetReplacer, mapSetReviver } from "../json-utils/mapReviver";

export const makeWordRelationGraph = (
  initialRelations?: Map<string, Set<string>>,
): WordRelationGraph => {
  const relations = initialRelations ?? new Map<string, Set<string>>();

  const addDirectedRelation = (fromWord: string, toWord: string) => {
    let relation = relations.get(fromWord);
    if (!relation) {
      relations.set(fromWord, (relation = new Set<string>()));
    }
    relation.add(toWord);
  };

  const filterRelations = (filterFn: FilterFn) => {
    const relationsToRemove = new Array<{ from: string; to: string }>();
    for (const [from, relation] of relations) {
      for (const to of relation) {
        if (!filterFn(from, to)) {
          relationsToRemove.push({ from, to });
        }
      }
    }
    for (const { from, to } of relationsToRemove) {
      relations.get(from)?.delete(to);
    }
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
    filterRelations,
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

export type FilterFn = (fromWord: string, toWord: string) => boolean;
export type WordRelationGraph = {
  addDirectedRelation: (fromWord: string, toWord: string) => void;
  // removeDirectedRelation: (fromWord: string, toWord: string) => void;
  getRelation: (word: string) => Set<string> | undefined;
  serialize: () => string;
  copy: (graph: WordRelationGraph, word: string) => void;
  filterRelations: (filterFn: FilterFn) => void;
};
