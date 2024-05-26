import { render } from "preact";
import { decompressFromEncodedURIComponent } from "lz-string";
import { App } from "./App.tsx";
import "./index.css";

let initialState = null;

const initialStateParam = new URL(window.location.href).searchParams.get(
  "data"
);
if (initialStateParam) {
  initialState = JSON.parse(
    decompressFromEncodedURIComponent(initialStateParam)
  );
}

render(<App initialState={initialState} />, document.getElementById("app")!);
