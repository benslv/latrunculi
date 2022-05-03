import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

import { TypographyStylesProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { MantineProvider } from "@mantine/core";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById("root")!;

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <MantineProvider>
      <TypographyStylesProvider>
        <NotificationsProvider position="top-center">
          <App />
        </NotificationsProvider>
      </TypographyStylesProvider>
    </MantineProvider>
  </React.StrictMode>,
);
