import { useEffect, useReducer } from "react";
import { AppShell, Burger, Center, Grid, Text } from "@mantine/core";

import Controls from "./Controls";
import Editor from "./Editor";
import { type State, getInitialState } from "./reducer";
import { reducer } from "./reducer";
import { useDisclosure } from "@mantine/hooks";

export function App({ initialState }: { initialState: Partial<State> }) {
  const [state, dispatch] = useReducer(
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

  const [opened, { toggle }] = useDisclosure(true);

  const { columns, rows, stitches, dragging, objectUrl } = state;
  return (
    <AppShell
      p="md"
      header={{ height: 60 }}
      aside={{
        width: { base: 200, md: 300, lg: 400, xl: 500 },
        breakpoint: "sm",
        collapsed: { desktop: !opened, mobile: !opened },
      }}
    >
      <AppShell.Header>
        <Grid p="sm" pl="md">
          <Grid.Col span="auto">
            <Text size="lg">Punchcard Text File Generator</Text>
          </Grid.Col>
          <Grid.Col span="content">
            <Burger
              opened={opened}
              onClick={toggle}
              aria-label="Toggle settings"
            />
          </Grid.Col>
        </Grid>
      </AppShell.Header>
      <AppShell.Main>
        <Center>
          <Editor {...{ columns, rows, stitches, dragging, dispatch }} />
        </Center>
      </AppShell.Main>
      <AppShell.Aside p="md">
        <Controls {...{ dispatch, columns, rows, stitches, objectUrl }} />
      </AppShell.Aside>
    </AppShell>
  );
}
