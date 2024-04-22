import { ThemeProvider, createTheme } from "@mui/material/styles";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { createGlobalStyle } from "styled-components";

import Home from "./pages/Home.jsx";
import PermissionPage from "./pages/PermissionPage.jsx";
import VideoCallPage from "./pages/VideoCallPage.jsx";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0BA1AE",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/permission" element={<PermissionPage />} />
          <Route path="/videocallPage" element={<VideoCallPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box; /* Makes sure padding and borders are inside the width/height */
    margin: 0; /* Reset default margins */
    padding: 0; /* Reset default paddings */
  }

  body {
    overflow-x: hidden; /* Prevents horizontal scrolling */
  }
`;
