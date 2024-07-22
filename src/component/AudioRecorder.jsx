import { Button, Typography } from "@mui/material";
import React, { useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { ruverseClient } from "../apis/ruverse";
import { useParams } from "react-router-dom";
import InfoModal from "./common/InfoModal";
// import useRecordClient from "../hooks/record/useRecordClient";

const AudioRecorder = () => {
  // const { audioStream, saveAudioStream } = useRecordContext();
  const [current, setCurrent] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { uname } = useParams();

  const { status, startRecording, stopRecording } = useReactMediaRecorder({
    // video: true,
    audio: true,
    blobPropertyBag: {
      type: "audio/wav",
    },
    onStart: () => {
      console.log(`[RECORDER] video record start = ${status}`);
    },
    onStop: async (url, blob) => {
      console.log("[RECORDER] video record stop");
      console.log(`[RECORDER] result: ${blob}`);

      const formData = new FormData();

      // audio: 서버에서 접근할때 사용하는 키값
      formData.append("audio", blob, `${uname}_오디오_${current}.wav`);

      setIsLoading(true);
      try {
        const response = await ruverseClient.post("/audio-receive", formData);
        setIsSuccess(true);
        setIsError(false);
        setCurrent((prev) => prev + 1);
      } catch (err) {
        setError(err);
        setIsError(true);
        setIsSuccess(false);
        console.log(err);
      }
      setIsLoading(false);

      // saveAudioStream(blob);
    },
  });

  const closeModal = () => {
    setIsError(false);
    setIsSuccess(false);
  };

  return (
    <>
      {status === "recording" ? (
        <Button onClick={stopRecording} color="primary" variant="contained">
          <Typography
            sx={{
              fontSize: { xs: "12px", md: "16px", lg: "18px" },
            }}
          >
            대답 끝내기
          </Typography>
        </Button>
      ) : (
        <Button onClick={startRecording} color="primary" variant="contained">
          <Typography
            sx={{
              fontSize: { xs: "12px", md: "16px", lg: "18px" },
            }}
          >
            대답하기
          </Typography>
        </Button>
      )}
      <InfoModal
        open={isError || isSuccess}
        isError={isError}
        isSuccess={isSuccess}
        onClose={closeModal}
        message={error}
      />
    </>
  );
};

export default AudioRecorder;
