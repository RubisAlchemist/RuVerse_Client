import { Button } from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";

const RecordManager = () => {
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
      console.log(url);
      console.log(blob);
    },
  });

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
    onStop: (url, blob) => {
      console.log(url);
      console.log(blob);
    },
  });

  const startRecording = () => {
    startScreenRecording();
    startVideoRecording();
  };

  const stopRecording = () => {
    stopVideoRecording();
    stopScreenRecording();
  };

  const recordingStatus =
    screenStatus === "recording" && videoStatus === "recording";

  return (
    <div style={{ border: "1px solid white" }}>
      {recordingStatus ? (
        <Button variant="outlined" color="error" onClick={stopRecording}>
          녹화종료
        </Button>
      ) : (
        <Button variant="outlined" color="error" onClick={startRecording}>
          녹화 시작
        </Button>
      )}
    </div>
  );
};

export default RecordManager;
