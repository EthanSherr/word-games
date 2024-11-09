export type PyramidCell = {
  character: string;
  editable: boolean;
};

export type PyramidPrompt = {
  layers: Array<Array<PyramidCell>>;
};
