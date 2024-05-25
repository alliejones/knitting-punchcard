import { useCallback } from "preact/hooks";
import type { Dispatch, Stitch } from "./App";
interface ControlsProps {
  dispatch: Dispatch;
  rows: number;
  columns: number;
  stitches: Stitch[];
}

const formatStitchOutput = (stitches: Stitch[], columnCount: number) => {
  const output = [];
  for (let i = 0; i < stitches.length; i += columnCount) {
    output.push(stitches.slice(i, i + columnCount).join(""));
  }
  return output.join("\n");
};

const Controls = ({ dispatch, rows, columns, stitches }: ControlsProps) => {
  const clearEditor = useCallback(
    () => dispatch({ type: "clearEditor" }),
    [dispatch]
  );
  return (
    <div>
      <div>
        <button onClick={clearEditor}>Clear</button>
      </div>
      <div>
        <label for="output">Text output</label>
        <textarea
          id="output"
          readonly
          cols={columns}
          rows={rows}
          value={formatStitchOutput(stitches, columns)}
        />
      </div>
    </div>
  );
};
export default Controls;
