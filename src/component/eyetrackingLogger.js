// import React, { useState, useEffect } from "react";
// // import EasySeeSo from "./seeso-minjs/easy-seeso";
// import EasySeeso from "seeso/easy-seeso";
// import { UserStatusOption } from "seeso";
// import { useSelector } from "react-redux";

// // import { showGaze, hideGaze } from "./showGaze";
// // import './main.css';
// // import { showGaze, hideGaze } from "./showGaze";

// // const { showGaze, hideGaze } = GazeComponent;

// const licenseKey = process.env.REACT_APP_EYETRACKING_LICENSE_KEY;
// const dotMaxSize = 10;
// const dotMinSize = 5;

// // export var gazeArchive = [];

// let isCalibrationMode = false;
// // let eyeTracker = null;
// let currentX, currentY;
// let calibrationButton;
// let isUseAttention = false;
// let isUseDrowsiness = false;
// let isUseBlink = true;
// const userStatusOption = new UserStatusOption(
//   isUseAttention,
//   isUseBlink,
//   isUseDrowsiness
// );
// // //blink function
// let isBlinkL = false;
// let isBlinkR = false;
// let isB = false;
// let leftOpen = 0;
// let rightOpen = 0;
// let eyeTracker = null;

// const EyetrackingLogger = (props) => {
//   const {
//     name,
//     quizIndex,
//     onEyeTrackingData,
//     setEyeTrackingData,
//     eyetrackingData,
//     quizSessionType,
//   } = props;
//   // const calibrationData = useSelector(state => state.calibration.calibrationData);
//   const { calibrationData } = useSelector(({ calibration }) => calibration);
//   const [gazeArchive, setGazeArchive] = useState([]);

//   useEffect(() => {
//     main();
//     return () => {
//       if (eyeTracker) {
//         eyeTracker.stopTracking();
//         eyeTracker = null;
//       }
//     };
//   }, [quizIndex]);

//   useEffect(() => {
//     // if (quizSessionType === "QUIZ") {
//     //   onEyeTrackingData(gazeArchive);
//     // } else {
//     //   if ((gazeArchive.length = 0)) {
//     //     setEyeTrackingData(gazeArchive);
//     //   } else {
//     //     setEyeTrackingData([...eyetrackingData, gazeArchive]);
//     //   }
//     // }
//     console.log(gazeArchive);
//   }, [gazeArchive]);

//   const onBlink = (
//     timestamp,
//     isBlinktLeft,
//     isBlinkRight,
//     isBlink,
//     leftOpenness,
//     rightOpenness
//   ) => {
//     isBlinkL = isBlinktLeft;
//     isBlinkR = isBlinkRight;
//     isB = isBlink;
//     leftOpen = leftOpenness;
//     rightOpen = rightOpenness;
//   };

//   //For User Status Option
//   let attentionScore = 0;
//   const onAttention = (timestampBegin, timestampEnd, score) => {
//     attentionScore = score;
//   };

//   let isDrowsy = false;
//   const onDrowsiness = (timestamp, isDrowsiness) => {
//     isDrowsy = isDrowsiness;
//   };

//   const onGaze = (gazeInfo) => {
//     if (!isCalibrationMode) {
//       // do something with gaze info.
//       showGaze(gazeInfo);
//     } else {
//       hideGaze();
//     }
//   };

//   const showGaze = (gazeInfo) => {
//     // console.log("Entering showGazeDotOnDom");
//     let canvas = document.getElementById("output");
//     //언제 이 배열이 reset돼서 archive에 넘어가는지에 대한 고민은 필요함
//     // let gazeArchive = [];
//     canvas.width = window.self.innerWidth;
//     canvas.height = window.self.innerHeight;
//     let ctx = canvas.getContext("2d");
//     //점색깔 투명하게하기
//     // ctx.globalAlpha = "0";
//     ctx.fillStyle = "#425080";
//     // console.log("x: ", gazeInfo.x, "y: ", gazeInfo.y);
//     //gaze 좌표 위치 저장
//     // console.log(gazeInfo)
//     // gazeArchive.push({
//     //   x: gazeInfo.x,
//     //   y: gazeInfo.y,
//     //   timeStamp: gazeInfo.timestamp,
//     //   trackingState: gazeInfo.trackingState,
//     //   eyemovementState: gazeInfo.eyemovementState,
//     //   leftOpenness: gazeInfo.leftOpenness,
//     //   rightOpenness: gazeInfo.rightOpenness
//     // });
//     let isoDate = new Date().toISOString();

