export type PyramidCell = {
  character: string;
  editable: boolean;
};

export type PyramidPrompt = {
  id: string;
  layers: Array<Array<PyramidCell>>;
};
