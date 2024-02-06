import React, { useEffect, useState } from "react";
// import { useHistory } from "react-router-dom";
// import { useDispatch } from "react-redux";
import EasySeeso from "seeso/easy-seeso";
import { UserStatusOption } from "seeso";

// import { calibrationSuccess } from "@store/actions";

const licenseKey = process.env.REACT_APP_EYETRACKING_LICENSE_KEY;

// let eyeTracker = null;
let gazeArchive = [];
let currentX, currentY;
let isUseAttention = false;
let isUseDrowsiness = false;
let isUseBlink = true;
const userStatusOption = new UserStatusOption(
  isUseAttention,
  isUseBlink,
  isUseDrowsiness
);
// //blink function
let isBlinkL = false;
let isBlinkR = false;
let isB = false;
let leftOpen = 0;
let rightOpen = 0;
const dotMaxSize = 50;
const dotMinSize = 30;
let isCalibrationMode = false;
let calibrationDataReceived = null;
let eyeTracker = null;

const EyetrackerInit = ({ groupId, onSuccess, setIsCalibrationComplete }) => {
  //   const dispatch = useDispatch();
  // let eyeTracker = useSelector(state => state.eyeTracker);
  const [showCanvas, setShowCanvas] = useState(false);
  //   const history = useHistory();
  useEffect(() => {
    main();

    return () => {
      //store에 eyetracker넣어놓기
      // console.log("calibrationdata", calibrationDataReceived) //받아온 데이터
      // dispatch(calibrationSuccess(calibrationDataReceived));
    };
  }, []);

  const main = async () => {
    console.log("[EyetrackingInit]", window.self.crossOriginIsolated);
    // if(!eyeTracker){
    //   eyeTracker = new EasySeeSo();
    //   try{
    //     await eyeTracker.init(
    //       licenseKey,
    //       async () => {
    //         await eyeTracker.startTracking(onGaze, onDebug);
    //         eyeTracker.showImage();
    //         eyeTracker.setUserStatusCallback(onAttention, onBlink, onDrowsiness);
    //         // console.log("eyeTracker: ", eyeTracker);
    //         calibration();
    //         //store에 eyetracker넣어놓기
    //       },
    //       async () => {
    //         console.log("SDK initialization failed");
    //         // 초기화 실패에 대한 추가 로직을 여기에 작성
    //       },
    //       userStatusOption
    //     );
    //   } catch(error){
    //     console.log("callback when init failed.", error)
    //   }
    // }
    eyeTracker = new EasySeeso();
    try {
      await eyeTracker.init(
        licenseKey,
        async () => {
          await eyeTracker.startTracking(onGaze, onDebug);
          eyeTracker.showImage();
          eyeTracker.setUserStatusCallback(onAttention, onBlink, onDrowsiness);
          // console.log("eyeTracker: ", eyeTracker);
          calibration();
          //store에 eyetracker넣어놓기
        },
        async () => {
          console.log("SDK initialization failed");
          // 초기화 실패에 대한 추가 로직을 여기에 작성
        },
        userStatusOption
      );
    } catch (error) {
      console.log("callback when init failed.", error);
    }
  };

  const calibration = () => {
    // calibration 로직
    setShowCanvas(true);
    isCalibrationMode = true;
    // hideGaze();
    eyeTracker.hideImage();
    const focusText = showFocusText();
    // console.log("eyeTracker: ", eyeTracker);
    setTimeout(() => {
      hideFocusText(focusText);
      eyeTracker.startCalibration(
        onCalibrationNextPoint,
        onCalibrationProgress,
        onCalibrationFinished,
        5
      );
      // eyeTracker.onCalibrationNextPoint();
      // eyeTracker.onCalibrationProgress();
      // eyeTracker.onCalibrationFinished();
    }, 2000);
  };

  const onGaze = (gazeInfo) => {
    if (!isCalibrationMode) {
      // do something with gaze info.
      // showGaze(gazeInfo, gazeArchive);
    } else {
      // hideGaze();
    }
  };

  const onDebug = (FPS, latency_min, latency_max, latency_avg) => {
    // do something with debug info.
  };

  const drawCircle = (x, y, dotSize, ctx) => {
    ctx.fillStyle = "#FF0000";
    ctx.beginPath();
    ctx.arc(x, y, dotSize, Math.PI * 2, 0, true);
    ctx.fill();
    ctx.fillText("다음점도 응시해주세요!", x, y + dotSize + 16);
  };

  const clearCanvas = () => {
    const canvas = document.getElementById("output");
    canvas.width = window.self.innerWidth;
    canvas.height = window.self.innerHeight;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return ctx;
  };

  const onCalibrationNextPoint = (pointX, pointY) => {
    currentX = pointX;
    currentY = pointY;
    const ctx = clearCanvas();
    drawCircle(currentX, currentY, dotMinSize, ctx);
    eyeTracker.startCollectSamples();
  };

  const onCalibrationProgress = (progress) => {
    const ctx = clearCanvas();
    const dotSize = dotMinSize + (dotMaxSize - dotMinSize) * progress;
    drawCircle(currentX, currentY, dotSize, ctx);
  };

  const onCalibrationFinished = (calibrationData) => {
    clearCanvas();
    eyeTracker.showImage();
    setShowCanvas(false);
    calibrationDataReceived = calibrationData;
    // dispatch(calibrationSuccess(calibrationDataReceived));
    onSuccess(true);
    setIsCalibrationComplete(true);
    // console.log(calibrationDataReceived)
  };

  const showFocusText = () => {
    const focusText = document.createElement("div");
    focusText.innerText =
      "자세 체크를 시작합니다.\n 시선은 빨간점을 계속해서 바라봐주세요.";
    focusText.style.position = "fixed";
    focusText.style.top = "50%";
    focusText.style.left = "50%";
    focusText.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(focusText);
    return focusText;
  };

  const hideFocusText = (focusText) => {
    document.body.removeChild(focusText);
  };

  const onBlink = (
    timestamp,
    isBlinktLeft,
    isBlinkRight,
    isBlink,
    leftOpenness,
    rightOpenness
  ) => {
    isBlinkL = isBlinktLeft;
    isBlinkR = isBlinkRight;
    isB = isBlink;
    leftOpen = leftOpenness;
    rightOpen = rightOpenness;
  };

  //For User Status Option
  let attentionScore = 0;
  const onAttention = (timestampBegin, timestampEnd, score) => {
    attentionScore = score;
  };

  let isDrowsy = false;
  const onDrowsiness = (timestamp, isDrowsiness) => {
    isDrowsy = isDrowsiness;
  };

  return (
    <div>
      <canvas
        id="preview"
        style={{
          position: "absolute",
          display: "none",
          zIndex: "1",
          pointerEvents: "none",
        }}
      ></canvas>
      {showCanvas && (
        <canvas
          id="output"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            position: "absolute",
            zIndex: "2",
            pointerEvents: "none",
          }}
        ></canvas>
      )}
      {/* {props.children} */}
    </div>
  );
};

export default EyetrackerInit;
