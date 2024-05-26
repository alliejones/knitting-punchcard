import { compressToEncodedURIComponent } from "lz-string";
import { useCallback } from "preact/hooks";
import { formatStitchOutput } from "./App";
import type { Dispatch, Stitch } from "./App";
import { ChangeEvent } from "preact/compat";
interface ControlsProps {
  dispatch: Dispatch;
  rows: number;
  columns: number;
  stitches: Stitch[];
  objectUrl: string;
}

const isStitch = (char: unknown): char is Stitch =>
  char === "x" || char === "-";

const parseTextFile = (
  file: string
): { stitches: Stitch[]; columns: number; rows: number } => {
  const lines = file.split("\n");
  const stitches = lines.flatMap((line) =>
    line.split("").map((char) => (isStitch(char) ? char : "-"))
  );
  return {
    columns: lines[0].length,
    rows: lines.length,
    stitches,
  };
};

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

  const loadFile = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const input = e.currentTarget;
      const file = input.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (
            reader.readyState === reader.DONE &&
            typeof reader.result === "string"
          ) {
            dispatch({
              type: "loadDesign",
              ...parseTextFile(reader.result),
            });
          }
          input.value = "";
        };
        reader.readAsText(file);
      }
    },
    [dispatch]
  );

  const shareUrl = useCallback(() => {
    const dataString = compressToEncodedURIComponent(
      JSON.stringify({
        stitches,
        columns,
        rows,
      })
    );
    const url = new URL(window.location.href);
    url.searchParams.set("data", dataString);
    window.history.replaceState(null, "", url.toString());
    navigator.clipboard.writeText(url.toString());
  }, [stitches, columns, rows]);

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
      <div>
        <label>
          Load text file
          <input type="file" onChange={loadFile} />
        </label>
      </div>
      <div>
        <button onClick={shareUrl}>Share</button>
      </div>
    </div>
  );
};
export default Controls;
