import { Box, Button, Modal, Typography } from "@mui/material";
import React, { useEffect } from "react";

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
    audio: false,
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

  useEffect(() => {
    if (screenError || videoError) {
      console.log("[RECORDER] 녹화 오류 발생");
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

  console.log(
    `[RECORDING] videoStatus = ${videoStatus} screenStatus = ${screenStatus}`
  );

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
      <Modal
        open={errorModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onClose={handleRecordError}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            녹화 오류
          </Typography>
          <Typography
            id="modal-modal-title"
            variant="caption"
            component="p"
            color="crimson"
          >
            녹화 버튼을 다시 눌러주세요.
          </Typography>
          <Button variant="outlined" color="error" onClick={handleRecordError}>
            확인
          </Button>
        </Box>
      </Modal>
    </RecordProvider>
  );
};

const style = {
  display: "flex",
  flexDirection: "column",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default RecordManager;