//     setGazeArchive({
//       x: gazeInfo.x,
//       y: gazeInfo.y,
//       time: gazeInfo.timestamp,
//       timeStamp: isoDate,
//       trackingState: gazeInfo.trackingState,
//       eyemovementState: gazeInfo.eyemovementState,
//       leftOpenness: gazeInfo.leftOpenness,
//       rightOpenness: gazeInfo.rightOpenness,
//       screenState:
//         Number.isNaN(gazeInfo.x) && Number.isNaN(gazeInfo.y)
//           ? "outside"
//           : "inside",
//     });

//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // 배열 비우는 코드
//     // if (gazeArchive.length == 50) {
//     //   console.log(gazeArchive);
//     //   // gazeArchive.splice(0);
//     // }
//     // console.log(gazeArchive);
//     // console.log(gazeArchive.length, gazeArchive[gazeArchive.length - 1]);

//     // 현재 gaze위치에 점을 그림
//     ctx.beginPath();
//     ctx.arc(gazeInfo.x, gazeInfo.y, 10, 0, Math.PI * 2, true);
//     ctx.fill();
//   };

//   const hideGaze = () => {
//     let canvas = document.getElementById("output");
//     let ctx = canvas.getContext("2d");
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//   };

//   const drawCircle = (x, y, dotSize, ctx) => {
//     ctx.fillStyle = "#FF0000";
//     ctx.beginPath();
//     ctx.arc(x, y, dotSize, 0, Math.PI * 2, true);
//     ctx.fill();
//   };

//   const hideCalibrationTitle = () => {
//     const calibrationTitle = document.getElementById("calibrationTitle");
//     calibrationTitle.style.display = "none";
//   };

//   const showCalibrationTitle = () => {
//     const calibrationTitle = document.getElementById("calibrationTitle");
//     calibrationTitle.style.display = "block";
//   };

//   const onDebug = (FPS, latency_min, latency_max, latency_avg) => {
//     // do something with debug info.
//   };

//   const main = async () => {
//     //   if (!calibrationButton) {
//     //     calibrationButton = document.getElementById("calibrationButton");
//     //     calibrationButton.addEventListener("click", onClickCalibrationBtn);
//     //     calibrationButton.disabled = true;
//     //   }
//     console.log("main ", eyeTracker);

//     if (!eyeTracker) {
//       eyeTracker = new EasySeeso();
//       try {
//         await eyeTracker.init(
//           licenseKey,
//           async () => {
//             if (calibrationData) {
//               eyeTracker.seeso.setCalibrationData(calibrationData);
//             }
//             await eyeTracker.startTracking(onGaze, onDebug);
//             eyeTracker.showImage();
//             // if (!eyeTracker.checkMobile()) {
//             //   eyeTracker.setMonitorSize(14); // 14 inch
//             //   eyeTracker.setFaceDistance(50);
//             // }
//             // enableCalibrationButton();
//             eyeTracker.setUserStatusCallback(
//               onAttention,
//               onBlink,
//               onDrowsiness
//             );
//           },
//           async () => {
//             console.log("SDK initialization failed");
//             // 초기화 실패에 대한 추가 로직을 여기에 작성
//           },
//           userStatusOption
//         );
//       } catch (error) {
//         console.log("callback when init failed.", error);
//       }
//     } else {
//       // calibrationButton.disabled = false;
//       if (calibrationData) {
//         eyeTracker.seeso.setCalibrationData(calibrationData);
//       }
//       await eyeTracker.startTracking(onGaze, onDebug);
//       eyeTracker.showImage();
//       // if (!eyeTracker.checkMobile()) {
//       //   eyeTracker.setMonitorSize(14); // 14 inch
//       //   eyeTracker.setFaceDistance(50);
//       // }
//       // enableCalibrationButton();
//       eyeTracker.setUserStatusCallback(onAttention, onBlink, onDrowsiness);
//     }
//   };

//   return (
//     <div name={name} {...props}>
//       <canvas
//         id="preview"
//         style={{
//           position: "absolute",
//           display: "block",
//           zIndex: "1",
//           pointerEvents: "none",
//         }}
//       ></canvas>
//       <canvas
//         id="output"
//         style={{
//           position: "absolute",
//           display: "block",
//           zIndex: "2",
//           pointerEvents: "none",
//         }}
//       ></canvas>
//       {props.children}
//     </div>
//   );
// };

// export default EyetrackingLogger;

// EyetrackingLogger.js
import React, { useState, useEffect } from "react";
import EyetrackingContext from "../pages/eyetrackingContext";

