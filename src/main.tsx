import { render } from "preact";
import { decompressFromEncodedURIComponent } from "lz-string";
import { MantineProvider } from "@mantine/core";
import { App } from "./App.tsx";

import "./index.css";
import "@mantine/core/styles.css";

let initialState = null;

const initialStateParam = new URL(window.location.href).searchParams.get(
  "data"
);
if (initialStateParam) {
  initialState = JSON.parse(
    decompressFromEncodedURIComponent(initialStateParam)
  );
}

render(
  <MantineProvider>
    <App initialState={initialState} />
  </MantineProvider>,
  document.getElementById("app")!
);
