export const makeAnagramLookup = () => {
  const anagramMap = new Map<string, Set<string>>()

  const toHash = (word: string) => word.split("").sort().join("")
  // insert adds the word itself
  const insert = (word: string) => {
    const hash = toHash(word)
    const anagramGroup = anagramMap.get(hash) ?? new Set()
    anagramGroup.add(word)
    anagramMap.set(hash, anagramGroup)
  }
  const getAnagrams = (word: string) => anagramMap.get(toHash(word))

  const getAll = () => anagramMap

  return {
    insert,
    getAnagrams,
    getAll,
  }
}
export type AnagramLookup = ReturnType<typeof makeAnagramLookup>
