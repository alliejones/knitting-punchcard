import { useCallback } from "preact/hooks";
import { formatStitchOutput } from "./App";
import type { Dispatch, Stitch } from "./App";
interface ControlsProps {
  dispatch: Dispatch;
  rows: number;
  columns: number;
  stitches: Stitch[];
  objectUrl: string;
}

const Controls = ({
  dispatch,
  rows,
  columns,
  stitches,
  objectUrl,
}: ControlsProps) => {
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
      <div>
        <a href={objectUrl} download="punchcard.txt">
          Download text file
        </a>
      </div>
    </div>
  );
};
export default Controls;
