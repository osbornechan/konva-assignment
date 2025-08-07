"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import Page from "./components/page/Page";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4f46e5",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Page />
    </ThemeProvider>
  );
}

export default App;
