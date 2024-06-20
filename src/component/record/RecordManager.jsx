import { Box, Button, Divider, Modal, Typography } from "@mui/material";
import React, { useEffect } from "react";

import { useReactMediaRecorder } from "react-media-recorder";
import { RecordProvider } from "../../context/record-context";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "../../store/upload/uploadSlice";
import webgazer from "webgazer";
import RecordButton from "./RecordButton";
import RecordResultModal from "./RecordResultModal";

const RecordManager = ({ children }) => {
  // 업로드 할 비디오, 화면 녹화 블롭 파일
  const [videoRecordBlob, setVideoRecordBlob] = useState(null);
  const [screenRecordBlob, setScreenRecordBlob] = useState(null);

  const [errorModal, setErrorModal] = useState(false);

  const uploadFinished = useSelector(
    (state) => state.upload.status.UPLOAD_SUCCESS
  );
  const dispatch = useDispatch();

  // 비디오 오디오 녹화
  const {
    status: videoStatus,
    startRecording: startVideoRecording,
    stopRecording: stopVideoRecording,
    error: videoError,
  } = useReactMediaRecorder({
    video: true,
    audio: true,
    blobPropertyBag: {
      type: "video/mp4",
    },
    onStart: () => {
      console.log(`[RECORDER] video record start = ${videoStatus}`);
    },
    onStop: (url, blob) => {
      console.log("[RECORDER] video record stop");
      console.log(`[RECORDER] result: ${blob}`);
      setVideoRecordBlob(blob);
    },
  });

  // 화면 녹화
  const {
    status: screenStatus,
    startRecording: startScreenRecording,
    stopRecording: stopScreenRecording,
    error: screenError,
  } = useReactMediaRecorder({
    screen: true,
    audio: true,
    blobPropertyBag: {
      type: "video/mp4",
    },
    askPermissionOnMount: false,
    onStart: () => {
      console.log(`[RECORDER] screen record start = ${screenStatus}`);
    },
    onStop: (url, blob) => {
      console.log("[RECORDER] screen record stop");
      console.log(`[RECORDER] result: ${blob}`);
      setScreenRecordBlob(blob);
    },
  });

  // 녹화 시작 할 때 webgazer 실행
  const startRecording = () => {
    try {
      console.log("[WEBGAZER] start");
      webgazer.begin();
    } catch (err) {
      console.log("[WEBGAZER] end error");
      console.log(err);
    }
    startVideoRecording();
    startScreenRecording();
  };

  const stopRecording = () => {
    try {
      console.log("[WEBGAZER] end");
      webgazer.pause();
    } catch (err) {
      console.log("[WEBGAZER] end error");
      console.log(err);
    }
    stopVideoRecording();
    stopScreenRecording();

    // 녹화 종료 후 업로드 모달 오픈
    dispatch(openModal());
  };

  useEffect(() => {
    // 화면 또는 스크린 공유를 하지 않았을 경우 오류 발생

    if (screenError !== "" || videoError !== "") {
      console.log("[RECORDER] 녹화 오류 발생");
      console.log(`[RECORDER] screenError: ${screenError}`);
      console.log(`[RECORDER] videoError: ${videoError}`);
      setErrorModal(true);
    }
  }, [screenError, videoError]);

  const handleRecordError = () => {
    if (videoStatus === "recording") {
      stopVideoRecording();
    }

    if (screenStatus === "recording") {
      stopVideoRecording();
    }

    webgazer.end();
    setErrorModal(false);
  };

  const recordingStatus =
    videoStatus === "recording" && screenStatus === "recording";

  return (
    <RecordProvider
      videoRecordBlob={videoRecordBlob}
      screenRecordBlob={screenRecordBlob}
    >
      {children}
      {recordingStatus ? (
        <RecordButton variant="outlined" color="error" onClick={stopRecording}>
          녹화 종료
        </RecordButton>
      ) : (
        <RecordButton variant="outlined" color="error" onClick={startRecording}>
          녹화 시작
        </RecordButton>
      )}
      <RecordResultModal open={errorModal} onClose={handleRecordError} />
    </RecordProvider>
  );
};

export default RecordManager;
