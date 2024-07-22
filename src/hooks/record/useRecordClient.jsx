import React, { useState } from "react";

const useRecordClient = () => {
  const [videoStream, setVideoStream] = useState(null);
  const [audioStream, setAudioStream] = useState(null);

  const [recordNum, setRecurdNum] = useState(1);

  const saveAudioStream = (audioStream) => setAudioStream(audioStream);

  const saveVideoStream = (videoStream) => setVideoStream(videoStream);

  const clearAudioStream = () => setAudioStream(null);

  const clearVideoStream = () => setVideoStream(null);

  return {
    recordNum,
    videoStream,
    audioStream,
    saveAudioStream,
    saveVideoStream,
    clearAudioStream,
    clearVideoStream,
    setRecurdNum,
  };
};

export default useRecordClient;
