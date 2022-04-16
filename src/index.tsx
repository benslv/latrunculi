import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { TypographyStylesProvider } from "@mantine/core";

ReactDOM.render(
  <React.StrictMode>
    <TypographyStylesProvider>
      <App />
    </TypographyStylesProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
