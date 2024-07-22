import React from "react";
import { Box, Button } from "@mui/material";

import { useReactMediaRecorder } from "react-media-recorder";

const VideoRecorder = () => {
  const { status, startRecording, stopRecording } = useReactMediaRecorder({
    // video: true,
    video: true,
    blobPropertyBag: {
      type: "audio/mp3",
    },
    onStart: () => {
      console.log(`[RECORDER] video record start = ${status}`);
    },
    onStop: (url, blob) => {
      console.log("[RECORDER] video record stop");
      console.log(`[RECORDER] result: ${blob}`);
      console.log(blob);
      console.log(url);
    },
  });

  return (
    <Box
      sx={{
        position: "absolute",
        left: "50%",
        top: "50%",
      }}
    >
      {status === "recording" ? (
        <Button onClick={stopRecording}>녹화종료</Button>
      ) : (
        <Button onClick={startRecording}>녹화시작</Button>
      )}
    </Box>
  );
};

export default VideoRecorder;
