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
}

export type Action =
  | { type: "clearEditor" }
  | { type: "setStitch"; index: number; value: Stitch }
  | { type: "mouseEvent"; event: "mousedown" | "mouseup" };
export type Dispatch = PreactDispatch<Action>;

const buildStitches = (columns: number, rows: number): Stitch[] =>
  Array(columns * rows).fill("-");

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "clearEditor": {
      return { ...state, stitches: buildStitches(state.columns, state.rows) };
    }
    case "setStitch": {
      const { index, value } = action;
      return {
        ...state,
        stitches: state.stitches.with(index, value),
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
  const [state, dispatch] = useReducer<State, Action>(reducer, {
    columns: 24,
    rows: 20,
    stitches: buildStitches(24, 20),
    dragging: false,
  });

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

  const { columns, rows, stitches, dragging } = state;
  return (
    <div>
      <Editor {...{ columns, rows, stitches, dragging, dispatch }} />
      <Controls {...{ dispatch, columns, rows, stitches }} />
    </div>
  );
}
