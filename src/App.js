import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Provider } from "react-redux";

import PermissionPage from "./pages/permissionPage";
import { PostureCheckPage } from "./pages/postureCheckPage";
import VideocallPage from "./pages/videocallPage";
import EyetrackingLogger from "./component/eyetrackingLogger";
import { Home } from "./pages/home";
// import EyetrackingLogger from "./component/eyetrackingLogger";
import GPSLogger from "./component/gpsLogger";
import AccelGyroLogger from "./component/accelgyroLogger";
import TouchLoggerContainer from "./component/touchLogger";

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
          {/* <Route path="/postureCheck" element={<PostureCheckPage />} /> */}
          <Route
            path="/videocallPage"
            element={
              <EyetrackingLogger>
                <GPSLogger>
                  <AccelGyroLogger>
                    {/* <TouchLoggerContainer> */}
                    <VideocallPage />
                    {/* </TouchLoggerContainer> */}
                  </AccelGyroLogger>
                </GPSLogger>
              </EyetrackingLogger>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
