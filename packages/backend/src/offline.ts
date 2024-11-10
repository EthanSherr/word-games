import fs from "fs/promises";

// BUILD a word graph of things connected by 1 letter difference :)
type WordNode = {
  word: string;
  addRelation: (wordNode: WordNode) => void;
};

const makeWordNode = (word: string): WordNode => {
  const relations = new Map<string, WordNode>();

  const addRelation = (wn: WordNode) => {
    relations.set(wn.word, wn);
  };

  return {
    word,
    addRelation,
  };
};

const makeAnagramLookup = () => {
  const anagramMap = new Map<string, Set<string>>();

  const toHash = (word: string) => word.split("").sort().join("");
  // insert adds the word itself
  const insert = (word: string) => {
    const hash = toHash(word);
    const anagramGroup = anagramMap.get(hash) ?? new Set();
    anagramGroup.add(word);
    anagramMap.set(hash, anagramGroup);
  };
  const getAnagrams = (word: string) => anagramMap.get(word);

  const getAll = () => anagramMap;

  return {
    insert,
    getAnagrams,
    getAll,
  };
};
type AnagramLookup = ReturnType<typeof makeAnagramLookup>;

const makeWordRelationGraph = () => {
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
type WordRelationGraph = ReturnType<typeof makeWordRelationGraph>;

const traverseGraphDepth = (
  graph: WordRelationGraph,
  anagramLookup: AnagramLookup,
  solutions: Array<Array<string>>,
  word: string,
  depth: number,
  path: Array<string>,
) => {
  path.push(word);
  if (depth === 1) {
    solutions.push(path);
    return;
  }
  const relations = graph.getRelation(word);
  if (!relations) return;

  for (const relatedChars of [...relations]) {
    const relatedWords = anagramLookup.getAnagrams(relatedChars);
    if (!relatedWords) return;
    for (const relatedWord of relatedWords) {
      traverseGraphDepth(
        graph,
        anagramLookup,
        solutions,
        relatedWord,
        depth - 1,
        [...path],
      );
    }
  }
};

const main = async () => {
  const wordsStr = await fs.readFile("./words.txt", { encoding: "utf8" });
  const words = wordsStr.split("\n");

  // initialize anagram lookup table
  const anagramLookup = makeAnagramLookup();
  for (const word of words) {
    anagramLookup.insert(word);
  }
  const anagramsDesc = [...anagramLookup.getAll().entries()]
    .map(([_, value]) => value)
    .sort((a, b) => {
      return b.size - a.size;
    });

  // remove each letter from each word - does it make up another word? if so join
  const graph = makeWordRelationGraph();
  for (const word of words) {
    for (let i = 0; i < word.length; i++) {
      const newChars = word.slice(0, i) + word.slice(i + 1);

      // WORDNODE RELATIONS
      const anagrams = anagramLookup.getAnagrams(newChars);
      if (!anagrams) {
        // not a word :)
        continue;
      }

      graph.addRelation(word, newChars);
    }
  }

  const jsonGraph = graph.toJson();
  await fs.writeFile("./full.json", JSON.stringify(jsonGraph, null, 4), {
    encoding: "utf8",
  });

  const fiveLetterWords = words.filter((w) => w.length == 5);
  const solutions = new Array<Array<string>>();
  for (const w of fiveLetterWords) {
    traverseGraphDepth(graph, anagramLookup, solutions, w, 5, []);
  }

  await fs.writeFile("./outpyramids.txt", JSON.stringify(solutions, null, 4), {
    encoding: "utf8",
  });
};
main();
