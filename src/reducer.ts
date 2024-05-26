import type { Dispatch as PreactDispatch } from "preact/hooks";

export type Stitch = "-" | "x";
export interface State {
  dragging: boolean;
  columns: number;
  rows: number;
  stitches: Stitch[];
  objectUrl: string;
}

export type Action =
  | { type: "loadDesign"; stitches: Stitch[]; columns: number; rows: number }
  | { type: "setStitch"; index: number; value: Stitch }
  | { type: "mouseEvent"; event: "mousedown" | "mouseup" };
export type Dispatch = PreactDispatch<Action>;

export const formatStitchOutput = (stitches: Stitch[], columnCount: number) => {
  const output = [];
  for (let i = 0; i < stitches.length; i += columnCount) {
    output.push(stitches.slice(i, i + columnCount).join(""));
  }
  return output.join("\n");
};

export const getObjectUrl = (
  stitches: Stitch[],
  columns: number,
  prevUrl: string
) => {
  URL.revokeObjectURL(prevUrl);
  return URL.createObjectURL(new Blob([formatStitchOutput(stitches, columns)]));
};

export const getInitialState = (initialState: Partial<State>) => {
  const columns = initialState.columns ?? 24;
  const rows = initialState.rows ?? 20;
  const stitches = Array(columns * rows).fill("-");

  return {
    columns,
    rows,
    stitches,
    dragging: false,
    objectUrl: getObjectUrl(stitches, columns, ""),
    ...initialState,
  };
};

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "loadDesign": {
      const { stitches, columns, rows } = action;
      return {
        ...state,
        stitches,
        columns,
        rows,
        objectUrl: getObjectUrl(stitches, columns, state.objectUrl),
      };
    }
    case "setStitch": {
      const { index, value } = action;
      const stitches = state.stitches.with(index, value);
      return {
        ...state,
        stitches,
        objectUrl: getObjectUrl(stitches, state.columns, state.objectUrl),
      };
    }
    case "mouseEvent": {
      if (action.event === "mousedown") {
        return { ...state, dragging: true };
      }
      if (action.event === "mouseup") {
        return { ...state, dragging: false };
      }
      return state;
    }
    default:
      return state;
  }
};