const EyetrackingLogger = ({ 
  children, 
  setGazeData,
}) => {
  const [gazeData, onGazeData] = useState({ x: 0, y: 0 });
  const [isWebgazerInitialized, setIsWebgazerInitialized] = useState(false);
  const webgazer = window.webgazer;
  let isMounted = true; // 컴포넌트의 마운트 상태를 추적하는 변수를 추가합니다.

  const initializeWebgazer = async () => {
    if (isMounted && webgazer) {
      // 컴포넌트가 여전히 마운트된 상태인지 확인합니다.
      await webgazer
        .setGazeListener((data, elapsedTime) => {
          if (data && isMounted) {
            // 데이터가 있고, 컴포넌트가 마운트 상태인지 확인합니다.
            onGazeData({ x: data.x, y: data.y });
            setGazeData({ x: data.x, y: data.y })
            // console.log(`Gaze Position - X: ${data.x}, Y: ${data.y}`);
          }
        })
        .showVideoPreview(false) // 이 부분을 추가하세요
        .showFaceOverlay(false) // 이 부분을 추가하세요
        .showFaceFeedbackBox(false) // 이 부분을 추가하세요
        .begin();
      setIsWebgazerInitialized(true);
    }
  };

  useEffect(() => {
    if (webgazer) {
      initializeWebgazer();
    } else {
      const script = document.createElement("script");
      script.src = "../../public/webgazer.js";
      script.defer = true;
      // script.onload = initializeWebgazer;
      // document.head.appendChild(script);
      script.onload = () => {
        if (!isWebgazerInitialized) {
          initializeWebgazer();
        }
      };
      document.head.appendChild(script);
    }

    return () => {
      // isMounted = false; // 언마운트될 때 isMounted를 false로 설정합니다.
      // if (webgazer && typeof window.webgazer.end === "function") {
      //   webgazer.end(); // window.webgazer가 있는지 확인하고 end 메소드를 호출합니다.
      // }
    };
  }, []);

  return (
    <EyetrackingContext.Provider value={{ gazeData, isWebgazerInitialized }}>
      {children}
    </EyetrackingContext.Provider>
  );
};

// export default EyetrackingLogger;3ew23ew33

// // EyetrackingLogger.js
// import React, { useState, useEffect } from "react";
// import EyetrackingContext from "../pages/eyetrackingContext";

// const EyetrackingLogger = ({ children }) => {
//   const [gazeData, setGazeData] = useState({ x: 0, y: 0 });
//   const [isWebgazerInitialized, setIsWebgazerInitialized] = useState(false);
//   const webgazer = window.webgazer;
//   let isMounted = true; // 컴포넌트의 마운트 상태를 추적하는 변수를 추가합니다.

//   const initializeWebgazer = async () => {
//     if (isMounted && webgazer) {
//       // 컴포넌트가 여전히 마운트된 상태인지 확인합니다.
//       await webgazer
//         .setGazeListener((data, elapsedTime) => {
//           if (data && isMounted) {
//             // 데이터가 있고, 컴포넌트가 마운트 상태인지 확인합니다.
//             setGazeData({ x: data.x, y: data.y });
//             console.log(`Gaze Position - X: ${data.x}, Y: ${data.y}`);
//           }
//         })
//         .showVideoPreview(false) // 이 부분을 추가하세요
//         .showFaceOverlay(false) // 이 부분을 추가하세요
//         .showFaceFeedbackBox(false) // 이 부분을 추가하세요
//         .begin();
//       setIsWebgazerInitialized(true);
//     }
//   };

//   useEffect(() => {
//     if (webgazer) {
//       initializeWebgazer();
//     } else {
//       const script = document.createElement("script");
//       script.src = "../../public/webgazer.js";
//       script.defer = true;
//       // script.onload = initializeWebgazer;
//       // document.head.appendChild(script);
//       script.onload = () => {
//         if (!isWebgazerInitialized) {
//           initializeWebgazer();
//         }
//       };
//       document.head.appendChild(script);
//     }

//     return () => {
//       // isMounted = false; // 언마운트될 때 isMounted를 false로 설정합니다.
//       // if (webgazer && typeof window.webgazer.end === "function") {
//       //   webgazer.end(); // window.webgazer가 있는지 확인하고 end 메소드를 호출합니다.
//       // }
//     };
//   }, []);

//   return (
//     <EyetrackingContext.Provider value={{ gazeData, isWebgazerInitialized }}>
//       {children}
//     </EyetrackingContext.Provider>
//   );
// };

export default EyetrackingLogger;