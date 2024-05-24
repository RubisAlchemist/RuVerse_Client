import React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import webgazer from "webgazer";
import { setEyetracking } from "../../store/logger/loggerSlice";

const EyetrackingLoggerTest = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    async function initGaze() {
      await webgazer
        .setGazeListener((data, elapsedTime) => {
          if (data) {
            // 데이터가 있고, 컴포넌트가 마운트 상태인지 확인합니다.
            let isoDate = new Date().toISOString();

            dispatch(
              setEyetracking({ x: data.x, y: data.y, timestamp: isoDate })
            );
            // console.log(`Gaze Position - X: ${data.x}, Y: ${data.y}`);
          }
        })
        .showVideoPreview(false) // 이 부분을 추가하세요
        .showFaceOverlay(false) // 이 부분을 추가하세요
        .showPredictionPoints(false)
        .showFaceFeedbackBox(false); // 이 부분을 추가하세요
    }

    initGaze();
  }, []);

  return <>{children}</>;
};

export default EyetrackingLoggerTest;
