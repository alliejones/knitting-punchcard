import { useEffect, useReducer } from "preact/hooks";

import Controls from "./Controls";
import Editor from "./Editor";
import { State, Action, getInitialState } from "./reducer";
import { reducer } from "./reducer";

export function App({ initialState }: { initialState: Partial<State> }) {
  const [state, dispatch] = useReducer<State, Action, null>(
    reducer,
    null,
    (): State => getInitialState(initialState)
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
