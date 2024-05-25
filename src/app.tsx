import Controls from "./Controls";
import Editor from "./Editor";
import { useEffect, useReducer } from "preact/hooks";
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
  | { type: "clearEditor" }
  | { type: "setStitch"; index: number; value: Stitch }
  | { type: "mouseEvent"; event: "mousedown" | "mouseup" };
export type Dispatch = PreactDispatch<Action>;

const buildStitches = (columns: number, rows: number): Stitch[] =>
  Array(columns * rows).fill("-");

export const formatStitchOutput = (stitches: Stitch[], columnCount: number) => {
  const output = [];
  for (let i = 0; i < stitches.length; i += columnCount) {
    output.push(stitches.slice(i, i + columnCount).join(""));
  }
  return output.join("\n");
};

const getObjectUrl = (stitches: Stitch[], columns: number, prevUrl: string) => {
  URL.revokeObjectURL(prevUrl);
  return URL.createObjectURL(new Blob([formatStitchOutput(stitches, columns)]));
};

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "clearEditor": {
      const stitches = buildStitches(state.columns, state.rows);
      return {
        ...state,
        stitches,
        objectUrl: getObjectUrl(stitches, state.columns, state.objectUrl),
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

export function App() {
  const [state, dispatch] = useReducer<State, Action, null>(
    reducer,
    null,
    () => {
      const stitches = buildStitches(24, 20);

      return {
        columns: 24,
        rows: 20,
        stitches,
        dragging: false,
        objectUrl: getObjectUrl(stitches, 24, ""),
      };
    }
  );

  useEffect(() => {
    const mousedown = () =>
      dispatch({ type: "mouseEvent", event: "mousedown" });
    document.addEventListener("mousedown", mousedown);

    const mouseup = () => dispatch({ type: "mouseEvent", event: "mouseup" });
    document.addEventListener("mouseup", mouseup);

    return () => {
      document.removeEventListener("mousedown", mousedown);
      document.removeEventListener("mouseup", mouseup);
    };
  });

  const { columns, rows, stitches, dragging, objectUrl } = state;
  return (
    <div>
      <Editor {...{ columns, rows, stitches, dragging, dispatch }} />
      <Controls {...{ dispatch, columns, rows, stitches, objectUrl }} />
    </div>
  );
}
