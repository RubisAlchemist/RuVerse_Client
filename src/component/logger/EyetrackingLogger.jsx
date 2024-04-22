import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setEyetracking } from "../../store/logger/loggerSlice";

const EyetrackingLogger = ({ children, setGazeData }) => {
  const [gazeData, onGazeData] = useState({ x: 0, y: 0 });
  const [isWebgazerInitialized, setIsWebgazerInitialized] = useState(false);
  const webgazer = window.webgazer;
  let isMounted = true; // 컴포넌트의 마운트 상태를 추적하는 변수를 추가합니다.

  const dispatch = useDispatch();

  const initializeWebgazer = async () => {
    if (isMounted && webgazer) {
      // 컴포넌트가 여전히 마운트된 상태인지 확인합니다.
      await webgazer
        .setGazeListener((data, elapsedTime) => {
          if (data && isMounted) {
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

  return <>{children}</>;
};

export default EyetrackingLogger;
