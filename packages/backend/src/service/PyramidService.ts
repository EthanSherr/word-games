import { PyramidPrompt } from "@common/src/model/pyramid";

export const makePyramidService = () => {
  return {
    getPyramidOfTheDay: () => {
      const response: PyramidPrompt = {
        layers: [[{ character: "x", editable: false }]],
      };
      return response;
    },
  };
};
