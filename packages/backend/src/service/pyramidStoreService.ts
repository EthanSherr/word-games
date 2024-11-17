import path from "path";
import { ErrorType } from "@word-games/common/src/promise-utils/tryCatch";
import { PyramidPrompt } from "@word-games/common/src/model/pyramid";
import {
  FileStorageService,
  makeFileStorageService,
} from "./fileStorageService";
import {
  makeWordRelationGraphFromJson,
  WordRelationGraph,
} from "@word-games/common/src/word-utils/wordRelationGraph";

// maybe pull from env, and default to ./storage for local?
const storageDirectory = "./storage";
const savedDirectory = "pyramidSaved";

// We store previous challenges here!
const savedPath = path.join(storageDirectory, savedDirectory);

const currentPyramidId = "current";

const getPromptFileName = (id: string) => `${id}-prompt.json`;
const getSolutionGraphFilename = (id: string) => `${id}-solution-graph.json`;
const getSolutionsDebugFilename = (id: string) => `${id}-solutions-debug.json`;

// We store alphabet stuff here
export const makePyramidStoreService = (
  fileService: FileStorageService = makeFileStorageService(savedPath),
) => {
  const getPyramidPrompt = async (
    id: string,
  ): Promise<ErrorType<PyramidPrompt, Error | "ENOENT">> => {
    const [err, json] = await fileService.readFileJson(getPromptFileName(id));
    if (err) {
      return [err, null] as const;
    }
    // TODO - kind of week inference... mby validate?
    return [null, json as PyramidPrompt];
  };

  const getPyramidSolutionGraph = async (
    id: string,
  ): Promise<ErrorType<WordRelationGraph, Error | "ENOENT">> => {
    const [err, str] = await fileService.readFileString(
      getSolutionGraphFilename(id),
    );
    if (err) {
      return [err, null] as const;
    }

    const graph = makeWordRelationGraphFromJson(str);
    // TODO - kind of week inference... mby validate?
    return [null, graph!];
  };

  const getCurrentPyramidPrompt = () => getPyramidPrompt(currentPyramidId);

  const getCurrentPyramidSolutionGraph = () =>
    getPyramidSolutionGraph(currentPyramidId);

  const setCurrentPyramidPrompt = async (prompt: PyramidPrompt) => {
    return fileService.writeFileJson(
      getPromptFileName(currentPyramidId),
      prompt,
    );
  };

  const setCurrentPyramidSolutionSubgraph = async (
    solutions: WordRelationGraph,
  ) => {
    return fileService.writeFileStr(
      getSolutionGraphFilename(currentPyramidId),
      solutions.serialize(),
    );
  };

  const setCurrentPyramidSolutionsDebug = async (
    solutions: Array<Array<string>>,
  ) => {
    return fileService.writeFileJson(
      getSolutionsDebugFilename(currentPyramidId),
      solutions,
    );
  };

  return {
    init: fileService.init,
    getCurrentPyramidPrompt,
    getCurrentPyramidSolutionGraph,
    setCurrentPyramidPrompt,
    setCurrentPyramidSolutionSubgraph,
    setCurrentPyramidSolutionsDebug,
  };
};
export type PyramidStoreService = ReturnType<typeof makePyramidStoreService>;
