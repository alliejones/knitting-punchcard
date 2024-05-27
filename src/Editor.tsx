import classNames from "classnames";
import classes from "./Editor.module.css";

import type { Dispatch } from "./reducer";
import type { Stitch } from "./reducer";
import { useCallback, useState } from "react";

const toggleStitch = (stitch: Stitch): Stitch => (stitch === "-" ? "x" : "-");

const focusStitch = (index: number) => {
  const el = document.getElementById(`stitch${index}`);
  el?.focus();
};

interface EditorProps {
  dispatch: Dispatch;
  dragging: boolean;
  columns: number;
  rows: number;
  stitches: Stitch[];
}
const Editor = ({
  columns,
  rows,
  stitches,
  dragging,
  dispatch,
}: EditorProps) => {
  const setStitch = useCallback(
    (index: number, value: Stitch) => {
      dispatch({ type: "setStitch", index, value });
    },
    [dispatch]
  );

  const [draggingStitchValue, setDraggingStitchValue] = useState<Stitch | null>(
    null
  );

  return (
    <div
      className={classes.grid}
      style={{
        gridTemplateColumns: `repeat(${columns}, 24px)`,
        gridTemplateRows: `repeat(${rows}, 24px)`,
      }}
    >
      {stitches.map((stitch, index) => (
        <div
          id={`stitch${index}`}
          key={`stitch${index}`}
          tabIndex={0}
          className={classNames(classes.stitch, {
            [classes.stitchPunched]: stitch === "x",
          })}
          onMouseDown={() => {
            setDraggingStitchValue(toggleStitch(stitch));
            setStitch(index, toggleStitch(stitch));
          }}
          onMouseUp={() => {
            setDraggingStitchValue(null);
          }}
          onMouseEnter={() => {
            if (dragging) {
              setStitch(index, draggingStitchValue ?? "x");
            }
          }}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              setStitch(index, toggleStitch(stitch));
            }

            if (e.key === "ArrowUp") focusStitch(index - columns);
            if (e.key === "ArrowDown") focusStitch(index + columns);
            if (e.key === "ArrowLeft" && index % columns !== 0)
              focusStitch(index - 1);
            if (e.key === "ArrowRight" && index % columns !== columns - 1)
              focusStitch(index + 1);
          }}
        ></div>
      ))}
    </div>
  );
};
export default Editor;
