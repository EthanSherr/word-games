export const makeWordRelationGraph = () => {
  const relations = new Map<string, Set<string>>();

  const addRelation = (fromWord: string, toWord: string) => {
    const relation = relations.get(fromWord) ?? new Set<string>();
    relation.add(toWord);
    relations.set(fromWord, relation);
  };

  const toJson = () => {
    const record: Record<string, Array<string>> = {};
    for (const [word, relatedWords] of relations.entries()) {
      record[word] = [...relatedWords];
    }
    return record;
  };

  const getRelation = (word: string) => relations.get(word);

  return {
    addRelation,
    getRelation,
    toJson,
  };
};
export type WordRelationGraph = ReturnType<typeof makeWordRelationGraph>;
