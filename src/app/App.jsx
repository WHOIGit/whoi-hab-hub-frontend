import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
// Material UI imports
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Container } from "@mui/material";
import { Outlet } from "react-router-dom";
// Import our stuff
import Header from "./Header";
import theme from "./theme";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DndProvider backend={HTML5Backend}>
        <Container maxWidth={false} disableGutters={true}>
          <Header />
          <main>
            <Outlet />
          </main>
        </Container>
      </DndProvider>
    </ThemeProvider>
  );
}
