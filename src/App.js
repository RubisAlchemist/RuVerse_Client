import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from 'react-redux';
import { updateData } from './store/dataLog/actions';

import PermissionPage from "./pages/permissionPage";
// <<<<<<< HEAD
// import Home from "./pages/home";
// import VideocallPage from "./pages/videocallPage";
// =======
import { PostureCheckPage } from "./pages/postureCheckPage";
import VideocallPage from "./pages/videocallPage";
import EyetrackingLogger from "./component/eyetrackingLogger";
import { Home } from "./pages/home";
// import EyetrackingLogger from "./component/eyetrackingLogger";
// >>>>>>> origin/main
import GPSLogger from "./component/gpsLogger";
import AccelGyroLogger from "./component/accelgyroLogger";
import TouchLoggerContainer from "./component/touchLogger";
import StylusLogger from "./component/stylusLogger";
// import KeyboadLogger from "./component/keyboardLogger";
import { Key } from "@mui/icons-material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0BA1AE",
    },
  },
});

function App() {
  const [gpsData, setGpsData] = useState([]);
  const [accelgyroData, setAccelgyroData] = useState([]);
  const [touchData, setTouchData] = useState([]);
  const [stylusData, setStylusData] = useState([]);
  // const [keyboardData, setKeyboardData] = useState([]);
  const dispatch = useDispatch();
  // const gpsData = useSelector(state => state.dataReducer.gpsData);
  // const accelgyroData = useSelector(state => state.dataReducer.accelgyroData);
  // const sessionTouchData = useSelector(state => state.dataReducer.sessionTouchData);
  // const sessionStylusData = useSelector(state => state.dataReducer.sessionStylusData);

  const handleSetGpsData = (newGpsData) => {
    // Append the new GPS data to the existing list
    setGpsData(prevDataList => [...prevDataList, newGpsData]);
  };
  const handleSetAccelgyroData = (newAccelgyroData) => {
    // Append the new GPS data to the existing list
    setGpsData(prevDataList => [...prevDataList, newAccelgyroData]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Dispatch action to update Redux store with the data
      dispatch(updateData({
        gpsData,
        accelgyroData,
        touchData,
        stylusData,
        // keyboardData,
      }));

      // Print out the data on the console
      console.log("Uploading data", {
        gpsData,
        accelgyroData,
        touchData,
        stylusData,
        // keyboardData,
      });
      
      // Clear the state variables
      setGpsData([]);
      setAccelgyroData([]);
      setTouchData([]);
      setStylusData([]);
      // setKeyboardData([]);

    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch, gpsData, accelgyroData, touchData, stylusData]);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/permission" element={<PermissionPage />} />
          <Route path="/" exact element={<Home />} />
          <Route
            path="/videocallPage"
            element={
              <EyetrackingLogger
                onEyeTrackingData={setEyeTrackingData}
                >
{/* <<<<<<< HEAD */}
                <GPSLogger 
                  onGpsData={handleSetGpsData}//{(gpsData) => dispatch(updateData({ gpsData }))}
                >
                  <AccelGyroLogger 
                    onAccelgyroData={handleSetAccelgyroData}//{(accelgyroData) => dispatch(updateData({ accelgyroData }))} //{setAccelgyroData}
                  >
                    <TouchLoggerContainer
                      touchData={touchData}
                      setTouchData={setTouchData}
                    >
                      <StylusLogger
                        stylusData={stylusData}
                        setStylusData={setStylusData}
                      >
                        {/* <KeyboadLogger
                          keyboardData={keyboardData}
                          setKeyboardData={setKeyboardData}
                        > */}
                          <VideocallPage />
                        {/* </KeyboadLogger> */}
                      </StylusLogger>
                    </TouchLoggerContainer>
                  </AccelGyroLogger>
                </GPSLogger>
              </EyetrackingLogger>
// =======
//               <EyetrackingLogger>
//                 <GPSLogger>
//                   <AccelGyroLogger>
//                     {/* <TouchLoggerContainer> */}
//                     <VideocallPage />
//                     {/* </TouchLoggerContainer> */}
//                   </AccelGyroLogger>
//                 </GPSLogger>
//               </EyetrackingLogger>
// >>>>>>> origin/main
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;




// // import React from "react";
// import React, { useEffect, useState, useRef, useMemo } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { ThemeProvider, createTheme } from "@mui/material/styles";
// import { Provider } from "react-redux";

// import { useDispatch } from 'react-redux';
// import { updateData } from './store/dataLog/actions';

// import PermissionPage from "./pages/permissionPage";
// import Home from "./pages/home";
// import { PostureCheckPage } from "./pages/postureCheckPage";
// import VideocallPage from "./pages/videocallPage";
// import EyetrackingLogger from "./component/eyetrackingLogger";
// import GPSLogger from "./component/gpsLogger";
// import AccelGyroLogger from "./component/accelgyroLogger";
// import TouchLoggerContainer from "./component/touchLogger";
// // import keyboardLogger from "./component/keyboardLogger";
// import StylusLogger from "./component/stylusLogger";
// import ArchiveModule from "./component/dataArchive.js";

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#0BA1AE",
//     },
//   },
// });

// function App() {
//   const [gpsData, setGpsData] = useState(null);
//   const [accelgyroData, setAccelgyroData] = useState(null);
//   const [sessionTouchData, setSessionTouchData] = useState([]);
//   const [sessionKeyboardData, setSessionKeyboardData] = useState([]);
//   const [sessionStylusData, setSessionStylusData] = useState([]);
//   const [eyetrackingData, setEyeTrackingData] = useState(null);

//   const dispatch = useDispatch();

//   useEffect(() => {
//     const interval = setInterval(() => {
//       // Dispatch action to update Redux store with the data
//       dispatch(updateData({
//         gpsData,
//         accelgyroData,
//         sessionTouchData,
//         sessionStylusData,
//       }));
//       // Print out the data on the console
//       console.log({
//         gpsData,
//         accelgyroData,
//         sessionTouchData,
//         sessionStylusData,
//       });
//     }, 30000);

//     return () => clearInterval(interval);
//   }, [dispatch, gpsData, accelgyroData, sessionTouchData, sessionStylusData]);


//   return (
//     <ThemeProvider theme={theme}>
//       <Router>
//         <Routes>
//           <Route path="/permission" element={<PermissionPage />} />
//           <Route path="/" exact element={<Home />} /> {/* 기본 페이지 */}
//           {/* <Route path="/postureCheck" element={<PostureCheckPage />} /> */}
//           <Route
//             path="/videocallPage"
//             element={
//               // <EyetrackingLogger>
//               //   onEyeTrackingData={setEyeTrackingData}
//                 <GPSLogger 
//                   onGpsData={setGpsData}
//                 >
//                   <AccelGyroLogger
//                     onAccelgyroData={setAccelgyroData}
//                   >
//                     <TouchLoggerContainer
//                       touchData={sessionTouchData}
//                       setTouchData={setSessionTouchData}
//                     >
//                       <StylusLogger
//                         stylusData={sessionStylusData}
//                         setStylusData={setSessionStylusData}
//                       >
//                         <VideocallPage />
//                         {/* <ArchiveModule
//                           // clientId={user.clientId}
//                           // quizId={quiz.quizId}
//                           // quizEnded={quizEnded}
//                           // quizTimelimit={quiz.timelimit}
//                           gpsData={gpsData}
//                           accelgyroData={accelgyroData}
//                           touchData={sessionTouchData}
//                           // keyboardData={sessionKeyboardData}
//                           stylusData={sessionStylusData}
//                           eyetrackingData={eyetrackingData}
//                         />  */}
//                       </StylusLogger>
//                     </TouchLoggerContainer>
//                   </AccelGyroLogger>
//                 </GPSLogger>
//               // </EyetrackingLogger>
//             }
//           />
//         </Routes>
//       </Router>
//     </ThemeProvider>
//   );
// }

// export default App;
