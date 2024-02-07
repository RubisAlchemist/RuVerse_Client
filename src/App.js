import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Provider } from "react-redux";

import PermissionPage from "./pages/permissionPage";
import Home from "./pages/home";
import { PostureCheckPage } from "./pages/postureCheckPage";
import VideocallPage from "./pages/videocallPage";

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
      <Router>
        <Routes>
          <Route path="/permission" element={<PermissionPage />} />
          <Route path="/" exact element={<Home />} /> {/* 기본 페이지 */}
          <Route path="/postureCheck" element={<PostureCheckPage />} />
          <Route path="/videocallPage" element={<VideocallPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
