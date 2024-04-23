import { Button } from "@mui/material";
import React from "react";

import { useReactMediaRecorder } from "react-media-recorder";
import { RecordProvider } from "../../context/record-context";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "../../store/upload/uploadSlice";
import webgazer from "webgazer";

const RecordManager = ({ children }) => {
  // 업로드 할 비디오, 화면 녹화 블롭 파일
  const [videoRecordBlob, setVideoRecordBlob] = useState(null);
  const [screenRecordBlob, setScreenRecordBlob] = useState(null);

  const uploadFinished = useSelector(
    (state) => state.upload.status.UPLOAD_SUCCESS
  );
  const dispatch = useDispatch();

  // 비디오 오디오 녹화
  const {
    status: videoStatus,
    startRecording: startVideoRecording,
    stopRecording: stopVideoRecording,
  } = useReactMediaRecorder({
    video: true,
    audio: true,
    blobPropertyBag: {
      type: "video/mp4",
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
  } = useReactMediaRecorder({
    screen: true,
    audio: false,
    blobPropertyBag: {
      type: "video/mp4",
    },
    askPermissionOnMount: false,
    onStop: (url, blob) => {
      console.log("[RECORDER] screen record stop");
      console.log(`[RECORDER] result: ${blob}`);
      setScreenRecordBlob(blob);
    },
  });

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
    // start webgazer
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

  const recordingStatus =
    videoStatus === "recording" && screenStatus === "recording";

  return (
    <RecordProvider
      videoRecordBlob={videoRecordBlob}
      screenRecordBlob={screenRecordBlob}
    >
      {children}
      {recordingStatus ? (
        <Button variant="outlined" color="error" onClick={stopRecording}>
          녹화종료
        </Button>
      ) : (
        <Button
          variant="outlined"
          color="error"
          onClick={startRecording}
          disabled={uploadFinished}
        >
          녹화 시작
        </Button>
      )}
    </RecordProvider>
  );
};

export default RecordManager;
