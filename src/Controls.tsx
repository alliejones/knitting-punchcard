import { useCallback, useState } from "preact/hooks";
import { compressToEncodedURIComponent } from "lz-string";
import {
  Alert,
  Button,
  Code,
  Collapse,
  Divider,
  FileButton,
  Group,
  Stack,
} from "@mantine/core";

import type { Dispatch, Stitch } from "./reducer";
import { formatStitchOutput } from "./reducer";
import { useDisclosure } from "@mantine/hooks";

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
  const clearEditor = useCallback(() => {
    if (confirm("Are you sure you want to clear the design?")) {
      dispatch({
        type: "loadDesign",
        columns,
        rows,
        stitches: Array(columns * rows).fill("-"),
      });
    }
  }, [dispatch]);

  const loadFile = useCallback(
    (file: File | null) => {
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

  const [showAbout, setShowAbout] = useState(true);
  const [showTextOutput, { toggle: toggleTextOutput }] = useDisclosure(false);

  return (
    <Stack>
      {showAbout && (
        <Alert
          color="blue"
          variant="outline"
          title="About"
          withCloseButton
          onClose={() => setShowAbout(false)}
        >
          <p>
            This is a small visual editor that generates text files compatible
            with{" "}
            <a href="https://brendaabell.com/knittingtools/pcgenerator/">
              Brenda A. Bell's Punchcard Generator
            </a>{" "}
            for knitting machines.
          </p>

          <p>
            This tool only works with text files. To generate punchcard SVGs,
            download the text file from this tool using the "Download file"
            button below and upload it to the punchcard generator. You can also
            upload existing text files for modification.
          </p>
        </Alert>
      )}
      <Group>
        <Button onClick={clearEditor}>Clear design</Button>
      </Group>
      <Divider />
      <Group>
        <Button onClick={shareUrl}>Share link</Button>
        <Button component="a" href={objectUrl} download="punchcard.txt">
          Download file
        </Button>
        <FileButton onChange={loadFile}>
          {(props) => <Button {...props}>Import file</Button>}
        </FileButton>
      </Group>
      <Divider />
      <Group>
        <Button onClick={toggleTextOutput}>
          {showTextOutput ? "Hide text output" : "Show text output"}
        </Button>
      </Group>
      <Collapse in={showTextOutput}>
        <Code block>{formatStitchOutput(stitches, columns)}</Code>
      </Collapse>
    </Stack>
  );
};
export default Controls;
