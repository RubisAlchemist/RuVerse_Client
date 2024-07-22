import { ThemeProvider, createTheme } from "@mui/material/styles";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { createGlobalStyle } from "styled-components";

import { EyetrackingLogger } from "./component/logger/index.js";
import ChannelEntryPage from "./pages/ChannelEntryPage.jsx";
import VideoInteractPage from "./pages/VideoInteractPage.jsx";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0BA1AE",
    },
  },
});

function App() {
  return (
    <EyetrackingLogger>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Router>
          <Routes>
            {/* 
            <Route path="/" exact element={<Home />} />
            <Route path="/permission" element={<PermissionPage />} />
            <Route path="/channelEntry" element={<ChannelEntryPage />} />
            <Route path="/videocallPage" element={<VideoCallPage />} />
            <Route path="/channel/:cname/:uid" element={<ChannelPage />} />
            <Route
              path="/channel/:cname/:uid/record"
              element={<AgoraRecordPage />}
            />
            */}
            <Route path="/" element={<ChannelEntryPage />} />
            <Route path="/channel/:uname" element={<VideoInteractPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </EyetrackingLogger>
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
